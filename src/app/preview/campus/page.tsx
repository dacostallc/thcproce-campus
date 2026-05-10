import { CampusMap } from "@/components/campus/CampusMap";

/** Página interna de testes — não linke na home. robots: noindex. */
export const metadata = {
  title: "Preview · Campus interno — THCProce",
  description: "Ambiente interno para ajustes do mapa e layout. Não indexada.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default function PreviewCampusPage() {
  return (
    <main className="relative">
      <CampusMap internalPreview />
    </main>
  );
}
