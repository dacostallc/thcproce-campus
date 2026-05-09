import type { Metadata } from "next";
import Link from "next/link";

import { AdminMissionCreateForm } from "@/components/admin/mission/AdminMissionForms";

export const metadata: Metadata = { title: "Nova missão — Admin" };

export default function AdminNewMissionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Nova missão</h1>
      </div>
      <AdminMissionCreateForm />
      <p className="text-xs text-white/40">
        <Link href="/admin/missions" className="text-canna-400/90 hover:underline">
          ← Lista
        </Link>
      </p>
    </div>
  );
}
