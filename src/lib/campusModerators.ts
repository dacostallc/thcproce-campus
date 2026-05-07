/** Lista em NEXT_PUBLIC_CAMPUS_MODERATOR_EMAILS (vírgulas). Opcional — usado apenas para identidade visual no mapa. */
export function parseCampusModeratorEmails(): string[] {
  const raw =
    typeof process.env.NEXT_PUBLIC_CAMPUS_MODERATOR_EMAILS === "string"
      ? process.env.NEXT_PUBLIC_CAMPUS_MODERATOR_EMAILS.trim()
      : "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isCampusModeratorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  return norm.length > 0 && parseCampusModeratorEmails().includes(norm);
}
