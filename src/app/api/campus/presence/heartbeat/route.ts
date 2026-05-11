import { NextResponse } from "next/server";
import {
  campusLivePresenceOnlineCount,
  listCampusLivePresence,
  upsertCampusLivePresence,
  type CampusLivePresenceRecord
} from "@/server/campus/campusLivePresenceMemory";
import { enrichCampusLivePresenceDto } from "@/lib/campusLivePresenceDto";

export const dynamic = "force-dynamic";

function parseHeartbeat(json: unknown): {
  visitorId: string;
  displayName?: string;
  avatarVariant?: string;
  currentHotspot?: string | null;
  currentArea?: string | null;
  xPct: number;
  yPct: number;
} | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const visitorId = typeof o.visitorId === "string" ? o.visitorId.trim() : "";
  if (visitorId.length < 10 || visitorId.length > 180) return null;
  const xPct = typeof o.xPct === "number" ? o.xPct : Number(o.xPct);
  const yPct = typeof o.yPct === "number" ? o.yPct : Number(o.yPct);
  if (!Number.isFinite(xPct) || !Number.isFinite(yPct)) return null;

  const displayName = typeof o.displayName === "string" ? o.displayName : undefined;
  const avatarVariant = typeof o.avatarVariant === "string" ? o.avatarVariant : undefined;
  const currentHotspot =
    o.currentHotspot === null || o.currentHotspot === undefined
      ? undefined
      : typeof o.currentHotspot === "string"
        ? o.currentHotspot.trim().slice(0, 120) || null
        : undefined;
  const currentArea =
    o.currentArea === null || o.currentArea === undefined
      ? undefined
      : typeof o.currentArea === "string"
        ? o.currentArea.trim().slice(0, 120) || null
        : undefined;

  return {
    visitorId,
    displayName,
    avatarVariant,
    currentHotspot,
    currentArea,
    xPct,
    yPct
  };
}

/**
 * Heartbeat de presença no campus (~10s no cliente).
 * Resposta inclui lista fresca (TTL 30s no servidor) para evitar segundo round-trip.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = parseHeartbeat(json);
  if (!parsed) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  upsertCampusLivePresence({
    visitorId: parsed.visitorId,
    displayName: parsed.displayName,
    avatarVariant: parsed.avatarVariant,
    currentHotspot: parsed.currentHotspot ?? null,
    currentArea: parsed.currentArea ?? null,
    xPct: parsed.xPct,
    yPct: parsed.yPct
  });

  const raw = listCampusLivePresence();
  const online = raw.map(enrichCampusLivePresenceDto);
  const count = campusLivePresenceOnlineCount();

  return NextResponse.json({
    ok: true as const,
    count,
    online,
    serverTime: Date.now()
  });
}
