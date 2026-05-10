"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readCampusGuestVisitor,
  setCampusGuestNickname as persistGuestNickname
} from "@/lib/campusGuestVisitor";

export type CampusGuestVisitorHook = {
  /** Verdadeiro quando não há sessão NextAuth. */
  isGuestVisitor: boolean;
  guestId: string;
  guestNickname: string | null;
  setGuestNickname: (name: string | null) => void;
  guestHydrated: boolean;
};

export function useCampusGuestVisitor(authStatus: string): CampusGuestVisitorHook {
  const [guestId, setGuestId] = useState("");
  const [guestNickname, setGuestNicknameState] = useState<string | null>(null);
  const [guestHydrated, setGuestHydrated] = useState(false);

  useEffect(() => {
    const v = readCampusGuestVisitor();
    setGuestId(v.guestId);
    setGuestNicknameState(v.guestNickname);
    setGuestHydrated(true);
  }, []);

  const setGuestNickname = useCallback((name: string | null) => {
    persistGuestNickname(name);
    const v = readCampusGuestVisitor();
    setGuestId(v.guestId);
    setGuestNicknameState(v.guestNickname);
  }, []);

  const isGuestVisitor = authStatus !== "authenticated";

  return {
    isGuestVisitor,
    guestId,
    guestNickname,
    setGuestNickname,
    guestHydrated
  };
}
