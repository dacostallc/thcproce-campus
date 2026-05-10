import { redirect } from "next/navigation";

function firstParam(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
}

/** Alias canónico: mesma experiência que `/entrar` (credenciais NextAuth). */
export default function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const qs = new URLSearchParams();
  const callbackUrl = firstParam(searchParams?.callbackUrl);
  const ref = firstParam(searchParams?.ref);
  if (callbackUrl) qs.set("callbackUrl", callbackUrl);
  if (ref) qs.set("ref", ref);
  const q = qs.toString();
  redirect(q ? `/entrar?${q}` : "/entrar");
}
