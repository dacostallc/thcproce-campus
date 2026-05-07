import type { CampusRealtimePayload } from "@/lib/campusCinemaSeats";
import {
  collectOccupiedCinemaSeatIndices,
  estimateCampusWalkMs,
  getSeatPositionForIndex,
  pickFreeCinemaSeat,
  pickStandingSpotForFullHouse
} from "@/lib/campusCinemaSeats";
import { scheduleCinemaSitAfterWalk } from "@/lib/campusCinemaSitTimer";
import type { AvatarPosture, PctPos } from "@/stores/campusStore";

/** Encaminha avatar para lugar no auditório e abre o Cine THCProce — idêntico ao clique no telão. */
export function enterCampusLiveAuditorium(opts: {
  othersByUid: Record<string, CampusRealtimePayload>;
  player: PctPos;
  setPlayer: (p: PctPos) => void;
  setAvatarPosture: (p: AvatarPosture) => void;
  setCinemaSeatIndex: (i: number | null) => void;
  setCinemaAuditoriumFull: (v: boolean) => void;
  setIsCineOpen: (open: boolean) => void;
}) {
  const occupied = collectOccupiedCinemaSeatIndices(opts.othersByUid);
  const seat = pickFreeCinemaSeat(occupied);

  opts.setAvatarPosture("stand");

  if (seat !== null) {
    opts.setCinemaAuditoriumFull(false);
    const target = getSeatPositionForIndex(seat);
    opts.setCinemaSeatIndex(seat);
    const ms = estimateCampusWalkMs(opts.player, target);
    opts.setPlayer(target);
    scheduleCinemaSitAfterWalk(ms);
  } else {
    opts.setCinemaAuditoriumFull(true);
    opts.setCinemaSeatIndex(null);
    const target = pickStandingSpotForFullHouse(opts.player);
    const ms = estimateCampusWalkMs(opts.player, target);
    opts.setPlayer(target);
  }

  opts.setIsCineOpen(true);
}
