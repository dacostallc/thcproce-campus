import { NextResponse } from "next/server";
import {
  campusLivePresenceOnlineCount,
  listCampusLivePresence
} from "@/server/campus/campusLivePresenceMemory";
import { enrichCampusLivePresenceDto } from "@/lib/campusLivePresenceDto";

export const dynamic = "force-dynamic";

export async function GET() {
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
