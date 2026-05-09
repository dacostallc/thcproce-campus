import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin THCProce",
};

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Admin THCProce</h1>
        <p className="mt-2 text-sm text-canna-200/90">Área administrativa ativa</p>
      </div>

      <section
        aria-label="Navegação futura"
        className="rounded-2xl border border-white/10 bg-black/30 p-6 shadow-lg"
      >
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/45">
          Módulos (em breve)
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <Link
              href="/admin/courses"
              className="inline-flex rounded-lg border border-canna-500/35 bg-canna-500/10 px-4 py-3 text-canna-100 transition hover:border-canna-400/50 hover:bg-canna-500/20"
            >
              Cursos
            </Link>
          </li>
          <li>
            <Link
              href="/admin/achievements"
              className="inline-flex rounded-lg border border-canna-500/35 bg-canna-500/10 px-4 py-3 text-canna-100 transition hover:border-canna-400/50 hover:bg-canna-500/20"
            >
              Achievements
            </Link>
          </li>
          <li>
            <Link
              href="/admin/missions"
              className="inline-flex rounded-lg border border-canna-500/35 bg-canna-500/10 px-4 py-3 text-canna-100 transition hover:border-canna-400/50 hover:bg-canna-500/20"
            >
              Missões
            </Link>
          </li>
          <li>
            <Link
              href="/admin/avatar-items"
              className="inline-flex rounded-lg border border-canna-500/35 bg-canna-500/10 px-4 py-3 text-canna-100 transition hover:border-canna-400/50 hover:bg-canna-500/20"
            >
              Cosméticos (avatar)
            </Link>
          </li>
          <li>
            <Link
              href="/admin/referrals"
              className="inline-flex rounded-lg border border-canna-500/35 bg-canna-500/10 px-4 py-3 text-canna-100 transition hover:border-canna-400/50 hover:bg-canna-500/20"
            >
              Indicações (referral)
            </Link>
          </li>
          <li>
            <span
              className="inline-flex cursor-not-allowed items-center rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/45"
              title="Disponível numa fase posterior"
            >
              Loja (futuro)
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
