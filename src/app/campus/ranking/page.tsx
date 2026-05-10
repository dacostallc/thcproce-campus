import Link from "next/link";
import { Trophy } from "lucide-react";
import { CampusLeaderboard } from "@/components/campus/leaderboard/CampusLeaderboard";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking · Campus THCProce",
  description: "Leaderboard demo do campus (mock local)."
};

export default function CampusRankingPage() {
  return (
    <main className="relative min-h-[100svh] bg-ink-900 px-4 pb-28 pt-[5.75rem] sm:px-6">
      <div className="pointer-events-none absolute inset-0 opacity-65">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_-10%,rgba(52,211,153,0.18),transparent_55%),radial-gradient(ellipse_at_90%_0%,rgba(192,132,252,0.12),transparent_52%)]" />
      </div>
      <div className="relative mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/14 bg-black/42 p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-300/42">
              <Trophy size={20} className="text-amber-200/95" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200/92">
                Campus THCProce
              </p>
              <h1 className="text-xl font-bold text-white">Ranking demonstrativo</h1>
              <p className="mt-2 text-sm text-white/55">
                Dados MOCK agrupados no browser — apenas para cenografia enquanto o backend não expõe
                leaderboard oficial.
              </p>
            </div>
          </div>
          <Button asChild variant="glass" size="sm" className="pointer-events-auto">
            <Link href="/campus">Voltar ao mapa</Link>
          </Button>
        </header>
        <div className="rounded-2xl border border-white/12 bg-black/42 p-5 backdrop-blur-md">
          <CampusLeaderboard />
        </div>
      </div>
    </main>
  );
}
