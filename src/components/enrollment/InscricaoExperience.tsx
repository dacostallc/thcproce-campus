"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  GraduationCap,
  Leaf,
  Lock,
  MapPin,
  Shield,
  Sparkles,
  UserPlus
} from "lucide-react";
import { trpc } from "@/lib/trpc/react";
import { cn } from "@/lib/utils";
import {
  ENROLLMENT_PLANS,
  getPlanById,
  type EnrollmentPlanId
} from "@/config/enrollmentPlans";
import { Button } from "@/components/ui/button";
import { isAbsoluteHttpUrl, lodgerCheckoutHref, CAMPUS_HOME_PATH } from "@/config/siteUrls";

const TERMOS_HREF = "/planos";

export function InscricaoExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("ref");
  const redefinirSenha = searchParams.get("redefinir") === "1";
  const formRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<EnrollmentPlanId | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [cpf, setCpf] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => (selectedPlanId ? getPlanById(selectedPlanId) : undefined),
    [selectedPlanId]
  );

  const register = trpc.enrollment.register.useMutation({
    onSuccess: () => {
      setErrorMsg(null);
      const pay = lodgerCheckoutHref();
      if (isAbsoluteHttpUrl(pay)) {
        window.location.assign(pay);
        return;
      }
      router.push("/planos?conta=criada");
    },
    onError: (e) => {
      setErrorMsg(e.message ?? "Não foi possível concluir o cadastro.");
    }
  });

  const selectPlan = useCallback((id: EnrollmentPlanId) => {
    setSelectedPlanId(id);
    setErrorMsg(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!selectedPlanId) {
      setErrorMsg("Escolha um plano de acesso.");
      return;
    }
    register.mutate({
      email,
      displayName,
      password,
      passwordConfirm,
      whatsapp,
      cpf: cpf.trim() || undefined,
      country,
      city,
      stateRegion,
      planId: selectedPlanId,
      acceptTerms,
      referralCode: referralFromUrl?.trim() || undefined,
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 15% 20%, rgba(34, 197, 94, 0.22), transparent 42%),
            radial-gradient(ellipse at 85% 15%, rgba(168, 85, 247, 0.16), transparent 45%),
            radial-gradient(ellipse at 50% 90%, rgba(251, 191, 36, 0.1), transparent 48%),
            linear-gradient(180deg, #050a07 0%, #0a1810 45%, #050a07 100%)
          `
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-canna-400/40 bg-canna-500/20 shadow-lg shadow-canna-500/10">
            <Leaf size={22} className="text-canna-300" />
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-canna-300/90">
              THCProce
            </div>
            <div className="truncate text-sm font-bold tracking-tight">Matrícula</div>
          </div>
        </Link>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <Button variant="glass" size="sm" className="border-white/15" asChild>
            <Link href={CAMPUS_HOME_PATH}>Campus</Link>
          </Button>
          <Button variant="glass" size="sm" className="border-white/15" asChild>
            <Link href="/entrar">Entrar</Link>
          </Button>
          <Button size="sm" className="hidden font-bold text-ink-900 sm:inline-flex" asChild>
            <Link href={CAMPUS_HOME_PATH}>
              Mapa vivo <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-12 sm:px-5 sm:pb-14">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-canna-400/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-canna-300 glass-strong sm:mb-6"
          >
            <Sparkles size={13} aria-hidden />
            Campus digital
          </motion.div>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Matrícula simples na Escola THCProce
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/72 sm:text-base">
            Escolha o período de acesso, preencha o formulário e conclua o pagamento quando o checkout estiver
            configurado. Depois é só entrar para voltar ao <strong className="text-canna-200">mapa do campus</strong>.
          </p>
        </div>

        {redefinirSenha ? (
          <div
            role="status"
            className="mx-auto mb-10 max-w-2xl rounded-2xl border border-amber-400/40 bg-amber-950/45 px-4 py-3 text-left text-sm leading-relaxed text-amber-50 shadow-lg shadow-black/20 sm:px-5"
          >
            <p className="font-semibold text-amber-200">Só quer mudar a senha?</p>
            <p className="mt-1.5 text-white/85">
              Não precisa escolher plano nem pagar outra vez. Use o formulário dedicado{" "}
              <Link href="/recuperar-senha" className="font-semibold text-canna-300 underline-offset-2 hover:underline">
                Recuperar senha
              </Link>
              {" "}com o mesmo e-mail da conta.
            </p>
          </div>
        ) : null}

        <div
          role="navigation"
          aria-label="Fluxo rápido"
          className="mx-auto mb-10 grid max-w-3xl gap-3 sm:mb-11 sm:grid-cols-3"
        >
          {[
            { n: "1", t: "Escolher plano", d: "Tempo de acesso" },
            { n: "2", t: "Seus dados", d: "Conta e segurança" },
            { n: "3", t: "Entrar no campus", d: "Após criar conta" }
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm backdrop-blur-sm sm:text-left"
            >
              <span className="text-[11px] font-bold text-canna-400">{s.n}</span>
              <p className="font-semibold text-white">{s.t}</p>
              <p className="mt-0.5 text-[11px] text-white/50">{s.d}</p>
            </div>
          ))}
        </div>

        <div
          ref={plansRef}
          id="escolher-plano"
          className="mb-11 grid scroll-mt-28 grid-cols-2 gap-3 sm:mb-14 md:grid-cols-3 lg:grid-cols-5 lg:gap-4"
        >
          {ENROLLMENT_PLANS.map((plan, idx) => {
            const active = selectedPlanId === plan.id;
            return (
              <motion.button
                key={plan.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => selectPlan(plan.id)}
                className={cn(
                  "relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 sm:gap-3",
                  "hover:border-canna-400/50 hover:shadow-lg hover:shadow-canna-500/10",
                  active
                    ? "glass-strong ring-2 ring-canna-400/40 scale-[1.02] border-canna-400/80"
                    : "glass border-white/12",
                  plan.recommended && "lg:ring-1 lg:ring-amber-400/30"
                )}
              >
                {plan.recommended ? (
                  <span className="absolute -top-2.5 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-canna-500 text-ink-900 shadow">
                    Recomendado
                  </span>
                ) : null}
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      active
                        ? "border-canna-400 bg-canna-500/20 text-canna-200"
                        : "border-white/15 text-white/40"
                    )}
                  >
                    {active ? <Check size={16} /> : <span className="text-xs opacity-50">{idx + 1}</span>}
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-canna-200">{plan.priceDisplay}</p>
                <p className="text-xs text-white/55 uppercase tracking-wide">{plan.durationLabel}</p>
                {plan.billingNote ? (
                  <p className="text-xs text-white/45 -mt-1">{plan.billingNote}</p>
                ) : null}
                <ul className="space-y-2 flex-1 mt-1">
                  {plan.benefits.slice(0, 3).map((b) => (
                    <li key={b} className="flex gap-2 text-xs text-white/75 leading-snug">
                      <CheckCircle2 className="shrink-0 h-4 w-4 text-canna-400/90 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <span
                  className={cn(
                    "mt-2 inline-flex justify-center rounded-xl py-2.5 text-sm font-bold transition-colors",
                    active
                      ? "bg-canna-500 text-ink-900"
                      : "bg-white/10 text-white hover:bg-white/15"
                  )}
                >
                  Escolher plano
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedPlan ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-canna-400/25 glass-strong px-4 py-4 sm:px-5"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-canna-300 font-semibold">
                  Plano selecionado
                </p>
                <p className="text-xl font-bold text-white">
                  {selectedPlan.name}{" "}
                  <span className="text-canna-200 font-extrabold ml-2">{selectedPlan.priceDisplay}</span>
                </p>
                <p className="text-sm text-white/65">{selectedPlan.durationLabel} · matrícula digital</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
                <Shield size={14} className="text-canna-400 shrink-0" />
                <span>
                  Após criar a conta você será levado ao pagamento (link externo) ou à página de planos para concluir.
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div ref={formRef} className="max-w-3xl mx-auto">
          <motion.div
            initial={false}
            className={cn(
              "rounded-3xl border border-white/10 glass-strong p-6 shadow-2xl shadow-black/40 sm:p-8",
              !selectedPlanId && "pointer-events-none opacity-55"
            )}
          >
            <div className="mb-6 flex flex-wrap items-start gap-3 sm:mb-8 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-canna-400/30 bg-canna-500/15">
                <UserPlus className="text-canna-300" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-white sm:text-xl">Formulário de matrícula</h2>
                <p className="mt-1 text-sm leading-snug text-white/58">
                  {selectedPlanId
                    ? "Dados protegidos; após criar a conta você segue para o pagamento quando estiver disponível — ou volta aqui quando quiser."
                    : "Selecione um plano na grade acima para habilitar os campos."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Nome completo"
                  icon={<GraduationCap size={16} />}
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Como no documento"
                  autoComplete="name"
                />
                <Field
                  label="E-mail"
                  icon={<Lock size={16} />}
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="WhatsApp"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+55 · DDD · número"
                />
                <Field
                  label="CPF (opcional)"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="Somente números"
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field
                  label="País"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country-name"
                />
                <Field
                  label="Cidade"
                  icon={<MapPin size={16} />}
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Field
                  label="Estado / região"
                  required
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="SP, PR..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Senha"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                />
                <Field
                  label="Confirmar senha"
                  required
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-canna-400/40 bg-black/30 text-canna-500 focus:ring-canna-500"
                />
                <span className="text-sm text-white/70 leading-snug">
                  Li e aceito os{" "}
                  <a
                    href={TERMOS_HREF}
                    target="_blank"
                    rel="noreferrer"
                    className="text-canna-300 font-semibold hover:underline"
                  >
                    termos da escola
                  </a>{" "}
                  e autorizo o uso dos dados para matrícula e comunicações do campus.
                </span>
              </label>

              {errorMsg ? (
                <div className="rounded-xl border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
                  {errorMsg}
                </div>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={!selectedPlanId || register.isPending}
                className="w-full min-w-[220px] font-bold text-ink-900 sm:w-auto"
              >
                {register.isPending ? "Criando conta…" : "Criar conta e seguir"}
              </Button>

              <p className="text-center text-xs leading-relaxed text-white/45 sm:text-left">
                Quando terminar, acesse{" "}
                <Link href="/entrar" className="font-semibold text-canna-300 underline-offset-4 hover:underline">
                  Entrar
                </Link>{" "}
                e abra o{" "}
                <Link href={CAMPUS_HOME_PATH} className="font-semibold text-canna-300 underline-offset-4 hover:underline">
                  campus interativo
                </Link>
                .
              </p>
            </form>
          </motion.div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-canna-400/25 bg-canna-500/[0.08] px-5 py-6 text-center backdrop-blur-sm sm:mt-14 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:text-left">
          <div className="min-w-0 sm:flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/90">
              Depois da matrícula
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/78">
              Use seu e-mail e senha para entrar; o mapa e as salas respeitam o calendário e o estado da sua conta.
            </p>
          </div>
          <div className="mt-5 flex shrink-0 flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-3">
            <Button size="lg" className="w-full font-bold text-ink-900 sm:w-auto" asChild>
              <Link href={CAMPUS_HOME_PATH}>Entrar no campus</Link>
            </Button>
            <Button variant="glass" size="lg" className="w-full border-white/15 sm:w-auto" asChild>
              <Link href="/entrar">Ir para login</Link>
            </Button>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-lg text-center text-xs leading-relaxed text-white/42">
          Só quer explorar antes de comprar?{" "}
          <Link href={CAMPUS_HOME_PATH} className="font-semibold text-canna-300 hover:underline">
            Abrir o mapa ao vivo
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  icon,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold flex items-center gap-2">
        {icon}
        {label}
        {required ? <span className="text-canna-400">*</span> : null}
      </span>
      <input
        className={cn(
          "w-full rounded-xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-white",
          "placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-canna-500/50 focus:border-canna-400/50"
        )}
        required={required}
        {...props}
      />
    </label>
  );
}
