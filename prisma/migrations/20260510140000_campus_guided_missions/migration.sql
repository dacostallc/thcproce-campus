-- THCProce Campus — progresso das missões guiadas (orientação / onboarding vivo).

CREATE TABLE "CampusMissionProgress" (
    "profileId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "progressCurrent" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "rewardClaimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampusMissionProgress_pkey" PRIMARY KEY ("profileId","missionId")
);

CREATE INDEX "CampusMissionProgress_profileId_idx" ON "CampusMissionProgress"("profileId");

ALTER TABLE "CampusMissionProgress" ADD CONSTRAINT "CampusMissionProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
