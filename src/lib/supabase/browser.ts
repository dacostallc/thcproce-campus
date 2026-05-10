"use client";

import { createBrowserClient } from "@supabase/ssr";

/** True when browser Realtime/Presence can be used (missing env → callers stay on local/offline paths). */
export function isSupabaseBrowserConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && anon);
}

export function createSupabaseBrowser() {
  if (!isSupabaseBrowserConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();
  return createBrowserClient(url, anon);
}
