"use client";



import { motion } from "framer-motion";

import { User } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import type { Transition } from "framer-motion";

import type { CampusUserRole } from "@/config/userRoles";

import { CampusAvatarIdTag } from "@/components/campus/CampusAvatarIdTag";

import { CampusCinemaEmojiBurst } from "@/components/campus/CampusCinemaEmoji";

import { useCampusStore } from "@/stores/campusStore";



type Props = {

  tagDisplayName: string;

  tagXpTotal: number;

  campusRole: CampusUserRole;

  memberSinceIso: string | null;

};



/** Avatar do visitante/aluno — segue coords em % (mesmo espaço dos hotspots). */

export function CampusPlayer({

  tagDisplayName,

  tagXpTotal,

  campusRole,

  memberSinceIso

}: Props) {

  const player = useCampusStore((s) => s.player);

  const posture = useCampusStore((s) => s.avatarPosture);

  const cinemaOpen = useCampusStore((s) => s.isCineOpen);

  const sit = posture === "sit";

  const lastEmoji = useCampusStore((s) => s.cinemaLastEmoji);

  const lastEmojiAt = useCampusStore((s) => s.cinemaLastEmojiAt);



  const prevRef = useRef(player);

  const [moveTransition, setMoveTransition] = useState<Transition>({

    type: "spring",

    stiffness: 95,

    damping: 26,

    mass: 1

  });



  useEffect(() => {

    const prev = prevRef.current;

    const d = Math.hypot(player.x - prev.x, player.y - prev.y);

    prevRef.current = player;

    if (d < 0.05) return;

    setMoveTransition({

      type: "tween",

      duration: Math.min(1.85, Math.max(0.32, 0.28 + d * 0.028)),

      ease: [0.22, 0.85, 0.36, 1]

    });

  }, [player.x, player.y]);



  return (

    <motion.div

      className="absolute z-[11] pointer-events-none -translate-x-1/2 -translate-y-1/2"

      style={{ left: `${player.x}%`, top: `${player.y}%` }}

      initial={false}

      animate={{ left: `${player.x}%`, top: `${player.y}%` }}

      transition={moveTransition}

    >

      <motion.div

        className="group relative flex flex-col items-center pointer-events-none"

        animate={{

          scale: sit ? 0.88 : 1,

          opacity: sit ? 0.92 : 1,

          filter: sit ? "brightness(1.15)" : "brightness(1)"

        }}

        transition={{ type: "spring", stiffness: 300, damping: 27 }}

      >

        <div className="relative flex flex-col items-center">

          <CampusCinemaEmojiBurst emoji={lastEmoji} at={lastEmojiAt} emphasis />



          <CampusAvatarIdTag

            displayName={tagDisplayName}

            xpTotal={tagXpTotal}

            campusRole={campusRole}

            memberSinceIso={memberSinceIso}

            cinemaMode={cinemaOpen}

            viewer="self"

          />



          <div className="pointer-events-auto flex min-h-[52px] min-w-[52px] items-center justify-center">

            <div

              className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full glass-strong shadow-lg shadow-black/40 ring-2 ${

                sit ? "ring-canna-300/40" : "ring-canna-400/60"

              }`}

            >

              <User size={22} className="text-canna-200" />

              {sit ? (

                <span

                  aria-hidden

                  className="absolute -bottom-1 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-full bg-black/45 blur-[2px]"

                />

              ) : null}

            </div>

          </div>

        </div>

      </motion.div>

    </motion.div>

  );

}


