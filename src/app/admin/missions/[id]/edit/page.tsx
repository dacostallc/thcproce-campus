import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminMissionEditForm } from "@/components/admin/mission/AdminMissionForms";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await prisma.mission.findUnique({
    where: { id: params.id },
    select: { code: true },
  });
  return { title: row ? `Editar ${row.code}` : "Missão — Admin" };
}

export default async function AdminEditMissionPage({ params }: Props) {
  const row = await prisma.mission.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar missão</h1>
        <p className="mt-1 font-mono text-xs text-white/40">{row.id}</p>
      </div>
      <AdminMissionEditForm
        missionId={row.id}
        code={row.code}
        title={row.title}
        description={row.description}
        type={row.type}
        targetValue={row.targetValue}
        xpReward={row.xpReward}
        souvenirCreditsReward={row.souvenirCreditsReward}
        active={row.active}
      />
      <p className="text-xs text-white/40">
        <Link href="/admin/missions" className="text-canna-400/90 hover:underline">
          ← Lista
        </Link>
      </p>
    </div>
  );
}
