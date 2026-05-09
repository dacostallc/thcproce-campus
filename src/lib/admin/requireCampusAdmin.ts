import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/options";
import { isCampusAdminEmail } from "@/lib/campusAdmin";

/**
 * Garante sessão NextAuth e e-mail em NEXT_PUBLIC_CAMPUS_ADMIN_EMAILS.
 * Sem sessão → /entrar com retorno a /admin. Logado mas não admin → 404 (sem revelar rota).
 */
export async function requireCampusAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    redirect(`/entrar?callbackUrl=${encodeURIComponent("/admin")}`);
  }
  if (!isCampusAdminEmail(email)) {
    notFound();
  }
  return { session, email };
}
