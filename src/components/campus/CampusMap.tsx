"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { areas, type Area } from "@/data/courses";
import { Hotspot } from "./Hotspot";
import { AmbientLife } from "./AmbientLife";
import { AmbientPixi } from "./AmbientPixi";
import { CoursePanel } from "./CoursePanel";
import { LessonPanel } from "./LessonPanel";
import { HUD } from "./HUD";
import { CampusPlayer } from "./CampusPlayer";
import { CampusPeerAvatars } from "./CampusPeerAvatars";
import { MapWalkLayer } from "./MapWalkLayer";
import { ProximityBanner } from "./ProximityBanner";
import { CampusChatDrawer } from "./CampusChatDrawer";
import { InternalPreviewBanner } from "./InternalPreviewBanner";
import { useCampusSkyStore } from "@/stores/campusSkyStore";
import { useCampusStore } from "@/stores/campusStore";
import { nearestArea } from "@/lib/campusProximity";
import { CAMPUS_IMAGE_OBJECT_POSITION } from "@/lib/campusArt";
import { isCampusAreaConstruction } from "@/config/campusAreaRollout";
import { getLastLessonIndex } from "@/lib/campusLastLesson";
import { trpc } from "@/lib/trpc/react";
import { CampusAreaGateModal, type CampusGateKind } from "./CampusAreaGateModal";

const PLACEHOLDER_NIGHT = `
  radial-gradient(ellipse at 20% 30%, rgba(34, 197, 94, 0.20), transparent 45%),
  radial-gradient(ellipse at 70% 25%, rgba(168, 85, 247, 0.18), transparent 40%),
  radial-gradient(ellipse at 80% 70%, rgba(251, 191, 36, 0.15), transparent 45%),
  radial-gradient(ellipse at 30% 80%, rgba(34, 211, 238, 0.10), transparent 40%),
  linear-gradient(180deg, #050a07 0%, #0a1510 60%, #050a07 100%)
`;

const PLACEHOLDER_DAY = `
  radial-gradient(ellipse at 25% 18%, rgba(56, 189, 248, 0.28), transparent 42%),
  radial-gradient(ellipse at 72% 22%, rgba(250, 204, 21, 0.22), transparent 40%),
  radial-gradient(ellipse at 48% 88%, rgba(74, 222, 128, 0.18), transparent 48%),
  linear-gradient(180deg, #e0f2fe 0%, #fef9c3 45%, #dcfce7 100%)
`;

type Props = {
  bgNightSrc?: string;
  bgDaySrc?: string;
  showCourseLabels?: boolean;
  internalPreview?: boolean;
};

export function CampusMap({
  bgNightSrc = "/campus/campus.png",
  bgDaySrc = "/campus/campus-day.png",
  showCourseLabels = true,
  internalPreview = false
}: Props) {
  const sky = useCampusSkyStore((s) => s.sky);
  const setPlayer = useCampusStore((s) => s.setPlayer);
  const player = useCampusStore((s) => s.player);
  const { data: session, status } = useSession();

  const [selected, setSelected] = useState<Area | null>(null);
  const [campusLesson, setCampusLesson] = useState<{
    area: Area;
    idx: number;
  } | null>(null);
  const [nightOk, setNightOk] = useState(true);
  const [dayOk, setDayOk] = useState(true);
  const [dismissNearId, setDismissNearId] = useState<string | null>(null);
  const [gateOpen, setGateOpen] = useState<{
    kind: CampusGateKind;
    area: Area;
  } | null>(null);

  const phase = sky;
  const anyMissing = sky === "night" ? !nightOk : !dayOk;

  const { data: progress } = trpc.campus.areaProgress.useQuery({}, {
    staleTime: 120_000
  });

  const { data: campusAccess } = trpc.campus.myCampusAccess.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 60_000
  });

  const canEnterCourses = useMemo(() => {
    if (process.env.NEXT_PUBLIC_CAMPUS_PUBLIC_ALL === "true") return true;
    if (status !== "authenticated") return false;
    if (!campusAccess) return false;
    return campusAccess.canOpenCourses;
  }, [status, campusAccess]);

  const handleSelectArea = (area: Area) => {
    if (isCampusAreaConstruction(area.id)) {
      setGateOpen({ kind: "construction", area });
      return;
    }
    if (!canEnterCourses) {
      setGateOpen({ kind: "enroll", area });
      return;
    }
    setSelected(area);
  };

  const nearResult = useMemo(
    () => nearestArea(player, 10),
    [player.x, player.y]
  );

  useEffect(() => {
    setDismissNearId(null);
  }, [nearResult?.area.id]);

  const proximityName =
    nearResult &&
    dismissNearId !== nearResult.area.id &&
    selected?.id !== nearResult.area.id
      ? nearResult.area.mapLabel ?? nearResult.area.name
      : null;

  const myLabel =
    status === "authenticated"
      ? (session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "Aluno")
      : "Visitante";

  return (
    <div
      className="relative w-full h-[100svh] overflow-hidden bg-ink-900 no-select"
      data-sky={sky}
    >
      {internalPreview ? <InternalPreviewBanner /> : null}

      <motion.div
        className="absolute inset-0 bg-ink-900"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative isolate h-full w-full overflow-hidden shadow-2xl ring-1 ring-white/5">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: sky === "night" ? 1 : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            {nightOk ? (
              <Image
                src={bgNightSrc}
                alt="Campus THCProce ao entardecer / noite"
                fill
                priority={sky === "night"}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: CAMPUS_IMAGE_OBJECT_POSITION }}
                onError={() => setNightOk(false)}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: PLACEHOLDER_NIGHT }} />
            )}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: sky === "night" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/38" />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: sky === "day" ? 1 : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            {dayOk ? (
              <Image
                src={bgDaySrc}
                alt="Campus THCProce durante o dia"
                fill
                priority={sky === "day"}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: CAMPUS_IMAGE_OBJECT_POSITION }}
                onError={() => setDayOk(false)}
              />
            ) : (
              <div className="absolute inset-0" style={{ background: PLACEHOLDER_DAY }} />
            )}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: sky === "day" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-sky-400/12 via-transparent to-amber-200/18" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_12%,rgba(255,251,235,0.32),transparent_52%)]" />
            </motion.div>
          </motion.div>

          <div className="absolute inset-0 z-[7] pointer-events-none">
            <AmbientLife phase={phase} />
          </div>

          <div className="absolute inset-0 z-[8]">
            <MapWalkLayer onWalkTo={setPlayer} />
          </div>

          <div className="absolute inset-0 z-10">
            {areas.map((area) => (
              <Hotspot
                key={area.id}
                area={area}
                showCourseLabels={showCourseLabels}
                onSelect={handleSelectArea}
                active={selected?.id === area.id}
                completed={Boolean(progress?.areas[area.id])}
              />
            ))}
          </div>

          <div className="absolute inset-0 z-[12] pointer-events-none">
            <CampusPlayer />
            <CampusPeerAvatars myLabel={myLabel} />
          </div>
        </div>
      </motion.div>

      {anyMissing ? <PlaceholderHint mode={sky} /> : null}

      <AmbientPixi phase={phase} />

      <ProximityBanner
        areaName={proximityName}
        onOpen={() => {
          if (nearResult) handleSelectArea(nearResult.area);
        }}
        onDismiss={() => {
          if (nearResult) setDismissNearId(nearResult.area.id);
        }}
      />

      <HUD />

      <CoursePanel
        area={selected}
        onClose={() => setSelected(null)}
        onOpenCampusLesson={(lessonIndex) => {
          if (!selected) return;
          const idx =
            typeof lessonIndex === "number"
              ? lessonIndex
              : getLastLessonIndex(selected.id, 0);
          setCampusLesson({ area: selected, idx });
          setSelected(null);
        }}
      />

      <CampusAreaGateModal
        open={gateOpen != null}
        kind={gateOpen?.kind ?? null}
        area={gateOpen?.area ?? null}
        sky={sky}
        onClose={() => setGateOpen(null)}
      />

      <LessonPanel
        open={campusLesson != null}
        area={campusLesson?.area ?? null}
        lessonIndex={campusLesson?.idx ?? 0}
        allAreas={areas}
        onClose={() => setCampusLesson(null)}
        onSelectArea={(a) =>
          setCampusLesson({ area: a, idx: getLastLessonIndex(a.id, 0) })
        }
        onSelectLesson={(idx) =>
          setCampusLesson((c) =>
            c ? { area: c.area, idx } : c
          )
        }
      />

      <CampusChatDrawer />

      <div className="md:hidden fixed bottom-2 left-2 right-2 z-10 text-center">
        <span className="inline-block px-3 py-1.5 rounded-full glass-strong text-[11px] tracking-wide text-white/70">
          Toque no mapa para andar · no nome do curso pra abrir a sala ·{" "}
          <span className="text-canna-300">{sky === "day" ? "Dia" : "Noite"}</span>
        </span>
      </div>
    </div>
  );
}

function PlaceholderHint({ mode }: { mode: "day" | "night" }) {
  const isDay = mode === "day";

  return (
    <div className="absolute bottom-36 left-1/2 z-[25] max-w-lg -translate-x-1/2 px-6 text-center sm:bottom-24">
      <div className="glass-strong rounded-2xl border border-canna-400/28 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-canna-300">
          Arte {isDay ? "diurna" : "noturna"} não encontrada
        </p>
        <p className="mt-2 text-sm text-white/75 leading-snug">
          Salve sua imagem do campus em{" "}
          <code className="rounded bg-black/35 px-1.5 py-0.5 text-canna-200 text-[11px]">
            public/campus/{isDay ? "campus-day.png" : "campus.png"}
          </code>{" "}
          (ou .webp) e atualize — o fundo provisório de{" "}
          {isDay ? "dia" : "noite"} está ativo.
        </p>
      </div>
    </div>
  );
}
