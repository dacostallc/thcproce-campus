import type { OAuthConfig } from "next-auth/providers/oauth";

type MoodleProfile = {
  sub?: string;
  id?: string | number;
  email?: string;
  preferred_username?: string;
  name?: string;
};

function mapProfile(raw: MoodleProfile) {
  const emailRaw = raw.email ?? raw.preferred_username;
  const email = typeof emailRaw === "string" && emailRaw.includes("@") ? emailRaw : undefined;
  const id = raw.sub ?? (raw.id != null ? String(raw.id) : email ?? "moodle-user");
  const name = raw.name ?? email?.split("@")[0]?.replace(/\./g, " ") ?? "Aluno Moodle";
  return { id, email, name };
}

/**
 * SSO opcional contra um IdP compatível com OpenID Discovery ou endpoints OAuth2 manuais
 * (Moodle via plugin servidor OAuth/OIDC ou proxy externo, Keycloak ao lado do Moodle, etc.).
 */
export function moodleOAuthProvider(): OAuthConfig<MoodleProfile> | null {
  const clientId = process.env.MOODLE_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.MOODLE_OAUTH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  const discovery = process.env.MOODLE_OIDC_DISCOVERY_URL?.trim();
  const issuer = process.env.MOODLE_OIDC_ISSUER?.trim()?.replace(/\/$/, "");

  const authManual = process.env.MOODLE_OAUTH_AUTHORIZATION_URL?.trim();
  const tokenManual = process.env.MOODLE_OAUTH_TOKEN_URL?.trim();
  const userManual = process.env.MOODLE_OAUTH_USERINFO_URL?.trim();

  const wellKnown =
    discovery ?? (issuer ? `${issuer}/.well-known/openid-configuration` : "");

  const providerName =
    process.env.MOODLE_OAUTH_PROVIDER_NAME?.trim() || "Moodle THCProce";

  const scope =
    process.env.MOODLE_OAUTH_SCOPES?.trim() ?? "openid email profile";

  if (wellKnown) {
    return {
      id: "moodle",
      name: providerName,
      type: "oauth",
      wellKnown,
      clientId,
      clientSecret,
      authorization: { params: { scope } },
      profile: mapProfile
    };
  }

  if (authManual && tokenManual && userManual) {
    return {
      id: "moodle",
      name: providerName,
      type: "oauth",
      clientId,
      clientSecret,
      authorization: { url: authManual, params: { scope } },
      token: tokenManual,
      userinfo: userManual,
      profile: mapProfile
    };
  }

  return null;
}
