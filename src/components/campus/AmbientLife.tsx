"use client";

import { cn } from "@/lib/utils";

type Phase = "day" | "night";

/**
 * Camada de "vida ambiente" CSS-only sobre o mapa do campus.
 * Luzes flutuantes leves ficam em `CampusAmbientSparks`. `phase` atenua vinheta de dia/noite.
 * Animações horizontais usam a largura do frame (`left` + trilho), nunca `vw`, para não invadir letterbox.
 */
export function AmbientLife({ phase = "night" }: { phase?: Phase }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Drone 1 — alto, da esquerda pra direita */}
      <div className="pointer-events-none absolute left-0 right-0 top-[6%] h-[24px] overflow-hidden">
        <div className="absolute top-0 h-[22px] w-[44px] motion-reduce:!animate-none campus-map-ambient-drone-a">
          <Drone tint="#8b9aaf" />
        </div>
      </div>

      {/* Drone 2 — meio, da direita pra esquerda */}
      <div className="pointer-events-none absolute left-0 right-0 top-[18%] h-[24px] overflow-hidden">
        <div
          className={cn(
            "absolute top-0 h-[22px] w-[44px] motion-reduce:!animate-none campus-map-ambient-drone-b",
            /* defasagem para não sincronizar com o primeiro */
            "[animation-delay:-12s]"
          )}
        >
          <Drone tint="#7eb8c8" />
        </div>
      </div>

      {/* Carro na rua de baixo */}
      <div className="pointer-events-none absolute bottom-[6%] left-0 right-0 h-[12px] overflow-hidden">
        <div
          className="absolute bottom-0 h-2 w-2 motion-reduce:!animate-none campus-map-ambient-car-a"
          style={{ animationDelay: "2s" }}
        >
          <CarLights />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-[8%] left-0 right-0 h-[12px] overflow-hidden">
        <div
          className="absolute bottom-0 h-2 w-2 motion-reduce:!animate-none campus-map-ambient-car-b"
          style={{ animationDelay: "1s" }}
        >
          <CarLights tint="#fde68a" />
        </div>
      </div>

      {/* Janelas piscando — sobre os edifícios da imagem real */}
      <FlickerSpot x={62} y={9} color="#a894b8" size={56} />
      <FlickerSpot x={87} y={11} color="#7eb0b8" size={44} />
      <FlickerSpot x={92} y={13} color="#7aa8b0" size={34} />
      <FlickerSpot x={42} y={36} color="#c9aa6a" size={72} />
      <FlickerSpot x={72} y={47} color="#b89a62" size={40} />
      <FlickerSpot x={78} y={65} color="#a89058" size={34} />
      <FlickerSpot x={14} y={11} color="#8eb898" size={50} />
      <FlickerSpot x={40} y={11} color="#8cb090" size={40} />
      <FlickerSpot x={42} y={82} color="#78a8b0" size={36} />

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
    <svg width="44" height="22" viewBox="0 0 44 22" className="opacity-38">
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
        className="block h-2 w-2 rounded-full"
        style={{
          background: tint,
          boxShadow: `0 0 6px 1px rgba(255,246,230,0.1)`,
          opacity: 0.48
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
        background: `radial-gradient(closest-side, ${color}20, transparent 76%)`,
        mixBlendMode: "soft-light"
      }}
    />
  );
}
