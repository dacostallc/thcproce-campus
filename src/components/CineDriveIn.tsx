"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Radio, X } from "lucide-react";
import { useMemo } from "react";
import { useCampusStore } from "@/stores/campusStore";
import type { MergedLiveBroadcast } from "@/lib/campusLiveBroadcast";
import {
  deriveEffectiveCampusStreamState,
  readMergedLiveBroadcastFromEnv,
  resolveCampusPrimaryPlaybackUrl
} from "@/lib/campusLiveBroadcast";
import { CampusLiveStreamOfflinePoster } from "@/components/campus/CampusLiveStreamOfflinePoster";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[200px] flex-1 items-center justify-center rounded-xl bg-transparent text-xs text-white/75 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
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
      className: "border-emerald-400/55 bg-emerald-500/18 text-emerald-50 backdrop-blur-sm"
    };
  }
  if (state === "scheduled") {
    return {
      label: "Programado",
      className: "border-sky-400/45 bg-sky-500/14 text-sky-50 backdrop-blur-sm"
    };
  }
  return {
    label: "Offline",
    className: "border-white/20 bg-white/10 text-white/80 backdrop-blur-sm"
  };
}

/**
 * Cine THCProce — player para YouTube Live, HLS/Bunny e Mux; chat à direita.
 * Sem backdrop escuro sobre o mapa — o campus permanece visível atrás do cartão do player.
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
            className="pointer-events-auto fixed left-1/2 top-[8%] z-[41] flex h-[min(62vh,660px)] max-h-[calc(100vh-6rem)] w-[min(96vw,min(1200px,calc(100vw-0.75rem)))] flex-col origin-top -translate-x-1/2 md:top-[9%] md:h-[min(70vh,760px)] md:w-[min(94vw,min(1320px,calc(100vw-2rem)))] lg:h-[min(74vh,820px)] lg:w-[min(92vw,min(1440px,calc(100vw-3rem)))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative flex h-full min-h-0 w-full min-w-0 flex-col rounded-2xl border border-white/22 bg-white/[0.06] p-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.12)] ring-1 ring-canna-400/25 sm:rounded-3xl sm:p-3 md:p-4"
              style={{
                WebkitBackdropFilter: "blur(12px)",
                backdropFilter: "blur(12px)"
              }}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <button
                type="button"
                onClick={() => closeCineDriveIn()}
                className="absolute right-2.5 top-2.5 z-[2] flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white/95 shadow-md backdrop-blur-md transition hover:bg-white/25 hover:border-white/35 focus-visible:outline focus-visible:ring-2 focus-visible:ring-canna-400/80 md:right-3 md:top-3"
                aria-label="Fechar Cine THCProce"
              >
                <X size={20} strokeWidth={2.4} />
              </button>

              <h2 id="cine-drive-in-title" className="sr-only">
                Cine THCProce — transmissão ao vivo
              </h2>

              <div className="mb-2 flex flex-wrap items-center gap-2 pr-10">
                <span
                  className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${badge.className}`}
                >
                  <Radio size={12} aria-hidden />
                  {badge.label}
                </span>
              </div>
              {scheduledLabel && streamState !== "live" ? (
                <p className="mb-2 text-center text-[10px] text-white/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                  Próxima janela anunciada:{" "}
                  <span className="text-canna-100/95">{scheduledLabel}</span>
                </p>
              ) : null}

              <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-[1fr_min(28%,240px)]">
                <div className="relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-transparent">
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
                    <CampusLiveStreamOfflinePoster
                      aspectVideo={false}
                      className="min-h-[min(48vh,460px)] w-full flex-1 rounded-lg border-white/10 py-12"
                      title="Transmissão do campus offline no momento"
                      subtitle="Próxima live em breve. Abre a programação do dia no campus para ver horários."
                    />
                  )}
                </div>

                <div className="pointer-events-auto flex max-h-[220px] min-h-[140px] flex-col rounded-xl border border-white/15 bg-white/[0.06] backdrop-blur-md md:max-h-none">
                  <p className="border-b border-white/[0.08] px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                    Chat ao vivo (placeholder)
                  </p>
                  <div className="flex flex-1 flex-col gap-2 p-2">
                    <div className="flex-1 overflow-hidden rounded-lg bg-white/[0.05] px-2 py-2 text-[10px] leading-relaxed text-white/55">
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
                      className="resize-none rounded-lg border border-white/12 bg-white/[0.06] px-2 py-1.5 text-[11px] text-white/65 placeholder:text-white/35"
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
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
