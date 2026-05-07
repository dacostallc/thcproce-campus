import { CampusMap } from "@/components/campus/CampusMap";

export const metadata = {
  title: "Campus — THCProce",
  description:
    "Caminhe pelo campus interativo da Escola PROCBD. 14 áreas, 11 cursos com certificado, +600 aulas em vídeo."
};

export default function CampusPage() {
  return (
    <main className="relative">
      <CampusMap showCourseLabels />
    </main>
  );
}
