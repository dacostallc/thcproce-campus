"use client";

import Link from "next/link";
import { StudentMissionsPanel } from "@/components/campus/missions/StudentMissionsPanel";
import { MissionRewardToast } from "@/components/campus/missions/MissionRewardToast";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

export default function CampusMissoesPage() {
  return (
    <main className="relative min-h-screen px-4 py-24 sm:px-6">
      <MissionRewardToast />
      <div className="mx-auto max-w-lg space-y-6">
        <p className="text-center text-xs text-white/45">
          <Link href={CAMPUS_HOME_PATH} className="text-canna-300 hover:text-canna-200 hover:underline">
            ← Voltar ao mapa
          </Link>
        </p>
        <div className="rounded-2xl campus-hud-glass border-white/14 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
          <StudentMissionsPanel variant="default" />
        </div>
      </div>
    </main>
  );
}
