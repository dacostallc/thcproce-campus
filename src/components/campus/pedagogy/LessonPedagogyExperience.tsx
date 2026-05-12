"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LessonPedagogyViewModel } from "@/lib/lessonPedagogyViewModel";
import { splitIntoBreathingLines } from "@/lib/pedagogyBreathingText";
import type { StreamPaletteSlice } from "@/components/campus/pedagogy/LessonPedagogyVisualBlocks";
import {
  CheckpointBulletList,
  ExerciseBlock,
  LessonClosingCeremony,
  LessonMissionRibbon,
  MissionBlock,
  MissionBriefingHero,
  OperationalDigestCard,
  PedagogySeparator,
  ProfessionalObservationBlock,
  TipBlock,
  ToolBlock,
  WarningBlock
} from "@/components/campus/pedagogy/LessonPedagogyVisualBlocks";
import { cn } from "@/lib/utils";

function proseTone(cinematic101: boolean): string {
  return cn(
    "text-[15px] sm:text-[16px] leading-[1.72] lg:text-[16px] lg:leading-[1.76] whitespace-pre-line",
    cinematic101 ? "text-white/[0.96]" : "text-white/[0.9]"
  );
}

const sectionPad = "border-b py-10 sm:py-12";

export function LessonPedagogyExperience({
  vm,
  pal,
  cinematic101,
  sectionHeadingRenderer
}: {
  vm: LessonPedagogyViewModel;
  pal: StreamPaletteSlice;
  cinematic101: boolean;
  sectionHeadingRenderer: (key: string, label: string) => ReactNode;
}) {
  const tone = cinematic101 ? "canna101" : "campus";
  const bodyCls = proseTone(cinematic101);

  const practicalItems =
    vm.practicalChunks.length > 0 ? vm.practicalChunks : vm.practicalExplanation.trim()
      ? [vm.practicalExplanation.trim()]
      : [];

  const summaryItems =
    vm.summaryChunks.length > 0 ? vm.summaryChunks : vm.operationalSummary.trim()
      ? [vm.operationalSummary.trim()]
      : [];

  const exerciseItems =
    vm.exerciseLines.length > 0 ? vm.exerciseLines : vm.exercise.trim() ? [vm.exercise.trim()] : [];

  return (
    <>
      <LessonMissionRibbon
        tone={tone}
        pal={pal}
        xp={vm.xpReward}
        minutes={vm.estimatedMinutes}
        difficulty={vm.difficultyLabel}
        category={vm.categoryLabel}
        evolution={vm.evolutionLabel}
      />

      <PedagogySeparator tone={tone} />

      <section className={cn(sectionPad, pal.sectionBorder)}>
        {sectionHeadingRenderer("briefing", "Briefing · entrada na missão")}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>
          <MissionBriefingHero
            tone={tone}
            impact={vm.briefingImpact}
            humanContext={vm.briefingHumanContext}
            discovery={vm.briefingDiscovery}
          />
        </motion.div>

        {vm.openingContinuationChunks.length ? (
          <>
            <PedagogySeparator tone={tone} className="py-6 sm:py-7" />
            <TipBlock tone={tone} title="Panorama extra · se precisares de mais contexto">
              <CheckpointBulletList tone={tone} items={vm.openingContinuationChunks} />
            </TipBlock>
          </>
        ) : null}
      </section>

      <section className={cn(sectionPad, pal.sectionBorder)}>
        {sectionHeadingRenderer("obj", "Objetivos · o que vais dominar")}
        <MissionBlock tone={tone} title="Porque esta sessão existe" subtitle={vm.objectiveLead}>
          <CheckpointBulletList tone={tone} items={vm.objectiveLines} numbered startIndex={0} />
        </MissionBlock>
      </section>

      <section className={cn(sectionPad, pal.sectionBorder)}>
        {sectionHeadingRenderer("explain", "Treino técnico · núcleo")}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          {practicalItems.length ? (
            <CheckpointBulletList tone={tone} items={practicalItems} />
          ) : (
            <p className={cn(bodyCls, "text-white/55")}>Conteúdo editorial em atualização para esta missão.</p>
          )}
        </motion.div>
      </section>

      {vm.stepByStep.length ? (
        <section className={cn(sectionPad, pal.sectionBorder)}>
          {sectionHeadingRenderer("steps", "Checkpoints · execução")}
          <div className="space-y-4">
            {vm.stepByStep.map((step, i) => {
              const stepLines = splitIntoBreathingLines(step, 200);
              return (
                <motion.div
                  key={`step-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(0.05 * i, 0.35) }}
                >
                  <ToolBlock tone={tone} label={`Checkpoint ${i + 1}`}>
                    {stepLines.length > 1 ? (
                      <CheckpointBulletList tone={tone} items={stepLines} />
                    ) : (
                      <span className={bodyCls}>{step}</span>
                    )}
                  </ToolBlock>
                </motion.div>
              );
            })}
          </div>
        </section>
      ) : null}

      {vm.realExample ? (
        <section className={cn(sectionPad, pal.sectionBorder)}>
          {sectionHeadingRenderer("ex", "Exemplo aplicável")}
          <TipBlock tone={tone} title="Campo real · sem ornamentação">
            {vm.exampleChunks.length > 1 ? (
              <CheckpointBulletList tone={tone} items={vm.exampleChunks} />
            ) : (
              <p className={bodyCls}>{vm.realExample}</p>
            )}
          </TipBlock>
        </section>
      ) : null}

      {vm.commonMistakes ? (
        <section className={cn(sectionPad, pal.sectionBorder)}>
          {sectionHeadingRenderer("mistakes", "Erros frequentes")}
          <WarningBlock tone={tone}>
            {vm.mistakesChunks.length > 1 ? (
              <CheckpointBulletList tone={tone} items={vm.mistakesChunks} />
            ) : (
              <p className={bodyCls}>{vm.commonMistakes}</p>
            )}
          </WarningBlock>
        </section>
      ) : null}

      {vm.professionalObservation ? (
        <section className={cn(sectionPad, pal.sectionBorder)}>
          {sectionHeadingRenderer("profobs", "Observação profissional")}
          <ProfessionalObservationBlock tone={tone}>
            {vm.profObservationChunks.length > 1 ? (
              <CheckpointBulletList tone={tone} items={vm.profObservationChunks} />
            ) : (
              <p className={bodyCls}>{vm.professionalObservation}</p>
            )}
          </ProfessionalObservationBlock>
        </section>
      ) : null}

      <section className={cn(sectionPad, pal.sectionBorder)}>
        {sectionHeadingRenderer("digest", "Resumo operacional")}
        <OperationalDigestCard tone={tone}>
          {summaryItems.length ? (
            <CheckpointBulletList tone={tone} items={summaryItems} />
          ) : (
            <p className={bodyCls}>Sem síntese editorial dedicada — revisita os checkpoints acima antes de fechar.</p>
          )}
        </OperationalDigestCard>
      </section>

      <section className={cn(sectionPad, pal.sectionBorder)}>
        {sectionHeadingRenderer("exo", "Missão prática · treino ativo")}
        <ExerciseBlock tone={tone} title="Tarefa curta — progressão real">
          {exerciseItems.length > 1 ? (
            <CheckpointBulletList tone={tone} items={exerciseItems} numbered />
          ) : (
            <p className={bodyCls}>{vm.exercise}</p>
          )}
        </ExerciseBlock>
      </section>

      <LessonClosingCeremony tone={tone} pal={pal}>
        <CheckpointBulletList tone={tone} items={splitIntoBreathingLines(vm.nextLessonBridge, 220)} />
      </LessonClosingCeremony>
    </>
  );
}
