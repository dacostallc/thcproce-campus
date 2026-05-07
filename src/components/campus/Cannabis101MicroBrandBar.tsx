"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Leaf, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCannabis101TrailerMuxPlaybackId,
  getCannabis101TrailerYoutubeId,
  hasCannabis101TrailerConfigured
} from "@/lib/video/cannabis101Stream";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

const MOODLE = "https://thcproce.com.br/escola";

type Props = {
  className?: string;
};

function TrailerModal({
  open,
  onClose,
  trailerMux,
  trailerYt
}: {
  open: boolean;
  onClose: () => void;
  trailerMux: string;
  trailerYt: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Trailer Cannabis 101"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-amber-500/30 bg-black shadow-2xl"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/60 p-2 text-white hover:bg-black/80"
              aria-label="Fechar trailer"
            >
              <X size={18} />
            </button>
            <div className="aspect-video w-full">
              {trailerMux ? (
                <MuxPlayer
                  playbackId={trailerMux}
                  streamType="on-demand"
                  accentColor="#fbbf24"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : trailerYt ? (
                <iframe
                  title="Trailer Cannabis 101"
                  className="size-full border-0"
                  src={`https://www.youtube-nocookie.com/embed/${trailerYt}?rel=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Faixa mínima no topo da coluna central — marca sem competir com o conteúdo da aula.
 */
export function Cannabis101MicroBrandBar({ className }: Props) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const showTrailer = hasCannabis101TrailerConfigured();
  const trailerMux = getCannabis101TrailerMuxPlaybackId();
  const trailerYt = getCannabis101TrailerYoutubeId();

  return (
    <>
      <div
        className={cn(
          "flex min-h-[2.25rem] flex-wrap items-center justify-between gap-2 border-b border-amber-500/10 bg-black/35 px-2 py-1.5 sm:px-3",
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Leaf className="size-3.5 shrink-0 text-amber-400/80" aria-hidden />
          <span className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200/75">
            Cannabis 101
          </span>
          <span className="text-white/20">·</span>
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
            THCProce Science
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {showTrailer && (trailerMux || trailerYt) ? (
            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              className="inline-flex items-center gap-1 rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-100 hover:bg-amber-500/15"
            >
              <Play className="size-3" />
              Trailer
            </button>
          ) : null}
          <Link
            href={MOODLE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/65 hover:border-amber-500/30 hover:text-white"
          >
            Moodle
            <ExternalLink className="size-3 opacity-70" />
          </Link>
        </div>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerMux={trailerMux}
        trailerYt={trailerYt}
      />
    </>
  );
}
