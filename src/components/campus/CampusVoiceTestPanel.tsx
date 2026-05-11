"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SAMPLE_TEXT =
  "Olá, meus amigos. Sejam muito bem-vindos ao THCProce Campus.";

export function CampusVoiceTestPanel() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const generate = useCallback(async () => {
    setError(null);
    setLoading(true);
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);

    try {
      const res = await fetch("/api/voice/tts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const ct = res.headers.get("content-type") ?? "";
      if (!res.ok) {
        if (ct.includes("application/json")) {
          const data = (await res.json()) as { error?: string };
          setError(data.error ?? `Erro ${res.status}`);
        } else {
          setError(`Pedido falhou (${res.status}).`);
        }
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      setAudioUrl(url);
    } catch {
      setError("Não foi possível contactar o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [text]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/90">
      <h2 className="mb-1 text-base font-semibold text-canna-200">
        Painel de teste — narração ElevenLabs (interno)
      </h2>
      <p className="mb-4 text-xs text-white/50">
        Só administradores autenticados. A chave da API nunca sai do servidor.
      </p>

      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/45">
        Texto (máx. 1200 caracteres)
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        className="mb-4 w-full resize-y rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white placeholder:text-white/35 focus:border-canna-500/50 focus:outline-none focus:ring-1 focus:ring-canna-500/40"
        disabled={loading}
      />

      <button
        type="button"
        onClick={() => void generate()}
        disabled={loading || !text.trim()}
        className="rounded-lg bg-canna-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-canna-500 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? "A gerar…" : "Gerar narração"}
      </button>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-500/35 bg-rose-950/40 px-3 py-2 text-xs text-rose-100">
          {error}
        </p>
      ) : null}

      {audioUrl ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-white/55">Pré-visualização:</p>
          <audio controls src={audioUrl} className="w-full max-w-md" />
        </div>
      ) : null}
    </div>
  );
}
