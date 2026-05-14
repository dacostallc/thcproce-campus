/**
 * Gera narração em áudio para aulas usando a API da ElevenLabs.
 *
 * Uso:
 *   npx --yes tsx scripts/generate-lesson-audio.mts <courseId> [lessonId|all]
 *
 * Exemplos:
 *   npx tsx scripts/generate-lesson-audio.mts cannabis-101 c101-l05-escolha-local-cultivo
 *   npx tsx scripts/generate-lesson-audio.mts cannabis-101 all
 *
 * Variáveis de ambiente obrigatórias (no .env ou exportadas):
 *   ELEVENLABS_API_KEY=sk_...
 *   ELEVENLABS_VOICE_ID=<id da voz no painel ElevenLabs>
 *   DATABASE_URL=postgresql://...  (mesma do projeto)
 *
 * Variáveis opcionais:
 *   ELEVENLABS_MODEL_ID=eleven_multilingual_v2  (padrão)
 *   ELEVENLABS_STORAGE=local|supabase           (padrão: local)
 *   NEXT_PUBLIC_SUPABASE_URL=...   (obrigatório se STORAGE=supabase)
 *   SUPABASE_SERVICE_KEY=...       (obrigatório se STORAGE=supabase; chave service_role)
 *
 * O script:
 *   1. Lê o .md da aula e extrai o texto puro.
 *   2. Verifica se já existe áudio no DB — pula se existir.
 *   3. Chama ElevenLabs e baixa o MP3.
 *   4. Salva localmente em public/audio/lessons/<courseId>/<lessonId>.mp3
 *      OU faz upload para Supabase Storage (bucket: lesson-audio).
 *   5. Registra a URL no DB (tabela LessonAudio).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Carrega .env antes de qualquer import que use process.env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Carrega .env manualmente (sem dotenv instalado globalmente)
const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

import { PrismaClient } from "@prisma/client";

// ─── Configuração ─────────────────────────────────────────────────────────────

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY?.trim();
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID?.trim();
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2";
const STORAGE = (process.env.ELEVENLABS_STORAGE?.trim() || "local") as "local" | "supabase";

if (!ELEVENLABS_API_KEY) {
  console.error("❌ ELEVENLABS_API_KEY não definida no .env");
  process.exit(1);
}
if (!VOICE_ID) {
  console.error("❌ ELEVENLABS_VOICE_ID não definida no .env");
  process.exit(1);
}

const db = new PrismaClient();

// ─── Extracção de texto do Markdown ──────────────────────────────────────────

function extractPlainText(markdown: string): string {
  return markdown
    // Remove frontmatter YAML
    .replace(/^---[\s\S]*?---\n?/, "")
    // Remove código
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    // Remove HTML
    .replace(/<[^>]+>/g, "")
    // Remove imagens
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Converte links em texto
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove cabeçalhos (#)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    // Remove tabelas (linhas com |)
    .replace(/^\|.*\|$/gm, "")
    .replace(/^[-|: ]+$/gm, "")
    // Remove blockquotes
    .replace(/^>\s?/gm, "")
    // Remove linhas horizontais
    .replace(/^---+$/gm, "")
    // Colapsa múltiplas linhas em branco
    .replace(/\n{3,}/g, "\n\n")
    // Remove nota do professor (ruído de instruções internas)
    .replace(/\*\*Nota do professor.*?\n.*?\n/gs, "")
    .trim();
}

// ─── ElevenLabs API ──────────────────────────────────────────────────────────

async function synthesize(text: string): Promise<Buffer> {
  const { ElevenLabsClient } = await import("elevenlabs");
  const client = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY! });
  const chunks = splitTextIntoChunks(text, 4500);
  const buffers: Buffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]!;
    console.log(`  [ElevenLabs SDK] Sintetizando parte ${i + 1}/${chunks.length} (${chunk.length} chars)…`);

    const stream = await client.generate({
      voice: VOICE_ID!,
      text: chunk,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.40,
        similarity_boost: 0.85,
        style: 0.25,
        use_speaker_boost: true,
      },
    });

    const parts: Buffer[] = [];
    for await (const part of stream) {
      parts.push(Buffer.isBuffer(part) ? part : Buffer.from(part));
    }
    buffers.push(Buffer.concat(parts));
  }
  return Buffer.concat(buffers);
}

function splitTextIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxChars, text.length);
    // Tenta quebrar em parágrafo ou ponto
    if (end < text.length) {
      const lastParagraph = text.lastIndexOf("\n\n", end);
      const lastSentence = text.lastIndexOf(". ", end);
      const breakPoint = lastParagraph > start + 500
        ? lastParagraph
        : lastSentence > start + 500
          ? lastSentence + 1
          : end;
      end = breakPoint;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks.filter(Boolean);
}

// ─── Storage ──────────────────────────────────────────────────────────────────

async function saveLocal(courseId: string, lessonId: string, buffer: Buffer): Promise<string> {
  const dir = path.join(root, "public", "audio", "lessons", courseId);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${lessonId}.mp3`);
  fs.writeFileSync(file, buffer);
  console.log(`  [Storage/local] Salvo: public/audio/lessons/${courseId}/${lessonId}.mp3`);
  return `/audio/lessons/${courseId}/${lessonId}.mp3`;
}

async function saveSupabase(courseId: string, lessonId: string, buffer: Buffer): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    console.warn("  [Storage/supabase] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_KEY ausentes — usando local.");
    return saveLocal(courseId, lessonId, buffer);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(supabaseUrl, serviceKey);

  const objectPath = `${courseId}/${lessonId}.mp3`;
  const { error } = await sb.storage
    .from("lesson-audio")
    .upload(objectPath, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (error) throw new Error(`Supabase upload: ${error.message}`);

  const { data: urlData } = sb.storage.from("lesson-audio").getPublicUrl(objectPath);
  console.log(`  [Storage/supabase] URL: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

async function saveAudio(courseId: string, lessonId: string, buffer: Buffer): Promise<string> {
  return STORAGE === "supabase"
    ? saveSupabase(courseId, lessonId, buffer)
    : saveLocal(courseId, lessonId, buffer);
}

// ─── Processamento por aula ───────────────────────────────────────────────────

async function processLesson(courseId: string, lessonId: string): Promise<void> {
  console.log(`\n▶ ${courseId}/${lessonId}`);

  // 1. Verifica se já existe
  const existing = await db.lessonAudio.findUnique({
    where: { courseId_lessonId: { courseId, lessonId } },
    select: { id: true, audioUrl: true },
  });
  if (existing) {
    console.log(`  ✓ Áudio já existe: ${existing.audioUrl} — pulando`);
    return;
  }

  // 2. Lê o markdown
  const candidates = [
    path.join(root, "src", "content", "courses", courseId, `${lessonId}.md`),
    path.join(root, "content", "courses", courseId, "lessons", `${lessonId}.md`),
  ];
  const mdPath = candidates.find((p) => fs.existsSync(p));
  if (!mdPath) {
    console.warn(`  ⚠ Arquivo .md não encontrado — pulando`);
    return;
  }

  const rawMd = fs.readFileSync(mdPath, "utf8");
  const text = extractPlainText(rawMd);
  if (text.length < 50) {
    console.warn(`  ⚠ Texto muito curto (${text.length} chars) — pulando`);
    return;
  }
  console.log(`  ✓ Texto extraído: ${text.length} chars`);

  // 3. Sintetiza
  const audioBuffer = await synthesize(text);
  console.log(`  ✓ Áudio gerado: ${(audioBuffer.length / 1024).toFixed(0)} KB`);

  // 4. Salva
  const audioUrl = await saveAudio(courseId, lessonId, audioBuffer);

  // 5. Registra no DB
  await db.lessonAudio.create({
    data: {
      courseId,
      lessonId,
      audioUrl,
      sizeBytes: audioBuffer.length,
    },
  });
  console.log(`  ✓ Registrado no DB: ${audioUrl}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const [courseId, lessonArg] = process.argv.slice(2);

  if (!courseId || !lessonArg) {
    console.error("Uso: npx tsx scripts/generate-lesson-audio.mts <courseId> <lessonId|all>");
    console.error("Ex.: npx tsx scripts/generate-lesson-audio.mts cannabis-101 all");
    process.exit(1);
  }

  // Resolve lista de aulas
  let lessonIds: string[] = [];

  if (lessonArg === "all") {
    // Lê do course.json
    const manifestCandidates = [
      path.join(root, "src", "content", "courses", courseId, "course.json"),
      path.join(root, "content", "courses", courseId, "course.json"),
    ];
    const manifestPath = manifestCandidates.find((p) => fs.existsSync(p));
    if (!manifestPath) {
      console.error(`❌ course.json não encontrado para ${courseId}`);
      process.exit(1);
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as { lessons?: string[] };
    if (!Array.isArray(manifest.lessons) || manifest.lessons.length === 0) {
      console.error(`❌ Campo "lessons" ausente ou vazio em course.json`);
      process.exit(1);
    }
    lessonIds = manifest.lessons;
    console.log(`Gerando áudio para ${lessonIds.length} aulas de ${courseId}…`);
  } else {
    lessonIds = [lessonArg];
  }

  let ok = 0;
  let skipped = 0;
  let errors = 0;

  for (const lessonId of lessonIds) {
    try {
      const before = await db.lessonAudio.count({ where: { courseId, lessonId } });
      await processLesson(courseId, lessonId);
      const after = await db.lessonAudio.count({ where: { courseId, lessonId } });
      if (after > before) ok++;
      else skipped++;
    } catch (e) {
      console.error(`  ❌ Erro em ${lessonId}:`, e instanceof Error ? e.message : e);
      errors++;
    }
  }

  console.log(`\n═══════════════════════════════`);
  console.log(`Concluído: ${ok} gerados, ${skipped} pulados, ${errors} erros`);
  if (STORAGE === "local") {
    console.log(`\nAúdios salvos em: public/audio/lessons/${courseId}/`);
    console.log(`Para produção: copie para Supabase Storage ou CDN e atualize URLs no DB.`);
  }

  await db.$disconnect();
}

main().catch((e) => {
  console.error("Erro fatal:", e);
  process.exit(1);
});
