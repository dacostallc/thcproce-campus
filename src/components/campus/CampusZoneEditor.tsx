"use client";

import type { CSSProperties } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN } from "@/lib/campusArt";
import { rectRecordsFromCampusDefinitions } from "@/lib/campusZoneEditorRectsFromData";
import {
  campusZoneEditorFileSchema,
  CAMPUS_ZONE_EDITOR_LS_KEY,
  clamp,
  newZoneId,
  type CampusZoneRectRecord
} from "@/lib/campusZoneEditorTypes";
import { cn } from "@/lib/utils";
import {
  Download,
  FolderOpen,
  Image as ImageIcon,
  Moon,
  Plus,
  Sun,
  Trash2
} from "lucide-react";

const MIN_DIM = 0.6;
const BG_NIGHT = "/campus/campus.png";
const BG_DAY = "/campus/campus-day.png";

type Sky = "night" | "day";

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

type Interaction =
  | {
      kind: "draw";
      startX: number;
      startY: number;
    }
  | {
      kind: "move";
      id: string;
      grabX: number;
      grabY: number;
    }
  | {
      kind: "resize";
      id: string;
      handle: ResizeHandle;
      startRect: { x: number; y: number; width: number; height: number };
      startX: number;
      startY: number;
    };

function pctFromClient(clientX: number, clientY: number, stage: DOMRect) {
  const x = ((clientX - stage.left) / stage.width) * 100;
  const y = ((clientY - stage.top) / stage.height) * 100;
  return { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
}

function normalizeRect(
  ax: number,
  ay: number,
  bx: number,
  by: number
): { x: number; y: number; width: number; height: number } {
  const x = Math.min(ax, bx);
  const y = Math.min(ay, by);
  const width = Math.abs(bx - ax);
  const height = Math.abs(by - ay);
  return { x, y, width, height };
}

function applyResize(
  handle: ResizeHandle,
  start: { x: number; y: number; width: number; height: number },
  dx: number,
  dy: number
): { x: number; y: number; width: number; height: number } {
  let { x, y, width: w, height: h } = start;

  switch (handle) {
    case "e":
      w = start.width + dx;
      break;
    case "w":
      x = start.x + dx;
      w = start.width - dx;
      break;
    case "s":
      h = start.height + dy;
      break;
    case "n":
      y = start.y + dy;
      h = start.height - dy;
      break;
    case "se":
      w = start.width + dx;
      h = start.height + dy;
      break;
    case "sw":
      x = start.x + dx;
      w = start.width - dx;
      h = start.height + dy;
      break;
    case "ne":
      y = start.y + dy;
      h = start.height - dy;
      w = start.width + dx;
      break;
    case "nw":
      x = start.x + dx;
      w = start.width - dx;
      y = start.y + dy;
      h = start.height - dy;
      break;
    default:
      break;
  }

  if (w < 0) {
    x += w;
    w = -w;
  }
  if (h < 0) {
    y += h;
    h = -h;
  }

  w = Math.max(MIN_DIM, w);
  h = Math.max(MIN_DIM, h);
  x = clamp(x, 0, 100 - w);
  y = clamp(y, 0, 100 - h);
  w = clamp(w, MIN_DIM, 100 - x);
  h = clamp(h, MIN_DIM, 100 - y);

  return { x, y, width: w, height: h };
}

const CATEGORY_PRESETS = [
  "Cultivo",
  "Laboratório",
  "Medicina",
  "Culinária",
  "Social",
  "Logística",
  "Entrada"
] as const;

/** RGB de pré-visualização por categoria (editor). */
const CATEGORY_PREVIEW_RGB: Record<string, { r: number; g: number; b: number }> =
  {
    Cultivo: { r: 124, g: 255, b: 91 },
    Laboratório: { r: 34, g: 211, b: 238 },
    Medicina: { r: 96, g: 165, b: 250 },
    Culinária: { r: 234, g: 179, b: 8 },
    Social: { r: 168, g: 85, b: 247 },
    Logística: { r: 249, g: 115, b: 22 },
    Entrada: { r: 236, g: 72, b: 153 }
  };

const HANDLE_CURSOR: Record<ResizeHandle, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize"
};

function zoneStylePreview(
  category: string,
  previewOpacity: number,
  glowOn: boolean
): CSSProperties {
  const { r, g, b } = CATEGORY_PREVIEW_RGB[category] ?? {
    r: 148,
    g: 163,
    b: 184
  };
  const fill = `rgba(${r},${g},${b},${previewOpacity * 0.22})`;
  const stroke = `rgba(${r},${g},${b},${previewOpacity * 0.95 + 0.08})`;
  const glow = glowOn
    ? `0 0 10px rgba(${r},${g},${b},0.35), 0 0 22px rgba(${r},${g},${b},0.15)`
    : undefined;
  return {
    backgroundColor: fill,
    border: `1.5px solid ${stroke}`,
    boxShadow: glow
  };
}

export function CampusZoneEditor() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const zonesRef = useRef<CampusZoneRectRecord[]>([]);

  const [zones, setZones] = useState<CampusZoneRectRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sky, setSky] = useState<Sky>("night");
  const [previewOpacity, setPreviewOpacity] = useState(0.42);
  const [glowOn, setGlowOn] = useState(true);
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [draftRect, setDraftRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  zonesRef.current = zones;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CAMPUS_ZONE_EDITOR_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        const r = campusZoneEditorFileSchema.safeParse(parsed);
        if (r.success) setZones(r.data.zones);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      zones
    };
    try {
      localStorage.setItem(CAMPUS_ZONE_EDITOR_LS_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [zones, hydrated]);

  const selected = useMemo(
    () => zones.find((z) => z.id === selectedId) ?? null,
    [zones, selectedId]
  );

  const stageBox = useCallback((): DOMRect | null => {
    return stageRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const updateZone = useCallback(
    (id: string, patch: Partial<CampusZoneRectRecord>) => {
      setZones((prev) =>
        prev.map((z) => (z.id === id ? { ...z, ...patch } : z))
      );
    },
    []
  );

  const deleteZone = useCallback((id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    setSelectedId((s) => (s === id ? null : s));
  }, []);

  const onZoneMouseDown = (e: React.MouseEvent, z: CampusZoneRectRecord) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const box = stageBox();
    if (!box) return;
    const { x, y } = pctFromClient(e.clientX, e.clientY, box);
    setSelectedId(z.id);
    setInteraction({
      kind: "move",
      id: z.id,
      grabX: x - z.x,
      grabY: y - z.y
    });
  };

  const onStageMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const box = stageBox();
    if (!box) return;
    const { x, y } = pctFromClient(e.clientX, e.clientY, box);

    setSelectedId(null);
    setInteraction({ kind: "draw", startX: x, startY: y });
    setDraftRect({ x, y, width: 0, height: 0 });
  };

  const onHandleDown = (
    e: React.MouseEvent,
    id: string,
    handle: ResizeHandle,
    zone: CampusZoneRectRecord
  ) => {
    e.stopPropagation();
    const box = stageBox();
    if (!box) return;
    const { x, y } = pctFromClient(e.clientX, e.clientY, box);
    setSelectedId(id);
    setInteraction({
      kind: "resize",
      id,
      handle,
      startRect: { x: zone.x, y: zone.y, width: zone.width, height: zone.height },
      startX: x,
      startY: y
    });
  };

  useEffect(() => {
    if (!interaction) return;

    const onMove = (ev: MouseEvent) => {
      const box = stageRef.current?.getBoundingClientRect();
      if (!box) return;
      const { x: cx, y: cy } = pctFromClient(ev.clientX, ev.clientY, box);

      if (interaction.kind === "draw") {
        const n = normalizeRect(interaction.startX, interaction.startY, cx, cy);
        setDraftRect(n);
        return;
      }

      if (interaction.kind === "move") {
        const cur = zonesRef.current.find((zz) => zz.id === interaction.id);
        if (!cur) return;
        const nx = clamp(cx - interaction.grabX, 0, 100);
        const ny = clamp(cy - interaction.grabY, 0, 100);
        const w = cur.width;
        const h = cur.height;
        setZones((prev) =>
          prev.map((zz) =>
            zz.id === interaction.id
              ? {
                  ...zz,
                  x: clamp(nx, 0, 100 - w),
                  y: clamp(ny, 0, 100 - h)
                }
              : zz
          )
        );
        return;
      }

      if (interaction.kind === "resize") {
        const dx = cx - interaction.startX;
        const dy = cy - interaction.startY;
        const next = applyResize(interaction.handle, interaction.startRect, dx, dy);
        setZones((prev) =>
          prev.map((zz) =>
            zz.id === interaction.id ? { ...zz, ...next } : zz
          )
        );
      }
    };

    const onUp = (ev: MouseEvent) => {
      if (interaction.kind === "draw") {
        const box = stageRef.current?.getBoundingClientRect();
        if (box) {
          const { x: cx, y: cy } = pctFromClient(ev.clientX, ev.clientY, box);
          const n = normalizeRect(interaction.startX, interaction.startY, cx, cy);
          if (n.width >= MIN_DIM && n.height >= MIN_DIM) {
            const rec: CampusZoneRectRecord = {
              id: newZoneId(),
              label: "Nova zona",
              x: n.x,
              y: n.y,
              width: n.width,
              height: n.height,
              category: "Cultivo",
              courseIds: []
            };
            setZones((prev) => [...prev, rec]);
            setSelectedId(rec.id);
          }
        }
      }
      setInteraction(null);
      setDraftRect(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [interaction]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (document.activeElement?.tagName === "INPUT") return;
        if (selectedId) deleteZone(selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, deleteZone]);

  const exportJson = () => {
    const payload = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      zones
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "campus-zones-rects.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJsonFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      const r = campusZoneEditorFileSchema.safeParse(data);
      if (!r.success) {
        alert("JSON inválido: exija version: 1 e lista zones.");
        return;
      }
      setZones(r.data.zones);
      setSelectedId(r.data.zones[0]?.id ?? null);
    } catch {
      alert("Não foi possível ler o ficheiro.");
    }
  };

  const loadFromCodebase = () => {
    const next = rectRecordsFromCampusDefinitions();
    setZones(next);
    setSelectedId(next[0]?.id ?? null);
  };

  const addEmptyZone = () => {
    const rec: CampusZoneRectRecord = {
      id: newZoneId(),
      label: "Nova zona",
      x: 40,
      y: 40,
      width: 12,
      height: 10,
      category: "Cultivo",
      courseIds: []
    };
    setZones((p) => [...p, rec]);
    setSelectedId(rec.id);
  };

  const bgSrc = sky === "night" ? BG_NIGHT : BG_DAY;

  const handles: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

  return (
    <div className="flex h-[100svh] flex-col bg-ink-900 text-white">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-white/10 bg-black/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 text-amber-300" aria-hidden />
          <h1 className="text-sm font-semibold tracking-wide">
            Editor de zonas (retângulos)
          </h1>
        </div>
        <p className="text-[11px] text-white/55 max-w-xl">
          Arraste no mapa vazio para criar. Arraste zona para mover. Polígonos
          virão depois — hoje só x, y, largura, altura em % (0–100).
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSky((s) => (s === "night" ? "day" : "night"))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10"
          >
            {sky === "night" ? (
              <Moon className="size-3.5" />
            ) : (
              <Sun className="size-3.5" />
            )}
            {sky === "night" ? "Noite" : "Dia"}
          </button>
          <label className="inline-flex items-center gap-2 text-[11px] text-white/70">
            Opacidade prévia
            <input
              type="range"
              min={0.12}
              max={0.78}
              step={0.02}
              value={previewOpacity}
              onChange={(e) => setPreviewOpacity(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-white/70">
            <input
              type="checkbox"
              checked={glowOn}
              onChange={(e) => setGlowOn(e.target.checked)}
              className="rounded border-white/20 accent-emerald-400"
            />
            Glow
          </label>
          <button
            type="button"
            onClick={addEmptyZone}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-1.5 text-xs font-medium text-emerald-100 hover:bg-emerald-500/25"
          >
            <Plus className="size-3.5" /> Zona
          </button>
          <button
            type="button"
            onClick={loadFromCodebase}
            className="inline-flex items-center gap-1 rounded-lg border border-amber-400/35 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-100 hover:bg-amber-500/20"
          >
            Importar SVG atual
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10"
          >
            <Download className="size-3.5" /> Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs hover:bg-white/10"
          >
            <FolderOpen className="size-3.5" /> Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importJsonFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-white/10 bg-black/25 p-3 text-xs">
          <p className="mb-2 font-medium uppercase tracking-wider text-white/45">
            Zonas ({zones.length})
          </p>
          <ul className="space-y-1">
            {zones.map((z) => (
              <li key={z.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(z.id)}
                  className={cn(
                    "w-full rounded-lg px-2 py-1.5 text-left transition-colors",
                    selectedId === z.id
                      ? "bg-emerald-500/25 text-emerald-50"
                      : "hover:bg-white/10 text-white/80"
                  )}
                >
                  <span className="line-clamp-2 font-medium">{z.label}</span>
                  <span className="block truncate font-mono text-[10px] text-white/40">
                    {z.id}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div
          ref={stageRef}
          role="presentation"
          className="relative min-h-0 flex-1 cursor-crosshair bg-black"
          onMouseDown={onStageMouseDown}
        >
          <img
            src={bgSrc}
            alt=""
            className="pointer-events-none opacity-100"
            style={{ ...CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN }}
            draggable={false}
          />

          {zones.map((z) => {
            const sel = selectedId === z.id;
            const preview = zoneStylePreview(z.category, previewOpacity, glowOn);
            return (
              <div
                key={z.id}
                role="presentation"
                className={cn(
                  "absolute box-border rounded-sm transition-none",
                  sel &&
                    "ring-2 ring-amber-300/90 ring-offset-1 ring-offset-black/50 z-10"
                )}
                style={{
                  left: `${z.x}%`,
                  top: `${z.y}%`,
                  width: `${z.width}%`,
                  height: `${z.height}%`,
                  ...preview,
                  zIndex: sel ? 20 : 5
                }}
                onMouseDown={(e) => onZoneMouseDown(e, z)}
              />
            );
          })}

          {draftRect &&
          draftRect.width >= MIN_DIM / 2 &&
          draftRect.height >= MIN_DIM / 2 ? (
            <div
              className="pointer-events-none absolute z-30 border-2 border-dashed border-amber-300/90 bg-amber-400/15"
              style={{
                left: `${draftRect.x}%`,
                top: `${draftRect.y}%`,
                width: `${draftRect.width}%`,
                height: `${draftRect.height}%`
              }}
            />
          ) : null}

          {selected
            ? handles.map((h) => {
                const hz = selected;
                const hxFrac =
                  h === "nw" || h === "w" || h === "sw"
                    ? 0
                    : h === "n" || h === "s"
                      ? 50
                      : 100;
                const hyFrac =
                  h === "nw" || h === "n" || h === "ne"
                    ? 0
                    : h === "e" || h === "w"
                      ? 50
                      : 100;
                const leftPct = hz.x + (hz.width * hxFrac) / 100;
                const topPct = hz.y + (hz.height * hyFrac) / 100;
                return (
                  <button
                    key={h}
                    type="button"
                    aria-label={`Redimensionar ${h}`}
                    className="absolute z-40 size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-amber-200 bg-ink-900 shadow-md"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      cursor: HANDLE_CURSOR[h]
                    }}
                    onMouseDown={(e) => onHandleDown(e, hz.id, h, hz)}
                  />
                );
              })
            : null}
        </div>

        <aside className="w-72 shrink-0 overflow-y-auto border-l border-white/10 bg-black/30 p-4 text-sm">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-white/45">
                  Selecionada
                </span>
                <button
                  type="button"
                  onClick={() => deleteZone(selected.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-400/40 bg-rose-950/40 px-2 py-1 text-[11px] text-rose-100 hover:bg-rose-900/50"
                >
                  <Trash2 className="size-3" /> Apagar
                </button>
              </div>
              <label className="block">
                <span className="mb-1 block text-[11px] text-white/50">Nome</span>
                <input
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-2 py-1.5 text-sm"
                  value={selected.label}
                  onChange={(e) => updateZone(selected.id, { label: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] text-white/50">Id</span>
                <input
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-2 py-1.5 font-mono text-xs"
                  value={selected.id}
                  onChange={(e) => {
                    const next = e.target.value.trim().replace(/\s+/g, "-");
                    if (!next) return;
                    const clash = zones.some((z) => z.id === next && z.id !== selected.id);
                    if (clash) return;
                    const prevId = selected.id;
                    setZones((p) =>
                      p.map((z) => (z.id === prevId ? { ...z, id: next } : z))
                    );
                    setSelectedId(next);
                  }}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] text-white/50">
                  Categoria
                </span>
                <input
                  list="campus-zone-editor-categories"
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-2 py-1.5 text-sm"
                  value={selected.category}
                  onChange={(e) =>
                    updateZone(selected.id, { category: e.target.value })
                  }
                />
                <datalist id="campus-zone-editor-categories">
                  {CATEGORY_PRESETS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] text-white/50">
                  courseIds (vírgula)
                </span>
                <input
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-2 py-1.5 font-mono text-xs"
                  value={selected.courseIds.join(", ")}
                  onChange={(e) =>
                    updateZone(selected.id, {
                      courseIds: e.target.value
                        .split(/[,\s]+/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/25 p-2 font-mono text-[11px]">
                <span className="text-white/45">x</span>
                <span>{selected.x.toFixed(2)}%</span>
                <span className="text-white/45">y</span>
                <span>{selected.y.toFixed(2)}%</span>
                <span className="text-white/45">largura</span>
                <span>{selected.width.toFixed(2)}%</span>
                <span className="text-white/45">altura</span>
                <span>{selected.height.toFixed(2)}%</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/50">
              Clique e arraste no mapa para criar uma zona, ou importe JSON /
              zonas SVG atuais.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
