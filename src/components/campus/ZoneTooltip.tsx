"use client";

type Props = {
  open: boolean;
  x: number;
  y: number;
  zoneName: string;
  /** Ex.: Desbloqueada / Bloqueada / Em live */
  statusLine: string;
  /** Requisitos ou detalhe extra. */
  detail: string | null;
};

/** Tooltip único global — posição em px (client), segue o rato no pai. */
export function ZoneTooltip({ open, x, y, zoneName, statusLine, detail }: Props) {
  if (!open) return null;

  const pad = 14;
  const maxLeft =
    typeof window !== "undefined" ? Math.max(8, window.innerWidth - 280) : x + pad;

  return (
    <div
      className="pointer-events-none fixed z-[45] max-w-[min(18rem,calc(100vw-1.5rem))] rounded-xl campus-hud-glass px-3.5 py-2.5 text-left"
      style={{
        left: Math.min(x + pad, maxLeft),
        top: y + pad
      }}
      role="tooltip"
    >
      <p className="text-[13px] font-semibold text-white/95 text-shadow-soft">{zoneName}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-canna-200/85">
        {statusLine}
      </p>
      {detail ? (
        <p className="mt-1.5 text-[12px] leading-snug text-white/75">{detail}</p>
      ) : null}
    </div>
  );
}
