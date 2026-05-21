import { EstradaConhecimentoOz } from "@/components/cultivosim/EstradaConhecimentoOz";

export const metadata = {
  title: "Preview CultivoSim Estrada do Conhecimento",
  description: "Protótipo interno da trilha de 200 casas do CultivoSim.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default function PreviewCultivoSimEstradaPage() {
  return <EstradaConhecimentoOz />;
}

