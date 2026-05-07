/**
 * Inicialização leve do Sentry — só ativa com NEXT_PUBLIC_SENTRY_DSN.
 * Evita exigir wrap do next.config em ambientes sem DSN.
 */
export function initSentryClient() {
  if (typeof window === "undefined") return;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      integrations: [],
      enabled: !!dsn
    });
  });
}
