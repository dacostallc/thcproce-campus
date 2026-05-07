import Link from "next/link";
import type { Metadata } from "next";

const lodger =
  process.env.NEXT_PUBLIC_LODGER_CHECKOUT ??
  "https://thcproce.com.br/escola/lodger/join/subscription.php?productid=2";

const tiers = [
  {
    id: "mensal",
    title: "Mensal",
    price: "—",
    copy: "Acesso completo ao conteúdo pelo tempo do plano. O paywall é por duração, não por curso.",
    href: lodger
  },
  {
    id: "trimestral",
    title: "Trimestral",
    price: "—",
    copy: "Melhor custo por mês; ideal para quem quer cravar o ritmo de estudo.",
    href: lodger
  },
  {
    id: "anual",
    title: "Anual",
    price: "—",
    copy: "Campus + atualizações sazonais + eventos ao longo do ano.",
    href: lodger
  },
  {
    id: "vitalicio",
    title: "Vitalício",
    price: "—",
    copy: "Onde a escola oferecer plano permanente — integrar com Lodger ou gateway PIX próprio.",
    href: lodger
  }
] as const;

export const metadata: Metadata = {
  title: "Planos por tempo — THCProce",
  description:
    "Mensal, trimestral, anual ou vitalício. Conteúdo liberado; o tempo de acesso é o que muda."
};

export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-ink-900 text-white px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3">
          Planos por tempo de acesso
        </h1>
        <p className="text-center text-white/70 max-w-2xl mx-auto mb-12">
          Todos os cursos e áreas do campus ficam disponíveis no mesmo nível; o que muda é{" "}
          <strong className="text-canna-200">quanto tempo</strong> sua matrícula permanece
          ativa — alinhado ao Lodger/PIX já usados na escola.
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
              <a
                href={t.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex justify-center rounded-xl bg-canna-500 hover:bg-canna-400 text-ink-900 font-bold py-3 px-4 transition-colors shadow-lg shadow-canna-500/25"
              >
                Comprar / renovar
              </a>
            </article>
          ))}
        </div>
        <p className="text-center mt-12 text-sm text-white/50">
          Ajuste os links reais de produto no Lodger e defina{" "}
          <code className="text-canna-200">NEXT_PUBLIC_LODGER_CHECKOUT</code> no deploy.
        </p>
        <div className="text-center mt-6">
          <Link href="/campus" className="text-canna-300 hover:underline text-sm font-semibold">
            Explorar o campus
          </Link>
        </div>
      </div>
    </main>
  );
}
