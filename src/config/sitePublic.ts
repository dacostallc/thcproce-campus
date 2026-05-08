/**
 * Origem canónica do site Next — Open Graph, metadataBase e links públicos absolutos opcionais.
 * Preferência: NEXTAUTH_URL (deve igualar ao domínio público em produção).
 * Opcional: AUTH_URL com o mesmo valor quando migrar para Auth.js v5.
 */
export function siteCanonicalOrigin(): string {
  const fromAuth =
    typeof process.env.NEXTAUTH_URL === "string"
      ? process.env.NEXTAUTH_URL.trim().replace(/\/$/, "")
      : "";
  if (fromAuth.startsWith("http")) return fromAuth;

  const pub =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/$/, "")
      : "";
  if (pub.startsWith("http")) return pub;

  return "https://thcproce.com.br";
}
