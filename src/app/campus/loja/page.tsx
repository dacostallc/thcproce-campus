import type { Metadata } from "next";
import Link from "next/link";
import { CampusStoreShell } from "@/components/campus/CampusStoreShell";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

export const metadata: Metadata = {
  title: "Loja do campus — THCProce",
  description: "Gasta créditos do campus neste dispositivo; em breve integrado ao teu perfil na escola."
};

export default function CampusLojaPage() {
  return (
    <main className="relative min-h-screen px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <p className="text-center text-xs text-white/45">
          <Link href={CAMPUS_HOME_PATH} className="text-canna-300 hover:text-canna-200 hover:underline">
            ← Voltar ao mapa
          </Link>
        </p>
        <CampusStoreShell density="page" />
      </div>
    </main>
  );
}
