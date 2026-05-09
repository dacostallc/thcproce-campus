import Link from "next/link";

import { AdminCourseForm } from "@/components/admin/AdminCourseForm";

export const metadata = {
  title: "Novo curso — Admin THCProce",
};

export default function AdminNewCoursePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Novo curso</h1>
        <p className="mt-1 text-sm text-white/55">Preencha os campos abaixo.</p>
      </div>
      <AdminCourseForm mode="create" />
      <p className="text-xs text-white/40">
        <Link href="/admin/courses" className="text-canna-400/90 hover:underline">
          ← Lista de cursos
        </Link>
      </p>
    </div>
  );
}
