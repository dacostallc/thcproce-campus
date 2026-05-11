const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";
const MAX_CHARS = 1200;

function truncateText(raw: string): string {
  const t = raw.trim();
  if (t.length <= MAX_CHARS) return t;
  return t.slice(0, MAX_CHARS);
}

/** Extrai mensagem útil da resposta ElevenLabs (JSON ou texto). */
async function friendlyElevenLabsError(res: Response): Promise<string> {
  const ct = res.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const body = (await res.json()) as { detail?: unknown };
      const d = body?.detail;
      if (typeof d === "string") return d;
      if (d != null && typeof d === "object" && "message" in d) {
        const m = (d as { message?: string }).message;
        if (typeof m === "string") return m;
      }
    } else {
      const text = await res.text();
      if (text.length && text.length < 400) return text;
    }
  } catch {
    /* ignore parse errors */
  }
  return `Pedido à ElevenLabs falhou (${res.status}). Verifique quota, voice ID e modelo.`;
}

/**
 * Gera áudio MP3 (servidor apenas — usar só em Route Handlers / Server Actions).
 * Variáveis: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, opcional `ELEVENLABS_MODEL_ID`.
 */
export async function generateElevenLabsSpeech(text: string): Promise<ArrayBuffer> {
  const trimmed = text?.trim();
  if (!trimmed) {
    throw new Error("O texto para narração é obrigatório.");
  }

  const bounded = truncateText(trimmed);
  if (bounded.length === 0) {
    throw new Error("O texto para narração é obrigatório.");
  }

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim();
  const modelId = process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_MODEL_ID;

  if (!apiKey) {
    throw new Error("Servidor sem ELEVENLABS_API_KEY configurada.");
  }
  if (!voiceId) {
    throw new Error("Servidor sem ELEVENLABS_VOICE_ID configurada.");
  }

  const url = `${ELEVENLABS_TTS_URL}/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg"
    },
    body: JSON.stringify({
      text: bounded,
      model_id: modelId,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.8,
        style: 0.25,
        use_speaker_boost: true
      }
    })
  });

  if (!res.ok) {
    throw new Error(await friendlyElevenLabsError(res));
  }

  return res.arrayBuffer();
}

export const ELEVENLABS_MAX_TEXT_LENGTH = MAX_CHARS;
