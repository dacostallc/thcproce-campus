import type { Metadata } from "next";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";

export const metadata: Metadata = {
  title: "Entrar na Escola THCProce",
  description:
    "Acesse o campus digital: crie sua conta, conheça os planos ou volte ao mapa."
};

export default function InscreverPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-ink-900 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-canna-400/25 glass-strong p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-canna-500/20 border border-canna-400/40 flex items-center justify-center shrink-0">
            <Leaf className="text-canna-300" size={24} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Entrar na Escola THCProce</h1>
          </div>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">
          O campus é o mapa vivo da escola: salas, trilhas e progressão. Por aqui você cria a conta de
          aluno, escolhe um plano quando estiver pronto e volta ao mapa sem perder o ritmo.
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full shadow-lg shadow-canna-500/25">
            <Link href="/inscrever-se">Criar conta</Link>
          </Button>
          <Button variant="glass" asChild className="w-full">
            <Link href="/planos">Ver planos</Link>
          </Button>
          <Button variant="glass" asChild className="w-full border border-white/15 bg-white/5">
            <Link href={CAMPUS_HOME_PATH}>Voltar ao campus</Link>
          </Button>
        </div>
        <p className="text-xs text-white/45 text-center">
          Já tem conta?{" "}
          <Link href="/login" className="text-canna-300 hover:underline font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
