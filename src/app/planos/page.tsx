import Link from "next/link";
import type { Metadata } from "next";
import { isAbsoluteHttpUrl, lodgerCheckoutHref } from "@/config/siteUrls";

const checkoutHref = lodgerCheckoutHref();
const checkoutOpenNewTab = isAbsoluteHttpUrl(checkoutHref);

const tiers = [
  {
    id: "mensal",
    title: "Mensal",
    price: "—",
    copy:
      "Matrícula ativa pelo período do plano; você explora o campus e as salas conforme calendário de liberação (pré-lançamento). O paywall é por duração, não por curso isolado.",
    href: checkoutHref
  },
  {
    id: "trimestral",
    title: "Trimestral",
    price: "—",
    copy: "Melhor custo por mês; ideal para quem quer cravar o ritmo de estudo.",
    href: checkoutHref
  },
  {
    id: "anual",
    title: "Anual",
    price: "—",
    copy: "Campus + atualizações sazonais + eventos ao longo do ano.",
    href: checkoutHref
  },
  {
    id: "vitalicio",
    title: "Vitalício",
    price: "—",
    copy: "Onde a escola oferecer plano permanente — integrar com Lodger ou gateway PIX próprio.",
    href: checkoutHref
  }
] as const;

export const metadata: Metadata = {
  title: "Planos por tempo — THCProce",
  description:
    "Mensal, trimestral, anual ou vitalício. No pré-lançamento fundador o catálogo cresce por fases; o tempo de matrícula é o que muda entre planos."
};

function CheckoutButton({ href }: { href: string }) {
  const cnBtn =
    "mt-6 inline-flex justify-center rounded-xl bg-canna-500 hover:bg-canna-400 text-ink-900 font-bold py-3 px-4 transition-colors shadow-lg shadow-canna-500/25";
  if (checkoutOpenNewTab) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cnBtn}>
        Comprar / renovar
      </a>
    );
  }
  return (
    <Link href={href} className={cnBtn}>
      Comprar / renovar
    </Link>
  );
}

export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-ink-900 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-white/70 max-w-2xl mx-auto mb-8">
          <Link
            href="/inscrever-se"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-canna-500/20 border border-canna-400/35 text-canna-200 font-semibold hover:bg-canna-500/30 transition-colors"
          >
            Matrícula no campus digital →
          </Link>
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3">
          Planos por tempo de acesso
        </h1>
        <p className="text-center text-white/70 max-w-2xl mx-auto mb-12">
          O mapa e as salas abrem conforme o calendário da escola (liberação progressiva). Entre os planos, o que muda é{" "}
          <strong className="text-canna-200">quanto tempo</strong> sua matrícula permanece
          ativa — integração Lodger/PIX quando configurada (
          <code className="text-canna-200">NEXT_PUBLIC_LODGER_CHECKOUT</code>).
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {tiers.map((t) => (
            <article
              key={t.id}
              className="rounded-2xl border border-canna-400/25 glass-strong p-6 flex flex-col"
            >
              <h2 className="text-xl font-bold text-canna-200">{t.title}</h2>
              <p className="text-2xl font-extrabold mt-2">{t.price}</p>
              <p className="text-sm text-white/75 mt-3 flex-1 leading-relaxed">{t.copy}</p>
              <CheckoutButton href={t.href} />
            </article>
          ))}
        </div>
        <p className="text-center mt-12 text-sm text-white/50">
          Sem Lodger configurado, o botão acima leva a esta página — defina um checkout absoluto em{" "}
          <code className="text-canna-200">NEXT_PUBLIC_LODGER_CHECKOUT</code> no deploy.
        </p>
        <div className="text-center mt-6">
          <Link href="/" className="text-canna-300 hover:underline text-sm font-semibold">
            Explorar o campus
          </Link>
        </div>
      </div>
    </main>
  );
}
