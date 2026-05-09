import { headers } from "next/headers";

/** Origem pública para montar links de convite no servidor (evita depender de env). */
export function serverSiteOrigin(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  if (!host) return "";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}
