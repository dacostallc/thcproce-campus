"use client";

import { useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandMetal, MessageCircle, Send, Trophy, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { areas } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { trpc } from "@/lib/trpc/react";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import { useCampusStore } from "@/stores/campusStore";

/** Chat global / por área + ranking rápido — armazenado em SQLite via tRPC. */
export function CampusChatDrawer() {
  const open = useCampusHudStore((s) => s.chatOpen);
  const setOpen = useCampusHudStore((s) => s.setChatOpen);
  const channel = useCampusHudStore((s) => s.chatChannel);
  const setChannel = useCampusHudStore((s) => s.setChatChannel);
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const isAdmin = isCampusAdminEmail(session?.user?.email ?? null);

  const { data: rows, refetch } = trpc.campus.chatHistory.useQuery(
    { channel, take: 60 },
    { enabled: open, refetchInterval: open ? 12_000 : false }
  );
  const { data: board } = trpc.campus.leaderboard.useQuery(
    { take: 8 },
    { enabled: open, staleTime: 60_000 }
  );
  const post = trpc.campus.chatPost.useMutation({
    onSuccess: () => void refetch()
  });

  const ordered = useMemo(() => {
    const list = rows ?? [];
    return [...list].reverse();
  }, [rows]);

  const channels = useMemo(() => {
    return [{ value: "global", label: "Campus inteiro" }].concat(
      areas.map((a) => ({ value: `area:${a.id}`, label: a.name }))
    );
  }, []);

  const authorNick =
    status === "authenticated"
      ? (session?.user?.name ??
          session?.user?.email?.split("@")[0] ??
          "Aluno"
        ).slice(0, 64)
      : "Visitante";

  function sendBody(body: string) {
    const trimmed = body.trim();
    if (!trimmed) return;
    post.mutate({
      channel,
      authorName: authorNick,
      body: trimmed
    });
    if (inputRef.current) inputRef.current.value = "";
    if (isAdmin && /^!/.test(trimmed)) {
      const highlight = trimmed.replace(/^!+\s*/, "").trim();
      if (highlight) useCampusStore.getState().fireAdminBroadcast(highlight);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] bg-black/35 backdrop-blur-[1px] pointer-events-auto"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-labelledby="campus-chat-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-[50] w-full max-w-md flex flex-col border-l border-canna-400/25 glass-strong shadow-2xl pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-canna-300">
                  <MessageCircle size={18} />
                  <h2 id="campus-chat-title" className="text-lg font-bold text-white">
                    Chat do campus
                  </h2>
                </div>
                <p className="text-[11px] text-white/55 mt-1">
                  Histórico no servidor • tempo real opcional pelo Supabase
                </p>
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-xl glass hover:bg-white/10 flex items-center justify-center text-white/80"
                aria-label="Fechar chat"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </header>

            <div className="px-5 py-3 border-b border-white/10 space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-semibold block">
                Canal
              </label>
              <select
                className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2.5 text-sm text-white outline-none focus:border-canna-400/50"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                {channels.map((c) => (
                  <option key={c.value} value={c.value} className="bg-ink-900">
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  disabled={post.isPending}
                  onClick={() =>
                    sendBody("👋 Acabei de dar um wave no campus — valeu pela boa energia!")
                  }
                >
                  <HandMetal size={14} /> Wave
                </Button>
                <Link href="/entrar">
                  <Button type="button" variant="glass" size="sm" className="!px-2">
                    Identificar‑se p/ nick
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3 space-y-2">
              {ordered.length === 0 ? (
                <p className="text-sm text-white/50 py-8 text-center">
                  Nenhuma mensagem aqui ainda — seja o primeiro.
                </p>
              ) : (
                ordered.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-xl border border-white/10 bg-black/22 px-3 py-2 text-sm"
                  >
                    <div className="text-[11px] font-bold text-canna-300">
                      {m.authorName}
                      <span className="font-normal text-white/40 ml-2">
                        {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-white/88 whitespace-pre-wrap break-words">
                      {m.body}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-white/10 px-5 py-3 space-y-3">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                <Trophy size={14} /> Ranking rápido (XP)
              </div>
              <ul className="flex flex-wrap gap-2">
                {(board ?? []).map((row, i) => (
                  <li
                    key={`${row.displayName}-${i}`}
                    className="rounded-lg border border-white/10 bg-black/25 px-2 py-1 text-[11px] text-white/85"
                  >
                    <span className="text-canna-300 font-bold">{i + 1}.</span>{" "}
                    {row.displayName ?? "—"}{" "}
                    <span className="text-white/45">({row.xpTotal} XP)</span>
                  </li>
                ))}
                {(!board || board.length === 0) && (
                  <li className="text-white/50 text-xs">Sem dados ainda.</li>
                )}
              </ul>
              {isAdmin ? (
                <p className="text-[11px] leading-snug text-amber-200/85 rounded-lg border border-amber-400/25 bg-amber-950/35 px-2.5 py-2">
                  <span className="font-semibold">Prof:</span> começa com{" "}
                  <span className="font-mono text-amber-100">!</span> — o chat guarda a linha
                  inteira; no balão aparece só o texto sem os <span className="font-mono">!</span>{" "}
                  do início (~5&nbsp;s + som).
                </p>
              ) : null}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={500}
                  placeholder="Escreve algo pro canal…"
                  className="flex-1 rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-canna-400/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = inputRef.current?.value.trim();
                      if (v) sendBody(v);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={post.isPending}
                  onClick={() => {
                    const v = inputRef.current?.value.trim();
                    if (v) sendBody(v);
                  }}
                  className="shrink-0"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
