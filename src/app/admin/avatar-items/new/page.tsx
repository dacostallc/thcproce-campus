import type { Metadata } from "next";
import Link from "next/link";

import { AdminAvatarItemCreateForm } from "@/components/admin/avatarItem/AdminAvatarItemForms";

export const metadata: Metadata = { title: "Novo item de avatar — Admin" };

export default function AdminNewAvatarItemPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo item cosmético</h1>
      </div>
      <AdminAvatarItemCreateForm />
      <p className="text-xs text-white/40">
        <Link href="/admin/avatar-items" className="text-canna-400/90 hover:underline">
          ← Lista
        </Link>
      </p>
    </div>
  );
}
