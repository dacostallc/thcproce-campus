import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminAvatarItemEditForm } from "@/components/admin/avatarItem/AdminAvatarItemForms";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const row = await prisma.avatarItem.findUnique({
    where: { id: params.id },
    select: { code: true },
  });
  return { title: row ? `Editar ${row.code}` : "Item avatar — Admin" };
}

export default async function AdminEditAvatarItemPage({ params }: Props) {
  const row = await prisma.avatarItem.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Editar item cosmético</h1>
        <p className="mt-1 font-mono text-xs text-white/40">{row.id}</p>
      </div>
      <AdminAvatarItemEditForm
        avatarItemId={row.id}
        code={row.code}
        title={row.name}
        description={row.description}
        type={row.type}
        displayGlyph={row.displayGlyph}
        unlockAchievementCode={row.unlockAchievementCode}
        active={row.active}
      />
      <p className="text-xs text-white/40">
        <Link href="/admin/avatar-items" className="text-canna-400/90 hover:underline">
          ← Lista
        </Link>
      </p>
    </div>
  );
}
