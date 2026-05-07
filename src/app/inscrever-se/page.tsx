import type { Metadata } from "next";
import { InscricaoExperience } from "@/components/enrollment/InscricaoExperience";

export const metadata: Metadata = {
  title: "Inscrição — Campus THCProce",
  description:
    "Matrícula na Escola Aberta: planos por tempo de acesso, formulário integrado ao campus virtual THCProce."
};

export default function InscreverSePage() {
  return <InscricaoExperience />;
}
