import { CampusMapAreasPreviewPanel } from "@/components/campus/CampusMapAreasPreviewPanel";

/** Ferramenta interna — authoring de polígonos (sem alterar o asset do mapa). */
export const metadata = {
  title: "Preview · Polígonos do mapa — THCProce",
  description: "Validação manual de áreas polygon em percentagem sobre a arte public/campus.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default function CampusMapAreasPreviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-ink-900 via-black to-ink-900">
      <CampusMapAreasPreviewPanel />
    </main>
  );
}
