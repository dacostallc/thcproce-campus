"use client";

import { useMemo, useState } from "react";
import { Award, BookOpen } from "lucide-react";
import { areas } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { computeLocalCoursePctFromMarks } from "@/lib/campusProgressStorage";
import { readCampusAcademicHistoryRows } from "@/lib/campusAcademicHistoryStorage";
import { evaluateCampusAreaCertificateEligibility } from "@/lib/campusCertificateEligibility";
import { openCampusCertificateMockWindow } from "@/lib/campusCertificateMock";
import { loadStudentProfile } from "@/lib/studentGamificationStorage";

function formatStudyHours(ms: number): string {
  const h = ms / 3_600_000;
  if (h < 0.05) return "—";
  return `${h.toFixed(1)} h`;
}

export function CampusProfileAcademicTab({
  hydrated,
  density
}: {
  hydrated: boolean;
  density: "page" | "modal";
}) {
  const isModal = density === "modal";
  const cardShell = isModal
    ? "rounded-xl campus-hud-glass border-white/12 bg-white/[0.03] p-4"
    : "rounded-2xl campus-hud-glass border-white/14 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.22)]";

  const rows = useMemo(() => (hydrated ? readCampusAcademicHistoryRows() : []), [hydrated]);
  const [certAreaId, setCertAreaId] = useState(() => areas[0]?.id ?? "");

  const certArea = areas.find((a) => a.id === certAreaId) ?? areas[0] ?? null;

  const eligibility = useMemo(() => {
    if (!hydrated || !certArea) return null;
    return evaluateCampusAreaCertificateEligibility(certArea);
  }, [hydrated, certArea]);

  if (!hydrated) {
    return (
      <div className={cn(cardShell)}>
        <p className="text-xs text-white/50">A sincronizar dados locais…</p>
      </div>
    );
  }

  const displayName = loadStudentProfile().displayName.trim() || "Aluno THC";

  return (
    <div className="space-y-4">
      <div className={cn(cardShell)}>
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-canna-300/85">
          <BookOpen size={14} className="text-canna-200/90" aria-hidden />
          Histórico académico (local)
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          Horas estimadas a partir do tempo com o painel de aulas aberto e eventos de quiz neste navegador.
          Backend futuro pode fundir com presença presencial e LMS.
        </p>

        {!rows.length ? (
          <p className="mt-4 text-xs text-white/45">
            Ainda sem registos — abra aulas no mapa para acumular tempo de estudo e respostas de quiz.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {rows.map((r) => {
              const meta = areas.find((a) => a.id === r.courseId);
              const pct = computeLocalCoursePctFromMarks(r.courseId);
              const modules = r.lessonIndicesTouched?.length ?? 0;
              return (
                <li
                  key={r.courseId}
                  className="rounded-xl border border-white/10 bg-black/22 px-3 py-2 text-[11px] text-white/80"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-white/92">
                      {meta?.name ?? r.courseId}
                    </span>
                    <span className="tabular-nums text-canna-200/90">{pct}%</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/52">
                    <span>Estudo ≈ {formatStudyHours(r.studyMsTotal)}</span>
                    <span>Quizzes: {r.quizzesAnswered}</span>
                    <span>Módulos tocados: {modules}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={cn(cardShell)}>
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/85">
          <Award size={14} className="text-emerald-200/90" aria-hidden />
          Certificação (demo)
        </p>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          Só liberta quando todas as aulas estão concluídas localmente, com tempo mínimo (dwell) e quizzes
          correctos — pela mesma ordem do outline.
        </p>

        <label className="mt-4 block text-[11px] font-medium text-white/55">
          Curso / área do campus
          <select
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
            value={certArea?.id ?? ""}
            onChange={(e) => setCertAreaId(e.target.value)}
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        {eligibility ? (
          eligibility.eligible ? (
            <p className="mt-3 text-xs font-semibold text-emerald-200/95">
              Requisitos satisfeitos — pode gerar o certificado mock (HTML → PDF pelo navegador).
            </p>
          ) : (
            <ul className="mt-3 list-inside list-disc space-y-1 text-[11px] text-amber-100/85">
              {eligibility.reasons.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )
        ) : null}

        <Button
          type="button"
          size="sm"
          variant="glass"
          disabled={!eligibility?.eligible}
          className="mt-4 bg-emerald-600/35 hover:bg-emerald-500/40 disabled:opacity-40"
          onClick={() => certArea && openCampusCertificateMockWindow(certArea, displayName)}
        >
          Gerar certificado (HTML / imprimir PDF)
        </Button>
      </div>
    </div>
  );
}
