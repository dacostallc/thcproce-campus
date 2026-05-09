import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Achievements — Admin" };

export default async function AdminAchievementsPage() {
  const rows = await prisma.achievement.findMany({
    orderBy: { code: "asc" },
    select: { id: true, code: true, title: true, xpReward: true, souvenirCredits: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Achievements</h1>
          <p className="mt-1 text-sm text-white/55">
            Códigos com critérios automáticos: FIRST_QUIZ_PASSED, QUIZ_PASSED (2+ aprovações), XP_100,
            XP_500, XP_1000.
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white hover:bg-canna-500"
        >
          Novo achievement
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-white/50">Ainda não há achievements — crie pelo menos os códigos acima.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/achievements/${a.id}/edit`}
                className="block rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm hover:border-white/20"
              >
                <span className="font-mono text-xs text-canna-300/90">{a.code}</span>
                <span className="mt-0.5 block font-medium text-white">{a.title}</span>
                <span className="mt-1 block text-xs text-white/45">
                  XP: {a.xpReward}
                  {a.souvenirCredits > 0 ? ` · Souvenirs: ${a.souvenirCredits}` : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-white/40">
        <Link href="/admin" className="text-canna-400/90 hover:underline">
          ← Admin
        </Link>
      </p>
    </div>
  );
}
