import { redirect } from "next/navigation";

/** Alias amigável — mesma experiência que /inscrever-se */
export default function CadastroRedirectPage() {
  redirect("/inscrever-se");
}
