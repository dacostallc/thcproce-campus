"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AvatarSelector } from "@/components/campus/AvatarSelector";
import { CampusMissionsPhase2Panel } from "@/components/campus/missions/CampusMissionsPhase2Panel";
import { CampusProfileAcademicTab } from "@/components/campus/CampusProfileAcademicTab";
import { CampusProfileInventoryTab } from "@/components/campus/CampusProfileInventoryTab";
import { StudentMissionsPanel } from "@/components/campus/missions/StudentMissionsPanel";
import { StudentProfileCard } from "@/components/campus/StudentProfileCard";
import { Button } from "@/components/ui/button";
import { areas } from "@/data/courses";
import { useCampusProgressClient } from "@/hooks/useCampusProgressClient";
import { useClientHydrated } from "@/hooks/useClientHydrated";
import { cn } from "@/lib/utils";
import {
  computeLocalCoursePctFromMarks,
  type CampusProgress
} from "@/lib/campusProgressStorage";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { isCampusAdminEmail } from "@/lib/campusAdmin";
import {
  isCampusLocalProgressResetAllowed,
  resetCampusLocalProgressAll
} from "@/lib/campusLocalProgressReset";
import {
  AVATAR_AURA_CATALOG,
  AVATAR_BADGE_VISUAL_CATALOG,
  AVATAR_FRAME_CATALOG,
  AVATAR_HOLOGRAM_FX_CATALOG,
  type AvatarVisualRarity
} from "@/lib/studentAvatarVisualMockCatalog";
import { getStudentTitleForProfile } from "@/lib/studentTitleCatalog";
import {
  loadStudentProfile,
  saveStudentProfile,
  DEFAULT_LOCAL_STUDENT_DISPLAY_NAME,
  studentProfilePerfilHydrationPlaceholder
} from "@/lib/studentGamificationStorage";

/** Nomes locais ainda «genéricos» — permitem herdar o nome da conta ao iniciar sessão. */
const PROFILE_NAME_SESSION_MERGE_DEFAULTS = new Set(["Visitante campus", DEFAULT_LOCAL_STUDENT_DISPLAY_NAME]);

const DEFAULT_DISPLAY = DEFAULT_LOCAL_STUDENT_DISPLAY_NAME;

export type CampusProfileFormDensity = "page" | "modal";

type CampusProfileFormProps = {
  density?: CampusProfileFormDensity;
  /** Extra content below the form sections (e.g. page-level nav links). */
  afterSections?: React.ReactNode;
};

function courseRowsForProfile(campus: CampusProgress, hydrated: boolean) {
  const seen = new Map<string, number>();
  for (const [id, row] of Object.entries(campus.courseProgressPct)) {
    seen.set(id, row.pct);
  }
  const fromMarks = [...areas].map((a) => {
    const cached = seen.get(a.id);
    if (cached != null) return { id: a.id, name: a.name, pct: cached };
    if (!hydrated) return { id: a.id, name: a.name, pct: 0 };
    const pct = computeLocalCoursePctFromMarks(a.id);
    return { id: a.id, name: a.name, pct };
  });
  return fromMarks.sort((x, y) => y.pct - x.pct);
}

export function CampusProfileForm({
  density = "page",
  afterSections = null
}: CampusProfileFormProps) {
  const { data: session, status } = useSession();
  const g = useStudentGamification();
  const hydrated = useClientHydrated();
  const gUi = useMemo(
    () => (hydrated ? g : studentProfilePerfilHydrationPlaceholder()),
    [hydrated, g]
  );
  const campus = useCampusProgressClient();
  const [nameDraft, setNameDraft] = useState(g.displayName);
  const showCampusLocalResetTools = isCampusLocalProgressResetAllowed(
    isCampusAdminEmail(session?.user?.email ?? null)
  );
  const isModal = density === "modal";
  const [profileMainTab, setProfileMainTab] = useState<"overview" | "inventory" | "academic">(
    "overview"
  );

  useEffect(() => {
    setNameDraft(g.displayName);
  }, [g.displayName]);

  useEffect(() => {
    const n = session?.user?.name?.trim();
    if (!n) return;
    const cur = loadStudentProfile();
    if (!PROFILE_NAME_SESSION_MERGE_DEFAULTS.has(cur.displayName)) return;
    saveStudentProfile({ displayName: n.slice(0, 80) });
  }, [session?.user?.name]);

  const persistName = useCallback(() => {
    const trimmed = nameDraft.trim().slice(0, 80);
    if (!trimmed) return;
    saveStudentProfile({ displayName: trimmed });
  }, [nameDraft]);

  const displayNameResolved = gUi.displayName.trim() || DEFAULT_DISPLAY;
  const studentTitle = useMemo(() => getStudentTitleForProfile(gUi).label, [gUi.xp]);
  const email = session?.user?.email?.trim() ?? null;
  const emailForCard = hydrated ? email : null;
  const accountHintForCard =
    hydrated && status === "authenticated" ? ("authenticated" as const) : ("guest" as const);
  const courseRows = useMemo(() => courseRowsForProfile(campus, hydrated), [campus, hydrated]);

  const cardShell = isModal
    ? "rounded-xl campus-hud-glass border-white/12 bg-white/[0.03] p-4"
    : "rounded-2xl campus-hud-glass border-white/14 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.22)]";

  const innerScroll = isModal ? "max-h-[min(72dvh,620px)] overflow-y-auto scrollbar-thin pr-1" : "";

  return (
    <div className={cn("space-y-4", isModal && "space-y-3")}>
      <div className={innerScroll}>
        <div className={cn("space-y-4", isModal && "space-y-3")}>
          <StudentProfileCard
            compact={isModal}
            displayName={displayNameResolved}
            studentTitle={studentTitle}
            email={emailForCard}
            accountHint={accountHintForCard}
            avatarVariant={gUi.avatarVariant}
            visualCosmetics={gUi.visualCosmeticsV1}
            xp={gUi.xp}
            credits={gUi.credits}
            badgeCount={gUi.badges.length}
            souvenirUnlockedCount={gUi.unlockedSouvenirs.length}
            bonusInventoryCount={gUi.bonusInventoryIds.length}
            helpfulPoints={gUi.helpfulPoints}
            communityRank={gUi.communityRank}
            mentorLevel={gUi.mentorLevel}
          />

          <div
            className={cn(
              "flex gap-1 rounded-xl border border-white/12 bg-black/20 p-1",
              isModal && "rounded-lg"
            )}
            role="tablist"
            aria-label="Secções do perfil local"
          >
            <button
              type="button"
              role="tab"
              aria-selected={profileMainTab === "overview"}
              onClick={() => setProfileMainTab("overview")}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs",
                profileMainTab === "overview"
                  ? "bg-canna-500/25 text-canna-50"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
              )}
            >
              Perfil
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={profileMainTab === "inventory"}
              onClick={() => setProfileMainTab("inventory")}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs",
                profileMainTab === "inventory"
                  ? "bg-emerald-500/22 text-emerald-50"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
              )}
            >
              Inventário
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={profileMainTab === "academic"}
              onClick={() => setProfileMainTab("academic")}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-[11px] font-semibold transition sm:text-xs",
                profileMainTab === "academic"
                  ? "bg-sky-500/22 text-sky-50"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
              )}
            >
              Histórico
            </button>
          </div>

          {profileMainTab === "inventory" ? (
            <CampusProfileInventoryTab density={isModal ? "modal" : "page"} hydrated={hydrated} />
          ) : profileMainTab === "academic" ? (
            <CampusProfileAcademicTab density={isModal ? "modal" : "page"} hydrated={hydrated} />
          ) : (
            <>
          <div className={cn(cardShell)}>
            {!isModal ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-canna-300/80">
                  Progresso local
                </p>
                <h1 className="mt-2 text-xl font-bold text-white">Meu perfil no campus (local)</h1>
                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  Guardado neste browser. Quando estás com sessão iniciada, não soma automaticamente com o
                  painel “Progresso” da conta no servidor.
                </p>
              </>
            ) : (
              <p className="text-[11px] leading-relaxed text-white/55">
                Progresso local neste browser. Não substitui o XP da conta no servidor.
              </p>
            )}
          </div>

          <div className={cn(cardShell)}>
            <label className="block text-xs font-semibold text-white/70" htmlFor="campus-local-name">
              Nome no campus (local)
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <input
                id="campus-local-name"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={persistName}
                maxLength={80}
                className="min-w-[12rem] flex-1 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none backdrop-blur-sm focus:border-canna-400/45"
              />
              <Button type="button" size="sm" variant="glass" onClick={persistName}>
                Guardar
              </Button>
            </div>
            <div
              className={cn("mt-6", !hydrated && "pointer-events-none opacity-90")}
              aria-busy={!hydrated}
            >
              <AvatarSelector compact={isModal} value={gUi.avatarVariant} />
            </div>
          </div>

          {showCampusLocalResetTools && hydrated ? (
            <div className={cn(cardShell)}>
              <h2 className="text-sm font-semibold text-white">Ajustes avançados do avatar (campo de testes)</h2>
              <p className="mt-1 text-xs text-white/45">
                Molduras, auroras e efeitos visuais são guardados neste dispositivo para validação de interface.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-[11px] font-medium text-white/55">
                Raridade visual
                <select
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.visualCosmeticsV1.rarity}
                  onChange={(e) =>
                    saveStudentProfile({
                      visualCosmeticsV1: {
                        ...g.visualCosmeticsV1,
                        rarity: e.target.value as AvatarVisualRarity
                      }
                    })
                  }
                >
                  {(["common", "uncommon", "rare", "epic", "legendary"] as AvatarVisualRarity[]).map(
                    (r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    )
                  )}
                </select>
              </label>
              <label className="block text-[11px] font-medium text-white/55">
                Moldura
                <select
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.visualCosmeticsV1.frameId}
                  onChange={(e) =>
                    saveStudentProfile({
                      visualCosmeticsV1: { ...g.visualCosmeticsV1, frameId: e.target.value }
                    })
                  }
                >
                  {Object.values(AVATAR_FRAME_CATALOG).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.labelPt}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] font-medium text-white/55">
                Aura
                <select
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.visualCosmeticsV1.auraId}
                  onChange={(e) =>
                    saveStudentProfile({
                      visualCosmeticsV1: { ...g.visualCosmeticsV1, auraId: e.target.value }
                    })
                  }
                >
                  {Object.values(AVATAR_AURA_CATALOG).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.labelPt}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] font-medium text-white/55">
                Pin holográfico
                <select
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.visualCosmeticsV1.badgeVisualId}
                  onChange={(e) =>
                    saveStudentProfile({
                      visualCosmeticsV1: { ...g.visualCosmeticsV1, badgeVisualId: e.target.value }
                    })
                  }
                >
                  {Object.values(AVATAR_BADGE_VISUAL_CATALOG).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.labelPt}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] font-medium text-white/55 sm:col-span-2">
                FX holográficos
                <select
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.visualCosmeticsV1.hologramFx}
                  onChange={(e) =>
                    saveStudentProfile({
                      visualCosmeticsV1: { ...g.visualCosmeticsV1, hologramFx: e.target.value }
                    })
                  }
                >
                  {Object.values(AVATAR_HOLOGRAM_FX_CATALOG).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.labelPt}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            </div>
          ) : null}

          {showCampusLocalResetTools && hydrated ? (
            <div className={cn(cardShell)}>
              <h2 className="text-sm font-semibold text-white">Reputação (campos de pré-visualização)</h2>
            <p className="mt-1 text-xs text-white/45">
              Estes números só existem localmente para cenários de equipa e design; o aluno vê o resumo mais
              genérico acima.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="text-[11px] font-medium text-white/55">
                Pontos úteis
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.helpfulPoints}
                  onChange={(e) =>
                    saveStudentProfile({ helpfulPoints: Math.max(0, Math.floor(Number(e.target.value) || 0)) })
                  }
                />
              </label>
              <label className="text-[11px] font-medium text-white/55">
                Rank comunidade
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.communityRank}
                  onChange={(e) =>
                    saveStudentProfile({ communityRank: Math.max(0, Math.floor(Number(e.target.value) || 0)) })
                  }
                />
              </label>
              <label className="text-[11px] font-medium text-white/55">
                Nível mentor
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-black/25 px-2 py-1.5 text-sm text-white"
                  value={g.mentorLevel}
                  onChange={(e) =>
                    saveStudentProfile({ mentorLevel: Math.max(0, Math.floor(Number(e.target.value) || 0)) })
                  }
                />
              </label>
            </div>
            </div>
          ) : null}

          <div className={cn(cardShell)}>
            <h2 className="text-sm font-semibold text-white">Título académico THCProce</h2>
            <p className="mt-1 text-[11px] text-white/50">
              Calculado a partir do XP do campus neste navegador:{" "}
              <span className="font-semibold text-amber-200/92">{studentTitle}</span>.
            </p>
          </div>
          <div className={cn(cardShell)}>
            <h2 className="text-sm font-semibold text-white">Progresso nos cursos (local)</h2>
            <p className="mt-1 text-xs text-white/45">
              Derivado das aulas vistas neste browser. Fica alinhado com o chip “continuar curso”.
            </p>
            <ul className="mt-3 space-y-2">
              {courseRows.map(({ id, name, pct }) => (
                <li
                  key={id}
                  className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2 text-sm text-white/85"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate font-medium">{name}</span>
                    <span className="tabular-nums text-canna-200/95">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/35">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-canna-400/85 to-emerald-300/70"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={cn(cardShell)}>
            <StudentMissionsPanel variant={isModal ? "compact" : "default"} />
          </div>

          <div className={cn(cardShell)}>
            <CampusMissionsPhase2Panel variant={isModal ? "compact" : "default"} title="Missões do campus · Fase 2" />
          </div>

            </>
          )}

        </div>
      </div>

      {isModal || showCampusLocalResetTools ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 border-t border-white/10 pt-3",
            isModal && showCampusLocalResetTools
              ? "justify-between"
              : isModal
                ? "justify-start"
                : "justify-end",
            isModal && "pt-2"
          )}
        >
          {isModal ? (
            <Button type="button" variant="glass" size="sm" className="text-xs" asChild>
              <Link href="/campus/perfil">Abrir página completa</Link>
            </Button>
          ) : null}
          {showCampusLocalResetTools ? (
            <Button
              type="button"
              variant="glass"
              size="sm"
              className="text-xs text-amber-200/95"
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  window.confirm(
                    "Repor todo o progresso local do campus neste dispositivo? Isto apaga bem-vindo, tour, aulas marcadas, inventário, missões e créditos locais."
                  )
                ) {
                  resetCampusLocalProgressAll();
                  window.location.reload();
                }
              }}
            >
              Resetar progresso local
            </Button>
          ) : null}
        </div>
      ) : null}

      {afterSections}
    </div>
  );
}
