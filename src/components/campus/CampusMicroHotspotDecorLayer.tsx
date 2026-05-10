import { cn } from "@/lib/utils";
import { CAMPUS_MICRO_HOTSPOTS } from "@/data/campusMicroHotspotsCatalog";

/** Marcadores contextuais — só decoração + `title` (descendentes recebem hover; área mínima). */
export function CampusMicroHotspotDecorLayer({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {CAMPUS_MICRO_HOTSPOTS.map((m) => (
        <div
          key={m.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.xPercent}%`, top: `${m.yPercent}%` }}
          title={`${m.labelPt} — ${m.hintPt}`}
        >
          <div className="group flex cursor-default flex-col items-center opacity-[0.06] transition duration-300 ease-out hover:opacity-100 motion-reduce:transition-none motion-reduce:hover:opacity-[0.08]">
            <div className="h-2 w-2 rounded-full bg-emerald-400/70 shadow-[0_0_10px_rgba(52,211,153,0.45)] ring-1 ring-white/25 transition duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(52,211,153,0.55)] motion-reduce:group-hover:scale-100" />
            <span className="mt-1 max-w-[7rem] text-center text-[7px] font-semibold uppercase tracking-[0.12em] text-white/55 group-hover:text-white/92">
              {m.shortLabelPt}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
