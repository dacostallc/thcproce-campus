"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RootErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-ink-900 text-white">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-xl font-bold text-white">Algo falhou ao carregar o campus</h1>
        <p className="text-sm text-white/65 leading-relaxed">
          O mapa ou um painel não concluiu o carregamento. Você pode tentar de novo ou verificar o status do sistema.
        </p>
        {error.digest ? (
          <p className="text-[11px] font-mono text-white/35">Ref: {error.digest}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-canna-500 px-5 py-2.5 text-sm font-bold text-ink-900 hover:bg-canna-400 transition-colors"
        >
          Tentar de novo
        </button>
        <Link
          href="/status"
          className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10 transition-colors"
        >
          Status
        </Link>
        <Link href="/" className="text-sm text-canna-300 hover:underline">
          Ir ao início
        </Link>
      </div>
    </main>
  );
}
