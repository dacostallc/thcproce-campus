"use client";

import Link from "next/link";
import { CampusProfileForm } from "@/components/campus/CampusProfileForm";
import { MissionRewardToast } from "@/components/campus/missions/MissionRewardToast";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

export function CampusLocalProfilePanel() {
  return (
    <main className="relative min-h-screen px-4 py-24 sm:px-6">
      <MissionRewardToast />
      <div className="mx-auto max-w-lg space-y-6">
        <CampusProfileForm
          density="page"
          afterSections={
            <p className="pt-4 text-center text-xs text-white/45">
              <Link href={CAMPUS_HOME_PATH} className="text-canna-300 hover:text-canna-200 hover:underline">
                ← Voltar ao mapa
              </Link>
              <span className="mx-2 text-white/25">·</span>
              <Link href="/perfil" className="text-canna-300 hover:text-canna-200 hover:underline">
                Meu progresso (conta)
              </Link>
            </p>
          }
        />
      </div>
    </main>
  );
}
