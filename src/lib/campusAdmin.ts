/**
 * Lista em NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS (vírgulas).
 * Bypass total do mapa: áreas, founder, construção — só estes e-mails logados.
 */
export function parseCampusAdminEmails(): string[] {
  const raw =
    typeof process.env.NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS === "string"
      ? process.env.NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS.trim()
      : "";
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isCampusAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const norm = email.trim().toLowerCase();
  if (!norm) return false;
  return parseCampusAdminEmails().includes(norm);
}
