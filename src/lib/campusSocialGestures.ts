const ALLOWED_GESTURE_EMOJI = new Set(["👋", "✋", "🙌", "👍", "✨", "🔥", "😊", "💚"]);

export type CampusSocialGestureKind = "wave" | "salve" | "emoji";

export function isAllowedCampusSocialGestureEmoji(s: string): boolean {
  return ALLOWED_GESTURE_EMOJI.has(s);
}

export function campusSocialGestureVerbPt(kind: CampusSocialGestureKind): string {
  switch (kind) {
    case "wave":
      return "acenou";
    case "salve":
      return "mandou um salve";
    case "emoji":
      return "reagiu";
    default:
      return "interagiu";
  }
}
