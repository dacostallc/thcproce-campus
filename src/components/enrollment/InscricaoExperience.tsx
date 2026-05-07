"use client";

import Link from "next/link";
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

const TERMOS_HREF = "https://thcproce.com.br/escola";

export function InscricaoExperience() {
  const formRef = useRef<HTMLDivElement>(null);
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

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => (selectedPlanId ? getPlanById(selectedPlanId) : undefined),
    [selectedPlanId]
  );

  const register = trpc.enrollment.register.useMutation({
    onSuccess: () => {
      setErrorMsg(null);
      setSuccess(true);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      acceptTerms
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

      <header className="relative z-10 px-5 py-5 max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-10 h-10 rounded-xl bg-canna-500/20 border border-canna-400/40 flex items-center justify-center shadow-lg shadow-canna-500/10">
            <Leaf size={22} className="text-canna-300" />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-canna-300/90 font-semibold">
              THCProce
            </div>
            <div className="text-sm font-bold tracking-tight">Matrícula no campus</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" className="border-white/15" asChild>
            <Link href="/entrar">Já tenho conta</Link>
          </Button>
          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/campus">
              Ver campus <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 px-5 pb-10 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-xs uppercase tracking-[0.15em] text-canna-300 font-semibold mb-6 border border-canna-400/30"
          >
            <Sparkles size={14} />
            <span>Pré-lançamento fundador</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-shadow-soft">
            Entre no{" "}
            <span className="bg-gradient-to-r from-canna-300 via-canna-400 to-amber-300 bg-clip-text text-transparent">
              Campus THCProce
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
            Fase de pré-lançamento fundador: valores promocionais para a primeira comunidade da
            universidade digital de cannabis. O catálogo de aulas e materiais cresce por etapas —
            sem promessa de título ou biblioteca finalizada nesta fase.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 mb-14">
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
                  "relative text-left rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300",
                  "hover:border-canna-400/50 hover:shadow-xl hover:shadow-canna-500/10",
                  active
                    ? "border-canna-400/80 glass-strong ring-2 ring-canna-400/40 scale-[1.02]"
                    : "border-white/12 glass",
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
              className="mb-8 rounded-2xl border border-canna-400/25 glass-strong px-5 py-4 flex flex-wrap items-center justify-between gap-3"
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
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Shield size={14} className="text-canna-400" />
                <span>Checkout (PIX, cartão, gateways) em integração futura</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div ref={formRef} className="max-w-3xl mx-auto">
          <motion.div
            initial={false}
            className={cn(
              "rounded-3xl border border-white/10 glass-strong p-6 sm:p-8 shadow-2xl shadow-black/40",
              !selectedPlanId && "opacity-60 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-canna-500/15 border border-canna-400/30 flex items-center justify-center">
                <UserPlus className="text-canna-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Seus dados na comunidade</h2>
                <p className="text-sm text-white/55">
                  {selectedPlanId
                    ? "Complete para efetivar a pré-matrícula. O acesso segue pendente até confirmarmos o pagamento."
                    : "Primeiro escolha um plano acima para liberar o formulário."}
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
                className="w-full sm:w-auto min-w-[220px] font-bold text-ink-900"
              >
                {register.isPending ? "Enviando…" : "Concluir inscrição"}
              </Button>
            </form>
          </motion.div>
        </div>

        <p className="text-center text-xs text-white/40 mt-10 max-w-xl mx-auto leading-relaxed">
          Moodle e certificados aparecem no fluxo quando o WS estiver ativo; até lá, nada disso bloqueia
          sua inscrição. Pagamento via provedores listados na documentação interna quando ativados.
        </p>
      </section>

      <AnimatePresence>
        {success && selectedPlan ? (
          <SuccessOverlay
            planName={selectedPlan.name}
            price={selectedPlan.priceDisplay}
            onDismiss={() => setSuccess(false)}
          />
        ) : null}
      </AnimatePresence>
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

function SuccessOverlay({
  planName,
  price,
  onDismiss
}: {
  planName: string;
  price: string;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg w-full rounded-3xl border border-canna-400/35 glass-strong p-8 text-center shadow-2xl"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-canna-500/20 border border-canna-400/40">
          <CheckCircle2 className="h-9 w-9 text-canna-300" />
        </div>
        <h3 className="text-2xl font-extrabold text-white">Cadastro recebido</h3>
        <p className="mt-2 text-white/70">
          Plano: <strong className="text-canna-200">{planName}</strong> ({price})
        </p>
        <p className="mt-4 text-sm text-white/60 leading-relaxed">
          Próximo passo: confirmação de pagamento e liberação do acesso. Enviaremos atualizações no
          e-mail cadastrado assim que o campus estiver ativo na sua conta.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="font-bold text-ink-900">
            <Link href="/campus" onClick={onDismiss}>
              Entrar no campus
            </Link>
          </Button>
          <Button variant="glass" asChild>
            <Link href="/entrar" onClick={onDismiss}>
              Fazer login
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
