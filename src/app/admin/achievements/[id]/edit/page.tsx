import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminAchievementEditForm } from "@/components/admin/achievement/AdminAchievementForms";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await prisma.achievement.findUnique({
    where: { id: params.id },
    select: { code: true },
  });
  return { title: row ? `Editar ${row.code}` : "Achievement — Admin" };
}

export default async function AdminEditAchievementPage({ params }: Props) {
  const row = await prisma.achievement.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar achievement</h1>
        <p className="mt-1 font-mono text-xs text-white/40">{row.id}</p>
      </div>
      <AdminAchievementEditForm
        achievementId={row.id}
        code={row.code}
        title={row.title}
        description={row.description}
        xpReward={row.xpReward}
        souvenirCredits={row.souvenirCredits}
      />
      <p className="text-xs text-white/40">
        <Link href="/admin/achievements" className="text-canna-400/90 hover:underline">
          ← Lista
        </Link>
      </p>
    </div>
  );
}
