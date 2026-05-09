import { redirect } from "next/navigation";

/** Alias: o conteúdo canónico está em `/perfil`. */
export default function CampusPerfilRedirectPage() {
  redirect("/perfil");
}
