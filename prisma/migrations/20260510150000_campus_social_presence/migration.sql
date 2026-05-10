-- Presença social leve no campus (polling + preferências em Profile).

ALTER TABLE "Profile" ADD COLUMN "campusSocialVisibility" TEXT NOT NULL DEFAULT 'name';
ALTER TABLE "Profile" ADD COLUMN "campusSocialStatusLight" TEXT NOT NULL DEFAULT 'exploring';

CREATE TABLE "CampusSocialPresence" (
    "profileId" TEXT NOT NULL,
    "visibilitySnapshot" TEXT NOT NULL DEFAULT 'name',
    "statusLight" TEXT NOT NULL DEFAULT 'exploring',
    "currentZoneLabel" TEXT,
    "avatarUrl" TEXT,
    "displayNameSnapshot" TEXT,
    "peerToken" TEXT NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampusSocialPresence_pkey" PRIMARY KEY ("profileId")
);

CREATE UNIQUE INDEX "CampusSocialPresence_peerToken_key" ON "CampusSocialPresence"("peerToken");
CREATE INDEX "CampusSocialPresence_lastSeenAt_idx" ON "CampusSocialPresence"("lastSeenAt");
CREATE INDEX "CampusSocialPresence_currentZoneLabel_lastSeenAt_idx" ON "CampusSocialPresence"("currentZoneLabel", "lastSeenAt");

ALTER TABLE "CampusSocialPresence" ADD CONSTRAINT "CampusSocialPresence_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "CampusSocialGesture" (
    "id" TEXT NOT NULL,
    "fromProfileId" TEXT NOT NULL,
    "toProfileId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "emoji" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampusSocialGesture_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CampusSocialGesture_toProfileId_createdAt_idx" ON "CampusSocialGesture"("toProfileId", "createdAt");
CREATE INDEX "CampusSocialGesture_fromProfileId_createdAt_idx" ON "CampusSocialGesture"("fromProfileId", "createdAt");
