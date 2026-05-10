import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Check,
  Crown,
  GraduationCap,
  Leaf,
  Sparkles,
  UserRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import {
  planosContactEmail,
  planosPriceAluno,
  planosPricePremium,
  planosPriceVisitante
} from "@/config/planosDisplay";
import { cn } from "@/lib/utils";

const TRILHAS = [
  "Cannabis 101",
  "Cultivo",
  "Extração",
  "Culinária",
  "Medicina canabinoide"
] as const;

/** Fluxo único de matriculação com escolha de plano (`InscricaoExperience`). */
const INSCRICAO_ROUTE = "/inscrever-se";

export const metadata: Metadata = {
  title: "Planos — Campus THCProce",
  description:
    "Escolha como entrar na Escola THCProce: visitante gratuito, aluno com matrícula ou Membro Premium. Campus digital, trilhas e comunidade."
};

function PlanosNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2.5 glass-hud sm:gap-3 sm:px-5 sm:py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-xl transition-transform hover:scale-[1.02]"
          aria-label="THCProce — início"
        >
          <span className="flex size-9 items-center justify-center rounded-xl border border-canna-400/45 bg-gradient-to-br from-canna-500/30 to-amber-500/20 shadow-md shadow-canna-900/40">
            <Leaf size={18} className="text-canna-200" />
          </span>
          <div className="leading-tight">
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-amber-200/85">
              THCProce
            </div>
            <div className="text-sm font-bold text-white">Escola Aberta</div>
          </div>
        </Link>
        <nav
          className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2"
          aria-label="Ações principais"
        >
          <Button variant="glass" size="sm" className="border-white/15 px-2.5 sm:px-3" asChild>
            <Link href={CAMPUS_HOME_PATH}>Campus</Link>
          </Button>
          <Button variant="glass" size="sm" className="border-white/15 px-2.5 sm:px-3" asChild>
            <Link href="/inscrever">Inscrever-se</Link>
          </Button>
          <Button
            size="sm"
            className="px-2.5 font-bold text-ink-900 shadow-lg shadow-canna-500/20 sm:px-3"
            asChild
          >
            <Link href="/login">Entrar</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function TierCta({ href, children }: { href: string; children: ReactNode }) {
  const cls = cn(
    "mt-auto mt-8 w-full justify-center py-3.5 text-base font-bold shadow-lg shadow-canna-950/35 sm:mt-10 sm:py-3"
  );
  const isMail = /^mailto:/i.test(href);
  if (isMail) {
    return (
      <Button size="lg" className={cls} asChild>
        <a href={href}>{children}</a>
      </Button>
    );
  }
  return (
    <Button size="lg" className={cls} asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function Benefit({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-sm leading-snug text-white/80 sm:gap-3">
      <Check
        size={17}
        className="mt-0.5 shrink-0 text-canna-400"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

export default function PlanosPage({
  searchParams
}: {
  searchParams?: { conta?: string };
}) {
  const contaCriada = searchParams?.conta === "criada";
  const mail = planosContactEmail();
  const consultMailto = mail
    ? `mailto:${mail}?subject=${encodeURIComponent("Planos THCProce — Membro Premium")}`
    : null;

  const pVisitante = planosPriceVisitante();
  const pAluno = planosPriceAluno();
  const pPremium = planosPricePremium();

  const premiumHref = consultMailto ?? INSCRICAO_ROUTE;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-ink-900"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 90% 70% at 50% -15%, rgba(74, 222, 128, 0.11), transparent 55%)",
            "radial-gradient(ellipse 80% 50% at 100% 30%, rgba(251, 191, 36, 0.06), transparent 50%)",
            "radial-gradient(ellipse 60% 45% at 0% 80%, rgba(34, 197, 94, 0.07), transparent 45%)"
          ].join(", ")
        }}
      />
      <PlanosNav />
      <main className="relative min-h-screen px-4 pb-28 pt-[8.75rem] text-white sm:px-6 sm:pb-32 sm:pt-36 lg:px-10 lg:pt-[10rem]">
        <div className="mx-auto max-w-6xl">
          {contaCriada ? (
            <div className="mb-8 rounded-2xl border border-canna-400/45 bg-canna-500/10 px-4 py-4 text-center text-sm text-white/90 sm:mb-10 sm:px-6">
              <strong className="text-canna-200">Conta criada.</strong> Escolha um plano
              abaixo e conclua no fluxo de matrícula. Depois acesse{" "}
              <Link
                href="/entrar"
                className="font-semibold text-canna-300 underline hover:text-canna-200"
              >
                Entrar
              </Link>{" "}
              com o mesmo e-mail.
            </div>
          ) : null}

          <section className="mb-16 text-center sm:mb-20 lg:mb-24">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200/90 sm:mb-4">
              Matrícula digital
            </p>
            <h1 className="text-balance px-1 text-3xl font-bold leading-[1.12] tracking-tight text-white sm:px-0 sm:text-4xl sm:leading-tight md:text-[2.5rem]">
              Escolha seu acesso ao Campus THCProce
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty px-1 text-[0.95rem] leading-relaxed text-white/70 sm:mt-6 sm:px-0 sm:text-lg">
              Do explorador gratuito ao aluno com matrícula: o mesmo mapa vivo, trilhas e salas —
              com benefícios alinhados ao seu momento.
            </p>
          </section>

          <div className="grid gap-7 sm:gap-8 lg:grid-cols-3 lg:gap-8 xl:gap-10">
            {/* Visitante */}
            <article
              className={cn(
                "flex flex-col rounded-2xl border border-canna-400/25 bg-black/22 p-6 sm:p-7 md:p-8",
                "shadow-[0_0_42px_-16px_rgba(74,222,128,0.28)] backdrop-blur-sm"
              )}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/6">
                  <UserRound size={22} className="text-canna-200" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Visitante</h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Exploração inicial
                  </p>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-canna-200 tabular-nums">
                {pVisitante}
              </p>
              <ul className="mt-5 flex flex-1 flex-col gap-3.5 sm:mt-6">
                <Benefit>Navegação pelo campus e descoberta das áreas públicas.</Benefit>
                <Benefit>Participação em experiências ao vivo quando a escola abrir sessões.</Benefit>
                <Benefit>Ideal para sentir o ambiente antes de se matricular.</Benefit>
              </ul>
              <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7 sm:pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
                  Acesso ao campus
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Demonstração e áreas públicas; salas restritas seguem calendário e regras da
                  escola.
                </p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
                  Trilhas inclusas
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Pré-visualização quando disponível pela escola; matrícula abre todas as trilhas
                  publicadas no seu ciclo de acesso.
                </p>
              </div>
              <TierCta href={CAMPUS_HOME_PATH}>Explorar o campus</TierCta>
            </article>

            {/* Aluno */}
            <article
              className={cn(
                "flex flex-col rounded-2xl border border-amber-400/35 bg-black/28 p-6 sm:p-7 md:p-8",
                "shadow-[0_0_52px_-12px_rgba(251,191,36,0.35)] backdrop-blur-sm",
                "ring-1 ring-amber-400/15"
              )}
            >
              <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/45 bg-amber-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-100 sm:mb-4">
                <Sparkles size={12} aria-hidden />
                Recomendado
              </div>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl border border-amber-400/35 bg-amber-500/12">
                  <GraduationCap size={22} className="text-amber-200" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Aluno</h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Matrícula completa
                  </p>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-amber-200 tabular-nums">{pAluno}</p>
              {pAluno === "Consultar acesso" ? (
                <p className="mt-2 text-xs text-white/50">
                  Valores e períodos são confirmados na matrícula ou no checkout oficial.
                </p>
              ) : null}
              <ul className="mt-5 flex flex-1 flex-col gap-3.5 sm:mt-6">
                <Benefit>Acesso ao campus conforme seu plano e calendário de liberação.</Benefit>
                <Benefit>Progresso na gamificação, presença no mapa e salas liberadas por trilha.</Benefit>
                <Benefit>Renovações e upgrades seguem as políticas publicadas pela escola.</Benefit>
              </ul>
              <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7 sm:pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
                  Acesso ao campus
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Mapa interativo completo dentro do período contratado, alinhado às regras de cada
                  sala.
                </p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
                  Trilhas inclusas
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {TRILHAS.map((t) => (
                    <li
                      key={t}
                      className="rounded-lg border border-canna-400/25 bg-canna-500/10 px-2.5 py-1 text-xs font-medium text-canna-100"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-white/45">
                  Conteúdo liberado etapa a etapa, conforme calendário da escola.
                </p>
              </div>
              <TierCta href={INSCRICAO_ROUTE}>Assinar</TierCta>
            </article>

            {/* Premium */}
            <article
              className={cn(
                "flex flex-col rounded-2xl border border-canna-400/30 bg-black/22 p-6 sm:p-7 md:p-8",
                "shadow-[0_0_42px_-16px_rgba(250,204,21,0.22)] backdrop-blur-sm"
              )}
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl border border-canna-400/35 bg-canna-500/15">
                  <Crown size={22} className="text-amber-200" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Membro Premium</h2>
                  <p className="text-xs uppercase tracking-[0.12em] text-white/45">
                    Experiência ampliada
                  </p>
                </div>
              </div>
              <p className="text-3xl font-extrabold text-canna-200 tabular-nums">{pPremium}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-3.5 sm:mt-6">
                <Benefit>Tudo que o plano Aluno oferece, com extras conforme comunicado pela escola.</Benefit>
                <Benefit>Prioridade ou acesso antecipado a novidades quando disponibilizadas.</Benefit>
                <Benefit>Fila de suporte dedicada dentro do canal oficial — sem promessa de SLA.</Benefit>
              </ul>
              <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7 sm:pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
                  Acesso ao campus
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Mesmo mapa vivo, com permissões amplas segundo o contrato do Membro Premium.
                </p>
              </div>
              <div className="mt-5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
                  Trilhas inclusas
                </p>
                <p className="mt-2 text-sm text-white/70">{TRILHAS.join(" · ")}</p>
                <p className="mt-1 text-xs text-white/45">
                  Trilhas e bônus finais conforme termos específicos do Premium.
                </p>
              </div>
              <TierCta href={premiumHref}>
                {consultMailto ? "Consultar assinatura" : "Assinar"}
              </TierCta>
            </article>
          </div>

          <section className="mx-auto mb-12 mt-16 max-w-3xl sm:mt-20 md:mt-24 lg:mb-16">
            <h2 className="mb-6 text-center text-xl font-bold text-white sm:mb-8">Perguntas frequentes</h2>
            <div className="space-y-3 sm:space-y-4">
              <FaqItem title="Como funciona o campus?">
                O campus é um mapa digital onde você navega até salas ligadas às trilhas. Dentro de
                cada sala você assiste às aulas e acompanha materiais quando a escola liberar o
                conteúdo no calendário.
              </FaqItem>
              <FaqItem title="Existe acesso vitalício?">
                Modalidades prolongadas ou vitalícios dependem das ofertas publicadas oficialmente —
                períodos e condições aparecem na matrícula ou no checkout. Nada aqui substitui o
                contrato ou o comprovante de pagamento.
              </FaqItem>
              <FaqItem title="Como funciona o suporte?">
                Dúvidas sobre cobrança, acesso ou trilhas entram pelo canal que a THCProce indicar —
                por exemplo e-mail institucional ou área logada quando estiver disponível.
              </FaqItem>
              <FaqItem title="Funciona no celular?">
                Sim. O campus é pensado para web responsiva: navegue pelo mapa e pelas salas no
                mobile; para longas sessões de estudo, computador ou tablet costumam ser mais
                confortáveis.
              </FaqItem>
            </div>
          </section>

          <footer className="flex flex-col items-center gap-7 border-t border-white/10 pt-10 pb-6 text-center sm:gap-8 sm:pt-14">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="font-bold text-ink-900" asChild>
                <Link href="/inscrever">Inscrever-se</Link>
              </Button>
              <Button variant="glass" size="lg" className="border-white/15" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
            <p className="max-w-lg text-xs text-white/45">
              Preços exibidos aqui só são numéricos quando configurados por variáveis de ambiente;
              caso contrário usamos textos como &quot;Consultar acesso&quot; ou &quot;Em breve&quot; para não
              prometer valores que possam mudar.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/" className="text-canna-300 hover:underline">
                Início
              </Link>
              <Link href={CAMPUS_HOME_PATH} className="text-canna-300 hover:underline">
                Campus
              </Link>
              {mail ? (
                <a href={`mailto:${mail}`} className="text-canna-300 hover:underline">
                  Contato
                </a>
              ) : null}
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}

function FaqItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm outline-none ring-canna-400/35 open:ring-1">
      <summary className="cursor-pointer select-none list-none px-4 py-3.5 text-sm font-semibold text-white sm:px-5 sm:py-4 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
      </summary>
      <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm leading-relaxed text-white/70 sm:px-5 sm:pb-5 sm:pt-4">
        {children}
      </div>
    </details>
  );
}
