import Link from "next/link";

import { requireCampusAdmin } from "@/lib/admin/requireCampusAdmin";

/** Auth + Prisma nas rotas admin — não pré-renderizar no `next build`. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireCampusAdmin();

  return (
    <div className="min-h-screen bg-ink-900 text-canna-50 antialiased">
      <header className="border-b border-white/10 bg-black/25">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-canna-400/90">
            THCProce — Admin
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/courses"
              className="text-xs text-white/55 transition hover:text-canna-200 hover:underline"
            >
              Cursos
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/admin/achievements"
              className="text-xs text-white/55 transition hover:text-canna-200 hover:underline"
            >
              Achievements
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/admin/missions"
              className="text-xs text-white/55 transition hover:text-canna-200 hover:underline"
            >
              Missões
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/admin/avatar-items"
              className="text-xs text-white/55 transition hover:text-canna-200 hover:underline"
            >
              Cosméticos
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/admin/referrals"
              className="text-xs text-white/55 transition hover:text-canna-200 hover:underline"
            >
              Indicações
            </Link>
            <span className="text-white/25">·</span>
            <Link
              href="/campus"
              className="text-xs text-white/55 transition hover:text-canna-200 hover:underline"
            >
              Campus
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
