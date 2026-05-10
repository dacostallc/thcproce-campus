"use client";

import { useEffect, useState } from "react";

/**
 * `false` durante SSR e na primeira pintura no cliente; `true` após montagem.
 * Usar para evitar ler `localStorage` ou formatos dependentes de locale/fuso no render inicial.
 */
export function useClientHydrated(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return ready;
}
