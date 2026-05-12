import type { ClassroomSlide } from "@/lib/classroomLessonSlides";

/**
 * Leitor de texto da aula — camada pensada para trocar entre browser (Web Speech) e TTS server-side.
 *
 * Próximo passo (API): o cliente chama apenas `POST /api/tts/lesson` (ou rota equivalente); chaves ficam
 * em `TTS_API_KEY` | `ELEVENLABS_API_KEY`, `TTS_PROVIDER`, `TTS_VOICE_ID` no servidor — nunca no bundle.
 */
export type LessonReaderBackend = "browser" | "api";

export type LessonReaderPlaybackState = "stopped" | "reading" | "paused";

export type BrowserLessonTextReaderOptions = {
  onStateChange?: (state: LessonReaderPlaybackState) => void;
};

function normalizeSpeechText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

/** Texto falável do passo atual (slide de leitura ou enunciado + opções do quiz). */
export function getLessonSlideSpeakableText(slide: ClassroomSlide | undefined): string {
  if (!slide) return "";
  if (slide.kind === "text") return normalizeSpeechText(slide.body);
  const q = slide.question;
  const opts = q.options.map((o, i) => `Opção ${i + 1}: ${o}.`).join(" ");
  return normalizeSpeechText(`${q.question} ${opts}`);
}

export function isBrowserSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickPortugueseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const lower = (lang: string) => lang.toLowerCase();
  return (
    voices.find((v) => lower(v.lang).startsWith("pt-br")) ??
    voices.find((v) => lower(v.lang).startsWith("pt")) ??
    null
  );
}

/**
 * Instância única por componente; usar `dispose()` ao desmontar (cancela a fila).
 */
export function createBrowserLessonTextReader(options?: BrowserLessonTextReaderOptions) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  let playbackState: LessonReaderPlaybackState = "stopped";

  const emit = (s: LessonReaderPlaybackState) => {
    playbackState = s;
    options?.onStateChange?.(s);
  };

  const applyVoice = (utterance: SpeechSynthesisUtterance) => {
    if (!synth) return;
    const voice = pickPortugueseVoice(synth.getVoices());
    if (voice) utterance.voice = voice;
    utterance.lang = "pt-BR";
    utterance.rate = 1;
    utterance.pitch = 1;
  };

  const speakWhenVoicesReady = (utterance: SpeechSynthesisUtterance) => {
    if (!synth) {
      emit("stopped");
      return;
    }

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      applyVoice(utterance);
      synth!.speak(utterance);
      emit("reading");
    };

    if (synth.getVoices().length > 0) {
      run();
      return;
    }

    const onVoices = () => {
      synth!.removeEventListener("voiceschanged", onVoices);
      window.clearTimeout(failsafe);
      run();
    };
    synth.addEventListener("voiceschanged", onVoices);
    const failsafe = window.setTimeout(() => {
      synth!.removeEventListener("voiceschanged", onVoices);
      run();
    }, 750);
  };

  return {
    getPlaybackState: () => playbackState,

    get isSupported() {
      return Boolean(synth);
    },

    /** Inicia leitura do texto (substitui qualquer leitura em curso). */
    speak(text: string) {
      if (!synth) {
        emit("stopped");
        return;
      }
      const cleaned = normalizeSpeechText(text);
      if (!cleaned) {
        emit("stopped");
        return;
      }

      synth.cancel();
      const u = new SpeechSynthesisUtterance(cleaned);
      u.onend = () => emit("stopped");
      u.onerror = () => emit("stopped");

      speakWhenVoicesReady(u);
    },

    pause() {
      if (!synth?.speaking || synth.paused) return;
      synth.pause();
      emit("paused");
    },

    resume() {
      if (!synth?.paused) return;
      synth.resume();
      emit("reading");
    },

    stop() {
      synth?.cancel();
      emit("stopped");
    },

    dispose() {
      synth?.cancel();
      emit("stopped");
    }
  };
}

/**
 * Futuro: reprodução via áudio gerado em `/api/tts/lesson`.
 * Esboço — não usado na UI até haver síntese real no servidor.
 *
 * Fluxo típico:
 * 1. `POST /api/tts/nlp` com `{ text: string }` (ou chunking por passo).
 * 2. Servidor lê `TTS_API_KEY ?? ELEVENLABS_API_KEY`, `TTS_PROVIDER`, `TTS_VOICE_ID`.
 * 3. Resposta: URL assinada, base64, ou stream `audio/mpeg`.
 * 4. Cliente: `new Audio(url)` + eventos play/pause/end para espelhar {@link LessonReaderPlaybackState}.
 */
export type LessonTtsApiConfig = {
  provider: string;
  voiceId: string | undefined;
};

export async function fetchLessonTtsStatus(): Promise<{
  configured: boolean;
  provider: string;
  voiceConfigured: boolean;
}> {
  try {
    const res = await fetch("/api/tts/lesson", { method: "GET" });
    if (!res.ok) {
      return { configured: false, provider: "none", voiceConfigured: false };
    }
    return (await res.json()) as {
      configured: boolean;
      provider: string;
      voiceConfigured: boolean;
    };
  } catch {
    return { configured: false, provider: "none", voiceConfigured: false };
  }
}
