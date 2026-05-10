"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Users } from "lucide-react";
import { CampusAvatarIdTag } from "@/components/campus/CampusAvatarIdTag";
import { CampusCinemaEmojiBurst } from "@/components/campus/CampusCinemaEmoji";
import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import { normalizeCampusPeerIdentity } from "@/lib/campusCinemaSeats";
import { cn } from "@/lib/utils";
import type { CampusPresenceStatus } from "@/types/campusPresencePeer";
import type { CampusPresencePeerVisual } from "@/hooks/useCampusPresencePeersVisual";

function peerStatusLabelPt(status: CampusPresenceStatus): string {
  switch (status) {
    case "idle":
      return "Em pausa";
    case "walking":
      return "A caminhar";
    case "cinema":
      return "No cinema";
    case "lesson":
      return "Em aula";
    case "offline":
      return "A sair…";
    default:
      return "A explorar";
  }
}

function peerStatusOrbClasses(status: CampusPresenceStatus): string {
  switch (status) {
    case "idle":
      return "border-amber-400/42 bg-amber-950/62 text-amber-50 shadow-[0_0_8px_rgba(250,204,21,0.14)] ring-amber-300/22";
    case "walking":
    case "exploring":
      return "border-emerald-400/55 bg-emerald-950/74 text-emerald-50 shadow-[0_0_14px_rgba(52,211,153,0.3)] ring-emerald-300/32";
    case "cinema":
      return "border-violet-400/55 bg-violet-950/78 text-violet-50 shadow-[0_0_16px_rgba(167,139,250,0.38)] ring-violet-300/38";
    case "lesson":
      return "border-sky-400/55 bg-sky-950/78 text-sky-50 shadow-[0_0_14px_rgba(56,189,248,0.34)] ring-sky-300/36";
    case "offline":
      return "border-white/18 bg-zinc-900/72 text-white/55 shadow-[0_0_6px_rgba(255,255,255,0.06)] ring-white/10";
    default:
      return "border-white/25 bg-black/55 text-white ring-white/15";
  }
}

type Props = {
  cinemaOpen: boolean;
  items: CampusPresencePeerVisual[];
  realtimeByPeerId?: Record<string, CampusRealtimePayload>;
};

/**
 * Peers no mapa — pointer-events-none no outer shell (não bloqueia walk/hotspots).
 * Cartão compacto sempre visível (mobile-safe); realtime inclui tag XP como antes.
 */
export function CampusUnifiedPresencePeers({ cinemaOpen, items, realtimeByPeerId }: Props) {
  if (!items.length) return null;

  return (
    <AnimatePresence initial={false}>
      {items.map(({ peer }) => {
        const rt = realtimeByPeerId?.[peer.peerId];
        const fullId = rt ? normalizeCampusPeerIdentity(rt) : null;
        const sit = rt?.avatarPosture === "sit";
        const opacity = peer.visualOpacity ?? 1;

        return (
          <motion.div
            key={peer.peerId}
            layout="position"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity,
              scale: opacity > 0.2 ? 1 : 0.94,
              left: `${peer.xPercent}%`,
              top: `${peer.yPercent}%`
            }}
            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
            transition={{
              left: { type: "tween", duration: 0.52, ease: [0.22, 0.85, 0.36, 1] },
              top: { type: "tween", duration: 0.52, ease: [0.22, 0.85, 0.36, 1] },
              opacity: { duration: 0.38 },
              scale: { type: "spring", stiffness: 280, damping: 28 },
              layout: { type: "spring", stiffness: 260, damping: 30 }
            }}
            className="pointer-events-none absolute z-[13] flex -translate-x-1/2 -translate-y-full flex-col items-center"
          >
            <motion.div
              className="group relative flex flex-col items-center"
              animate={
                peer.status === "idle"
                  ? { y: [0, -2, 0] }
                  : peer.status === "offline"
                    ? { y: 0 }
                    : { y: sit ? 2 : 0 }
              }
              transition={
                peer.status === "idle"
                  ? { duration: 4.6, repeat: Infinity, ease: "easeInOut" }
                  : peer.status === "offline"
                    ? { duration: 0.35 }
                    : { type: "spring", stiffness: 260, damping: 26 }
              }
            >
              {rt && fullId ? (
                <>
                  <CampusCinemaEmojiBurst emoji={rt.lastEmoji ?? null} at={rt.lastEmojiAt ?? 0} />
                  <CampusAvatarIdTag
                    displayName={fullId.displayName}
                    xpTotal={fullId.xpTotal}
                    campusRole={fullId.campusRole}
                    memberSinceIso={fullId.memberSinceIso}
                    cinemaMode={cinemaOpen}
                    viewer="peer"
                  />
                </>
              ) : null}

              <div className="pointer-events-none flex min-h-[52px] min-w-[52px] flex-col items-center justify-center gap-1">
                <motion.div
                  layout
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-bold tabular-nums shadow-lg shadow-black/35 ring-1 backdrop-blur-md sm:h-10 sm:w-10",
                    peerStatusOrbClasses(peer.status),
                    sit ? "scale-[0.92] opacity-[0.93]" : ""
                  )}
                  animate={{ scale: sit ? 0.92 : 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                >
                  <Users
                    size={sit ? 13 : 15}
                    strokeWidth={2}
                    aria-hidden
                    className={cn(
                      peer.status === "offline" && "opacity-55",
                      peer.status === "idle" && "opacity-80"
                    )}
                  />
                </motion.div>

                <div
                  className={cn(
                    "max-w-[10.5rem] rounded-lg border border-white/12 bg-black/58 px-2 py-1 text-center shadow-md shadow-black/25 backdrop-blur-md",
                    "ring-1 ring-white/[0.06]"
                  )}
                  role="group"
                  aria-label={`${peer.displayName}, ${peerStatusLabelPt(peer.status)}`}
                >
                  <p className="truncate text-[10px] font-semibold leading-tight text-white/92">
                    {peer.displayName}
                  </p>
                  <p className="mt-0.5 text-[8.5px] font-medium uppercase tracking-[0.14em] text-white/48">
                    {peerStatusLabelPt(peer.status)}
                  </p>
                  {peer.zoneTitlePt ? (
                    <p className="mt-0.5 truncate text-[8px] text-white/42">{peer.zoneTitlePt}</p>
                  ) : peer.currentZoneId ? (
                    <p className="mt-0.5 truncate text-[8px] text-white/38">{peer.currentZoneId}</p>
                  ) : null}
                  {peer.levelHint && !rt ? (
                    <p className="mt-0.5 truncate text-[8px] text-emerald-200/55">{peer.levelHint}</p>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}
