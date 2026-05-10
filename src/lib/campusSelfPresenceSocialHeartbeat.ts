import type { CampusSelfPresenceStatus } from "@/lib/campusWalkEstimate";
import type { CampusSocialStatusLight } from "@/types/campusSocialPresence";

/** Espelha estado fino do cliente para o heartbeat social (Prisma — polling dos outros). */
export function campusSelfPresenceStatusToSocialLight(
  s: CampusSelfPresenceStatus
): CampusSocialStatusLight {
  switch (s) {
    case "idle":
      return "rest";
    case "walking":
      return "exploring";
    case "cinema":
      return "cinema";
    case "lesson":
      return "studying";
    default:
      return "exploring";
  }
}
