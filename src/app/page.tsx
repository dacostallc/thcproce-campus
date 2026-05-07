import Link from "next/link";
import { Leaf, ArrowRight, Sparkles, Award, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Fundo com glow ambiental */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(34, 197, 94, 0.18), transparent 45%),
            radial-gradient(ellipse at 80% 30%, rgba(168, 85, 247, 0.15), transparent 45%),
            radial-gradient(ellipse at 50% 80%, rgba(251, 191, 36, 0.12), transparent 50%),
            linear-gradient(180deg, #050a07 0%, #0a1510 50%, #050a07 100%)
          `
        }}
      />

      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-canna-500/20 border border-canna-400/40 flex items-center justify-center">
            <Leaf size={20} className="text-canna-300" />
          </span>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.2em] text-canna-300/80 font-semibold">
              THCProce
            </div>
            <div className="text-base font-bold">Escola Aberta</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <a className="px-3.5 py-2 rounded-xl text-sm text-white/70 hover:text-white" href="#areas">Áreas</a>
          <a className="px-3.5 py-2 rounded-xl text-sm text-white/70 hover:text-white" href="#planos">Planos</a>
          <a className="px-3.5 py-2 rounded-xl text-sm text-white/70 hover:text-white" href="https://thcproce.com.br/escola/login/index.php">Entrar</a>
        </nav>

        <Link
          href="/campus"
          className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canna-500 hover:bg-canna-400 text-ink-900 font-bold text-sm transition-all shadow-lg shadow-canna-500/30"
        >
          Visitar Campus
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </header>

      <section className="px-6 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-strong text-xs uppercase tracking-[0.15em] text-canna-300 font-semibold mb-6">
            <Sparkles size={14} />
            <span>11 cursos · +600 aulas · certificado oficial</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.02] text-white text-shadow-soft">
            Caminhe pelo nosso{" "}
            <span className="bg-gradient-to-r from-canna-300 via-canna-400 to-amber-300 bg-clip-text text-transparent">
              campus de cannabis
            </span>{" "}
            e aprenda do seu jeito.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/75 max-w-2xl leading-relaxed">
            Não é mais um Moodle. É uma <strong className="text-white">escola viva</strong> — você
            entra, anda pelo campus, escolhe a sala, conhece os professores e os outros alunos.
            Cultivo, extrações, medicina canabinoide, culinária e indústria — todas as áreas, um
            único acesso.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/campus"
              className="group inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-canna-500 hover:bg-canna-400 text-ink-900 font-bold tracking-wide transition-all shadow-xl shadow-canna-500/30 hover:scale-[1.02]"
            >
              <PlayCircle size={20} />
              Entrar no campus
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl glass-strong hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Ver planos · a partir de R$ 100/ano
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            <Stat label="Cursos completos" value="11" />
            <Stat label="Vídeo-aulas" value="600+" />
            <Stat label="Inscritos no YouTube" value="70k" />
            <Stat label="Anos ensinando" value="5+" />
          </div>
        </div>
      </section>

      <section id="areas" className="px-6 pb-24 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
          14 áreas pra explorar no campus
        </h2>
        <p className="text-white/65 max-w-2xl mb-10">
          Da germinação à indústria. Cada construção do mapa é uma porta pra uma sala diferente.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            "Cannabis 101", "Cultivo Greenhouse", "Cultivo Outdoor", "Cultivo Indoor",
            "Genética & Sementes", "Secagem & Cura", "Extrações Solventless", "Extração de Óleo",
            "Medicina Canabinoide", "Culinária", "Laboratório de Análise", "Legislação",
            "Cooperativismo", "Indústria Cannabis"
          ].map((name) => (
            <div
              key={name}
              className="px-4 py-3 rounded-xl glass-strong text-sm font-medium text-white/85 hover:border-canna-400/40 hover:text-canna-200 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-center">
          Acesso por tempo, não por tranca
        </h2>
        <p className="text-white/65 text-center max-w-2xl mx-auto mb-12">
          Todo aluno pagante tem acesso completo às 14 áreas. O que muda entre os planos é
          quanto tempo você fica no campus.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <PlanCard
            name="Mensal"
            price="R$ 19"
            period="/mês"
            features={["Acesso completo às 14 áreas", "Todos os 600+ vídeos", "Prof THC 24h", "Cancelamento livre"]}
          />
          <PlanCard
            name="Anual"
            price="R$ 100"
            period="/ano"
            highlight
            features={["Tudo do mensal", "Certificado oficial", "Comunidade do campus", "Lives ao vivo", "Economia de 56%"]}
          />
          <PlanCard
            name="Vitalício"
            price="R$ 597"
            period="único"
            features={["Acesso permanente", "Avatar exclusivo Master", "Acesso antecipado a novos cursos", "Suporte prioritário"]}
          />
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-white/10 text-center">
        <div className="text-sm text-white/50">
          © 2026 PROCBD — Escola Aberta de Cannabis ·{" "}
          <a href="mailto:procbd@icloud.com" className="hover:text-canna-300">procbd@icloud.com</a>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 rounded-xl glass-strong">
      <div className="text-3xl font-extrabold text-canna-300">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-white/55 mt-0.5">{label}</div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  features,
  highlight
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "relative rounded-2xl p-6 flex flex-col " +
        (highlight
          ? "glass-strong border-canna-400/50 ring-glow-canna"
          : "glass-strong")
      }
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-canna-500 text-ink-900 text-[10px] uppercase tracking-[0.2em] font-bold">
          Mais escolhido
        </div>
      )}
      <div className="text-[11px] uppercase tracking-[0.2em] text-canna-300/80 font-semibold">
        {name}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-white">{price}</span>
        <span className="text-white/55 text-sm">{period}</span>
      </div>
      <ul className="mt-5 space-y-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
            <Award size={14} className="mt-0.5 text-gold-400 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        className={
          "mt-6 px-4 py-3 rounded-xl font-bold tracking-wide transition-colors " +
          (highlight
            ? "bg-canna-500 hover:bg-canna-400 text-ink-900 shadow-lg shadow-canna-500/30"
            : "glass hover:bg-white/10 text-white")
        }
      >
        Quero esse plano
      </button>
    </div>
  );
}
