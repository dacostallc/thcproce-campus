import { randomBytes } from "crypto";
import {
  campusZonePublicTitle,
  type CampusMapZoneLabel
} from "@/data/campusMicroLessonContext";
import {
  CAMPUS_SOCIAL_ZONE_ANCHOR_PCT,
  campusSocialPeerDotOffset
} from "@/config/campusSocialZoneAnchors";
import {
  campusSocialGestureVerbPt,
  isAllowedCampusSocialGestureEmoji,
  type CampusSocialGestureKind
} from "@/lib/campusSocialGestures";
import {
  CAMPUS_SOCIAL_STATUS_LABELS_PT,
  parseCampusSocialStatusLight,
  parseCampusSocialVisibility,
  type CampusSocialStatusLight,
  type CampusSocialVisibility
} from "@/types/campusSocialPresence";
import { prisma } from "@/server/db";
import { levelFromXp } from "@/server/gamification";

export const CAMPUS_SOCIAL_PRESENCE_TTL_MS = 58_000;

function safeDisplaySnapshot(profileDisplay: string | null, sessionName: string | null): string {
  const cand = (profileDisplay?.trim() || sessionName?.trim() || "Colega").slice(0, 28);
  if (cand.includes("@")) return "Colega";
  return cand || "Colega";
}

function peerPublicLabel(
  visibilitySnapshot: CampusSocialVisibility,
  displayNameSnapshot: string | null,
  peerToken: string
): string {
  if (visibilitySnapshot === "anonymous") {
    return `Colega · ${peerToken.slice(-4)}`;
  }
  return (displayNameSnapshot ?? "Colega").slice(0, 24);
}

export async function campusSocialHeartbeat(opts: {
  profileId: string;
  sessionDisplayName: string | null;
  sessionImage: string | null;
  currentZoneLabel: string | null | undefined;
  statusLightOverride?: CampusSocialStatusLight | undefined;
}): Promise<{ ok: true; peerToken: string | null }> {
  const profile = await prisma.profile.findUnique({
    where: { id: opts.profileId },
    select: {
      displayName: true,
      campusSocialVisibility: true,
      campusSocialStatusLight: true
    }
  });
  if (!profile) return { ok: true, peerToken: null };

  const visibility = parseCampusSocialVisibility(profile.campusSocialVisibility);
  const statusLight =
    opts.statusLightOverride ?? parseCampusSocialStatusLight(profile.campusSocialStatusLight);

  const snapshotName = safeDisplaySnapshot(profile.displayName, opts.sessionDisplayName);

  if (visibility === "hidden") {
    await prisma.campusSocialPresence.deleteMany({ where: { profileId: opts.profileId } });
    return { ok: true, peerToken: null };
  }

  const avatarUrl =
    typeof opts.sessionImage === "string" && /^https?:\/\//i.test(opts.sessionImage.trim())
      ? opts.sessionImage.trim().slice(0, 500)
      : null;

  const zone =
    typeof opts.currentZoneLabel === "string" && opts.currentZoneLabel.trim().length >= 2
      ? opts.currentZoneLabel.trim().slice(0, 64)
      : null;

  const existing = await prisma.campusSocialPresence.findUnique({
    where: { profileId: opts.profileId },
    select: { peerToken: true }
  });

  const peerToken = existing?.peerToken ?? randomBytes(18).toString("base64url");

  await prisma.campusSocialPresence.upsert({
    where: { profileId: opts.profileId },
    create: {
      profileId: opts.profileId,
      visibilitySnapshot: visibility,
      statusLight,
      currentZoneLabel: zone,
      avatarUrl,
      displayNameSnapshot: snapshotName,
      peerToken
    },
    update: {
      visibilitySnapshot: visibility,
      statusLight,
      currentZoneLabel: zone,
      avatarUrl,
      displayNameSnapshot: snapshotName,
      peerToken: existing?.peerToken ?? peerToken
    }
  });

  return { ok: true, peerToken };
}

export type CampusSocialPollPayload = {
  registeredOnlineCount: number;
  othersVisibleCount: number;
  peers: Array<{
    peerToken: string;
    displayLabel: string;
    zoneLabel: string | null;
    zoneTitlePt: string;
    statusLight: CampusSocialStatusLight;
    statusLabelPt: string;
    levelLabel: string;
    avatarUrl: string | null;
    xPct: number;
    yPct: number;
  }>;
  zoneSummary: Array<{ zoneLabel: string; zoneTitlePt: string; count: number }>;
  incomingGestures: Array<{
    id: string;
    fromLabel: string;
    verbPt: string;
    emoji: string | null;
    createdAt: string;
  }>;
  myVisibility: CampusSocialVisibility;
  myStatusLight: CampusSocialStatusLight;
};

export async function campusSocialPoll(opts: {
  profileId: string;
}): Promise<CampusSocialPollPayload> {
  const cutoff = new Date(Date.now() - CAMPUS_SOCIAL_PRESENCE_TTL_MS);

  await prisma.campusSocialGesture.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - 600_000) } }
  });

  const me = await prisma.profile.findUnique({
    where: { id: opts.profileId },
    select: {
      campusSocialVisibility: true,
      campusSocialStatusLight: true
    }
  });

  const myVisibility = parseCampusSocialVisibility(me?.campusSocialVisibility);
  const myStatusLight = parseCampusSocialStatusLight(me?.campusSocialStatusLight);

  const registeredOnlineCount = await prisma.campusSocialPresence.count({
    where: {
      lastSeenAt: { gte: cutoff },
      visibilitySnapshot: { not: "hidden" }
    }
  });

  const rows = await prisma.campusSocialPresence.findMany({
    where: {
      lastSeenAt: { gte: cutoff },
      visibilitySnapshot: { not: "hidden" },
      NOT: { profileId: opts.profileId }
    },
    select: {
      peerToken: true,
      visibilitySnapshot: true,
      statusLight: true,
      currentZoneLabel: true,
      avatarUrl: true,
      displayNameSnapshot: true,
      profile: { select: { xpTotal: true } }
    }
  });

  const peers = rows.map((r) => {
    const vis = parseCampusSocialVisibility(r.visibilitySnapshot);
    const statusLight = parseCampusSocialStatusLight(r.statusLight);
    const zoneLabel = r.currentZoneLabel;
    const zoneTitlePt = zoneLabel ? campusZonePublicTitle(zoneLabel) : "Campus";
    const lvl = levelFromXp(r.profile.xpTotal);

    const off = campusSocialPeerDotOffset(r.peerToken);
    let xPct = 50 + off.dx;
    let yPct = 42 + off.dy;
    if (
      zoneLabel &&
      Object.prototype.hasOwnProperty.call(CAMPUS_SOCIAL_ZONE_ANCHOR_PCT, zoneLabel)
    ) {
      const anchor = CAMPUS_SOCIAL_ZONE_ANCHOR_PCT[zoneLabel as CampusMapZoneLabel];
      xPct = anchor.xPct + off.dx;
      yPct = anchor.yPct + off.dy;
    }

    return {
      peerToken: r.peerToken,
      displayLabel: peerPublicLabel(vis, r.displayNameSnapshot, r.peerToken),
      zoneLabel,
      zoneTitlePt,
      statusLight,
      statusLabelPt: CAMPUS_SOCIAL_STATUS_LABELS_PT[statusLight],
      levelLabel: lvl.label.slice(0, 28),
      avatarUrl: r.avatarUrl,
      xPct,
      yPct
    };
  });

  const zoneMap = new Map<string, number>();
  for (const p of peers) {
    const key = p.zoneLabel ?? "__campus__";
    zoneMap.set(key, (zoneMap.get(key) ?? 0) + 1);
  }

  const zoneSummary = [...zoneMap.entries()]
    .map(([zoneLabel, count]) => ({
      zoneLabel,
      zoneTitlePt:
        zoneLabel === "__campus__"
          ? "Sem zona definida"
          : campusZonePublicTitle(zoneLabel),
      count
    }))
    .sort((a, b) => b.count - a.count);

  const gestureCutoff = new Date(Date.now() - 180_000);
  const gesturesRaw = await prisma.campusSocialGesture.findMany({
    where: { toProfileId: opts.profileId, createdAt: { gte: gestureCutoff } },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      fromProfileId: true,
      kind: true,
      emoji: true,
      createdAt: true
    }
  });

  const incomingGestures: CampusSocialPollPayload["incomingGestures"] = [];

  const fromIds = [...new Set(gesturesRaw.map((g) => g.fromProfileId))];
  const fromPresences =
    fromIds.length === 0
      ? []
      : await prisma.campusSocialPresence.findMany({
          where: { profileId: { in: fromIds } },
          select: {
            profileId: true,
            visibilitySnapshot: true,
            displayNameSnapshot: true,
            peerToken: true
          }
        });
  const presMap = new Map(fromPresences.map((p) => [p.profileId, p]));

  for (const g of gesturesRaw) {
    const fp = presMap.get(g.fromProfileId);
    const vis = parseCampusSocialVisibility(fp?.visibilitySnapshot ?? "name");
    const fromLabel = fp
      ? peerPublicLabel(vis, fp.displayNameSnapshot, fp.peerToken)
      : "Colega";
    const kind = g.kind as CampusSocialGestureKind;
    incomingGestures.push({
      id: g.id,
      fromLabel,
      verbPt: campusSocialGestureVerbPt(kind),
      emoji: g.emoji,
      createdAt: g.createdAt.toISOString()
    });
  }

  return {
    registeredOnlineCount,
    othersVisibleCount: peers.length,
    peers,
    zoneSummary,
    incomingGestures,
    myVisibility,
    myStatusLight
  };
}

export async function campusSocialUpdatePrefs(opts: {
  profileId: string;
  visibility?: CampusSocialVisibility;
  statusLight?: CampusSocialStatusLight;
}): Promise<{ ok: true }> {
  const data: Record<string, string> = {};
  if (opts.visibility !== undefined) data.campusSocialVisibility = opts.visibility;
  if (opts.statusLight !== undefined) data.campusSocialStatusLight = opts.statusLight;
  if (!Object.keys(data).length) return { ok: true };

  await prisma.profile.update({
    where: { id: opts.profileId },
    data
  });

  if (opts.visibility === "hidden") {
    await prisma.campusSocialPresence.deleteMany({ where: { profileId: opts.profileId } });
  }

  return { ok: true };
}

export async function campusSocialSendGesture(opts: {
  fromProfileId: string;
  targetPeerToken: string;
  kind: CampusSocialGestureKind;
  emoji?: string | null;
}): Promise<{ ok: true }> {
  const since = new Date(Date.now() - 60_000);
  const burst = await prisma.campusSocialGesture.count({
    where: { fromProfileId: opts.fromProfileId, createdAt: { gte: since } }
  });
  if (burst > 14) {
    throw new Error("RATE_LIMIT_GESTURES");
  }

  const target = await prisma.campusSocialPresence.findUnique({
    where: { peerToken: opts.targetPeerToken },
    select: { profileId: true, visibilitySnapshot: true }
  });
  if (!target || target.visibilitySnapshot === "hidden") {
    throw new Error("TARGET_UNAVAILABLE");
  }
  if (target.profileId === opts.fromProfileId) {
    throw new Error("SELF_TARGET");
  }

  let emojiOut: string | null = null;
  if (opts.kind === "emoji") {
    const e = opts.emoji?.trim() ?? "";
    if (!isAllowedCampusSocialGestureEmoji(e)) throw new Error("BAD_EMOJI");
    emojiOut = e;
  }

  await prisma.campusSocialGesture.create({
    data: {
      fromProfileId: opts.fromProfileId,
      toProfileId: target.profileId,
      kind: opts.kind,
      emoji: emojiOut
    }
  });

  return { ok: true };
}
