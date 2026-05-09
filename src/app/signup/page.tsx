import { redirect } from "next/navigation";

type Props = { searchParams: Record<string, string | string[] | undefined> };

/** Alias em inglês → mesma inscrição com `?ref=`. */
export default function SignupPage({ searchParams }: Props) {
  const raw = searchParams.ref;
  const ref = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const q = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  redirect(`/inscrever-se${q}`);
}
