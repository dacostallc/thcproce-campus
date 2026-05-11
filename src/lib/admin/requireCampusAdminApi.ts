import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { isCampusAdminEmail } from "@/lib/campusAdmin";

/** Para Route Handlers: retorna JSON 401/403 ou null se admin autenticado. */
export async function requireCampusAdminApi(): Promise<Response | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) {
    return Response.json({ error: "Inicie sessão como administrador do campus." }, { status: 401 });
  }
  if (!isCampusAdminEmail(email)) {
    return Response.json({ error: "Acesso reservado a administradores." }, { status: 403 });
  }
  return null;
}
