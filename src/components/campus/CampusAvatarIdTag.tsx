"use client";

import { cn } from "@/lib/utils";
import type { CampusUserRole } from "@/config/userRoles";
import { USER_ROLE_STYLE } from "@/config/userRoles";

type Viewer = "self" | "peer";

type Props = {
  displayName: string;
  xpTotal: number;
  campusRole: CampusUserRole;
  memberSinceIso: string | null;
  cinemaMode: boolean;
  viewer: Viewer;
};

function formatXp(n: number) {
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function formatMemberSince(iso: string): string | null {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(d);
  } catch {
    return null;
  }
}

/**
 * Etiqueta ~20px acima da cabeça (marginBottom 20). Seta (::after).
 * pointer-events-none — cliques atravessam para o mapa.
 */
export function CampusAvatarIdTag({
  displayName,
  xpTotal,
  campusRole,
  memberSinceIso,
  cinemaMode,
  viewer
}: Props) {
  const rs = USER_ROLE_STYLE[campusRole];
  const name = (displayName || "Aluno THC").trim().slice(0, 22) || "Aluno THC";
  const xpFmt = formatXp(xpTotal);
  const emoji = rs.leadingEmoji;

  const isSelf = viewer === "self";
  const opacityClass =
    isSelf === true
      ? "opacity-100"
      : cinemaMode
        ? "opacity-[0.78] [@media(any-pointer:coarse)]:opacity-90 group-hover:opacity-100"
        : "opacity-60 [@media(any-pointer:coarse)]:opacity-80 group-hover:opacity-100";

  const sinceLabel =
    viewer === "peer" && memberSinceIso
      ? formatMemberSince(memberSinceIso)
      : null;

  const borderCss = `${rs.borderWidthPx}px solid ${rs.borderHex}`;

  const adminGlow = USER_ROLE_STYLE.admin.glowBoxShadow ?? "";
  const useOuterAdminHalo =
    campusRole === "admin" && viewer === "peer" && cinemaMode === false;

  const cardShadow =
    campusRole !== "admin"
      ? "0 2px 12px rgba(0,0,0,0.35)"
      : useOuterAdminHalo
        ? "0 2px 10px rgba(0,0,0,0.45)"
        : adminGlow;

  const innerCard = (
    <div
      className={cn(
        "pointer-events-none relative z-[1] min-w-[6.85rem] max-w-[13rem] rounded-lg px-2 pb-1 pt-[7px] text-center shadow-md transition-opacity duration-200 ease-out font-sans antialiased",
        rs.fontBold && "font-bold",
        opacityClass,
        "after:pointer-events-none after:absolute after:left-1/2 after:top-full after:z-0 after:-ml-[6px] after:border-[6px] after:border-transparent after:border-t-black/55 after:content-['']"
      )}
      style={{
        marginBottom: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        WebkitBackdropFilter: "blur(4px)",
        backdropFilter: "blur(4px)",
        border: borderCss,
        boxShadow: cardShadow
      }}
      aria-hidden
    >
      <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0 px-0.5 text-[10px] leading-snug tracking-wide">
        {emoji ? (
          <span className="shrink-0 leading-none" aria-hidden>
            {emoji}
          </span>
        ) : null}
        <span
          className="min-w-0 max-w-[8rem] truncate normal-case"
          style={{ color: rs.nameColorHex }}
        >
          {name}
        </span>
        <span style={{ color: rs.separatorColorHex }} aria-hidden>
          •
        </span>
        <span
          className="shrink-0 tabular-nums font-medium"
          style={{ color: rs.xpColorHex }}
        >
          XP {xpFmt}
        </span>
      </p>
      {sinceLabel ? (
        <p
          className={cn(
            "pointer-events-none mx-auto mt-1 max-w-[11.5rem] border-t border-white/10 px-1 pt-1 text-center font-sans text-[9px] font-normal tracking-wide text-white/78",
            "hidden max-md:block md:hidden md:group-hover:block"
          )}
        >
          Membro desde {sinceLabel}
        </p>
      ) : null}
    </div>
  );

  /* Halo extra apenas admin em peer fora do overlay (chefão na multidão) */
  if (useOuterAdminHalo && USER_ROLE_STYLE.admin.outerGlowFilter) {
    return (
      <div className="relative z-[22] mx-auto flex flex-col items-center">
        <div
          className="pointer-events-none flex flex-col items-center rounded-[11px] p-[2px]"
          style={{
            marginBottom: 0,
            background:
              "linear-gradient(155deg, rgba(251,191,36,0.55), rgba(245,158,11,0.14))",
            boxShadow: adminGlow,
            filter: USER_ROLE_STYLE.admin.outerGlowFilter
          }}
        >
          {innerCard}
        </div>
      </div>
    );
  }

  return <div className="relative z-[22] mx-auto flex flex-col items-center">{innerCard}</div>;
}
