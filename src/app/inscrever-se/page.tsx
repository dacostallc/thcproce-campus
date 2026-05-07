import type { Metadata } from "next";
import { InscricaoExperience } from "@/components/enrollment/InscricaoExperience";

export const metadata: Metadata = {
  title: "Entre no Campus THCProce — Oferta de lançamento",
  description:
    "Fase de lançamento com valores promocionais. Matrícula na universidade digital de cannabis — THCProce."
};

export default function InscreverSePage() {
  return <InscricaoExperience />;
}
