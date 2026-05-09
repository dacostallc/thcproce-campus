import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Missões — Admin" };

export default async function AdminMissionsPage() {
  const rows = await prisma.mission.findMany({
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      title: true,
      type: true,
      targetValue: true,
      xpReward: true,
      souvenirCreditsReward: true,
      active: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Missões</h1>
          <p className="mt-1 text-sm text-white/55">
            Criar e editar missões (o seed continua válido; pode complementar aqui). Sem loja nem resgate.
          </p>
        </div>
        <Link
          href="/admin/missions/new"
          className="rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white hover:bg-canna-500"
        >
          Nova missão
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-white/50">Ainda não há missões. Crie uma ou execute o seed.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/missions/${m.id}/edit`}
                className="block rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm hover:border-white/20"
              >
                <span className="font-mono text-xs text-canna-300/90">{m.code}</span>
                <span className="mt-0.5 block font-medium text-white">{m.title}</span>
                <span className="mt-1 block text-xs text-white/45">
                  {m.type} · alvo {m.targetValue} · +{m.xpReward} XP · +{m.souvenirCreditsReward} souvenirs ·{" "}
                  {m.active ? "activa" : "inactiva"}
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
