import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { ensureUserUnlockedAvatarItems } from "@/lib/services/avatarCosmetics";
import { syncMissionsForProfile } from "@/lib/services/missionsSync";
import { ProfileAvatarEditor } from "@/components/perfil/ProfileAvatarEditor";
import { ProfileCosmeticsSection, type CosmeticRow } from "@/components/perfil/ProfileCosmeticsSection";
import { ProfileReferralSection } from "@/components/perfil/ProfileReferralSection";
import { ProfileRewardHistory } from "@/components/perfil/ProfileRewardHistory";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import { serverSiteOrigin } from "@/lib/http/siteOrigin";
import { ensureProfileReferralCode } from "@/lib/referral/ensureReferralCode";
import { levelFromXp } from "@/server/gamification";

export const metadata: Metadata = {
  title: "Meu progresso — THCProce",
  description: "XP, nível e conquistas no campus.",
};

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect(`/entrar?callbackUrl=${encodeURIComponent("/perfil")}`);
  }

  const email = session.user.email.trim().toLowerCase();
  const sessionName = session.user.name?.trim() || null;

  let profile = await prisma.profile.findUnique({
    where: { email },
    include: {
      userAchievements: {
        orderBy: { unlockedAt: "desc" },
        include: { achievement: true },
      },
    },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        email,
        displayName: sessionName ?? email.split("@")[0] ?? "Aluno",
      },
      include: {
        userAchievements: {
          orderBy: { unlockedAt: "desc" },
          include: { achievement: true },
        },
      },
    });
  }

  const ensuredReferralCode = await ensureProfileReferralCode(prisma, profile.id);
  await ensureUserUnlockedAvatarItems(profile.id);
  await syncMissionsForProfile(profile.id);

  const [profileRow, referralCount, rewardLogs] = await Promise.all([
    prisma.profile.findUniqueOrThrow({
      where: { id: profile.id },
      include: {
        userAchievements: {
          orderBy: { unlockedAt: "desc" },
          include: { achievement: true },
        },
        userAvatarItems: {
          where: { avatarItem: { active: true } },
          include: { avatarItem: true },
          orderBy: { unlockedAt: "desc" },
        },
        activeHatItem: true,
        activeBadgeItem: true,
        userMissionProgresses: {
          where: { mission: { active: true } },
          include: { mission: true },
          orderBy: { mission: { sortOrder: "asc" } },
        },
      },
    }),
    prisma.referral.count({ where: { referrerProfileId: profile.id } }),
    prisma.profileRewardLog.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        type: true,
        source: true,
        description: true,
        xpAmount: true,
        souvenirCreditsAmount: true,
        createdAt: true,
      },
    }),
  ]);

  const siteOrigin = serverSiteOrigin();
  const invitePath = `/inscrever-se?ref=${encodeURIComponent(profileRow.referralCode ?? ensuredReferralCode)}`;
  const inviteUrlAbsolute = siteOrigin ? `${siteOrigin}${invitePath}` : invitePath;

  const cosmeticRows: CosmeticRow[] = profileRow.userAvatarItems.map((u) => ({
    avatarItemId: u.avatarItemId,
    code: u.avatarItem.code,
    name: u.avatarItem.name,
    type: u.avatarItem.type,
    displayGlyph: u.avatarItem.displayGlyph,
    unlockedAt: u.unlockedAt.toISOString(),
  }));

  const hatIds = new Set(cosmeticRows.filter((r) => r.type === "HAT").map((r) => r.avatarItemId));
  const badgeIds = new Set(cosmeticRows.filter((r) => r.type === "BADGE").map((r) => r.avatarItemId));
  const activeHatItemId =
    profileRow.activeHatItemId && hatIds.has(profileRow.activeHatItemId) ? profileRow.activeHatItemId : null;
  const activeBadgeItemId =
    profileRow.activeBadgeItemId && badgeIds.has(profileRow.activeBadgeItemId)
      ? profileRow.activeBadgeItemId
      : null;

  const [quizzesPassed, quizAttemptsTotal] = await Promise.all([
    prisma.quizAttempt.count({ where: { profileId: profileRow.id, passed: true } }),
    prisma.quizAttempt.count({ where: { profileId: profileRow.id } }),
  ]);

  const displayName = profileRow.displayName ?? sessionName ?? email.split("@")[0] ?? "Aluno";
  const tier = levelFromXp(profileRow.xpTotal);

  return (
    <main className="relative min-h-screen px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-lg space-y-6">
        <div className="rounded-2xl border border-canna-400/25 bg-black/35 p-6 shadow-lg shadow-black/40 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-canna-300/80">Perfil</p>
          <h1 className="mt-2 text-xl font-bold text-white">Meu progresso</h1>
          <p className="mt-4 text-sm text-white/90">
            <span className="text-white/50">Nome: </span>
            {displayName}
          </p>
          <p className="mt-1 text-sm text-white/90">
            <span className="text-white/50">E-mail: </span>
            {email}
          </p>
          <p className="mt-4 text-sm text-white/90">
            <span className="text-white/50">XP total: </span>
            <strong className="text-gold-200">{profileRow.xpTotal}</strong>
          </p>
          <p className="mt-1 text-sm text-white/90">
            <span className="text-white/50">Nível: </span>
            <strong>{tier.label}</strong>
            <span className="ml-2 font-mono text-xs text-white/45">({profileRow.levelKey})</span>
          </p>
          <p className="mt-4 text-sm text-white/90">
            <span className="text-white/50">Créditos souvenir: </span>
            <strong className="text-sky-200">{profileRow.souvenirCredits}</strong>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/50">
            Créditos simbólicos para futuras recompensas da escola. Sem valor monetário; não permitem compra nem
            resgate nesta fase.
          </p>
          <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/55">
            Quizzes: <strong className="text-white/80">{quizzesPassed}</strong> aprovados
            {quizAttemptsTotal > quizzesPassed ? (
              <span className="text-white/40"> · {quizAttemptsTotal} tentativas no total</span>
            ) : null}
          </p>
        </div>

        <ProfileAvatarEditor
          avatarType={profileRow.avatarType}
          avatarColor={profileRow.avatarColor}
          hatGlyph={
            profileRow.activeHatItem?.active ? profileRow.activeHatItem.displayGlyph : null
          }
          badgeGlyph={
            profileRow.activeBadgeItem?.active ? profileRow.activeBadgeItem.displayGlyph : null
          }
        />

        <ProfileCosmeticsSection
          unlocked={cosmeticRows}
          activeHatItemId={activeHatItemId}
          activeBadgeItemId={activeBadgeItemId}
        />

        <ProfileReferralSection
          referralCode={profileRow.referralCode ?? ensuredReferralCode}
          inviteUrl={inviteUrlAbsolute}
          invitedCount={referralCount}
          referralSouvenirEarned={profileRow.referralSouvenirEarned}
        />

        <ProfileRewardHistory logs={rewardLogs} />

        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-white">Missões</h2>
          <p className="mt-1 text-xs text-white/50">
            Actualizadas ao submeter quizzes e ao ganhar XP ou conquistas — sem cron nem ranking.
          </p>
          {profileRow.userMissionProgresses.length === 0 ? (
            <p className="mt-3 text-sm text-white/55">
              Ainda não há missões configuradas. Execute o seed após o deploy do schema.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {profileRow.userMissionProgresses.map((mp) => {
                const m = mp.mission;
                const done = mp.completedAt != null;
                return (
                  <li
                    key={mp.missionId}
                    className={`rounded-xl border px-3 py-2.5 text-sm ${
                      done ? "border-emerald-500/30 bg-emerald-950/15" : "border-white/10 bg-black/25"
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-white/90">{m.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-white/40">{m.type}</span>
                    </div>
                    {m.description ? (
                      <p className="mt-1 text-xs text-white/55">{m.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs text-white/70">
                      {done ? (
                        <span className="text-emerald-300/90">Concluída</span>
                      ) : (
                        <>
                          Progresso:{" "}
                          <strong>
                            {mp.currentProgress} / {m.targetValue}
                          </strong>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-[11px] text-white/45">
                      Recompensa: +{m.xpReward} XP, +{m.souvenirCreditsReward} créditos souvenir
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
          <h2 className="text-sm font-semibold text-white">Conquistas</h2>
          {profileRow.userAchievements.length === 0 ? (
            <p className="mt-3 text-sm text-white/55">
              Ainda não há conquistas registadas. Aprove quizzes com achievements configurados no campus.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {profileRow.userAchievements.map((ua) => (
                <li
                  key={`${ua.profileId}-${ua.achievementId}`}
                  className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm"
                >
                  <div className="font-medium text-canna-200/95">{ua.achievement.title}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-white/40">{ua.achievement.code}</div>
                  {ua.achievement.description ? (
                    <p className="mt-1 text-xs text-white/55">{ua.achievement.description}</p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-white/45">
                    Desbloqueada em{" "}
                    {ua.unlockedAt.toLocaleString("pt-BR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                  {ua.achievement.xpReward > 0 ? (
                    <p className="mt-1 text-[11px] text-gold-300/90">+{ua.achievement.xpReward} XP</p>
                  ) : null}
                  {ua.achievement.souvenirCredits > 0 ? (
                    <p className="mt-1 text-[11px] text-sky-300/90">
                      +{ua.achievement.souvenirCredits} créditos souvenir
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-xs text-white/45">
          <Link href={CAMPUS_HOME_PATH} className="text-canna-300 hover:text-canna-200 hover:underline">
            ← Voltar ao campus
          </Link>
        </p>
      </div>
    </main>
  );
}
