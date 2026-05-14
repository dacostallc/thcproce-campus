import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/server/db";
import { generateVoiceoverWithTimestamps, isTtsConfigured, type ParagraphTimestamp } from "@/lib/tts/elevenlabs";

// Aulas longas podem levar até ~60s para sintetizar no ElevenLabs
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * POST /api/tts/generate-lesson
 * Body: { courseId: string; lessonId: string }
 *
 * 1. Verifica se já existe áudio no DB → retorna URL existente.
 * 2. Lê o .md da aula e extrai texto puro.
 * 3. Chama ElevenLabs com a voz configurada (ELEVENLABS_VOICE_ID).
 * 4. Salva MP3 localmente em `public/audio/lessons/<courseId>/` (dev)
 *    ou em Supabase Storage (prod quando SUPABASE_SERVICE_KEY estiver definida).
 * 5. Registra URL na tabela `LessonAudio` do Neon.
 * 6. Retorna { audioUrl: string }.
 *
 * Variáveis necessárias: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
 * Opcional:            ELEVENLABS_MODEL_ID (default: eleven_multilingual_v2)
 *                      SUPABASE_SERVICE_KEY + NEXT_PUBLIC_SUPABASE_URL (prod storage)
 */

const MAX_CHARS = 12_000;

const SAFE_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function isSafe(s: string): boolean {
  return typeof s === "string" && s.length > 0 && s.length < 160 && SAFE_SEGMENT.test(s);
}

function findMarkdownFile(courseId: string, lessonId: string): string | null {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "src", "content", "courses", courseId, `${lessonId}.md`),
    path.join(cwd, "content", "courses", courseId, "lessons", `${lessonId}.md`),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

function stripMarkdownLine(line: string): string {
  return line
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    .replace(/^\|.*\|$/, "")
    .replace(/^[-|: ]+$/, "")
    .replace(/^>\s?/, "")
    .replace(/^---+$/, "")
    .trim();
}

function extractPlainText(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\n?/, "")
    .split("\n")
    .map(stripMarkdownLine)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Extrai parágrafos como textos puros (preserva separação por \n\n). */
function extractParagraphs(markdown: string): string[] {
  const plain = extractPlainText(markdown);
  return plain
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}


async function saveAudioFile(courseId: string, lessonId: string, buffer: Buffer): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim();

  // Supabase Storage (produção com credenciais configuradas)
  if (supabaseUrl && serviceKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(supabaseUrl, serviceKey);
    const objectPath = `${courseId}/${lessonId}.mp3`;
    const { error } = await sb.storage
      .from("lesson-audio")
      .upload(objectPath, buffer, { contentType: "audio/mpeg", upsert: true });
    if (error) throw new Error(`Supabase upload: ${error.message}`);
    return sb.storage.from("lesson-audio").getPublicUrl(objectPath).data.publicUrl;
  }

  // Local filesystem (dev / Vercel com volume persistente)
  // Salva em public/audio/<courseId>/ → servido por /api/audio/<courseId>/<lessonId>.mp3
  const dir = path.join(process.cwd(), "public", "audio", courseId);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${lessonId}.mp3`);
  fs.writeFileSync(file, buffer);
  return `/api/audio/${courseId}/${lessonId}.mp3`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  if (!isTtsConfigured()) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID são obrigatórios no servidor." },
      { status: 503 },
    );
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const courseId = body && typeof body === "object" ? String((body as Record<string, unknown>).courseId ?? "").trim() : "";
  const lessonId = body && typeof body === "object" ? String((body as Record<string, unknown>).lessonId ?? "").trim() : "";

  if (!isSafe(courseId) || !isSafe(lessonId)) {
    return NextResponse.json({ error: "courseId ou lessonId inválidos." }, { status: 400 });
  }

  // 1. Verifica se já existe → retorna imediatamente (gratuito)
  try {
    const existing = await prisma.lessonAudio.findUnique({
      where: { courseId_lessonId: { courseId, lessonId } },
      select: { audioUrl: true },
    });
    if (existing?.audioUrl) {
      return NextResponse.json({ audioUrl: existing.audioUrl, cached: true });
    }
  } catch (e) {
    console.error("[generate-lesson] DB check error:", e);
  }

  // 2. Lê o markdown
  const mdPath = findMarkdownFile(courseId, lessonId);
  if (!mdPath) {
    return NextResponse.json(
      { error: `Arquivo .md não encontrado para ${courseId}/${lessonId}.` },
      { status: 404 },
    );
  }

  const rawMd = fs.readFileSync(mdPath, "utf8");
  const text = extractPlainText(rawMd);
  if (text.length < 50) {
    return NextResponse.json({ error: "Texto muito curto para síntese." }, { status: 422 });
  }

  const truncatedText = text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
  if (text.length > MAX_CHARS) {
    console.warn(`[generate-lesson] Texto truncado de ${text.length} para ${MAX_CHARS} chars`);
  }

  // Parágrafos para derivar timestamps (usando o texto original, não truncado)
  const paragraphs = extractParagraphs(rawMd);

  // 3. Sintetiza com timestamps de parágrafo via SDK ElevenLabs
  let audioBuffer: Buffer;
  let paragraphTimestamps: ParagraphTimestamp[] = [];
  try {
    const result = await generateVoiceoverWithTimestamps(truncatedText, paragraphs);
    audioBuffer = result.buffer;
    paragraphTimestamps = result.paragraphTimestamps;
  } catch (e) {
    console.error("[generate-lesson] ElevenLabs error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Falha na síntese ElevenLabs." },
      { status: 502 },
    );
  }

  // 4. Salva arquivo
  let audioUrl: string;
  try {
    audioUrl = await saveAudioFile(courseId, lessonId, audioBuffer);
  } catch (e) {
    console.error("[generate-lesson] save error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Falha ao salvar o áudio." },
      { status: 500 },
    );
  }

  // 5. Registra no DB com timestamps
  try {
    await prisma.lessonAudio.upsert({
      where: { courseId_lessonId: { courseId, lessonId } },
      create: {
        courseId,
        lessonId,
        audioUrl,
        sizeBytes: audioBuffer.length,
        paragraphTimestamps: paragraphTimestamps.length > 0 ? paragraphTimestamps : undefined,
      },
      update: {
        audioUrl,
        sizeBytes: audioBuffer.length,
        paragraphTimestamps: paragraphTimestamps.length > 0 ? paragraphTimestamps : undefined,
      },
    });
  } catch (e) {
    console.error("[generate-lesson] DB upsert error:", e);
    // Não falha a request — o áudio foi gerado e salvo, só o DB falhou
  }

  return NextResponse.json({ audioUrl, cached: false, paragraphTimestamps });
}
