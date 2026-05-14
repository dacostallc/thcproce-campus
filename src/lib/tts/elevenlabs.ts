/**
 * Helper ElevenLabs SDK — voz oficial THCProce.
 *
 * Configurações calibradas para a voz do Professor Sergio:
 *   stability: 0.40       → variação de tom natural (não robótico)
 *   similarity_boost: 0.85 → fidelidade máxima à voz clonada
 *   style: 0.25           → estilo expressivo, evita monotonia
 *   use_speaker_boost: true → nitidez e presença na narração
 *
 * Variáveis de ambiente necessárias (server-side apenas):
 *   ELEVENLABS_API_KEY   → chave da conta
 *   ELEVENLABS_VOICE_ID  → id da voz clonada "thcproce-voz-de-aulas"
 *   ELEVENLABS_MODEL_ID  → modelo (default: eleven_multilingual_v2)
 */

import { ElevenLabsClient } from "elevenlabs";

// ─── Configuração da voz ──────────────────────────────────────────────────────

export const THCPROCE_VOICE_SETTINGS = {
  stability: 0.40,
  similarity_boost: 0.85,
  style: 0.25,
  use_speaker_boost: true,
} as const;

// ─── Cliente singleton ────────────────────────────────────────────────────────

let _client: ElevenLabsClient | null = null;

function getClient(): ElevenLabsClient {
  if (!_client) {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("[ElevenLabs] ELEVENLABS_API_KEY não definida.");
    }
    _client = new ElevenLabsClient({ apiKey });
  }
  return _client;
}

function resolveVoiceId(): string {
  const id = process.env.ELEVENLABS_VOICE_ID?.trim() || process.env.TTS_VOICE_ID?.trim();
  if (!id) throw new Error("[ElevenLabs] ELEVENLABS_VOICE_ID não definida.");
  return id;
}

function resolveModelId(): string {
  return process.env.ELEVENLABS_MODEL_ID?.trim() || "eleven_multilingual_v2";
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Gera narração de áudio para um texto usando a voz oficial THCProce.
 * Retorna um `Buffer` com o MP3 completo.
 *
 * @param text Texto puro (sem markdown). Máx ~5000 chars por chamada.
 */
export async function generateVoiceover(text: string): Promise<Buffer> {
  const client = getClient();
  const voiceId = resolveVoiceId();
  const modelId = resolveModelId();

  const audioStream = await client.generate({
    voice: voiceId,
    text,
    model_id: modelId,
    voice_settings: THCPROCE_VOICE_SETTINGS,
  });

  // Coleta o stream em um Buffer único
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Verifica se as variáveis de ambiente necessárias estão definidas.
 * Seguro para uso em routes de status (GET /api/tts/lesson).
 */
export function isTtsConfigured(): boolean {
  return Boolean(
    process.env.ELEVENLABS_API_KEY?.trim() &&
    (process.env.ELEVENLABS_VOICE_ID?.trim() || process.env.TTS_VOICE_ID?.trim()),
  );
}
