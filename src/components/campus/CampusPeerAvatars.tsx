"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Users } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { useCampusStore } from "@/stores/campusStore";
import { useCampusHudStore } from "@/stores/campusHudStore";

type Peer = { id: string; x: number; y: number; label: string };

/** Avatares de outros alunos sobre o mapa (+ atualiza contagem no HUD). */
export function CampusPeerAvatars({ myLabel }: { myLabel: string }) {
  const player = useCampusStore((s) => s.player);
  const [peers, setPeers] = useState<Peer[]>([]);
  const supa = useMemo(() => createSupabaseBrowser(), []);

  const uid = useMemo(() => {
    if (typeof window === "undefined") return "";
    const k = "thc-presence-id";
    let id = sessionStorage.getItem(k);
    if (!id) {
      id = `p_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(k, id);
    }
    return id;
  }, []);

  const labelRef = useRef(myLabel);
  labelRef.current = myLabel;
  const posRef = useRef(player);
  posRef.current = player;

  useEffect(() => {
    const setOnline = useCampusHudStore.getState().setOnlineApprox;
    const map = new Map<string, Peer>();

    if (!supa || !uid) {
      const seed =
        typeof window !== "undefined"
          ? uid.split("").reduce((a, c) => a + c.charCodeAt(0), 99)
          : 140;
      setOnline(105 + (seed % 45));
      return;
    }

    const ch = supa.channel("campus-map", {
      config: { broadcast: { self: false } }
    });

    type PosPayload = { uid: string; x: number; y: number; label: string; at: number };

    const flush = () =>
      setPeers(Array.from(map.values()).filter((p) => p.id !== uid));

    ch.on("broadcast", { event: "pos" }, ({ payload }) => {
      const p = payload as PosPayload;
      if (!p?.uid || p.uid === uid) return;
      const stale = Date.now() - (p.at || 0) > 12000;
      if (stale || p.x == null || p.y == null) {
        map.delete(p.uid);
      } else {
        map.set(p.uid, {
          id: p.uid,
          x: p.x,
          y: p.y,
          label: String(p.label || "").slice(0, 20) || "Aluno"
        });
      }
      setOnline(Math.max(1, 1 + map.size));
      flush();
    });

    void ch.subscribe();

    const iv = window.setInterval(() => {
      const p = posRef.current;
      const lb = labelRef.current;
      const msg: PosPayload = {
        uid,
        x: p.x,
        y: p.y,
        label: lb.slice(0, 24),
        at: Date.now()
      };
      void ch.send({
        type: "broadcast",
        event: "pos",
        payload: msg
      });
      setOnline(Math.max(1, 1 + map.size));
    }, 380);

    return () => {
      window.clearInterval(iv);
      void supa.removeChannel(ch);
    };
  }, [supa, uid]);

  if (!peers.length) return null;

  return (
    <>
      {peers.map((p) => (
        <div
          key={p.id}
          className="pointer-events-none absolute z-[13] -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="glass-strong mb-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/90 shadow-md">
            {p.label}
          </span>
          <div className="mx-auto flex size-8 items-center justify-center rounded-full border border-sky-400/50 bg-sky-950/80 text-sky-200 shadow-lg">
            <Users size={14} />
          </div>
        </div>
      ))}
    </>
  );
}
