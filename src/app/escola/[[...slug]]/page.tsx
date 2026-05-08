import Link from "next/link";
import { Leaf } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escola em atualização — THCProce",
  robots: { index: false, follow: false }
};

/**
 * Bloqueio público temporário da escola legada (Moodle em /escola).
 * Não remove dados no servidor Moodle — apenas substitui o que o Next entrega neste host.
 */
export default function LegacyEscolaMaintenancePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-ink-900 text-white">
      <div
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(34, 197, 94, 0.12), transparent 50%), linear-gradient(180deg, #050a07 0%, #0a1510 100%)"
        }}
      />

      <div className="w-full max-w-lg rounded-2xl border border-canna-400/30 glass-strong p-8 sm:p-10 text-center shadow-2xl shadow-black/40">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-canna-400/40 bg-canna-500/15">
          <Leaf className="text-canna-300" size={28} aria-hidden />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          A Escola THCProce está sendo atualizada
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
          O novo campus já está disponível no endereço principal. Faça login por lá para acessar suas aulas e o mapa
          interativo.
        </p>
        <Link
          href="https://thcproce.com.br"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-canna-500 px-5 py-3.5 text-sm font-bold text-ink-900 shadow-lg shadow-canna-500/25 transition hover:bg-canna-400"
        >
          Abrir o novo campus
        </Link>
        <p className="mt-6 text-[11px] text-white/45">
          Dúvidas ou suporte:{" "}
          <a href="mailto:procbd@icloud.com" className="text-canna-300 hover:underline">
            procbd@icloud.com
          </a>
        </p>
      </div>
    </main>
  );
}
