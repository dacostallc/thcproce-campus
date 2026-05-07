"use client";

import { useEffect } from "react";
import { useCampusStore } from "@/stores/campusStore";

/** Teclas 1 / 2 / 3 enviam reação via Presence (mapa inteiro ou Cine THCProce). */
export function useCampusEmojiReactionHotkeys() {
  const fireCinemaEmoji = useCampusStore((s) => s.fireCinemaEmoji);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tg = e.target as HTMLElement | null;
      const tag = tg?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        tg?.getAttribute?.("role") === "textbox"
      )
        return;
      if (tg?.isContentEditable) return;

      const keyMap: Record<string, string> = {
        "1": "🔥",
        "2": "👏",
        "3": "🌱"
      };
      const emoji = keyMap[e.key];
      if (!emoji) return;
      e.preventDefault();
      fireCinemaEmoji(emoji);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [fireCinemaEmoji]);
}
