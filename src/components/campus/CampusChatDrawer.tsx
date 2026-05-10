"use client";

import { useMemo, useRef, useState } from "react";
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
import { useCampusGuestVisitor } from "@/hooks/useCampusGuestVisitor";
import { CampusGuestNicknameModal } from "@/components/campus/CampusGuestNicknameModal";
import { CAMPUS_LEADERBOARD_MOCK_ROWS } from "@/lib/campusLeaderboardMock";

type ChatRowLite = {
  id: string;
  authorName: string;
  body: string;
  createdAt: Date | string;
};

const GUEST_DEMO_CHAT: ChatRowLite[] = [
  {
    id: "guest-local-demo-1",
    authorName: "Campus THCProce",
    body:
      "Explora o mapa à vontade. As mensagens abaixo são só exemplos — o histórico real do chat fica disponível depois de entrares na conta.",
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString()
  },
  {
    id: "guest-local-demo-2",
    authorName: "Convite",
    body:
      "Cria um nick de visitante (guardado só neste dispositivo) ou regista-te gratuitamente para conversar com a comunidade e sincronizar progresso.",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString()
  }
];

/** Chat global — visitantes: só mock local + ranking exemplo; nunca escrita nem leaderboard real sem sessão. */
export function CampusChatDrawer() {
  const open = useCampusHudStore((s) => s.chatOpen);
  const setOpen = useCampusHudStore((s) => s.setChatOpen);
  const channel = useCampusHudStore((s) => s.chatChannel);
  const setChannel = useCampusHudStore((s) => s.setChatChannel);
  const { data: session, status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const isAdmin = isCampusAdminEmail(session?.user?.email ?? null);
  const [nickModalOpen, setNickModalOpen] = useState(false);

  const isAuthed = status === "authenticated";
  const { guestNickname, setGuestNickname, guestHydrated } = useCampusGuestVisitor(status);

  const { data: rows, refetch } = trpc.campus.chatHistory.useQuery(
    { channel, take: 60 },
    {
      enabled: open && isAuthed,
      refetchInterval: open && isAuthed ? 12_000 : false,
      retry: (failureCount, err) => {
        const code = (err as { data?: { code?: string } })?.data?.code;
        if (code === "UNAUTHORIZED") return false;
        return failureCount < 2;
      }
    }
  );

  const { data: boardRemote } = trpc.campus.leaderboard.useQuery(
    { take: 8 },
    {
      enabled: open && isAuthed,
      staleTime: 60_000,
      retry: (failureCount, err) => {
        const code = (err as { data?: { code?: string } })?.data?.code;
        if (code === "UNAUTHORIZED") return false;
        return failureCount < 2;
      }
    }
  );

  const post = trpc.campus.chatPost.useMutation({
    onSuccess: () => void refetch()
  });

  const demoLeaderboard = useMemo(
    () =>
      CAMPUS_LEADERBOARD_MOCK_ROWS.slice(0, 8).map((r) => ({
        displayName: r.displayName,
        xpTotal: r.xp,
        levelKey: "—"
      })),
    []
  );

  const ordered = useMemo(() => {
    if (!isAuthed) return [...GUEST_DEMO_CHAT];
    if (rows === undefined) return [];
    const list = rows as ChatRowLite[];
    return [...list].reverse();
  }, [isAuthed, rows]);

  const chatRemoteLoading = Boolean(open && isAuthed && rows === undefined);

  const board = isAuthed ? (boardRemote ?? []) : demoLeaderboard;

  const channels = useMemo(() => {
    return [{ value: "global", label: "Campus inteiro" }].concat(
      areas.map((a) => ({ value: `area:${a.id}`, label: a.name }))
    );
  }, []);

  const authorNick =
    status === "authenticated"
      ? (
          session?.user?.name ??
          session?.user?.email?.split("@")[0] ??
          "Aluno"
        ).slice(0, 64)
      : guestNickname?.trim().slice(0, 64) || "Visitante";

  const canSend = isAuthed;

  function sendBody(body: string) {
    if (!canSend) return;
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

  const hasGuestNick = Boolean(guestHydrated && guestNickname?.trim());

  return (
    <>
      <CampusGuestNicknameModal
        open={nickModalOpen}
        onOpenChange={setNickModalOpen}
        initialNickname={guestNickname}
        onSave={(n) => setGuestNickname(n)}
      />
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
                    {canSend
                      ? "Histórico no servidor • tempo real opcional pelo Supabase"
                      : "Modo visitante — mensagens de exemplo; identifica-te para te orientarmos ao registo."}
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

              {!canSend && guestHydrated ? (
                <div className="mx-5 mt-3 space-y-2 rounded-xl border border-white/12 bg-black/22 px-3 py-2.5 text-[11px] leading-relaxed text-white/78">
                  {!hasGuestNick ? (
                    <p>
                      Identifica-te primeiro com um{" "}
                      <span className="font-semibold text-canna-200">nick de visitante</span> (só neste aparelho).
                      Isto não é conta nem substitui login — ajuda-nos a guiar-te no campus.
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold text-canna-200">Nick criado.</span> Para enviar mensagens reais,
                      entre ou{" "}
                      <Link href="/inscrever" className="text-sky-300 hover:underline font-semibold">
                        inscreva-se
                      </Link>
                      .
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <Button
                      type="button"
                      size="sm"
                      className="!text-[11px]"
                      onClick={() => setNickModalOpen(true)}
                    >
                      {hasGuestNick ? "Editar nick de visitante" : "Criar nick de visitante"}
                    </Button>
                    <Button type="button" variant="glass" size="sm" className="!text-[11px]" asChild>
                      <Link href="/entrar">Entrar</Link>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-white/10 pt-2 text-[10px] text-white/48">
                    <Link href="/inscrever" className="text-emerald-200/85 hover:underline">
                      Salvar meu progresso
                    </Link>
                    <span className="text-white/25" aria-hidden>
                      ·
                    </span>
                    <Link href="/inscrever" className="text-emerald-200/85 hover:underline">
                      Criar conta gratuita
                    </Link>
                    <span className="text-white/25" aria-hidden>
                      ·
                    </span>
                    <Link href="/entrar" className="text-emerald-200/85 hover:underline">
                      Entrar no campus completo
                    </Link>
                  </div>
                </div>
              ) : null}

              <div className="px-5 py-3 border-b border-white/10 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/55 font-semibold block">
                  Canal
                </label>
                <select
                  className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2.5 text-sm text-white outline-none focus:border-canna-400/50 disabled:opacity-45"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  disabled={!canSend}
                  title={!canSend ? "Canais remotos disponíveis após entrar na conta." : undefined}
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
                    disabled={post.isPending || !canSend}
                    title={!canSend ? "Inicia sessão para usar o wave no chat." : undefined}
                    onClick={() =>
                      sendBody("👋 Acabei de dar um wave no campus — valeu pela boa energia!")
                    }
                  >
                    <HandMetal size={14} /> Wave
                  </Button>
                  {!canSend ? (
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      className="!px-2 !text-[11px]"
                      onClick={() => setNickModalOpen(true)}
                    >
                      Criar nick de visitante
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3 space-y-2">
                {!canSend ? (
                  <p className="text-[10px] uppercase tracking-wide text-white/38 mb-2">
                    Pré-visualização (local)
                  </p>
                ) : null}
                {chatRemoteLoading ? (
                  <p className="text-xs text-white/45 py-6 text-center">A carregar mensagens…</p>
                ) : null}
                {!chatRemoteLoading && ordered.length === 0 ? (
                  <p className="text-sm text-white/50 py-8 text-center">
                    Nenhuma mensagem aqui ainda — seja o primeiro.
                  </p>
                ) : !chatRemoteLoading ? (
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
                ) : null}
              </div>

              <div className="border-t border-white/10 px-5 py-3 space-y-3">
                <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                  <Trophy size={14} /> Ranking rápido (XP)
                </div>
                {!canSend ? (
                  <p className="text-[10px] text-white/45">
                    Exemplo ilustrativo — ranking oficial só com sessão na escola.
                  </p>
                ) : null}
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
                    placeholder={
                      canSend
                        ? "Escreve algo pro canal…"
                        : "Identifique-se ou entre para enviar mensagens…"
                    }
                    disabled={!canSend}
                    readOnly={!canSend}
                    className="flex-1 rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm outline-none focus:border-canna-400/50 disabled:opacity-45 cursor-not-allowed disabled:cursor-not-allowed"
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
                    disabled={post.isPending || !canSend}
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
    </>
  );
}
