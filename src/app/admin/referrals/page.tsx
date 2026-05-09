import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Indicações — Admin" };

export default async function AdminReferralsPage() {
  const rows = await prisma.referral.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      referrer: { select: { email: true, displayName: true, referralCode: true } },
      referred: { select: { email: true, displayName: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Indicações (referral)</h1>
        <p className="mt-1 text-sm text-white/55">
          Registo simples de recompensas simbólicas — sem analytics avançado.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-white/50">Ainda não há indicações concluídas.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-white/90">
                  <strong className="font-medium text-canna-200/95">Quem indicou:</strong>{" "}
                  {r.referrer.displayName ?? r.referrer.email ?? "—"}{" "}
                  <span className="font-mono text-[10px] text-white/40">({r.referrer.referralCode})</span>
                </span>
                <span className="text-[10px] text-white/40">
                  {r.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </div>
              <div className="mt-2 text-white/80">
                <strong className="font-medium text-white/90">Novo aluno:</strong>{" "}
                {r.referred.displayName ?? r.referred.email ?? "—"}
              </div>
              <div className="mt-2 text-xs text-white/50">
                Bónus indicador: +{r.referrerRewardAmount} · Bónus indicado: +{r.referredRewardAmount} (souvenir)
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-white/40">
        <Link href="/admin" className="text-canna-400/90 hover:underline">
          ← Admin
        </Link>
      </p>
    </div>
  );
}
