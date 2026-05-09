import { CampusZoneEditor } from "@/components/campus/CampusZoneEditor";

/** Ferramenta interna — não indexar. Manuais: retângulos %; polígonos depois. */
export const metadata = {
  title: "Preview · Editor de zonas — THCProce",
  description:
    "Editor visual de zonas retangulares do campus (coordenadas 0–100%).",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default function CampusZoneEditorPage() {
  return (
    <main className="relative">
      <CampusZoneEditor />
    </main>
  );
}
