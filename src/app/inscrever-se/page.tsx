import type { Metadata } from "next";
import { Suspense } from "react";
import { InscricaoExperience } from "@/components/enrollment/InscricaoExperience";

export const metadata: Metadata = {
  title: "Entre no Campus THCProce — Oferta de lançamento",
  description:
    "Fase de lançamento com valores promocionais. Matrícula na universidade digital de cannabis — THCProce."
};

export default function InscreverSePage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] p-8 text-center text-sm text-white/60">Carregando…</div>}>
      <InscricaoExperience />
    </Suspense>
  );
}
