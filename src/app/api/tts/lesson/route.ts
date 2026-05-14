import { NextResponse } from "next/server";
import { generateVoiceover, isTtsConfigured, THCPROCE_VOICE_SETTINGS } from "@/lib/tts/elevenlabs";

export const maxDuration = 60;

/**
 * GET  /api/tts/lesson  → status de configuração
 * POST /api/tts/lesson  → sintetiza texto em tempo real (preview)
 *
 * Para geração em lote com cache no DB use:
 *   npx tsx scripts/generate-lesson-audio.mts <courseId> all
 */

const MAX_CHARS = 5000;

export async function GET() {
  const configured = isTtsConfigured();
  return NextResponse.json({
    configured,
    provider: configured ? "elevenlabs" : "none",
    model: process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2",
    voiceSettings: configured ? THCPROCE_VOICE_SETTINGS : null,
  });
}

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

  const text =
    body && typeof body === "object" && "text" in body
      ? String((body as Record<string, unknown>).text ?? "").trim()
      : "";

  if (!text) {
    return NextResponse.json({ error: "Campo 'text' obrigatório." }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `Texto excede ${MAX_CHARS} caracteres. Use o script de geração em lote para aulas completas.` },
      { status: 413 },
    );
  }

  try {
    const audioBuffer = await generateVoiceover(text);
    return new Response(audioBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[tts/lesson]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Falha na síntese ElevenLabs." },
      { status: 502 },
    );
  }
}
