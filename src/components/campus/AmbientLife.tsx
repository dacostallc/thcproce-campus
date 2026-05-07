"use client";

import { useMemo } from "react";

type Phase = "day" | "night";

/**
 * Camada de "vida ambiente" CSS-only sobre o mapa do campus.
 * `phase`: de noite, vagalumes e vinheta mais fortes; de dia, efeitos mais leves (sol).
 */
export function AmbientLife({ phase = "night" }: { phase?: Phase }) {
  const fireflyCount = phase === "day" ? 10 : 30;
  const fireflies = useMemo(
    () =>
      Array.from({ length: fireflyCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 30 + Math.random() * 60,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 5,
        size: 1.5 + Math.random() * 2.5
      })),
    [phase]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Drone 1 — alto, da esquerda pra direita */}
      <div
        className="absolute top-[6%] animate-droneFly"
        style={{ animationDuration: "26s" }}
      >
        <Drone tint="#a78bfa" />
      </div>

      {/* Drone 2 — meio, da direita pra esquerda */}
      <div
        className="absolute top-[18%] animate-droneFly2"
        style={{ animationDuration: "34s" }}
      >
        <Drone tint="#67e8f9" />
      </div>

      {/* Carro na rua de baixo */}
      <div
        className="absolute bottom-[6%] left-0 animate-carPass"
        style={{ animationDuration: "16s", animationDelay: "3s" }}
      >
        <CarLights />
      </div>
      <div
        className="absolute bottom-[8%] left-0 animate-carPass"
        style={{ animationDuration: "22s", animationDelay: "10s" }}
      >
        <CarLights tint="#fde68a" />
      </div>

      {/* Vagalumes */}
      {fireflies.map((f) => (
        <span
          key={f.id}
          className="absolute rounded-full bg-canna-300 animate-firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            opacity: phase === "day" ? 0.45 : 1,
            boxShadow: "0 0 8px 2px rgba(74,222,128,0.7)"
          }}
        />
      ))}

      {/* Janelas piscando — sobre os edifícios da imagem real */}
      <FlickerSpot x={62} y={9} color="#c084fc" size={90} />
      <FlickerSpot x={87} y={11} color="#67e8f9" size={70} />
      <FlickerSpot x={92} y={13} color="#67e8f9" size={50} />
      <FlickerSpot x={42} y={36} color="#fbbf24" size={120} />
      <FlickerSpot x={72} y={47} color="#fbbf24" size={60} />
      <FlickerSpot x={78} y={65} color="#fbbf24" size={50} />
      <FlickerSpot x={14} y={11} color="#86efac" size={80} />
      <FlickerSpot x={40} y={11} color="#86efac" size={60} />
      <FlickerSpot x={42} y={82} color="#67e8f9" size={50} />

      {/* Vinheta: mais forte à noite, suave durante o dia */}
      <div
        className={
          phase === "day"
            ? "absolute inset-0 opacity-35 pointer-events-none"
            : "absolute inset-0 vignette"
        }
        style={
          phase === "day"
            ? {
                background:
                  "radial-gradient(ellipse at center, transparent 58%, rgba(15,23,42,0.25) 100%)"
              }
            : undefined
        }
      />
    </div>
  );
}

function Drone({ tint }: { tint: string }) {
  return (
    <svg width="44" height="22" viewBox="0 0 44 22" className="opacity-90">
      <defs>
        <radialGradient id={`g-${tint}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={tint} stopOpacity="1" />
          <stop offset="100%" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="6" cy="11" r="6" fill={`url(#g-${tint})`} />
      <circle cx="38" cy="11" r="6" fill={`url(#g-${tint})`} />
      <rect x="14" y="9" width="16" height="4" rx="2" fill="#0a0f0c" />
      <circle cx="6" cy="11" r="1.5" fill={tint} />
      <circle cx="38" cy="11" r="1.5" fill={tint} />
    </svg>
  );
}

function CarLights({ tint = "#fef3c7" }: { tint?: string }) {
  return (
    <div className="relative">
      <span
        className="block w-2 h-2 rounded-full"
        style={{
          background: tint,
          boxShadow: `0 0 18px 6px ${tint}`,
          opacity: 0.95
        }}
      />
    </div>
  );
}

function FlickerSpot({
  x,
  y,
  color,
  size
}: {
  x: number;
  y: number;
  color: string;
  size: number;
}) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-windowFlicker"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(closest-side, ${color}55, transparent 70%)`,
        mixBlendMode: "screen"
      }}
    />
  );
}
