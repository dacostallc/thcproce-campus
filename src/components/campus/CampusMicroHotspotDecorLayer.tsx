import { cn } from "@/lib/utils";
import { CAMPUS_MICRO_HOTSPOTS } from "@/data/campusMicroHotspotsCatalog";

/** Marcadores contextuais — só decoração + `title` nativo (sem hits próprios). */
export function CampusMicroHotspotDecorLayer({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {CAMPUS_MICRO_HOTSPOTS.map((m) => (
        <div
          key={m.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: `${m.xPercent}%`, top: `${m.yPercent}%` }}
          title={`${m.labelPt} — ${m.hintPt}`}
        >
          <div className="h-2 w-2 rounded-full bg-emerald-400/65 shadow-[0_0_10px_rgba(52,211,153,0.45)] ring-1 ring-white/25" />
          <span className="mt-1 max-w-[7rem] text-center text-[7px] font-semibold uppercase tracking-[0.12em] text-white/38">
            {m.shortLabelPt}
          </span>
        </div>
      ))}
    </div>
  );
}
