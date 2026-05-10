"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { CampusMapInteractiveArea } from "@/lib/campusMapAreasInteractive.types";
import { summarizeInteractiveTarget } from "@/lib/campusMapInteractiveTargetSummary";
import type { CampusMapTopicCatalogEntry } from "@/lib/campusMapTopicCatalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  sky: "day" | "night";
  showTechStripe: boolean;
  topic: CampusMapTopicCatalogEntry;
  hit?: CampusMapInteractiveArea | null;
  onClose: () => void;
  onPrimaryCta: () => void;
};

export function CampusMapTopicModal({
  sky,
  showTechStripe,
  topic,
  hit,
  onClose,
  onPrimaryCta
}: Props) {
  const course = topic.relatedCourse;
  const ctaDisabled =
    topic.status === "coming_soon" || (!course && topic.explicitNavigation === undefined);

  const courseDisplay = course?.mapLabel ?? course?.name ?? "Curso relacionado não disponível";

  return (
    <AnimatePresence>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-[54] backdrop-blur-sm",
          sky === "day" ? "bg-sky-950/30" : "bg-black/50"
        )}
        aria-label="Fechar"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal
        aria-labelledby="campus-topic-modal-title"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className={cn(
          "fixed left-1/2 top-[44%] z-[55] max-h-[min(88vh,640px)] w-[min(92%,420px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl p-6",
          "campus-hud-glass border-teal-300/22"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-white/45 hover:bg-white/10 hover:text-white"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <p
          id="campus-topic-modal-title"
          className="pr-10 text-lg font-semibold tracking-tight text-white/95"
        >
          {topic.title}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-white/78">{topic.shortDescription}</p>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-3 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-200/75">
            Você vai aprender
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-white/82">
            {topic.whatStudentLearns.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-3 text-sm text-white/85">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-200/75">
            Curso relacionado
          </p>
          <p className="mt-1.5 font-medium text-white/92">{courseDisplay}</p>
          <p className="mt-2 text-[12px] text-white/62">
            Tempo estimado de leitura: ~{topic.estimatedMinutes}&nbsp;min
          </p>
        </div>

        <Button
          type="button"
          className="mt-5 w-full"
          disabled={ctaDisabled}
          onClick={onPrimaryCta}
        >
          {topic.callToActionLabel}
        </Button>

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="glass" size="sm" onClick={onClose}>
            Voltar ao mapa
          </Button>
        </div>

        {showTechStripe ? (
          <div className="mt-5 rounded-xl border border-white/10 bg-black/35 px-3 py-2 font-mono text-[10px] leading-relaxed text-emerald-200/82">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/42">
              Equipa técnica
            </p>
            <p className="mt-1 break-all text-emerald-100/92">areaId: {hit?.id ?? topic.areaId}</p>
            <p className="mt-1 break-all text-emerald-100/92">topicId: {topic.topicId}</p>
            <p className="mt-1 break-all text-teal-200/95">
              parentCourseId: {topic.parentCourseId}
            </p>
            <p className="mt-1 break-all text-teal-200/95">
              targetLessonId:{" "}
              {typeof topic.targetLessonId === "number" ? String(topic.targetLessonId) : "—"}
            </p>
            {hit ? (
              <p className="mt-1 break-all text-emerald-100/92">
                target (seed): {summarizeInteractiveTarget(hit.target)}
              </p>
            ) : null}
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
