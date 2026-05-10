import { Suspense } from "react";
import { CampusMap } from "@/components/campus/CampusMap";

export const metadata = {
  title: "Campus — THCProce",
  description:
    "Campus interativo THCProce: 14 áreas, trilhas em liberação progressiva no pré-lançamento fundador. Sem promessa de catálogo finalizado."
};

export default function CampusMapPage() {
  return (
    <main className="relative">
      <Suspense fallback={null}>
        <CampusMap />
      </Suspense>
    </main>
  );
}
