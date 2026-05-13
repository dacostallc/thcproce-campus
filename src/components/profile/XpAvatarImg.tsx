"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE, getAvatarByXp } from "@/lib/progression/avatars";

type Props = {
  xp: number;
  className?: string;
  sizes?: string;
  /** Se definido, sobrepõe o alt automático. */
  alt?: string;
};

/**
 * Imagem de avatar por XP com fallback se o ficheiro em `public/avatar/` falhar.
 */
export function XpAvatarImg({ xp, className, sizes, alt }: Props) {
  const info = getAvatarByXp(xp);
  const [src, setSrc] = useState(info.imageSrc);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- fallback dinâmico onError; PNG estáticos locais
    <img
      src={src}
      alt={alt ?? `Avatar ${info.label} · ${xp} XP`}
      sizes={sizes}
      className={cn(
        "box-border max-h-full max-w-full object-contain object-center align-middle",
        "-translate-y-0.5 drop-shadow-2xl",
        className
      )}
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  );
}
