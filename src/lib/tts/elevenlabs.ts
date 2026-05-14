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

  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// ─── Timestamps ───────────────────────────────────────────────────────────────

export interface ParagraphTimestamp {
  /** Primeiros 80 chars do parágrafo (usado para matching no frontend). */
  text: string;
  /** Tempo de início em segundos no áudio gerado. */
  startTime: number;
}

/**
 * Gera narração com alinhamento caractere-a-caractere.
 * Deriva timestamps de parágrafo a partir dos dados de alinhamento retornados
 * pela API ElevenLabs e retorna junto com o buffer MP3.
 *
 * @param text      Texto puro completo da aula.
 * @param paragraphs Lista dos parágrafos originais (para mapear offsets).
 */
export async function generateVoiceoverWithTimestamps(
  text: string,
  paragraphs: string[],
): Promise<{ buffer: Buffer; paragraphTimestamps: ParagraphTimestamp[] }> {
  const client = getClient();
  const voiceId = resolveVoiceId();
  const modelId = resolveModelId();

  const result = await client.textToSpeech.convertWithTimestamps(voiceId, {
    text,
    model_id: modelId,
    voice_settings: { ...THCPROCE_VOICE_SETTINGS },
    output_format: "mp3_44100_128",
  });

  // Decodifica o base64 retornado pela API para Buffer
  const buffer = Buffer.from(result.audio_base64 ?? "", "base64");

  // Alinhamento caractere → segundo
  const chars: string[]  = result.alignment?.characters ?? [];
  const starts: number[] = result.alignment?.character_start_times_seconds ?? [];

  // Para cada parágrafo, encontra o offset do primeiro caractere no texto
  // completo e busca o tempo inicial correspondente no array de alinhamento
  const paragraphTimestamps: ParagraphTimestamp[] = [];
  let searchFrom = 0;

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Procura o parágrafo no texto a partir de where última busca terminou
    const idx = text.indexOf(trimmed, searchFrom);
    if (idx === -1) continue;

    // Conta quantos chars o ElevenLabs mapeou até esse offset
    // (o alinhamento pode ter menos chars que o texto por normalização)
    const charIdx = Math.min(idx, chars.length - 1);
    const startTime = starts[charIdx] ?? 0;

    paragraphTimestamps.push({
      text: trimmed.slice(0, 80),
      startTime: Math.round(startTime * 10) / 10, // arredonda para 0.1s
    });

    searchFrom = idx + trimmed.length;
  }

  return { buffer, paragraphTimestamps };
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
