-- CreateTable
CREATE TABLE "UserCampusProgress" (
    "profileId" TEXT NOT NULL,
    "lastZoneLabel" TEXT,
    "lastLegacyHitId" TEXT,
    "lastBuildingCourseId" TEXT,
    "lastMicroLessonBlueprintId" TEXT,
    "lastPanelKind" TEXT,
    "recommendedZoneLabels" JSONB NOT NULL DEFAULT '[]',
    "favoriteTrailIds" JSONB NOT NULL DEFAULT '[]',
    "navigationHistory" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCampusProgress_pkey" PRIMARY KEY ("profileId")
);

-- CreateTable
CREATE TABLE "UserZoneDiscovery" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "zoneLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'discovered',
    "visitCount" INTEGER NOT NULL DEFAULT 1,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserZoneDiscovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMicroLessonProgress" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    "zoneLabel" TEXT NOT NULL,
    "legacyHitId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "secondsEngaged" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMicroLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserXpLedger" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserXpLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "badgeCode" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserZoneDiscovery_profileId_zoneLabel_key" ON "UserZoneDiscovery"("profileId", "zoneLabel");

-- CreateIndex
CREATE INDEX "UserZoneDiscovery_profileId_idx" ON "UserZoneDiscovery"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMicroLessonProgress_profileId_blueprintId_key" ON "UserMicroLessonProgress"("profileId", "blueprintId");

-- CreateIndex
CREATE INDEX "UserMicroLessonProgress_profileId_zoneLabel_idx" ON "UserMicroLessonProgress"("profileId", "zoneLabel");

-- CreateIndex
CREATE INDEX "UserXpLedger_profileId_createdAt_idx" ON "UserXpLedger"("profileId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_profileId_badgeCode_key" ON "UserBadge"("profileId", "badgeCode");

-- CreateIndex
CREATE INDEX "UserBadge_profileId_idx" ON "UserBadge"("profileId");

-- AddForeignKey
ALTER TABLE "UserCampusProgress" ADD CONSTRAINT "UserCampusProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserZoneDiscovery" ADD CONSTRAINT "UserZoneDiscovery_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMicroLessonProgress" ADD CONSTRAINT "UserMicroLessonProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserXpLedger" ADD CONSTRAINT "UserXpLedger_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
