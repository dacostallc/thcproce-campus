import { NextResponse } from "next/server";

/**
 * TTS server-side para aulas — chaves só em variáveis de ambiente (nunca `NEXT_PUBLIC_*`).
 *
 * Configurar no `.env` / painel do deploy:
 * - `TTS_API_KEY` ou `ELEVENLABS_API_KEY`
 * - `TTS_PROVIDER` (ex.: elevenlabs, openai, …)
 * - `TTS_VOICE_ID` (id da voz no provedor)
 *
 * Estado actual: síntese na sala usa Web Speech no browser; este endpoint expõe readiness e
 * reserva `POST` para quando a integração estiver pronta.
 */
function resolveTtsKey(): string | undefined {
  return process.env.TTS_API_KEY?.trim() || process.env.ELEVENLABS_API_KEY?.trim();
}

export async function GET() {
  const key = resolveTtsKey();
  const provider = process.env.TTS_PROVIDER?.trim() || "";
  const voiceId = process.env.TTS_VOICE_ID?.trim();
  const configured = Boolean(key && provider.length > 0);

  return NextResponse.json({
    configured,
    provider: configured ? provider : "none",
    voiceConfigured: Boolean(voiceId),
  });
}

export async function POST(req: Request) {
  const key = resolveTtsKey();
  const provider = process.env.TTS_PROVIDER?.trim();

  if (!key || !provider) {
    return NextResponse.json(
      { error: "TTS não configurado no servidor (defina TTS_PROVIDER e TTS_API_KEY ou ELEVENLABS_API_KEY)." },
      { status: 503 },
    );
  }

  void req;
  // Futuro: validar JSON `{ text: string }`, chamar API do provedor com TTS_VOICE_ID, devolver áudio.
  return NextResponse.json(
    {
      error: "Síntese TTS server-side ainda não implementada. O cliente usa Web Speech API.",
    },
    { status: 501 },
  );
}
