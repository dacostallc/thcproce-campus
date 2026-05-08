"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  MessageCircle,
  Sparkles,
  User2,
  Bell,
  Sun,
  Moon,
  CalendarHeart,
  Newspaper
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useCampusSkyStore } from "@/stores/campusSkyStore";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import {
  CAMPUS_HOME_PATH,
  isAbsoluteHttpUrl,
  lodgerCheckoutHref
} from "@/config/siteUrls";

export function HUD() {
  const pathname = usePathname();
  const campusNavActive = pathname === CAMPUS_HOME_PATH || pathname === "/campus";
  const sky = useCampusSkyStore((s) => s.sky);
  const toggleSky = useCampusSkyStore((s) => s.toggleSky);
  const onlineApprox = useCampusHudStore((s) => s.onlineApprox);
  const chatOpen = useCampusHudStore((s) => s.chatOpen);
  const setChatOpen = useCampusHudStore((s) => s.setChatOpen);
  const setEventsOpen = useCampusHudStore((s) => s.setEventsOpen);
  const setMuralOpen = useCampusHudStore((s) => s.setMuralOpen);
  const eventsOpen = useCampusHudStore((s) => s.eventsOpen);
  const muralOpen = useCampusHudStore((s) => s.muralOpen);

  const { data: session, status } = useSession();
  const campusAdmin = isCampusAdminEmail(session?.user?.email ?? null);
  const { data: xpData } = trpc.campus.myProgress.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 30_000
  });
  const { data: events } = trpc.campus.campusEvents.useQuery(undefined, {
    staleTime: 3600_000
  });
  const { data: mural } = trpc.campus.muralFeed.useQuery(
    { take: 10 },
    {
      enabled: muralOpen,
      staleTime: 15_000
    }
  );
  const utils = trpc.useUtils();
  const [muralBody, setMuralBody] = useState("");
  const muralPost = trpc.campus.muralPost.useMutation({
    onSuccess: () => {
      void utils.campus.muralFeed.invalidate();
      setMuralBody("");
    }
  });
  const { data: badges } = trpc.campus.myBadges.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 120_000
  });
  const tickStreak = trpc.campus.tickStreak.useMutation();
  const streakOnceRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    const k = "thc-campus-streak-day";
    const today = new Date().toDateString();
    try {
      if (typeof localStorage === "undefined") return;
      if (localStorage.getItem(k) === today) return;
      if (streakOnceRef.current) return;
      streakOnceRef.current = true;
      tickStreak.mutate(undefined, {
        onSuccess: () => {
          localStorage.setItem(k, today);
        },
        onError: () => {
          streakOnceRef.current = false;
        }
      });
    } catch {
      streakOnceRef.current = false;
    }
  }, [status, tickStreak]);

  const checkoutHref = lodgerCheckoutHref();
  const checkoutExternal = isAbsoluteHttpUrl(checkoutHref);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 pt-4 pointer-events-none [&_button]:pointer-events-auto [&_a]:pointer-events-auto"
      >
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-strong pointer-events-auto"
          >
            <span className="w-8 h-8 rounded-xl bg-canna-500/20 border border-canna-400/40 flex items-center justify-center">
              <Leaf size={18} className="text-canna-300" />
            </span>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.18em] text-canna-300/80 font-semibold">
                THCProce
              </div>
              <div className="text-sm font-bold">Escola Aberta</div>
            </div>
          </Link>

          <nav className="hidden md:flex flex-1 justify-center gap-1 px-2 py-2 rounded-2xl glass-strong max-w-lg pointer-events-auto">
            <NavLink active={campusNavActive} href={CAMPUS_HOME_PATH}>
              Campus
            </NavLink>
            <NavLink href="/planos">Cursos</NavLink>
            <NavLink href="/inscrever-se">Prof THC</NavLink>
            <NavLink href="/planos">Planos</NavLink>
            <NavLink href="/inscrever-se">Inscrever</NavLink>
          </nav>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => toggleSky()}
              className={cn(
                "flex h-10 w-12 items-center justify-center rounded-xl border transition-all pointer-events-auto",
                sky === "day"
                  ? "border-sky-400/50 bg-sky-500/15 text-sky-100"
                  : "border-canna-400/35 text-white/90 glass-strong"
              )}
              aria-label={sky === "night" ? "Modo dia" : "Modo noite"}
            >
              {sky === "night" ? <Moon size={15} /> : <Sun size={16} className="text-amber-200" />}
            </button>

            <IconButton aria-label="Eventos no campus" onClick={() => setEventsOpen(true)}>
              <CalendarHeart size={16} />
            </IconButton>
            <IconButton aria-label="Mural social" onClick={() => setMuralOpen(true)}>
              <Newspaper size={16} />
            </IconButton>
            <IconButton aria-label="Notificações">
              <Bell size={16} />
            </IconButton>
            <IconButton aria-label="Abrir chat" onClick={() => setChatOpen(!chatOpen)}>
              <MessageCircle size={16} className={chatOpen ? "text-canna-300" : undefined} />
            </IconButton>

            {status === "authenticated" ? (
              <>
                {campusAdmin ? (
                  <span className="rounded-md border border-amber-400/45 bg-amber-500/15 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-100 shadow-sm shadow-amber-900/40">
                    Admin THCProce
                  </span>
                ) : null}
                <span className="hidden xl:inline max-w-[120px] truncate text-[11px] text-white/60">
                  {session?.user?.email}
                </span>
                <Button
                  type="button"
                  variant="glass"
                  size="sm"
                  className="!px-3"
                  onClick={() => void signOut({ callbackUrl: CAMPUS_HOME_PATH })}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="glass" size="sm" className="!px-3" asChild>
                  <Link href="/entrar">
                    <User2 size={14} /> Entrar
                  </Link>
                </Button>
                <Button size="sm" className="shadow-lg shadow-canna-500/25" asChild>
                  {checkoutExternal ? (
                    <Link href={checkoutHref} target="_blank" rel="noreferrer">
                      Inscrever-se
                    </Link>
                  ) : (
                    <Link href={checkoutHref}>Inscrever-se</Link>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-4 left-1/2 z-20 hidden -translate-x-1/2 pointer-events-none sm:block"
      >
        <div className="glass-strong rounded-2xl px-5 py-3 flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="relative w-2 h-2 rounded-full bg-canna-400">
              <span className="absolute inset-0 rounded-full bg-canna-400 animate-ping opacity-75" />
            </span>
            <span className="text-xs uppercase tracking-wider text-white/70">Campus ativo</span>
            <span className="text-xs font-semibold text-canna-300">{onlineApprox} online</span>
          </div>
          <span className="w-px h-5 bg-white/15" />
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles size={14} className="text-gold-400 shrink-0" />
            <span className="text-xs text-white/70">XP</span>
            <span className="text-xs font-semibold text-white">
              {xpData?.xp ?? "—"}
              {xpData?.levelLabel ? (
                <span className="ml-2 text-gold-300/90"> · {xpData.levelLabel}</span>
              ) : null}
              {xpData?.streak != null && xpData.streak > 0 ? (
                <span className="ml-2 text-orange-300/90">🔥 {xpData.streak}d</span>
              ) : null}
            </span>
            {badges?.badges && badges.badges.length > 0 ? (
              <>
                <span className="w-px h-5 bg-white/15 hidden lg:block" />
                <span className="hidden lg:flex flex-wrap gap-1 max-w-[280px]">
                  {badges.badges.slice(0, 4).map((b) => (
                    <span
                      key={b.id}
                      className="text-[10px] font-semibold rounded-md bg-gold-500/15 border border-gold-400/35 text-gold-200 px-1.5 py-0.5"
                    >
                      {b.label}
                    </span>
                  ))}
                </span>
              </>
            ) : null}
            <span className="w-px h-5 bg-white/15" />
            <span className="text-xs text-white/70">Próxima:</span>
            <span className="text-xs font-semibold text-white">Cannabis 101 · Aula 1</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {eventsOpen ? (
          <CampusOverlay onClose={() => setEventsOpen(false)} title="Eventos sazonais">
            <ul className="space-y-3 text-sm text-white/85">
              {(events ?? []).map((ev) => (
                <li
                  key={ev.id}
                  className="rounded-xl border border-canna-400/25 bg-black/25 p-3"
                >
                  <div className="font-semibold text-canna-200">{ev.title}</div>
                  <div className="text-xs text-white/60 mt-1">{ev.when}</div>
                  {ev.href ? (
                    ev.href.startsWith("http") ? (
                      <a
                        href={ev.href}
                        className="mt-2 inline-block text-xs text-sky-300 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir →
                      </a>
                    ) : (
                      <Link href={ev.href} className="mt-2 inline-block text-xs text-sky-300 hover:underline">
                        Abrir →
                      </Link>
                    )
                  ) : null}
                </li>
              ))}
              {events?.length === 0 ? (
                <li className="text-white/60">Nenhum evento cadastrado ainda.</li>
              ) : null}
            </ul>
          </CampusOverlay>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {muralOpen ? (
          <CampusOverlay onClose={() => setMuralOpen(false)} title="Mural do campus">
            <div className="space-y-2 max-h-[50vh] overflow-y-auto scrollbar-thin pr-2">
              {(mural ?? []).map((row) => (
                <article
                  key={row.id}
                  className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm"
                >
                  <span className="text-[11px] font-bold text-canna-300">{row.authorName}</span>
                  <p className="mt-1 text-white/85 whitespace-pre-wrap">{row.body}</p>
                </article>
              ))}
              {mural?.length === 0 ? (
                <p className="text-white/55 text-sm">
                  Nenhum post no mural ainda — seja o primeiro se estiver logado.
                </p>
              ) : null}
              {status === "authenticated" ? (
                <form
                  className="mt-4 pt-4 border-t border-white/10 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = (
                      session?.user?.name ??
                      session?.user?.email?.split("@")[0] ??
                      "Aluno"
                    ).slice(0, 64);
                    const b = muralBody.trim().slice(0, 500);
                    if (!b) return;
                    muralPost.mutate({ authorName: name, body: b });
                  }}
                >
                  <label htmlFor="mural-body" className="text-xs text-white/60 sr-only">
                    Mensagem no mural
                  </label>
                  <textarea
                    id="mural-body"
                    value={muralBody}
                    onChange={(e) => setMuralBody(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Compartilhe um recado ou vitória na jornada…"
                    className="w-full rounded-xl bg-black/30 border border-white/15 px-3 py-2 text-sm resize-none outline-none focus:border-canna-400/50"
                  />
                  <Button type="submit" size="sm" disabled={muralPost.isPending || !muralBody.trim()}>
                    Publicar
                  </Button>
                </form>
              ) : (
                <p className="mt-4 text-[11px] text-white/50 border-t border-white/10 pt-4">
                  <Link href="/entrar" className="text-canna-300 hover:underline font-semibold">
                    Entrar
                  </Link>{" "}
                  para publicar no mural.
                </p>
              )}
            </div>
          </CampusOverlay>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function CampusOverlay({
  title,
  children,
  onClose
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        className="fixed left-4 right-4 top-28 z-[60] mx-auto max-h-[70vh] max-w-lg overflow-hidden rounded-2xl border border-canna-400/30 glass-strong p-6 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <Button type="button" variant="glass" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
        {children}
      </motion.div>
    </>
  );
}

function NavLink({
  href,
  children,
  active = false
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  const isExt = /^https?:\/\//.test(href);
  const cnBase =
    "px-3.5 py-2 rounded-xl text-sm font-medium transition-colors " +
    (active
      ? "bg-canna-500/15 text-canna-300"
      : "text-white/70 hover:bg-white/5 hover:text-white");
  return isExt ? (
    <a href={href} className={cnBase} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={cnBase}>
      {children}
    </Link>
  );
}

function IconButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="w-10 h-10 rounded-xl glass-strong hover:bg-white/10 transition-colors flex items-center justify-center text-white/80 hover:text-white"
      {...props}
    >
      {children}
    </button>
  );
}
