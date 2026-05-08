import Link from "next/link";
import packageJson from "../../../package.json";

export const dynamic = "force-dynamic";

export default function StatusPage() {
  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ??
    null;
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID ?? null;
  const envName = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";

  const authConfigured = Boolean(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET !== "");

  return (
    <main className="min-h-screen bg-ink-900 text-white px-6 py-16 flex flex-col items-center">
      <div className="w-full max-w-md rounded-2xl border border-canna-400/25 glass-strong p-8 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-canna-300 font-bold mb-1">THCProce</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Status do sistema</h1>
        </div>

        <ul className="space-y-4 text-sm">
          <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-white/60">Sistema</span>
            <span className="font-semibold text-emerald-300">online</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-white/60">Login (NextAuth)</span>
            <span className={`font-semibold ${authConfigured ? "text-emerald-300" : "text-amber-300"}`}>
              {authConfigured ? "disponível" : "sem NEXTAUTH_SECRET (configure em produção)"}
            </span>
          </li>
          <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-white/60">Versão app</span>
            <span className="font-mono text-xs text-white/90">{packageJson.version}</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
            <span className="text-white/60">Ambiente</span>
            <span className="font-mono text-xs text-white/90">{envName}</span>
          </li>
          {commit ? (
            <li className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <span className="text-white/60">Commit</span>
              <span className="font-mono text-[11px] text-white/90 truncate max-w-[180px]" title={commit}>
                {commit.slice(0, 7)}
              </span>
            </li>
          ) : null}
          {deploymentId ? (
            <li className="flex justify-between gap-4">
              <span className="text-white/60">Deploy</span>
              <span className="font-mono text-[11px] text-white/90 truncate max-w-[180px]" title={deploymentId}>
                {deploymentId}
              </span>
            </li>
          ) : null}
        </ul>

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/" className="text-center text-sm font-semibold text-canna-300 hover:underline">
            Voltar ao campus
          </Link>
          <Link href="/entrar" className="text-center text-sm text-white/50 hover:text-white hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
