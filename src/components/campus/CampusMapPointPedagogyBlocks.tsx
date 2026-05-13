"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Gift, GitBranch, MessageCircle } from "lucide-react";
import type {
  CampusMapPointAmbience,
  CampusMapPointBundleMeta,
  CampusMapPointMission,
  CampusMapPointQuiz,
  CampusMapPointRewards
} from "@/lib/campus/campusMapPointBundle.types";
import { cn } from "@/lib/utils";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import {
  alignMissionChecklist,
  getMapPointQuizPerAnswerCoinRule,
  isMapPointBundleComplete,
  persistMapPointQuizAnswer,
  persistMissionCheckToggle,
  tryClaimMapPointBundleRewards
} from "@/lib/campusMapPointProgressClient";

type Props = {
  sky: "day" | "night";
  /** Slug da pasta editorial (`resolveCampusMapPointContentFolderSlug`) — chave de progresso local. */
  progressSlug?: string | null;
  mission?: CampusMapPointMission;
  quiz?: CampusMapPointQuiz;
  rewards?: CampusMapPointRewards;
  ambience?: CampusMapPointAmbience;
  bundleMeta?: CampusMapPointBundleMeta;
};

function slugToReadable(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function rarityStyle(
  rarity: NonNullable<CampusMapPointRewards["rarity"]>,
  isDay: boolean
): string {
  switch (rarity) {
    case "comum":
      return isDay
        ? "border-slate-400/40 bg-slate-100/95 text-slate-900/88"
        : "border-white/15 bg-white/[0.06] text-white/88";
    case "raro":
      return isDay
        ? "border-sky-500/35 bg-sky-50/95 text-sky-950/90"
        : "border-sky-400/35 bg-sky-950/35 text-sky-50/92";
    case "épico":
      return isDay
        ? "border-violet-500/38 bg-violet-50/96 text-violet-950/92"
        : "border-violet-400/38 bg-violet-950/38 text-violet-50/92";
    case "lendário":
      return isDay
        ? "border-amber-500/45 bg-amber-50/96 text-amber-950/94"
        : "border-amber-400/40 bg-amber-950/42 text-amber-50/93";
    default:
      return isDay ? "border-slate-400/35 bg-white/90 text-slate-900/88" : "border-white/12 bg-white/[0.06] text-white/85";
  }
}

export function CampusMapPointPedagogyBlocks({
  sky,
  progressSlug = null,
  mission,
  quiz,
  rewards,
  ambience,
  bundleMeta
}: Props) {
  const isDay = sky === "day";
  const profile = useStudentGamification();
  const [pickedEphemeral, setPickedEphemeral] = useState<Partial<Record<number, number>>>({});

  const entry = useMemo(() => {
    if (!progressSlug) return {};
    return profile.mapPointProgressBySlug[progressSlug] ?? {};
  }, [progressSlug, profile.mapPointProgressBySlug]);

  const perAnswerCoinRule = progressSlug ? getMapPointQuizPerAnswerCoinRule(progressSlug) : null;

  const entrySyncKey = progressSlug ? JSON.stringify(entry) : "";

  useEffect(() => {
    if (!progressSlug) return;
    tryClaimMapPointBundleRewards(progressSlug, rewards, mission, quiz);
  }, [progressSlug, rewards, mission, quiz, entrySyncKey]);

  const rewardsLocked = Boolean(entry.rewardsClaimedAt);
  const missionDone = mission ? alignMissionChecklist(mission, entry.missionChecklist).every(Boolean) : true;
  const quizDone = quiz
    ? quiz.questions.every((q) => entry.quizByQuestionId?.[q.id] != null)
    : true;
  const bundleComplete = isMapPointBundleComplete(mission, quiz, entry);

  const hasAmbience = Boolean(ambience?.lines?.length);
  const journey =
    bundleMeta &&
    (bundleMeta.prerequisites?.length ||
      bundleMeta.relatedAreas?.length ||
      bundleMeta.recommendedNext?.length) ? (
      bundleMeta
    ) : undefined;
  const hasBlocks = Boolean(mission || quiz || rewards || hasAmbience || journey);

  if (!hasBlocks) return null;

  const card = cn(
    "mt-4 rounded-2xl border border-white/[0.08] px-3 py-3",
    isDay ? "border-slate-400/25 bg-white/65" : "bg-black/16"
  );

  const labelCls = cn(
    "text-[11px] font-semibold uppercase tracking-wide",
    isDay ? "text-emerald-900/70" : "text-teal-200/78"
  );

  return (
    <div className="relative mt-4 space-y-3">
      {mission ? (
        <div className={card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={cn(labelCls, "flex items-center gap-2")}>
              <ClipboardList size={14} aria-hidden />
              Missão do cultivador
            </p>
            {missionDone ? (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  isDay
                    ? "border-emerald-600/40 bg-emerald-50/95 text-emerald-950/90"
                    : "border-teal-400/35 bg-teal-950/40 text-teal-50/92"
                )}
              >
                Concluído
              </span>
            ) : null}
          </div>
          <p
            className={cn(
              "mt-2 text-[15px] font-semibold leading-snug",
              isDay ? "text-slate-900/95" : "text-white/95"
            )}
          >
            {mission.title}
          </p>
          <p
            className={cn(
              "mt-1.5 text-[13px] leading-relaxed",
              isDay ? "text-slate-800/88" : "text-white/78"
            )}
          >
            {mission.description}
          </p>
          <ul className={cn("mt-2.5 list-none space-y-1.5 pl-0")}>
            {mission.checklist.map((line, i) => {
              const checks = progressSlug
                ? alignMissionChecklist(mission, entry.missionChecklist)
                : mission.checklist.map(() => false);
              const done = progressSlug ? checks[i] === true : false;
              const disableToggle = !progressSlug || rewardsLocked;
              return (
                <li key={`${line}-${i}`} className="flex gap-2">
                  <button
                    type="button"
                    disabled={disableToggle}
                    onClick={() => {
                      if (!progressSlug || rewardsLocked) return;
                      persistMissionCheckToggle(progressSlug, mission, i);
                    }}
                    className={cn(
                      "flex flex-1 gap-2 rounded-xl border px-2 py-1.5 text-left text-[13px] leading-snug transition",
                      isDay
                        ? "border-slate-400/30 bg-white/75 text-slate-900/90"
                        : "border-white/12 bg-white/[0.05] text-white/84",
                      done &&
                        (isDay
                          ? "border-emerald-600/45 bg-emerald-50/95 ring-1 ring-emerald-700/20"
                          : "border-teal-400/35 bg-teal-950/35 ring-1 ring-teal-400/22"),
                      disableToggle && "cursor-default opacity-95",
                      !disableToggle && "hover:border-white/25"
                    )}
                  >
                    <CheckCircle2
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        done
                          ? isDay
                            ? "text-emerald-700"
                            : "text-teal-300"
                          : isDay
                            ? "text-slate-400"
                            : "text-white/35"
                      )}
                      aria-hidden
                    />
                    <span>{line}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {!progressSlug ? (
            <p className={cn("mt-2 text-[11px] leading-snug", isDay ? "text-slate-600/90" : "text-white/48")}>
              Progresso da missão ficará disponível quando o painel tiver slug editorial.
            </p>
          ) : null}
        </div>
      ) : null}

      {quiz ? (
        <div className={card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className={labelCls}>{quiz.title?.trim() || "Quiz rápido"}</p>
            {quizDone ? (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  isDay
                    ? "border-sky-600/35 bg-sky-50/95 text-sky-950/88"
                    : "border-sky-400/35 bg-sky-950/40 text-sky-50/90"
                )}
              >
                Respondido
              </span>
            ) : null}
          </div>
          {quiz.subtitle?.trim() ? (
            <p
              className={cn(
                "mt-1.5 text-[12px] leading-snug",
                isDay ? "text-slate-700/88" : "text-white/62"
              )}
            >
              {quiz.subtitle.trim()}
            </p>
          ) : null}
          {perAnswerCoinRule ? (
            <p
              className={cn(
                "mt-2 rounded-lg border px-2 py-1.5 text-[11px] leading-snug",
                isDay ? "border-sky-400/35 bg-sky-50/80 text-sky-950/85" : "border-sky-400/25 bg-sky-950/25 text-sky-50/88"
              )}
            >
              🪙 Sistema por pergunta: acerto <strong>+{perAnswerCoinRule.gain}</strong> moedas · erro{" "}
              <strong>−{perAnswerCoinRule.loss}</strong> moedas (ao mudar de opção, o saldo corrige o efeito
              anterior da mesma pergunta).
            </p>
          ) : null}
          {rewards?.xpTiers?.length ? (
            <div
              className={cn(
                "mt-2 rounded-xl border px-2.5 py-2 text-[11px] leading-snug",
                isDay ? "border-amber-400/35 bg-amber-50/75 text-amber-950/88" : "border-amber-400/22 bg-amber-950/22 text-amber-50/85"
              )}
            >
              <p className={cn("font-bold uppercase tracking-wide", isDay ? "text-amber-900/85" : "text-amber-200/88")}>
                Recompensa THCProce (por acertos)
              </p>
              <ul className="mt-1.5 list-none space-y-1 pl-0">
                {[...rewards.xpTiers].sort((a, b) => b.minCorrect - a.minCorrect).map((t) => (
                  <li key={`tier-${t.minCorrect}`}>
                    ≥{t.minCorrect} corretas → +{t.xp} XP · +{t.greenCoins} moedas
                  </li>
                ))}
              </ul>
              <p className={cn("mt-1.5 text-[10px]", isDay ? "text-amber-900/70" : "text-amber-100/65")}>
                Menos de {Math.min(...rewards.xpTiers.map((x) => x.minCorrect))} acertos: 0 XP e 0 moedas neste ponto. Selo
                a partir de 3 corretas.
              </p>
            </div>
          ) : null}
          <div className="mt-3 space-y-5">
            {quiz.questions.map((q, qIdx) => {
              const saved = progressSlug ? entry.quizByQuestionId?.[q.id] : undefined;
              const ephemeral = pickedEphemeral[qIdx];
              const selected = saved?.selectedIndex ?? ephemeral;
              const correct = q.correctIndex;
              return (
                <div key={q.id} className="space-y-2">
                  <p
                    className={cn(
                      "text-[13.5px] font-medium leading-snug",
                      isDay ? "text-slate-900/92" : "text-white/90"
                    )}
                  >
                    {q.question}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {q.options.map((opt, i) => {
                      const isPicked = selected === i;
                      const showResult = selected !== undefined;
                      const isCorrect = i === correct;
                      const wrongPick = showResult && isPicked && !isCorrect;
                      return (
                        <li key={`${q.id}-${i}`}>
                          <button
                            type="button"
                            disabled={rewardsLocked}
                            onClick={() => {
                              if (rewardsLocked) return;
                              if (progressSlug) {
                                persistMapPointQuizAnswer(progressSlug, q.id, i, i === correct);
                              } else {
                                setPickedEphemeral((prev) => ({ ...prev, [qIdx]: i }));
                              }
                            }}
                            className={cn(
                              "w-full rounded-xl border px-3 py-2 text-left text-[13px] leading-snug transition",
                              isDay
                                ? "border-slate-400/35 bg-white/80 text-slate-900/90 hover:border-emerald-700/40"
                                : "border-white/12 bg-white/[0.06] text-white/85 hover:border-white/22",
                              showResult &&
                                isCorrect &&
                                (isDay
                                  ? "border-emerald-600/55 bg-emerald-50/95 ring-1 ring-emerald-700/25"
                                  : "border-teal-400/45 bg-teal-950/35 ring-1 ring-teal-400/25"),
                              wrongPick &&
                                (isDay
                                  ? "border-red-400/45 bg-red-50/90"
                                  : "border-rose-400/40 bg-rose-950/28"),
                              rewardsLocked && "cursor-default opacity-95"
                            )}
                          >
                            <span
                              className={cn(
                                "font-semibold",
                                isDay ? "text-slate-500" : "text-white/45"
                              )}
                            >
                              {String.fromCharCode(65 + i)}.
                            </span>{" "}
                            {opt}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {selected !== undefined ? (
                    <div
                      className={cn(
                        "space-y-1 text-[12px] leading-snug",
                        selected === correct
                          ? isDay
                            ? "font-medium text-emerald-900/85"
                            : "font-medium text-teal-200/90"
                          : isDay
                            ? "text-slate-700/80"
                            : "text-white/60"
                      )}
                    >
                      <p>
                        {selected === correct
                          ? "Certo — esta é a melhor opção para o contexto do campus."
                          : `A resposta indicada pelo conteúdo é a alternativa ${String.fromCharCode(65 + correct)}.`}
                      </p>
                      {q.explanation?.trim() ? (
                        <p className={cn("italic", isDay ? "text-slate-700/85" : "text-white/55")}>
                          💡 {q.explanation.trim()}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {rewards ? (
        <div className={card}>
          <p className={cn(labelCls, "flex items-center gap-2")}>
            <Gift size={14} aria-hidden />
            Recompensas do mapa
          </p>
          {rewardsLocked ? (
            <div
              className={cn(
                "mt-2 rounded-xl border px-2.5 py-2 text-[12px] leading-snug",
                isDay ? "border-emerald-600/35 bg-emerald-50/88 text-emerald-950/88" : "border-teal-400/30 bg-teal-950/35 text-teal-50/88"
              )}
            >
              <span className="font-bold">Resgatado</span>
              {entry.rewardsClaimedAt ? (
                <span className="block text-[11px] opacity-90">
                  {new Date(entry.rewardsClaimedAt).toLocaleString()}
                </span>
              ) : null}
              <span className="mt-1 block text-[11px] opacity-80">
                XP, créditos e selo já foram aplicados ao teu perfil local — não duplicam.
              </span>
            </div>
          ) : (
            <p
              className={cn(
                "mt-1.5 text-[11px] leading-snug",
                isDay ? "text-slate-700/85" : "text-white/58"
              )}
            >
              Completa a missão e o quiz deste ponto para aplicar automaticamente (uma vez por área neste
              navegador).
              {!bundleComplete ? (
                <span className={cn("mt-1 block", isDay ? "text-slate-600" : "text-white/45")}>
                  Estado:{" "}
                  {!missionDone ? "missão em curso" : !quizDone ? "falta responder o quiz" : "a processar…"}
                </span>
              ) : null}
            </p>
          )}
          {rewards.rarity ? (
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  rarityStyle(rewards.rarity, isDay)
                )}
              >
                Raridade · {rewards.rarity}
              </span>
            </div>
          ) : null}
          <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                isDay ? "border-slate-400/25 bg-white/90" : "border-white/10 bg-white/[0.04]"
              )}
            >
              <span className={isDay ? "text-slate-600" : "text-white/50"}>XP</span>{" "}
              <span className={cn("font-bold", isDay ? "text-slate-900" : "text-white")}>{rewards.xp}</span>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                isDay ? "border-slate-400/25 bg-white/90" : "border-white/10 bg-white/[0.04]"
              )}
            >
              <span className={isDay ? "text-slate-600" : "text-white/50"}>Green Coins</span>{" "}
              <span className={cn("font-bold", isDay ? "text-slate-900" : "text-white")}>
                {rewards.greenCoins}
              </span>
            </div>
            <div
              className={cn(
                "col-span-2 rounded-lg border px-2 py-1.5",
                isDay ? "border-slate-400/25 bg-white/90" : "border-white/10 bg-white/[0.04]"
              )}
            >
              <span className={isDay ? "text-slate-600" : "text-white/50"}>Grower Master</span>{" "}
              <span className={cn("font-bold", isDay ? "text-slate-900" : "text-white")}>
                +{rewards.growerMasterProgress}
              </span>
            </div>
          </div>
          <div
            className={cn(
              "mt-3 rounded-xl border px-2.5 py-2",
              isDay ? "border-amber-400/35 bg-amber-50/80" : "border-amber-400/25 bg-amber-950/25"
            )}
          >
            <p
              className={cn("text-[11px] font-bold uppercase tracking-wide", isDay ? "text-amber-900/80" : "text-amber-200/85")}
              title={`id: ${rewards.badge.id}`}
            >
              Selo · {rewards.badge.name}
            </p>
            <p className={cn("mt-1 text-[12.5px] leading-snug", isDay ? "text-amber-950/88" : "text-amber-50/88")}>
              {rewards.badge.description}
            </p>
          </div>
        </div>
      ) : null}

      {journey ? (
        <div className={card}>
          <p className={cn(labelCls, "flex items-center gap-2")}>
            <GitBranch size={14} aria-hidden />
            Jornada sugerida
          </p>
          <p
            className={cn(
              "mt-1.5 text-[11px] leading-snug",
              isDay ? "text-slate-700/85" : "text-white/62"
            )}
          >
            Sugestões de próximos temas para explorares no mapa do campus.
          </p>
          {journey.prerequisites?.length ? (
            <div className="mt-2">
              <p className={cn("text-[10px] font-bold uppercase tracking-wide", isDay ? "text-slate-600" : "text-white/55")}>
                Antes, vale revisar
              </p>
              <ul className="mt-1 list-none space-y-1">
                {journey.prerequisites.map((slug) => (
                  <li
                    key={slug}
                    title={slug}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-[11px] font-medium leading-snug",
                      isDay ? "border-slate-400/30 bg-white/90 text-slate-800/90" : "border-white/12 bg-white/[0.05] text-white/78"
                    )}
                  >
                    {slugToReadable(slug)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {journey.relatedAreas?.length ? (
            <div className="mt-2">
              <p className={cn("text-[10px] font-bold uppercase tracking-wide", isDay ? "text-slate-600" : "text-white/55")}>
                Temas vizinhos
              </p>
              <ul className="mt-1 flex flex-wrap gap-1">
                {journey.relatedAreas.map((slug) => (
                  <li
                    key={slug}
                    title={slug}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      isDay ? "border-slate-400/28 bg-white/88 text-slate-800/88" : "border-white/14 bg-white/[0.06] text-white/78"
                    )}
                  >
                    {slugToReadable(slug)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {journey.recommendedNext?.length ? (
            <div className="mt-2">
              <p className={cn("text-[10px] font-bold uppercase tracking-wide", isDay ? "text-slate-600" : "text-white/55")}>
                Próximo passo natural
              </p>
              <ul className="mt-1 flex flex-wrap gap-1">
                {journey.recommendedNext.map((slug) => (
                  <li
                    key={slug}
                    title={slug}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      isDay ? "border-emerald-700/28 bg-emerald-50/92 text-emerald-950/88" : "border-teal-400/28 bg-teal-950/35 text-teal-50/88"
                    )}
                  >
                    {slugToReadable(slug)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {hasAmbience ? (
        <div className={card}>
          <p className={cn(labelCls, "flex items-center gap-2")}>
            <MessageCircle size={14} aria-hidden />
            Ambiente do ponto
          </p>
          <ul className="mt-2 space-y-1.5">
            {ambience!.lines!.map((line) => (
              <li
                key={line}
                className={cn(
                  "text-[12.5px] italic leading-relaxed",
                  isDay ? "text-slate-700/85" : "text-white/70"
                )}
              >
                “{line}”
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
