"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

const showMoodle =
  typeof process.env.NEXT_PUBLIC_SHOW_MOODLE_LOGIN === "string" &&
  process.env.NEXT_PUBLIC_SHOW_MOODLE_LOGIN === "true";

function EntrarInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? CAMPUS_HOME_PATH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false
      });
      if (res?.error) {
        setError(
          "Não conseguimos autenticar. Use o mesmo e-mail e senha que definiu em /inscrever-se (outro domínio = outra conta). Se esqueceu a senha, volte à inscrição com o mesmo e-mail e defina uma nova senha."
        );
        return;
      }
      window.location.href =
        typeof callbackUrl === "string" && callbackUrl.startsWith("/")
          ? callbackUrl
          : CAMPUS_HOME_PATH;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-canna-400/25 glass-strong p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-12 h-12 rounded-2xl bg-canna-500/20 border border-canna-400/40 flex items-center justify-center">
          <Leaf className="text-canna-300" size={24} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-white">Entrar no campus</h1>
          <p className="text-sm text-white/60">
            Credenciais de teste ou SSO (OAuth/OIDC configurável — ver env).
          </p>
        </div>
      </div>

      {showMoodle ? (
        <>
          <Button
            type="button"
            variant="glass"
            className="w-full mb-4"
            onClick={() =>
              void signIn("moodle", {
                callbackUrl:
                  typeof callbackUrl === "string" && callbackUrl.startsWith("/")
                    ? callbackUrl
                    : CAMPUS_HOME_PATH
              })
            }
          >
            Entrar com Moodle (OAuth)
          </Button>
          <div className="flex items-center gap-3 mb-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
            <span className="h-px flex-1 bg-white/15" /> ou convite/dev{" "}
            <span className="h-px flex-1 bg-white/15" />
          </div>
        </>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-canna-300 mb-1.5 uppercase tracking-wider">
            E-mail
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-black/35 border border-white/15 px-4 py-3 text-sm outline-none focus:border-canna-400/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-canna-300 mb-1.5 uppercase tracking-wider">
            Senha
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-black/35 border border-white/15 px-4 py-3 text-sm outline-none focus:border-canna-400/50"
          />
        </div>
        {error ? (
          <p className="text-sm text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-xs text-white/45 leading-relaxed">
        Criou conta em{" "}
        <Link href="/inscrever-se" className="text-canna-300 hover:underline font-semibold">
          Inscrição
        </Link>
        ? Use a mesma senha. Modo dev: e-mail válido +{" "}
        <code className="text-canna-200">CAMPUS_DEMO_PASSWORD</code> (padrão{" "}
        <code className="text-canna-200">demo</code>) só se ainda não há senha cadastrada.
      </p>

      <div className="mt-4 text-center text-sm space-y-2">
        <div>
          <Link href="/inscrever-se" className="text-canna-300 hover:underline font-semibold">
            Primeira vez? Inscreva-se no campus
          </Link>
        </div>
        <div>
          <Link href={CAMPUS_HOME_PATH} className="text-white/50 hover:underline">
            Voltar ao mapa
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-ink-900">
      <Suspense fallback={<div className="text-white/60 text-sm">Carregando…</div>}>
        <EntrarInner />
      </Suspense>
    </main>
  );
}
