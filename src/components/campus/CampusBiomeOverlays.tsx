"use client";

import { campusBiomeBackgroundImage } from "@/lib/campusWorldPlan";
import { cn } from "@/lib/utils";

type Props = {
  phase: "day" | "night";
};

/**
 * Camada única de “climas” por distrito — reforça leitura espacial sem DOM pesado.
 */
export function CampusBiomeOverlays({ phase }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[6] transition-opacity duration-700 ease-out",
        phase === "day" ? "opacity-[0.82]" : "opacity-100"
      )}
      style={{
        backgroundImage: campusBiomeBackgroundImage(phase),
        backgroundColor: "transparent",
        /* normal: gradientes já são subtis; soft-light lavava contraste e “some” traços no escuro */
        mixBlendMode: "normal"
      }}
      aria-hidden
    />
  );
}
