"use client";

import { useEffect } from "react";
import { useCampusHudStore } from "@/stores/campusHudStore";

export function useCampusAdminBroadcastHotkeys(isCampusAdmin: boolean) {
  useEffect(() => {
    if (!isCampusAdmin) return;

    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey || e.code !== "KeyB") return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      const { adminBroadcastComposerOpen, setAdminBroadcastComposerOpen } =
        useCampusHudStore.getState();
      setAdminBroadcastComposerOpen(!adminBroadcastComposerOpen);
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isCampusAdmin]);
}
