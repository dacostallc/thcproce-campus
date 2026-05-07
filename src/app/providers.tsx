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

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const [client] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({ enabled: () => process.env.NODE_ENV === "development" }),
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
