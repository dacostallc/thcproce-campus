/**
 * Resolução de URLs para vídeos pesados do campus (Bunny Pull Zone / Storage CDN).
 * Next/Vercel = app; mídia grande = CDN — não depender de `public/video/*.mp4` em produção.
 */

export const CAMPUS_DEFAULT_OPENING_MP4 = "cannabis-sem-mito.mp4";

function trimEnv(v: string | undefined): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Produção/staging pode servir `/video/*` de propósito (ex.: preview atrás de VPN). */
export function campusMediaAllowLocalPublicVideo(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    trimEnv(process.env.NEXT_PUBLIC_CAMPUS_MEDIA_ALLOW_LOCAL) === "true"
  );
}

/** Base da Pull Zone (ou prefixo CDN), sem barra final. Vazio se não configurado. */
export function getCampusCdnBaseUrl(): string {
  const raw = trimEnv(process.env.NEXT_PUBLIC_CAMPUS_CDN_BASE_URL);
  if (!raw) return "";
  return raw.replace(/\/+$/, "");
}

/**
 * Monta URL de ficheiro no CDN ou, só em dev / com flag explícita, `/video/...`.
 *
 * @param assetPath — `nome.mp4`, `video/nome.mp4`, `/video/nome.mp4`, ou URL `http(s)://…`
 */
export function getCampusMediaUrl(assetPath: string): string | null {
  const raw = assetPath.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;

  let rel = raw.replace(/^\/+/, "");
  if (rel.startsWith("public/")) rel = rel.slice("public/".length);
  if (rel.startsWith("video/")) rel = rel.slice("video/".length);

  const cdn = getCampusCdnBaseUrl();
  if (cdn) {
    return `${cdn}/${rel}`;
  }

  if (campusMediaAllowLocalPublicVideo()) {
    return `/video/${rel}`;
  }

  return null;
}

/**
 * Interpreta valores de env (`NEXT_PUBLIC_*_VIDEO_SRC`): URL absoluta, path público ou nome de ficheiro.
 */
export function resolveCampusVideoEnvValue(trimmed: string): string | null {
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  if (trimmed.startsWith("/video/")) {
    const inner = trimmed.slice("/video/".length);
    const fromCdn = getCampusMediaUrl(inner);
    if (fromCdn) return fromCdn;
    return campusMediaAllowLocalPublicVideo() ? trimmed : null;
  }

  if (trimmed.startsWith("/")) return trimmed;

  const resolved = getCampusMediaUrl(trimmed);
  if (resolved) return resolved;

  return campusMediaAllowLocalPublicVideo() ? `/video/${trimmed.replace(/^video\//, "")}` : null;
}

/**
 * Abertura Cannabis 101 — cinematográfica.
 * - `NEXT_PUBLIC_CANNABIS101_OPENING_VIDEO_SRC=""` → sem vídeo (só poster).
 * - URL/path explícito → {@link resolveCampusVideoEnvValue}.
 * - Ausente → ficheiro default {@link CAMPUS_DEFAULT_OPENING_MP4} via CDN ou `/video` local (dev).
 */
export function resolveCannabis101OpeningVideoSrc(): string | null {
  const raw = process.env.NEXT_PUBLIC_CANNABIS101_OPENING_VIDEO_SRC;
  if (raw === "") return null;

  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (trimmed.length > 0) {
    return resolveCampusVideoEnvValue(trimmed);
  }

  return getCampusMediaUrl(CAMPUS_DEFAULT_OPENING_MP4);
}

/**
 * Painel HUD «Cinema e ao vivo» — vídeo estático / trailer quando não há live embed.
 * - `NEXT_PUBLIC_CAMPUS_CINEMA_VIDEO_SRC=""` → desliga vídeo no cartão (placeholder só texto).
 * - Ausente → mesmo default que a abertura C101 (útil como trailer único no Bunny).
 */
export function resolveCampusCinemaVideoSrc(): string | null {
  const raw = process.env.NEXT_PUBLIC_CAMPUS_CINEMA_VIDEO_SRC;
  if (raw === "") return null;

  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (trimmed.length > 0) {
    return resolveCampusVideoEnvValue(trimmed);
  }

  return getCampusMediaUrl(CAMPUS_DEFAULT_OPENING_MP4);
}
