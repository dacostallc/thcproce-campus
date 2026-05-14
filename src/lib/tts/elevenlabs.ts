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
 * Gera narração via streaming e retorna o Buffer completo.
 * Usa `client.generate()` que entrega chunks conforme chegam — evita
 * esperar o MP3 inteiro em memória antes de retornar (o que causava timeout
 * com `convertWithTimestamps` para textos longos).
 */
export async function generateVoiceoverWithTimestamps(
  text: string,
  paragraphs: string[],
): Promise<{ buffer: Buffer; paragraphTimestamps: ParagraphTimestamp[] }> {
  // Fase 1: streaming do áudio completo (rápido, não bufferiza tudo de uma vez)
  const buffer = await generateVoiceover(text);

  // Fase 2: timestamps — chamada separada apenas para o primeiro trecho
  // (max 2 000 chars) para não ultrapassar o tempo de gateway.
  // Se falhar por qualquer motivo, retorna timestamps vazios graciosamente.
  const TIMESTAMP_MAX_CHARS = 2_000;
  const shortText = text.slice(0, TIMESTAMP_MAX_CHARS);
  const shortParagraphs = paragraphs.filter((p) =>
    shortText.includes(p.trim().slice(0, 40)),
  );

  let paragraphTimestamps: ParagraphTimestamp[] = [];

  if (shortParagraphs.length > 0) {
    try {
      const client = getClient();
      const voiceId = resolveVoiceId();
      const modelId = resolveModelId();

      const result = await client.textToSpeech.convertWithTimestamps(voiceId, {
        text: shortText,
        model_id: modelId,
        voice_settings: { ...THCPROCE_VOICE_SETTINGS },
        output_format: "mp3_44100_128",
      });

      const chars: string[]  = result.alignment?.characters ?? [];
      const starts: number[] = result.alignment?.character_start_times_seconds ?? [];
      let searchFrom = 0;

      for (const para of shortParagraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;
        const idx = shortText.indexOf(trimmed, searchFrom);
        if (idx === -1) continue;
        const charIdx = Math.min(idx, chars.length - 1);
        const startTime = starts[charIdx] ?? 0;
        paragraphTimestamps.push({
          text: trimmed.slice(0, 80),
          startTime: Math.round(startTime * 10) / 10,
        });
        searchFrom = idx + trimmed.length;
      }
    } catch (e) {
      // Timestamps são opcionais — o áudio principal já foi gerado
      console.warn("[ElevenLabs] Timestamps skipped:", e instanceof Error ? e.message : e);
      paragraphTimestamps = [];
    }
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
