"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen, DoorOpen, X } from "lucide-react";
import { areas, type Area } from "@/data/courses";
import { CAMPUS_MAP_INTERACTIVE_AREAS } from "@/lib/campusMapAreasCatalog";
import type { CampusMapInteractiveArea } from "@/lib/campusMapAreasInteractive.types";
import {
  hotspotEffectiveCourseId,
  hotspotPanelHeading,
  hotspotPrimaryCtaLabel,
  hotspotResolvedLessonIndex,
  hotspotSecondaryCtaLabel,
  hotspotShortDescription
} from "@/lib/campusMapHotspotResolve";
import { summarizeInteractiveTarget } from "@/lib/campusMapInteractiveTargetSummary";
import {
  getCampusMapTopicByAreaId,
  resolveTopicPrimaryNavigation
} from "@/lib/campusMapTopicCatalog";
import { useCampusHudStore } from "@/stores/campusHudStore";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  sky: "day" | "night";
  showTechStripe: boolean;
  onEnterCourse: (area: Area) => void;
  onOpenLesson: (area: Area, lessonIndex: number) => void;
};

function runTopicExplicitNavigation(
  topic: NonNullable<ReturnType<typeof getCampusMapTopicByAreaId>>,
  router: ReturnType<typeof useRouter>
) {
  const en = topic.explicitNavigation;
  if (!en) return;
  if (en.kind === "route") {
    router.push(en.href);
    return;
  }
  if (en.kind === "hud_store") {
    useCampusHudStore.getState().setCampusStoreOpen(true);
    return;
  }
  if (en.kind === "hud_mural") {
    useCampusHudStore.getState().setMuralOpen(true);
  }
}

export function CampusMapHotspotPanel({
  sky,
  showTechStripe,
  onEnterCourse,
  onOpenLesson
}: Props) {
  const router = useRouter();
  const hitId = useCampusHudStore((s) => s.campusMapHotspotPanelHitId);
  const setHitId = useCampusHudStore((s) => s.setCampusMapHotspotPanelHitId);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const hit = useMemo((): CampusMapInteractiveArea | null => {
    if (!hitId) return null;
    return CAMPUS_MAP_INTERACTIVE_AREAS.find((a) => a.id === hitId) ?? null;
  }, [hitId]);

  const { data: progress } = trpc.campus.areaProgress.useQuery({}, { staleTime: 120_000 });

  useEffect(() => {
    if (!hit) return;
    queueMicrotask(() => closeBtnRef.current?.focus());
  }, [hit]);

  const topic = hit ? getCampusMapTopicByAreaId(hit.id) : undefined;
  const effCourseId = hit ? hotspotEffectiveCourseId(hit) : null;
  const course =
    topic?.relatedCourse ?? (effCourseId ? areas.find((a) => a.id === effCourseId) ?? null : null);

  const topicComingSoon = topic?.status === "coming_soon";
  const description = hit ? hotspotShortDescription(hit, course) : "";
  const heading = hit ? hotspotPanelHeading(hit) : "";

  const primaryLabel = topic?.explicitNavigation
    ? topic.callToActionLabel
    : hit
      ? hotspotPrimaryCtaLabel(hit)
      : "Entrar";

  const secondaryLabel = hit ? hotspotSecondaryCtaLabel(hit) : "Ver aulas";

  const primaryDisabled = topicComingSoon || (!topic?.explicitNavigation && !course);

  const showSecondary = Boolean(course) && !topicComingSoon && !topic?.explicitNavigation;

  const close = () => setHitId(null);

  const handlePrimary = () => {
    if (!hit) return;
    if (topicComingSoon) return;
    if (topic?.explicitNavigation) {
      runTopicExplicitNavigation(topic, router);
      close();
      return;
    }
    if (!course) return;
    const slugIdx = hotspotResolvedLessonIndex(hit, course);
    if (slugIdx !== null) {
      onOpenLesson(course, slugIdx);
      close();
      return;
    }
    if (topic) {
      const nav = resolveTopicPrimaryNavigation(topic);
      if (nav.destination === "lesson" && typeof nav.lessonIndex === "number") {
        onOpenLesson(course, nav.lessonIndex);
        close();
        return;
      }
    }
    onEnterCourse(course);
    close();
  };

  const handleSecondary = () => {
    if (!hit || topicComingSoon || !course) return;
    onEnterCourse(course);
    close();
  };

  const progressLine =
    course && progress?.areas
      ? progress.areas[course.id]
        ? "Sala marcada como concluída no teu progresso sincronizado."
        : "Ainda em exploração — avança ao teu ritmo."
      : "Progresso detalhado disponível quando estiveres inscrito e sincronizado.";

  const backdropTint =
    sky === "day" ? "bg-sky-950/[0.22] backdrop-blur-[12px]" : "bg-black/[0.32] backdrop-blur-[12px]";

  const glassInner = cn(
    "relative overflow-hidden rounded-[1.35rem] p-[1px]",
    sky === "day"
      ? "border border-white/38 bg-gradient-to-br from-white/50 via-cyan-100/25 to-teal-100/28"
      : "border border-white/14 bg-gradient-to-br from-white/16 via-teal-500/12 to-violet-900/22"
  );

  const scrollSurface = cn(
    "thin-scrollbar max-h-[min(72dvh,620px)] overflow-y-auto rounded-[1.28rem] px-5 py-5 backdrop-blur-2xl",
    sky === "day"
      ? "bg-white/[0.42]"
      : "bg-[linear-gradient(165deg,rgba(255,255,255,0.11)_0%,rgba(6,22,30,0.52)_48%,rgba(8,16,24,0.62)_100%)]"
  );

  return (
    <AnimatePresence>
      {hit ? (
        <>
          <motion.button
            type="button"
            aria-label="Fechar ficha do mapa"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("fixed inset-0 z-[51]", backdropTint)}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal
            aria-labelledby="campus-hotspot-panel-title"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className={cn(
              "fixed right-0 top-0 z-[52] flex h-full w-[min(100vw,400px)] flex-col pt-[calc(3.75rem+env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] pl-3 pr-[max(0.75rem,env(safe-area-inset-right))]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                glassInner,
                "flex max-h-[min(100dvh,100%)] flex-col shadow-[0_0_90px_rgba(34,197,94,0.07)]"
              )}
            >
              <div className={cn(scrollSurface, "flex flex-col")}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(250,204,21,0.22),transparent_55%),radial-gradient(ellipse_at_92%_12%,rgba(167,243,208,0.2),transparent_48%),linear-gradient(118deg,transparent_38%,rgba(255,255,255,0.07)_52%,transparent_64%)] opacity-[0.5] mix-blend-overlay" />

                <header className="relative flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <p
                      id="campus-hotspot-panel-title"
                      className={cn(
                        "pr-2 text-lg font-semibold tracking-tight",
                        sky === "day" ? "text-slate-900/95" : "text-white/95"
                      )}
                    >
                      {heading}
                    </p>
                    {topic ? (
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-teal-200/80">
                        Tópico · {topic.parentCourseId}
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-amber-200/75">
                        {hit.type} · mapa
                      </p>
                    )}
                  </div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    className="rounded-xl p-2 text-white/45 transition hover:bg-white/10 hover:text-white"
                    aria-label="Fechar"
                    onClick={close}
                  >
                    <X size={18} />
                  </button>
                </header>

                <p
                  className={cn(
                    "relative mt-4 text-[15px] leading-relaxed tracking-wide",
                    sky === "day" ? "text-slate-800/90" : "text-white/82"
                  )}
                >
                  {description}
                </p>

                {topic && topic.whatStudentLearns.length ? (
                  <div className="relative mt-4 rounded-2xl border border-white/[0.08] bg-black/16 px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-200/75">
                      O que vais explorar
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-white/80">
                      {topic.whatStudentLearns.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {course ? (
                  <div className="relative mt-4 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">Curso ligado</p>
                    <p className="mt-1 text-sm font-medium text-white/92">{course.mapLabel ?? course.name}</p>
                    {topic ? (
                      <p className="mt-1 text-[12px] text-white/58">
                        ~{topic.estimatedMinutes} min de leitura estimada
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div className="relative mt-4 rounded-2xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-[12px] leading-snug text-white/65">
                  {progressLine}
                </div>

                {topicComingSoon ? (
                  <p className="relative mt-4 rounded-xl border border-amber-400/25 bg-amber-950/25 px-3 py-2 text-[13px] text-amber-100/85">
                    Este tópico está marcado como brevemente no catálogo — volta em breve.
                  </p>
                ) : null}

                <div className="relative mt-6 flex flex-col gap-2">
                  <Button
                    type="button"
                    className="w-full gap-2"
                    disabled={primaryDisabled}
                    onClick={handlePrimary}
                  >
                    <DoorOpen size={17} strokeWidth={2} aria-hidden />
                    {primaryLabel}
                  </Button>
                  {showSecondary ? (
                    <Button type="button" variant="glass" className="w-full gap-2" onClick={handleSecondary}>
                      <BookOpen size={17} strokeWidth={2} aria-hidden />
                      {secondaryLabel}
                    </Button>
                  ) : null}
                </div>

                {showTechStripe ? (
                  <div className="relative mt-6 rounded-xl border border-white/10 bg-black/35 px-3 py-2 font-mono text-[10px] leading-relaxed text-emerald-200/82">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/42">Equipa técnica</p>
                    <p className="mt-1 break-all text-emerald-100/92">id: {hit.id}</p>
                    <p className="mt-1 break-all text-emerald-100/92">tipo: {hit.type}</p>
                    <p className="mt-1 break-all text-teal-200/95">target: {summarizeInteractiveTarget(hit.target)}</p>
                    {hit.lessonSlug ? (
                      <p className="mt-1 break-all text-teal-200/95">lessonSlug: {hit.lessonSlug}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
