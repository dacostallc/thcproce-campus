"use client";

import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { CampusAvatarIdTag } from "@/components/campus/CampusAvatarIdTag";
import { CampusCinemaEmojiBurst } from "@/components/campus/CampusCinemaEmoji";
import {
  getPeerMapPixelsFromPayload,
  normalizeCampusPeerIdentity
} from "@/lib/campusCinemaSeats";
import { useCampusPresenceStore } from "@/stores/campusPresenceStore";
import { useCampusStore } from "@/stores/campusStore";

/** Avatares de outros alunos sincronizados via `CampusPresenceSync`. */
export function CampusPeerAvatars() {
  const peersObj = useCampusPresenceStore((s) => s.othersByUid);
  const cinemaOpen = useCampusStore((s) => s.isCineOpen);
  const peers = Object.values(peersObj);

  if (!peers.length) return null;

  return (
    <>
      {peers.map((p) => {
        const pos = getPeerMapPixelsFromPayload(p);
        const sit = p.avatarPosture === "sit";
        const identity = normalizeCampusPeerIdentity(p);

        return (
          <div
            key={p.uid}
            className="pointer-events-none absolute z-[13] flex -translate-x-1/2 -translate-y-full flex-col items-center"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="group relative flex flex-col items-center">
              <CampusCinemaEmojiBurst
                emoji={p.lastEmoji ?? null}
                at={p.lastEmojiAt ?? 0}
              />

              <CampusAvatarIdTag
                displayName={identity.displayName}
                xpTotal={identity.xpTotal}
                campusRole={identity.campusRole}
                memberSinceIso={identity.memberSinceIso}
                cinemaMode={cinemaOpen}
                viewer="peer"
              />

              <div className="pointer-events-auto flex min-h-[52px] min-w-[52px] items-center justify-center">
                <motion.div
                  className={`relative flex items-center justify-center rounded-full border border-sky-400/50 bg-sky-950/80 text-sky-200 shadow-lg ring-1 ring-white/10 ${
                    sit ? "size-7" : "size-8"
                  }`}
                  animate={{
                    scale: sit ? 0.88 : 1,
                    opacity: sit ? 0.93 : 1,
                    filter: sit ? "brightness(1.12)" : "brightness(1)"
                  }}
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                >
                  <Users size={sit ? 12 : 14} />
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
