"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCampusStore } from "@/stores/campusStore";
import { campusCineYoutubeUrlFromEnv } from "@/config/campusCinema";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] flex-1 items-center justify-center rounded-xl bg-black/40 text-xs text-white/60">
      A carregar o player…
    </div>
  )
});

type Props = {
  youtubeUrl?: string;
};

/** Drive-in cinematográfico: overlay fixo com live YouTube THCProce. */
export function CineDriveIn({ youtubeUrl }: Props) {
  const url = youtubeUrl?.trim() || campusCineYoutubeUrlFromEnv();
  const isOpen = useCampusStore((s) => s.isCineOpen);
  const setCineOpen = useCampusStore((s) => s.setIsCineOpen);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="cine-root"
          className="fixed inset-0 z-[40] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          aria-modal
          aria-labelledby="cine-drive-in-title"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
            aria-hidden
            onClick={() => setCineOpen(false)}
          />
          <motion.div
            className="pointer-events-auto fixed left-1/2 top-[10%] z-[1] flex h-[60vh] w-[80vw] max-w-[min(92vw,1200px)] -translate-x-1/2 flex-col rounded-2xl border-2 border-canna-400/70 bg-black/35 p-3 md:p-4 shadow-[0_0_32px_rgba(74,222,128,0.45),0_0_4px_rgba(74,222,128,0.9)_inset] sm:rounded-3xl sm:p-5"
            style={{
              WebkitBackdropFilter: "blur(12px)",
              backdropFilter: "blur(12px)"
            }}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setCineOpen(false)}
              className="absolute right-3 top-3 z-[2] flex h-10 w-10 items-center justify-center rounded-xl border border-canna-400/40 bg-black/55 text-white/95 shadow-[0_0_12px_rgba(74,222,128,0.35)] transition hover:bg-canna-600/35 hover:border-canna-300/60 focus-visible:outline focus-visible:ring-2 focus-visible:ring-canna-400/80 md:right-4 md:top-4"
              aria-label="Fechar Cine THC"
            >
              <X size={20} strokeWidth={2.4} />
            </button>

            <h2 id="cine-drive-in-title" className="sr-only">
              Cine THC — transmissão ao vivo
            </h2>

            <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/20">
              {url ? (
                <div className="relative aspect-auto min-h-0 flex-1 w-full [&_.react-player]:!h-full [&_.react-player]:!w-full">
                  <ReactPlayer
                    url={url}
                    width="100%"
                    height="100%"
                    controls
                    playing={isOpen}
                    config={{
                      youtube: {
                        playerVars: { autoplay: 1, modestbranding: 1 }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
                  <p className="text-sm font-semibold text-canna-200">
                    Nenhuma transmissão configurada
                  </p>
                  <p className="max-w-sm text-xs text-white/65">
                    Defina{" "}
                    <code className="rounded bg-white/10 px-1 py-0.5 text-[11px] text-canna-200">
                      NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL
                    </code>{" "}
                    com o link da live THCProce.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
