"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";
import { trpc } from "@/lib/trpc/react";
import { initSentryClient } from "@/lib/sentry";
function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3030}`;
}

const trpcDebugLogs =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_TRPC_DEBUG === "true";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * 60 s: dados considerados frescos por 1 minuto após o fetch.
             * Evita round-trips redundantes ao re-montar painéis ou trocar de aba.
             * Per-query overrides (ex.: myBadges com 120 000) continuam válidos.
             */
            staleTime: 60_000,
            /** 5 min em memória antes do garbage-collector limpar dados não usados. */
            gcTime: 5 * 60_000,
            /** Sem refetch automático ao recuperar foco da janela/aba. */
            refetchOnWindowFocus: false,
            /** Uma única tentativa de retry — falhas aparecem rapidamente. */
            retry: 1,
          },
        },
      }),
  );
  const [client] = useState(() =>
    trpc.createClient({
      links: [
        /** Logs «query #…» só quando `NEXT_PUBLIC_TRPC_DEBUG=true` — sem `loggerLink` no bundle por defeito. */
        ...(trpcDebugLogs ? [loggerLink({ enabled: () => true })] : []),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson
        })
      ]
    })
  );

  useEffect(() => {
    initSentryClient();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* PWA opcional */
    });
  }, []);

  return (
    <SessionProvider>
      <trpc.Provider client={client} queryClient={qc}>
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
}
