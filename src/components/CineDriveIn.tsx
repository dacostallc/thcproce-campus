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

/**
 * Cine THCProce: player compacto ao topo para o auditório ficar visível em baixo + luz dinâmica no reflexo do telão.
 */
export function CineDriveIn({ youtubeUrl }: Props) {
  const url = youtubeUrl?.trim() || campusCineYoutubeUrlFromEnv();
  const isOpen = useCampusStore((s) => s.isCineOpen);
  const closeCineDriveIn = useCampusStore((s) => s.closeCineDriveIn);
  const auditoriumFull = useCampusStore((s) => s.cinemaAuditoriumFull);
  const cinemaSeatIndex = useCampusStore((s) => s.cinemaSeatIndex);

  const showStandingBanner = auditoriumFull && cinemaSeatIndex === null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="cine-root"
          className="pointer-events-none fixed inset-0 z-[40]"
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
            className="fixed inset-0 z-0 pointer-events-auto bg-gradient-to-b from-black/62 via-black/42 to-transparent"
            aria-hidden
            onClick={() => closeCineDriveIn()}
          />

          {/* Camada principal: verde / branco pulsando (simula variações do telão) */}
          <motion.div
            className="pointer-events-none fixed left-1/2 top-[8%] z-[25] block h-[min(40vh,420px)] w-[min(98vw,1200px)] -translate-x-1/2 md:h-[min(46vh,480px)]"
            aria-hidden
            animate={{
              opacity: [0.58, 0.93, 0.66, 0.88],
              scale: [1, 1.012, 0.994, 1.006],
              rotate: [-0.3, 0.35, -0.2, 0.15]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 10.8,
              ease: "easeInOut"
            }}
            style={{
              background: [
                "radial-gradient(ellipse 92% 78% at 50% -2%, rgba(252,251,247,0.34) 0%, rgba(52,211,153,0.44) 22%, rgba(16,163,124,0.18) 48%, transparent 74%)",
                "radial-gradient(ellipse 70% 60% at 46% 4%, rgba(224,247,239,0.28) 0%, transparent 55%)",
                "radial-gradient(ellipse 95% 80% at 52% -6%, rgba(167,251,229,0.12) 0%, transparent 42%)"
              ].join(", "),
              filter: "saturate(1.06)"
            }}
          />

          <motion.div
            className="pointer-events-none fixed left-1/2 top-[8%] z-[26] block h-[min(40vh,420px)] w-[min(98vw,1200px)] -translate-x-1/2 mix-blend-screen md:h-[min(46vh,480px)]"
            aria-hidden
            animate={{
              opacity: [0.12, 0.34, 0.18, 0.3]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 6.4,
              ease: "easeInOut",
              delay: 0.45
            }}
            style={{
              background:
                "radial-gradient(ellipse 78% 52% at 50% 2%, rgba(250,250,250,0.65) 0%, rgba(110,231,183,0.15) 36%, transparent 68%)"
            }}
          />

          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 top-[calc(12%+min(44vh,440px))] z-[38] md:top-[calc(14%+min(44vh,440px))]"
            aria-hidden
          >
            <motion.div
              className="mx-auto h-full max-w-[1200px]"
              animate={{
                opacity: [0.68, 1, 0.76, 0.92]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 8.2,
                ease: "easeInOut"
              }}
              style={{
                background:
                  "linear-gradient(to bottom, rgba(248,250,252,0.11) 0%, rgba(34,197,94,0.15) 12%, rgba(45,212,191,0.07) 22%, transparent 72%)",
                maskImage:
                  "radial-gradient(ellipse 92% 100% at 50% -10%, black 52%, transparent 88%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 92% 100% at 50% -10%, black 52%, transparent 88%)"
              }}
            />

            <motion.div
              className="pointer-events-none absolute inset-0 mx-auto max-w-[1200px]"
              animate={{
                opacity: [0.22, 0.48, 0.26, 0.42],
                rotate: [-0.2, 0.25, -0.1, 0.15]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 7.6,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                background:
                  "linear-gradient(to bottom, rgba(240,253,244,0.14) 0%, rgba(16,185,129,0.11) 20%, transparent 78%)",
                mixBlendMode: "soft-light",
                maskImage:
                  "radial-gradient(ellipse 88% 100% at 50% -8%, black 48%, transparent 86%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 88% 100% at 50% -8%, black 48%, transparent 86%)"
              }}
            />
          </div>

          <motion.div
            className="pointer-events-auto fixed left-1/2 top-[12%] z-[41] max-h-[min(44vh,440px)] w-[min(94vw,min(760px,calc(100vw-1.25rem)))] origin-top -translate-x-[calc(50%+min(1vw,6px))] md:top-[14%] md:max-h-[min(42vh,420px)] md:w-[min(86vw,min(780px,calc(100vw-3rem)))] md:-translate-x-[calc(50%+min(2.5vw,22px))] lg:w-[min(78vw,min(820px,calc(100vw-4rem)))] lg:-translate-x-[calc(50%+min(3.5vw,32px))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative flex h-full w-full flex-col rounded-2xl border-2 border-canna-400/70 bg-black/38 p-2.5 shadow-[0_0_32px_rgba(74,222,128,0.45),0_0_4px_rgba(74,222,128,0.9)_inset] sm:rounded-3xl sm:p-3 md:p-4"
              style={{
                WebkitBackdropFilter: "blur(14px)",
                backdropFilter: "blur(14px)"
              }}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <button
                type="button"
                onClick={() => closeCineDriveIn()}
                className="absolute right-2.5 top-2.5 z-[2] flex h-10 w-10 items-center justify-center rounded-xl border border-canna-400/40 bg-black/55 text-white/95 shadow-[0_0_12px_rgba(74,222,128,0.35)] transition hover:bg-canna-600/35 hover:border-canna-300/60 focus-visible:outline focus-visible:ring-2 focus-visible:ring-canna-400/80 md:right-3 md:top-3"
                aria-label="Fechar Cine THCProce"
              >
                <X size={20} strokeWidth={2.4} />
              </button>

              <h2 id="cine-drive-in-title" className="sr-only">
                Cine THCProce — transmissão ao vivo
              </h2>

              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/12 bg-black/25">
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
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
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

              {showStandingBanner ? (
                <p
                  className="mt-2 shrink-0 rounded-lg border border-amber-400/25 bg-amber-950/35 px-2.5 py-1 text-center text-[11px] font-medium leading-snug text-amber-100/90"
                  role="status"
                >
                  Auditório lotado! Você está assistindo em pé na lateral.
                </p>
              ) : null}

              <p className="mt-2 shrink-0 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                Assentos e avatares abaixo continuam sincronizados
              </p>
              <p className="mt-1 text-center text-[10px] text-white/42">
                Reações (mapa ou aqui):{" "}
                <span className="text-white/62">1</span>
                {" · "}
                <span aria-hidden className="text-white/82">
                  🔥{" "}
                </span>
                <span className="text-white/62">2</span>
                {" · "}
                <span aria-hidden className="text-white/82">
                  👏{" "}
                </span>
                <span className="text-white/62">3</span>
                {" · "}
                <span aria-hidden className="text-white/82">
                  🌱
                </span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
