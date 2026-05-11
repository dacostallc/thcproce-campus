import { CampusVoiceTestPanel } from "@/components/campus/CampusVoiceTestPanel";

export const metadata = {
  title: "Voz ElevenLabs (teste) — Admin THCProce",
  robots: { index: false, follow: false }
};

export default function AdminVoiceTestPage() {
  const enabled = process.env.NEXT_PUBLIC_CAMPUS_VOICE_TEST_PANEL === "true";

  if (!enabled) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-white/65">
        <p className="font-medium text-white/90">Painel de voz desativado.</p>
        <p className="mt-2">
          Defina{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 text-xs text-canna-200">
            NEXT_PUBLIC_CAMPUS_VOICE_TEST_PANEL=true
          </code>{" "}
          no ambiente e faça novo deploy para ver este ecrã.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Teste de narração ElevenLabs</h1>
        <p className="mt-1 text-xs text-white/50">
          Uso interno. Requer sessão admin e variáveis <code className="text-canna-300/90">ELEVENLABS_*</code> no servidor.
        </p>
      </div>
      <CampusVoiceTestPanel />
    </div>
  );
}
