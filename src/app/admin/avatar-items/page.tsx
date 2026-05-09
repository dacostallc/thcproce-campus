import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Itens de avatar — Admin" };

export default async function AdminAvatarItemsPage() {
  const rows = await prisma.avatarItem.findMany({
    orderBy: { code: "asc" },
    select: {
      id: true,
      code: true,
      name: true,
      type: true,
      displayGlyph: true,
      unlockAchievementCode: true,
      active: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Itens cosméticos (avatar)</h1>
          <p className="mt-1 text-sm text-white/55">
            Chapéus e insígnias por emoji. Desbloqueio opcional por código de achievement. Sem loja nem upload.
          </p>
        </div>
        <Link
          href="/admin/avatar-items/new"
          className="rounded-xl bg-canna-600 px-4 py-2 text-sm font-semibold text-white hover:bg-canna-500"
        >
          Novo item
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-white/50">Ainda não há itens. Crie um ou execute o seed.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/avatar-items/${item.id}/edit`}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm hover:border-white/20"
              >
                <span className="text-2xl" aria-hidden>
                  {item.displayGlyph}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-xs text-canna-300/90">{item.code}</span>
                  <span className="mt-0.5 block font-medium text-white">{item.name}</span>
                  <span className="mt-1 block text-xs text-white/45">
                    {item.type}
                    {item.unlockAchievementCode ? ` · desbloqueio: ${item.unlockAchievementCode}` : " · sem desbloqueio automático"}
                    {" · "}
                    {item.active ? "activo" : "inactivo"}
                  </span>
                </div>
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
