"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Radio, Users, X } from "lucide-react";
import { useMemo } from "react";
import { useCampusStore } from "@/stores/campusStore";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import type { MergedLiveBroadcast } from "@/lib/campusLiveBroadcast";
import {
  deriveEffectiveCampusStreamState,
  readMergedLiveBroadcastFromEnv,
  resolveCampusPrimaryPlaybackUrl
} from "@/lib/campusLiveBroadcast";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] flex-1 items-center justify-center rounded-xl bg-black/40 text-xs text-white/60">
      A carregar o player…
    </div>
  )
});

type Props = {
  /** Preferência: dados fundidos do tRPC `campus.liveBroadcast`; senão env público. */
  liveBroadcast?: MergedLiveBroadcast | null;
};

function streamStateBadgePt(state: ReturnType<typeof deriveEffectiveCampusStreamState>): {
  label: string;
  className: string;
} {
  if (state === "live") {
    return {
      label: "Ao vivo",
      className: "border-emerald-400/45 bg-emerald-950/55 text-emerald-100"
    };
  }
  if (state === "scheduled") {
    return {
      label: "Programado",
      className: "border-sky-400/40 bg-sky-950/45 text-sky-100"
    };
  }
  return {
    label: "Offline",
    className: "border-white/15 bg-black/40 text-white/65"
  };
}

/**
 * Cine THCProce — player preparado para YouTube Live, HLS/Bunny e Mux;
 * estados editoriais, chat placeholder e contagem aproximada de espectadores (presence).
 */
export function CineDriveIn({ liveBroadcast }: Props) {
  const merged = useMemo(
    () => liveBroadcast ?? readMergedLiveBroadcastFromEnv(),
    [liveBroadcast]
  );

  const playbackUrl = resolveCampusPrimaryPlaybackUrl(merged);
  const streamState = deriveEffectiveCampusStreamState(merged);
  const badge = streamStateBadgePt(streamState);

  const isOpen = useCampusStore((s) => s.isCineOpen);
  const closeCineDriveIn = useCampusStore((s) => s.closeCineDriveIn);
  const auditoriumFull = useCampusStore((s) => s.cinemaAuditoriumFull);
  const cinemaSeatIndex = useCampusStore((s) => s.cinemaSeatIndex);

  const peersObj = useCampusPresenceStore((s) => s.othersByUid);

  const viewerApprox = useMemo(() => {
    let n = 0;
    for (const p of Object.values(peersObj)) {
      if (p.inCinema) n++;
    }
    if (isOpen) n += 1;
    return n;
  }, [peersObj, isOpen]);

  const showStandingBanner = auditoriumFull && cinemaSeatIndex === null;

  const scheduledLabel = useMemo(() => {
    if (!merged.scheduledStartIso) return null;
    try {
      const d = new Date(merged.scheduledStartIso);
      if (Number.isNaN(d.getTime())) return merged.scheduledStartIso;
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(d);
    } catch {
      return merged.scheduledStartIso;
    }
  }, [merged.scheduledStartIso]);

  const useIframeEmbed =
    typeof playbackUrl === "string" &&
    playbackUrl.includes("iframe.mediadelivery.net/embed");

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
            className="fixed inset-0 z-0 pointer-events-auto bg-gradient-to-b from-black/42 via-black/26 to-transparent"
            aria-hidden
            onClick={() => closeCineDriveIn()}
          />

          <motion.div
            className="pointer-events-none fixed left-1/2 top-[6%] z-[25] block h-[min(58vh,620px)] w-[min(99vw,1420px)] -translate-x-1/2 md:h-[min(62vh,700px)]"
            aria-hidden
            animate={{
              opacity: [0.4, 0.72, 0.48, 0.68],
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
                "radial-gradient(ellipse 92% 78% at 50% -2%, rgba(252,251,247,0.22) 0%, rgba(52,211,153,0.28) 22%, rgba(16,163,124,0.12) 48%, transparent 74%)",
                "radial-gradient(ellipse 70% 60% at 46% 4%, rgba(224,247,239,0.18) 0%, transparent 55%)",
                "radial-gradient(ellipse 95% 80% at 52% -6%, rgba(167,251,229,0.08) 0%, transparent 42%)"
              ].join(", "),
              filter: "saturate(1.06)"
            }}
          />

          <motion.div
            className="pointer-events-none fixed left-1/2 top-[6%] z-[26] block h-[min(58vh,620px)] w-[min(99vw,1420px)] -translate-x-1/2 mix-blend-screen md:h-[min(62vh,700px)]"
            aria-hidden
            animate={{
              opacity: [0.08, 0.22, 0.14, 0.22]
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
                "radial-gradient(ellipse 78% 52% at 50% 2%, rgba(250,250,250,0.42) 0%, rgba(110,231,183,0.1) 36%, transparent 68%)"
            }}
          />

          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 top-[calc(10%+min(58vh,620px))] z-[38] md:top-[calc(11%+min(62vh,700px))]"
            aria-hidden
          >
            <motion.div
              className="mx-auto h-full max-w-[1200px]"
              animate={{
                opacity: [0.52, 0.82, 0.58, 0.74]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 8.2,
                ease: "easeInOut"
              }}
              style={{
                background:
                  "linear-gradient(to bottom, rgba(248,250,252,0.07) 0%, rgba(34,197,94,0.1) 12%, rgba(45,212,191,0.05) 22%, transparent 72%)",
                maskImage:
                  "radial-gradient(ellipse 92% 100% at 50% -10%, black 52%, transparent 88%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 92% 100% at 50% -10%, black 52%, transparent 88%)"
              }}
            />

            <motion.div
              className="pointer-events-none absolute inset-0 mx-auto max-w-[1200px]"
              animate={{
                opacity: [0.16, 0.34, 0.18, 0.3],
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
                  "linear-gradient(to bottom, rgba(240,253,244,0.09) 0%, rgba(16,185,129,0.07) 20%, transparent 78%)",
                mixBlendMode: "soft-light",
                maskImage:
                  "radial-gradient(ellipse 88% 100% at 50% -8%, black 48%, transparent 86%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 88% 100% at 50% -8%, black 48%, transparent 86%)"
              }}
            />
          </div>

          <motion.div
            className="pointer-events-auto fixed left-1/2 top-[8%] z-[41] flex h-[min(62vh,660px)] max-h-[calc(100vh-6rem)] w-[min(96vw,min(1200px,calc(100vw-0.75rem)))] flex-col origin-top -translate-x-1/2 md:top-[9%] md:h-[min(70vh,760px)] md:w-[min(94vw,min(1320px,calc(100vw-2rem)))] lg:h-[min(74vh,820px)] lg:w-[min(92vw,min(1440px,calc(100vw-3rem)))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative flex h-full min-h-0 w-full min-w-0 flex-col rounded-2xl border-2 border-canna-400/70 bg-black/30 p-2.5 shadow-[0_0_32px_rgba(74,222,128,0.45),0_0_4px_rgba(74,222,128,0.9)_inset] sm:rounded-3xl sm:p-3 md:p-4"
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

              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 pr-10">
                <span
                  className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${badge.className}`}
                >
                  <Radio size={12} aria-hidden />
                  {badge.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-black/35 px-2 py-1 text-[10px] font-semibold text-white/75">
                  <Users size={12} className="text-canna-200/90" aria-hidden />
                  ~{viewerApprox} espectadores
                </span>
              </div>
              {scheduledLabel && streamState !== "live" ? (
                <p className="mb-2 text-center text-[10px] text-white/55">
                  Próxima janela anunciada: <span className="text-canna-100/90">{scheduledLabel}</span>
                </p>
              ) : null}

              <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-[1fr_min(28%,240px)]">
                <div className="relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/12 bg-black/18">
                  {playbackUrl ? (
                    useIframeEmbed ? (
                      <iframe
                        title="Transmissão Bunny Stream"
                        src={playbackUrl}
                        className="min-h-[min(48vh,460px)] w-full flex-1 rounded-lg border-0 bg-black"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative flex min-h-[min(48vh,460px)] flex-1 flex-col overflow-hidden [&_.react-player]:!absolute [&_.react-player]:!left-0 [&_.react-player]:!top-0 [&_.react-player]:!h-full [&_.react-player]:!w-full [&_iframe]:!h-full [&_iframe]:!w-full">
                        <ReactPlayer
                          url={playbackUrl}
                          width="100%"
                          height="100%"
                          controls
                          playing={isOpen && streamState === "live"}
                          config={{
                            youtube: {
                              playerVars: { autoplay: 1, modestbranding: 1 }
                            },
                            file: { attributes: { controlsList: "nodownload" } }
                          }}
                        />
                      </div>
                    )
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                      <p className="text-sm font-semibold text-canna-200">
                        Nenhuma transmissão configurada
                      </p>
                      <p className="max-w-sm text-xs text-white/65">
                        Configure{" "}
                        <code className="rounded bg-white/10 px-1 py-px font-mono text-[10px]">
                          NEXT_PUBLIC_CAMPUS_LIVE_YOUTUBE_URL
                        </code>
                        ,{" "}
                        <code className="rounded bg-white/10 px-1 py-px font-mono text-[10px]">
                          NEXT_PUBLIC_CAMPUS_STREAM_HLS_URL
                        </code>{" "}
                        ou embed Bunny/Mux nas variáveis públicas do deploy.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pointer-events-auto flex max-h-[220px] min-h-[140px] flex-col rounded-xl border border-white/10 bg-black/25 md:max-h-none">
                  <p className="border-b border-white/[0.07] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    Chat ao vivo (placeholder)
                  </p>
                  <div className="flex flex-1 flex-col gap-2 p-2">
                    <div className="flex-1 overflow-hidden rounded-lg bg-black/30 px-2 py-2 text-[10px] leading-relaxed text-white/40">
                      Mensagens em tempo real ligam ao backend depois — canal único por sala/live.
                    </div>
                    <label className="sr-only" htmlFor="cine-chat-placeholder">
                      Mensagem
                    </label>
                    <textarea
                      id="cine-chat-placeholder"
                      rows={2}
                      disabled
                      placeholder="Em breve: enviar mensagem…"
                      className="resize-none rounded-lg border border-white/10 bg-black/35 px-2 py-1.5 text-[11px] text-white/55 placeholder:text-white/30"
                    />
                  </div>
                </div>
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
                Reações (mapa ou aqui): <span className="text-white/62">1</span>
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
