import crypto from "crypto";

/**
 * Embed Bunny Stream com token de visualização ativado na biblioteca.
 * @see https://docs.bunny.net/docs/stream-token-authentication
 */
export function signedBunnyStreamEmbedUrl(
  libraryId: string,
  videoId: string,
  tokenSecurityKey: string,
  ttlSeconds: number
): string {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;
  const raw = `${tokenSecurityKey}${videoId}${expires}`;
  const token = crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  const u = new URL(
    `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`
  );
  u.searchParams.set("token", token);
  u.searchParams.set("expires", String(expires));
  u.searchParams.set("autoplay", "false");
  u.searchParams.set("preload", "true");
  return u.toString();
}
