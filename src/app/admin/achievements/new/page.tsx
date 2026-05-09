import type { Metadata } from "next";
import Link from "next/link";

import { AdminAchievementCreateForm } from "@/components/admin/achievement/AdminAchievementForms";

export const metadata: Metadata = { title: "Novo achievement — Admin" };

export default function AdminNewAchievementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo achievement</h1>
      </div>
      <AdminAchievementCreateForm />
      <p className="text-xs text-white/40">
        <Link href="/admin/achievements" className="text-canna-400/90 hover:underline">
          ← Lista
        </Link>
      </p>
    </div>
  );
}
