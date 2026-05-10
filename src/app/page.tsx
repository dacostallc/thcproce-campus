import type { Metadata } from "next";
import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  Compass,
  DoorOpen,
  PlayCircle,
  Map as MapIcon,
  Sparkles,
  GraduationCap,
  Home,
  ClipboardList,
  UserPlus,
  MapPin,
  BookOpen,
  ArrowDown,
  Film
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import { areas, type AreaId } from "@/data/courses";

export const metadata: Metadata = {
  title: "THCProce Escola Aberta",
  description:
    "Educação, cultura e cultivo em um campus digital interativo — trilhas, salas e progressão no mapa vivo da escola."
};

const demoJourneySteps = [
  { n: 1, title: "Home", href: "/", icon: Home },
  { n: 2, title: "Planos", href: "/planos", icon: ClipboardList },
  { n: 3, title: "Inscrever-se", href: "/inscrever-se", icon: UserPlus },
  { n: 4, title: "Campus", href: CAMPUS_HOME_PATH, icon: MapPin },
  {
    n: 5,
    title: "Cannabis 101",
    href: `${CAMPUS_HOME_PATH}?hotspot=cannabis-101`,
    icon: BookOpen
  }
] as const;

const steps = [
  {
    n: 1,
    title: "Escolha sua trilha",
    copy: "Defina por onde começar — cada trilha tem salas próprias no mapa.",
    icon: Compass
  },
  {
    n: 2,
    title: "Entre nas salas",
    copy: "Navegue pelo campus e abra as salas ligadas à trilha que você escolheu.",
    icon: DoorOpen
  },
  {
    n: 3,
    title: "Assista às aulas",
    copy: "Aulas em vídeo e materiais de apoio, no seu ritmo.",
    icon: PlayCircle
  },
  {
    n: 4,
    title: "Evolua no campus",
    copy: "Volte ao mapa, explore novas áreas e aprofunde o que já viu.",
    icon: Sparkles
  }
] as const;

/** Áreas reais (`Area.id` em `data/courses.ts`) representando cada trilha da landing. */
const LANDING_TRILHA_AREAS: { id: AreaId; cardTitle?: string }[] = [
  { id: "cannabis-101" },
  { id: "cultivo-outdoor", cardTitle: "Cultivo" },
  { id: "extracao-oleo", cardTitle: "Extração" },
  { id: "culinaria", cardTitle: "Culinária" },
  { id: "medicina", cardTitle: "Medicina Canabinoide" }
];

const areaById = new Map(areas.map((a) => [a.id, a]));

const trilhas = LANDING_TRILHA_AREAS.map(({ id, cardTitle }) => {
  const area = areaById.get(id);
  if (!area) {
    throw new Error(`Landing trilha: area id "${id}" não encontrada em data/courses.ts`);
  }
  return {
    id,
    title: cardTitle ?? area.name,
    desc: area.short
  };
});

function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl glass-hud px-4 py-3 sm:px-5">
        <Link prefetch={false}
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-xl transition-transform hover:scale-[1.02]"
          aria-label="THCProce Escola Aberta — início"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-canna-400/45 bg-gradient-to-br from-canna-500/30 to-amber-500/20 shadow-md shadow-canna-900/40">
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
          className="hidden items-center gap-1 sm:flex md:gap-2"
          aria-label="Secções"
        >
          <NavPill href="#como-funciona">Como funciona</NavPill>
          <NavPill href="#trilhas">Trilhas</NavPill>
          <NavPill href="#campus-vivo">Campus vivo</NavPill>
        </nav>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <Link prefetch={false}
            href={CAMPUS_HOME_PATH}
            className={cn(
              buttonVariants({ variant: "glass", size: "sm" }),
              "hidden border-white/15 min-[380px]:inline-flex sm:hidden"
            )}
          >
            Campus
          </Link>
          <Link prefetch={false}
            href="/planos"
            className={cn(buttonVariants({ variant: "glass", size: "sm" }), "border-white/15")}
          >
            Planos
          </Link>
          <Link prefetch={false}
            href="/login"
            className={cn(
              buttonVariants({ size: "sm" }),
              "font-bold text-ink-900 shadow-lg shadow-canna-500/20"
            )}
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link prefetch={false}
      href={href}
      className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/5 hover:text-white md:px-3"
    >
      {children}
    </Link>
  );
}

export default function MarketingHomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 22% 12%, rgba(34, 197, 94, 0.12), transparent 52%),
            radial-gradient(ellipse at 82% 18%, rgba(251, 191, 36, 0.09), transparent 46%),
            radial-gradient(ellipse at 48% 88%, rgba(22, 101, 52, 0.14), transparent 58%),
            linear-gradient(180deg, rgba(7, 18, 12, 1) 0%, rgba(5, 14, 10, 1) 45%, #040807 100%)
          `
        }}
      />

      <LandingNav />

      {/* hero — campus art + HUD-style overlay (paths match CampusMap defaults) */}
      <main className="relative z-10 pb-24" style={{ pointerEvents: "auto" }}>
        <section
          aria-label="Apresentação"
          className="relative flex min-h-[70svh] w-full flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20"
        >
          {/*
            Fundo só com CSS (sem <img>) para não haver camada “replaced element” a interferir com cliques.
            Dia/noite: prefers-color-scheme.
          */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat",
              "bg-[url('/campus/campus.png')]",
              "[@media(prefers-color-scheme:light)]:bg-[url('/campus/campus-day.png')]"
            )}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] overflow-hidden select-none"
            aria-hidden
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-b",
                "from-ink-900/85 via-canna-950/70 to-canna-950/88"
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute inset-0",
                "[background-image:radial-gradient(ellipse_at_50%_18%,rgba(34,197,94,0.18),transparent_56%),radial-gradient(ellipse_at_0%_100%,rgba(20,83,45,0.35),transparent_48%),radial-gradient(ellipse_at_100%_0%,rgba(15,118,110,0.22),transparent_42%)]"
              )}
            />
          </div>
          <div
            className="relative z-[60] mx-auto w-full max-w-6xl px-4 py-1 sm:px-6"
            style={{ pointerEvents: "auto", isolation: "isolate" }}
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-white/[0.03] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                Escola aberta
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-shadow-soft sm:text-5xl md:text-6xl">
                THCProce Escola Aberta
              </h1>
              <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
                Educação, cultura e cultivo em um campus digital interativo.
              </p>

              <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:items-center">
                <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
                  <Link prefetch={false}
                    href={CAMPUS_HOME_PATH}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "min-h-12 font-bold text-ink-900 shadow-lg shadow-canna-500/30"
                    )}
                  >
                    Entrar no Campus
                    <MapIcon className="size-4" aria-hidden />
                  </Link>
                  <Link prefetch={false}
                    href="/planos"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "glass" }),
                      "min-h-12 border border-white/15 bg-white/5"
                    )}
                  >
                    Ver Planos
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>

                <nav
                  aria-label="Explorar o campus sem cadastro"
                  className="flex flex-col gap-2.5 rounded-2xl border border-amber-400/15 bg-black/25 px-3 py-3 backdrop-blur-sm sm:px-4"
                >
                  <p className="text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">
                    Acesso rápido ao mapa
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Link prefetch={false}
                      href={`${CAMPUS_HOME_PATH}?hotspot=cannabis-101`}
                      className={cn(
                        buttonVariants({ size: "sm", variant: "glass" }),
                        "border border-canna-400/25 bg-canna-500/[0.07] text-white hover:border-amber-400/35"
                      )}
                    >
                      <BookOpen className="size-3.5 text-amber-200/90" aria-hidden />
                      Cannabis 101
                    </Link>
                    <Link prefetch={false}
                      href="#trilhas"
                      className={cn(
                        buttonVariants({ size: "sm", variant: "glass" }),
                        "border border-white/12 bg-white/[0.04]"
                      )}
                    >
                      <GraduationCap className="size-3.5 text-canna-200/90" aria-hidden />
                      Cursos e trilhas
                    </Link>
                    <Link prefetch={false}
                      href={`${CAMPUS_HOME_PATH}?cinema=1`}
                      className={cn(
                        buttonVariants({ size: "sm", variant: "glass" }),
                        "border border-white/12 bg-white/[0.04]"
                      )}
                    >
                      <Film className="size-3.5 text-amber-200/90" aria-hidden />
                      Cinema
                    </Link>
                  </div>
                </nav>
              </div>

              <nav
                aria-label="Percurso de demonstração"
                className="mx-auto mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-3 shadow-inner backdrop-blur-sm sm:mt-10 sm:px-4 sm:py-3.5"
              >
                <p className="mb-3 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-200/75">
                  Jornada de demonstração
                </p>
                <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:flex-nowrap">
                  {demoJourneySteps.map((step, idx) => {
                    const Ico = step.icon;
                    const isLast = idx === demoJourneySteps.length - 1;
                    return (
                      <li key={step.n} className="flex shrink-0 items-center gap-x-2">
                        <Link prefetch={false}
                          href={step.href}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-amber-400/15 bg-amber-500/[0.05] px-2 py-1.5 transition hover:border-amber-400/30 hover:bg-amber-500/10 sm:gap-2 sm:px-2.5"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-amber-400/25 bg-amber-500/15 text-[10px] font-bold text-amber-100">
                            {step.n}
                          </span>
                          <Ico className="size-3 text-amber-200/85 sm:size-3.5" aria-hidden />
                          <span className="max-w-[5.75rem] truncate text-[10px] font-semibold text-white/80 sm:text-[11px]">
                            {step.title}
                          </span>
                        </Link>
                        {!isLast ? (
                          <span className="hidden text-white/25 sm:flex" aria-hidden>
                            <ArrowDown className="size-3 rotate-[-90deg] sm:size-3.5" />
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-6 flex justify-center px-4 sm:mt-7">
                <Link prefetch={false}
                  href={CAMPUS_HOME_PATH}
                  className={cn(
                    buttonVariants({ size: "sm", variant: "glass" }),
                    "h-auto min-h-8 border border-white/12 bg-transparent py-2 text-[11px] font-medium text-white/58 hover:bg-white/[0.04] hover:text-amber-100/92"
                  )}
                >
                  Ver demonstração do campus
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* como funciona */}
        <section id="como-funciona" className="mx-auto mt-20 max-w-6xl scroll-mt-28 px-4 sm:px-6 sm:mt-28">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Como funciona
            </h2>
            <p className="mt-2 max-w-xl mx-auto text-sm text-white/60">
              Um fluxo simples, do interesse à experiência completa no campus.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className={cn(
                    "rounded-2xl border border-canna-400/20 glass-strong p-5",
                    "transition hover:border-amber-400/25 hover:shadow-lg hover:shadow-black/20"
                  )}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10">
                      <Icon className="size-5 text-amber-200" aria-hidden />
                    </span>
                    <span className="text-xs font-bold text-canna-300/90">{s.n}. {s.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/70">{s.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* trilhas */}
        <section id="trilhas" className="mx-auto mt-20 max-w-6xl scroll-mt-28 px-4 sm:px-6 sm:mt-28">
          <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Cursos e trilhas
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/60 mx-auto sm:mx-0">
                Trilhas pensadas para explorar no campus; matrícula e planos em um só lugar.
              </p>
            </div>
            <Link prefetch={false}
              href="/planos"
              className={cn(
                buttonVariants({ variant: "glass", size: "sm" }),
                "mx-auto shrink-0 border-white/15 sm:mx-0"
              )}
            >
              Planos e matrícula
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trilhas.map((t) => (
              <li key={t.id} id={`trilha-${t.id}`}>
                <div
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-5",
                    "transition hover:border-canna-400/35 hover:bg-white/[0.04]"
                  )}
                >
                  <h3 className="text-base font-bold text-white">{t.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{t.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link prefetch={false}
                      href={CAMPUS_HOME_PATH}
                      className={cn(buttonVariants({ size: "sm", variant: "glass" }), "border-white/12")}
                    >
                      Explorar no mapa
                    </Link>
                    <Link prefetch={false}
                      href="/planos"
                      className={cn(buttonVariants({ size: "sm" }), "font-bold text-ink-900")}
                    >
                      Planos
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* campus vivo */}
        <section id="campus-vivo" className="mx-auto mt-20 max-w-6xl scroll-mt-28 px-4 sm:px-6 sm:mt-28">
          <div
            className={cn(
              "overflow-hidden rounded-3xl border border-amber-400/20 glass-hud p-8 sm:p-10",
              "relative"
            )}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-canna-500/10 blur-3xl"
              aria-hidden
            />
            <div className="relative max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-canna-400/30 bg-canna-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-canna-200">
                <PlayCircle className="size-3.5" aria-hidden />
                Campus vivo
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Navegue áreas, salas e experiências
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/72 sm:text-base">
                O estudante percorre um mapa interativo: cada região revela salas e atividades
                alinhadas às trilhas. É o mesmo universo visual da escola — método, cultura e
                comunidade em um só lugar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link prefetch={false}
                  href={CAMPUS_HOME_PATH}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "font-bold text-ink-900 shadow-lg shadow-canna-500/25"
                  )}
                >
                  Abrir o campus
                  <MapIcon className="size-4" aria-hidden />
                </Link>
                <Link prefetch={false}
                  href={`${CAMPUS_HOME_PATH}?cinema=1`}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "glass" }),
                    "border border-amber-400/25 bg-amber-500/[0.06]"
                  )}
                >
                  Abrir o Cinema
                  <Film className="size-4 text-amber-200/90" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* final CTA */}
        <section
          id="inscricao"
          className="mx-auto mt-20 max-w-6xl scroll-mt-28 px-4 pb-8 sm:px-6 sm:mt-28"
        >
          <div className="rounded-3xl border border-canna-400/25 glass-strong px-6 py-12 text-center sm:px-12">
            <GraduationCap className="mx-auto size-10 text-amber-200/90" aria-hidden />
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Pronto para entrar?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/65 sm:text-base">
              Crie sua conta ou acesse com o e-mail já cadastrado e continue no campus.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link prefetch={false}
                href="/inscrever"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-w-[200px] font-bold text-ink-900 shadow-lg shadow-canna-500/25"
                )}
              >
                Inscrever-se
              </Link>
              <Link prefetch={false}
                href="/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "glass" }),
                  "min-w-[200px] border border-amber-400/25 bg-amber-500/[0.06]"
                )}
              >
                Entrar
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
