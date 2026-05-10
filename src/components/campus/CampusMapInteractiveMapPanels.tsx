"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clapperboard, MessageCircle, X } from "lucide-react";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CampusMapHotspotPanel } from "@/components/campus/CampusMapHotspotPanel";

type Props = {
  sky: "day" | "night";
  showHotspotTechStripe: boolean;
};

type MockRow = { id: string; label: string; meta: string };

function SectionBlock({
  title,
  rows,
  sky
}: {
  title: string;
  rows: MockRow[];
  sky: "day" | "night";
}) {
  return (
    <section className="space-y-2.5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">{title}</h3>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.id}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-[13px] leading-snug backdrop-blur-md",
              sky === "day"
                ? "border-white/25 bg-white/[0.14] text-slate-900/92 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]"
                : "border-white/12 bg-white/[0.06] text-white/90 shadow-inner shadow-black/20"
            )}
          >
            <span className="font-medium">{r.label}</span>
            <span
              className={cn(
                "mt-0.5 block text-[11px]",
                sky === "day" ? "text-slate-600/75" : "text-white/50"
              )}
            >
              {r.meta}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CampusMapInteractiveMapPanels({
  sky,
  showHotspotTechStripe
}: Props) {
  const scheduleOpen = useCampusHudStore((s) => s.campusMapScheduleDayOpen);
  const setScheduleOpen = useCampusHudStore((s) => s.setCampusMapScheduleDayOpen);
  const cinemaOpen = useCampusHudStore((s) => s.campusMapCinemaLiveOpen);
  const setCinemaOpen = useCampusHudStore((s) => s.setCampusMapCinemaLiveOpen);
  const cinemaExpanded = useCampusHudStore((s) => s.campusMapCinemaLiveExpanded);
  const setCinemaExpanded = useCampusHudStore((s) => s.setCampusMapCinemaLiveExpanded);
  const muralOpen = useCampusHudStore((s) => s.campusMapMuralFeedOpen);
  const setMuralOpen = useCampusHudStore((s) => s.setCampusMapMuralFeedOpen);

  const [muralDraft, setMuralDraft] = useState("");
  const [muralMessages, setMuralMessages] = useState<{ id: string; text: string; at: string }[]>([
    { id: "m1", text: "Boa energia neste campus — curti o painel novo.", at: "há pouco" },
    { id: "m2", text: "Alguém sabe quando abre a próxima live de solventless?", at: "há 1 h" }
  ]);

  const pushMuralDemo = useCallback(() => {
    const t = muralDraft.trim();
    if (!t) return;
    setMuralMessages((prev) => [
      { id: `local-${Date.now()}`, text: t, at: "agora" },
      ...prev
    ]);
    setMuralDraft("");
  }, [muralDraft]);

  const backdropTint =
    sky === "day" ? "bg-sky-950/[0.18] backdrop-blur-[10px]" : "bg-black/[0.22] backdrop-blur-[10px]";

  const glassPanel = cn(
    "border shadow-[220px_0_120px_rgba(14,165,233,0.04)]",
    sky === "day"
      ? "border-white/35 bg-gradient-to-br from-white/[0.42] via-white/[0.18] to-cyan-50/[0.16]"
      : "border-white/14 bg-gradient-to-br from-white/[0.09] via-white/[0.05] to-emerald-950/[0.12]"
  );

  return (
    <>
      <CampusMapHotspotPanel sky={sky} showTechStripe={showHotspotTechStripe} />
      <AnimatePresence>
        {scheduleOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar programação"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn("fixed inset-0 z-[51]", backdropTint)}
              onClick={() => setScheduleOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal
              aria-labelledby="campus-schedule-day-title"
              initial={{ x: "-105%" }}
              animate={{ x: 0 }}
              exit={{ x: "-105%" }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={cn(
                "fixed left-0 top-0 z-[52] flex h-full w-[min(100vw,380px)] flex-col pt-[calc(3.75rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] pl-[max(0.75rem,env(safe-area-inset-left))] pr-3"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "flex max-h-[min(100dvh,100%)] flex-col overflow-hidden rounded-r-3xl",
                  glassPanel,
                  "backdrop-blur-2xl"
                )}
              >
                <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5">
                  <div>
                    <p
                      id="campus-schedule-day-title"
                      className={cn(
                        "text-base font-semibold tracking-tight",
                        sky === "day" ? "text-slate-900/95" : "text-white/94"
                      )}
                    >
                      Programação do dia
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/45">
                      Agenda ilustrativa — horários reais vêm da coordenação e da sala oficial.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                    aria-label="Fechar"
                    onClick={() => setScheduleOpen(false)}
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </header>
                <div className="thin-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
                  <SectionBlock
                    sky={sky}
                    title="Aulas ao vivo"
                    rows={[
                      { id: "a1", label: "Cannabis 101 · dúvidas e síntese", meta: "14:00 · Sala de formação" },
                      { id: "a2", label: "Indoor: clima & VPD", meta: "16:30 · Laboratório" }
                    ]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Eventos"
                    rows={[
                      { id: "e1", label: "Bate-papo com cultivadores", meta: "18:00 · Praça" },
                      { id: "e2", label: "Sorteio de merch THCProce", meta: "19:45 · Loja" }
                    ]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Próximas lives"
                    rows={[
                      { id: "l1", label: "Extrações solventless", meta: "Amanhã · 11:00" },
                      { id: "l2", label: "Legislação em debate", meta: "Quinta · 20:00" }
                    ]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Cinema do dia"
                    rows={[{ id: "c1", label: "Curtas da comunidade", meta: "21:00 · Telão drive-in" }]}
                  />
                  <SectionBlock
                    sky={sky}
                    title="Em destaque"
                    rows={[
                      { id: "ag1", label: "Novidades na loja do campus", meta: "Esta semana" },
                      { id: "ag2", label: "Mais conteúdo outdoor a caminho", meta: "Em breve" }
                    ]}
                  />
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {cinemaOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar painel cinema"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[51] bg-transparent"
              onClick={() => setCinemaOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-label="Cinema e ao vivo"
              initial={{ x: "-104%" }}
              animate={{ x: 0 }}
              exit={{ x: "-104%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className={cn(
                "fixed z-[53] flex flex-col rounded-r-3xl border border-white/12 shadow-[14px_12px_52px_rgba(0,0,0,0.38)] backdrop-blur-2xl",
                "left-[max(0.5rem,env(safe-area-inset-left))]",
                "bottom-[calc(env(safe-area-inset-bottom)+3.25rem)] sm:bottom-[max(0.5rem,env(safe-area-inset-bottom))]",
                "max-sm:h-[calc(100dvh-6.75rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] sm:h-[calc(100dvh-4rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
                cinemaExpanded ? "w-[min(calc(100vw-1rem),372px)] min-w-[280px]" : "w-11 min-w-[44px]"
              )}
              style={{
                background:
                  "linear-gradient(195deg, rgba(255,255,255,0.08) 0%, rgba(8,12,20,0.78) 42%, rgba(4,6,12,0.92) 100%)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1 border-b border-white/10 py-1.5 pl-2 pr-1">
                {cinemaExpanded ? (
                  <Clapperboard size={16} className="ml-1 shrink-0 text-amber-200/85" aria-hidden />
                ) : null}
                <button
                  type="button"
                  className="flex h-9 flex-1 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/10 hover:text-white"
                  aria-expanded={cinemaExpanded}
                  aria-label={cinemaExpanded ? "Recolher painel" : "Expandir painel"}
                  onClick={() => setCinemaExpanded(!cinemaExpanded)}
                >
                  {cinemaExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
                {cinemaExpanded ? (
                  <button
                    type="button"
                    className="rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white"
                    aria-label="Fechar"
                    onClick={() => setCinemaOpen(false)}
                  >
                    <X size={17} />
                  </button>
                ) : null}
              </div>
              {cinemaExpanded ? (
                <div className="thin-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto p-3 text-[13px] text-white/82">
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-black/25 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal-200/75">Player</p>
                    <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-slate-900/90 to-black/80 text-xs text-white/42">
                      Vídeo ou transmissão — em breve
                    </div>
                  </div>
                  <div className="rounded-2xl border border-amber-400/15 bg-amber-950/20 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200/70">Ao vivo</p>
                    <p className="mt-2 text-white/75">
                      Aqui verias o estado da transmissão ao vivo quando estiver ligada.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Chat</p>
                    <p className="mt-2 text-[12px] text-white/55">
                      Espaço para conversa com quem está a ver o mesmo ecrã — ainda por configurar.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Eventos</p>
                    <p className="mt-2 text-[12px] text-white/55">
                      Lista rápida do que passa no telão — exemplo para acompanhar o ritmo do campus.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/45">Programação</p>
                    <p className="mt-2 text-[12px] text-white/55">
                      Atalho para a programação do dia — abre o painel completo quando quiseres ver tudo junto.
                    </p>
                  </div>
                </div>
              ) : (
                /* Recolhido: só a faixa fina com chevron no header — evita mancha âmbar no limite do ecrã. */
                <div className="flex flex-1" aria-hidden />
              )}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {muralOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Fechar mural"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn("fixed inset-0 z-[51]", backdropTint)}
              onClick={() => setMuralOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal
              aria-labelledby="campus-mural-feed-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed left-1/2 top-[44%] z-[52] w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2"
              onClick={(e) => e.stopPropagation()}
            >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[1.35rem] border border-cyan-200/30 p-[1px] shadow-[0_0_96px_rgba(34,211,238,0.16),0_0_1px_rgba(167,243,208,0.35)_inset]",
                    sky === "day" ? "bg-gradient-to-br from-white/55 via-cyan-100/25 to-violet-100/30" : "bg-gradient-to-br from-white/20 via-teal-500/10 to-violet-600/15"
                  )}
                >
                <div
                  className={cn(
                    "relative rounded-[1.28rem] px-5 py-5 backdrop-blur-2xl",
                    sky === "day" ? "bg-white/[0.38]" : "bg-[linear-gradient(160deg,rgba(255,255,255,0.1)_0%,rgba(6,22,30,0.55)_48%,rgba(8,16,24,0.62)_100%)]"
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(167,243,208,0.62),transparent_52%),radial-gradient(ellipse_at_88%_18%,rgba(196,181,253,0.42),transparent_48%),linear-gradient(125deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] opacity-[0.42] mix-blend-overlay" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="text-teal-200/90" size={20} />
                      <div>
                        <h2
                          id="campus-mural-feed-title"
                          className={cn(
                            "text-lg font-semibold tracking-tight",
                            sky === "day" ? "text-slate-900/95" : "text-white/95"
                          )}
                        >
                          Mural do campus
                        </h2>
                        <p className="text-[11px] text-white/50">
                          Modo demonstração: os recados ficam guardados só neste aparelho.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-xl p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
                      aria-label="Fechar"
                      onClick={() => setMuralOpen(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <ul className="relative mt-5 max-h-[min(42vh,320px)] space-y-3 overflow-y-auto pr-1">
                    {muralMessages.map((m, i) => (
                      <li
                        key={m.id}
                        className={cn(
                          "relative rounded-2xl border px-4 py-3 shadow-sm",
                          sky === "day"
                            ? "border-white/35 bg-white/55 text-slate-900/92"
                            : "border-white/12 bg-white/[0.07] text-white/88",
                          i > 0 ? "-mt-2 translate-x-1 scale-[0.98] opacity-90" : "",
                          i > 1 ? "translate-x-2 scale-[0.96] opacity-75" : ""
                        )}
                        style={{
                          transform: `perspective(800px) rotateX(${i * 2}deg) translateZ(${-i * 4}px)`,
                          zIndex: 10 - i
                        }}
                      >
                        <p className="text-[13px] leading-snug">{m.text}</p>
                        <p className="mt-1.5 text-[10px] text-white/40">{m.at}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      value={muralDraft}
                      onChange={(e) => setMuralDraft(e.target.value)}
                      placeholder="Escreve um recado…"
                      className={cn(
                        "min-h-[44px] flex-1 rounded-xl border px-3 text-[13px] outline-none ring-teal-400/30 focus:ring-2",
                        sky === "day"
                          ? "border-slate-300/60 bg-white/80 text-slate-900 placeholder:text-slate-500/80"
                          : "border-white/15 bg-black/30 text-white placeholder:text-white/35"
                      )}
                    />
                    <Button
                      type="button"
                      variant="glass"
                      size="sm"
                      className="shrink-0"
                      onClick={pushMuralDemo}
                    >
                      Publicar recado
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
