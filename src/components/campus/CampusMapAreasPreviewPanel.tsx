"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { CampusMapAreasDebugOverlay } from "@/components/campus/CampusMapAreasDebugOverlay";
import {
  CAMPUS_MAP_AREAS_EXAMPLE_ONLY,
  CAMPUS_MAP_AREAS_OVERLAY_LS_KEY,
  parseCampusMapAreasOverlayJson,
  resolveCampusMapAreasForOverlay,
  type CampusMapArea
} from "@/lib/campusMapAreasCatalog";
import { CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN } from "@/lib/campusArt";
import { CAMPUS_HOME_PATH } from "@/config/siteUrls";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLACEHOLDER_JSON = `{
  "version": 1,
  "areas": [
    {
      "id": "minha_area",
      "label": "Etiqueta opcional",
      "coordUnit": "percent_of_stage",
      "polygon": [
        { "x": 10, "y": 10 },
        { "x": 20, "y": 10 },
        { "x": 18, "y": 22 }
      ]
    }
  ]
}`;

/**
 * Preview interna: sobrepor polígonos sobre a arte do campus (mesmo ficheiro que o mapa).
 * Sem escrita ao catálogo TypeScript — JSON pode ser gravado só em localStorage para testar em `/campus`.
 */
export function CampusMapAreasPreviewPanel({
  headingId = "campus-map-areas-preview"
}: {
  headingId?: string;
}) {
  const [draft, setDraft] = useState("");
  const [showExamples, setShowExamples] = useState(true);
  const [lsNote, setLsNote] = useState<string | null>(null);

  const overlayAreas = useMemo((): CampusMapArea[] | null => {
    const trimmed = draft.trim();
    if (trimmed) {
      const p = parseCampusMapAreasOverlayJson(trimmed);
      if (p) return p;
      return []; // texto inválido — overlay vazio
    }
    if (showExamples) return [...CAMPUS_MAP_AREAS_EXAMPLE_ONLY];
    return resolveCampusMapAreasForOverlay({ includeExamples: false, jsonOverride: null });
  }, [draft, showExamples]);

  const persistToLocalStorage = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setLsNote("Cole um JSON válido antes de gravar.");
      return;
    }
    const parsed = parseCampusMapAreasOverlayJson(trimmed);
    if (!parsed?.length) {
      setLsNote("JSON inválido — rever esquema em docs/campus-map-areas-authoring.md.");
      return;
    }
    try {
      window.localStorage.setItem(CAMPUS_MAP_AREAS_OVERLAY_LS_KEY, trimmed);
      setLsNote("Gravado. Abra o campus com NEXT_PUBLIC_CAMPUS_MAP_AREAS_DEBUG=true ou em dev para sobrepor.");
    } catch {
      setLsNote("Não foi possível gravar (storage bloqueado).");
    }
  }, [draft]);

  const clearLs = useCallback(() => {
    try {
      window.localStorage.removeItem(CAMPUS_MAP_AREAS_OVERLAY_LS_KEY);
      setLsNote("Overlay em localStorage removido.");
    } catch {
      setLsNote("Falha ao limpar.");
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-24 text-white/90 sm:px-6">
      <p className="text-center">
        <Link href={CAMPUS_HOME_PATH} className="text-sm text-canna-300 hover:underline">
          ← Voltar ao mapa
        </Link>
      </p>

      <header className="space-y-2 text-center">
        <h1 id={headingId} className="text-2xl font-bold text-white">
          Preview · polígonos do mapa (authoring manual)
        </h1>
        <p className="text-sm text-white/58">
          Não há geração automática de máscaras — cole coordenadas validadas (JSON schema v1).{" "}
          <span className="text-amber-200/92">Consulte docs/campus-map-areas-authoring.md.</span>
        </p>
      </header>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-white/45">
          JSON (schema v1)
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={PLACEHOLDER_JSON}
          rows={12}
          spellCheck={false}
          className="w-full rounded-xl border border-white/14 bg-black/40 p-4 font-mono text-[13px] text-white/85 outline-none focus:border-canna-400/40"
        />
        <label className="flex items-center gap-2 text-sm text-white/65">
          <input
            type="checkbox"
            checked={showExamples}
            onChange={(e) => setShowExamples(e.target.checked)}
            className="rounded border-white/30"
          />
          Quando vazio: mostrar <code className="text-[11px] text-amber-200/90">CAMPUS_MAP_AREAS_EXAMPLE_ONLY</code>
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="glass" onClick={() => setDraft(PLACEHOLDER_JSON)}>
            Inserir template mínimo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="glass"
            onClick={() => {
              const blob = JSON.stringify({ version: 1, areas: CAMPUS_MAP_AREAS_EXAMPLE_ONLY }, null, 2);
              setDraft(blob);
              setShowExamples(false);
            }}
          >
            Exportar EXAMPLE_ONLY
          </Button>
          <Button type="button" size="sm" className="text-amber-100" variant="glass" onClick={persistToLocalStorage}>
            Gravar overlay no navegador
          </Button>
          <Button type="button" size="sm" variant="glass" onClick={clearLs}>
            Limpar LS do overlay
          </Button>
        </div>
        {lsNote ? <p className="text-xs text-sky-200/90">{lsNote}</p> : null}
      </div>

      <section className={cn("relative aspect-video overflow-hidden rounded-2xl border border-white/12 bg-black/60")}>
        {/* eslint-disable-next-line @next/next/no-img-element -- espelhar o mesmo ficheiro do mapa público */}
        <img src="/campus/campus.png" alt="" style={{ ...CAMPUS_MAP_BACKGROUND_IMG_STYLE_CONTAIN }} decoding="async" />
        <CampusMapAreasDebugOverlay isolatedPreviewAreas={overlayAreas ?? []} />
      </section>

      <p className="text-center text-[11px] text-white/40">
        Cores: amarelado = entrada marcada como <code className="text-amber-200/85">exampleOnly</code> no JSON;
        verde = área produtiva.
      </p>
    </div>
  );
}
