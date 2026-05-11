"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/react";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

function RecuperarSenhaInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const afterLogin =
    typeof callbackUrl === "string" && callbackUrl.startsWith("/") ? callbackUrl : CAMPUS_HOME_PATH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const reset = trpc.enrollment.resetPassword.useMutation({
    onSuccess: () => {
      router.push(`/entrar?callbackUrl=${encodeURIComponent(afterLogin)}`);
    }
  });

  const errorMsg = reset.error?.message ?? null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset.mutate({
      email: email.trim().toLowerCase(),
      password,
      passwordConfirm
    });
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-canna-400/25 glass-strong p-8 shadow-2xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-canna-400/40 bg-canna-500/20">
          <Leaf className="text-canna-300" size={24} />
        </span>
        <div>
          <h1 className="text-xl font-bold text-white">Recuperar senha</h1>
          <p className="text-sm text-white/60">
            Só para quem já tem conta na THCProce. Sem escolher plano nem pagar.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-canna-300">
            E-mail da conta
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm outline-none focus:border-canna-400/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-canna-300">
            Nova senha (mín. 8 caracteres)
          </label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm outline-none focus:border-canna-400/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-canna-300">
            Confirmar nova senha
          </label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm outline-none focus:border-canna-400/50"
          />
        </div>
        {errorMsg ? (
          <p className="rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">
            {errorMsg}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={reset.isPending}>
          {reset.isPending ? "A guardar…" : "Guardar nova senha"}
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <div>
          <Link href="/entrar" className="font-semibold text-canna-300 hover:underline">
            Voltar a entrar
          </Link>
        </div>
        <div>
          <Link href="/inscrever-se" className="text-white/50 hover:underline">
            Ainda não tem conta? Matrícula
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-4">
      <Suspense fallback={<div className="text-sm text-white/60">Carregando…</div>}>
        <RecuperarSenhaInner />
      </Suspense>
    </main>
  );
}
