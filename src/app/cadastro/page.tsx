import { redirect } from "next/navigation";

type Props = { searchParams: Record<string, string | string[] | undefined> };

/** Alias amigável — mesma experiência que /inscrever-se (preserva `?ref=`). */
export default function CadastroRedirectPage({ searchParams }: Props) {
  const raw = searchParams.ref;
  const ref = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
  const q = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  redirect(`/inscrever-se${q}`);
}
