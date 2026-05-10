"use client";

import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";

import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

type Props = { playbackId: string; courseSlug?: string | null };

export function MuxLessonPlayer({ playbackId, courseSlug }: Props) {
  return (
    <div className="min-h-screen bg-ink-900 text-white flex flex-col">
      <header className="px-6 py-4 border-b border-white/10 glass-strong flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-canna-300 font-semibold">
            THCProce · vídeo premium
          </p>
          <p className="text-sm text-white/70">{courseSlug ? `Curso: ${courseSlug}` : "Demonstração"}</p>
        </div>
        <Link
          href={CAMPUS_HOME_PATH}
          className="text-sm font-semibold text-canna-300 hover:text-canna-200"
        >
          ← Voltar ao campus
        </Link>
      </header>
      <div className="flex-1 w-full max-w-5xl mx-auto p-6">
        <div className="rounded-2xl overflow-hidden border border-canna-400/25 shadow-xl bg-black aspect-video">
          <MuxPlayer
            playbackId={playbackId}
            streamType="on-demand"
            accentColor="#4ade80"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <p className="mt-4 text-xs text-white/50">
          Substitua o playback ID pela variável de ambiente NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID ou
          integre aulas vindas do Mux Assets API após SSO com Moodle.
        </p>
      </div>
    </div>
  );
}
