export type CampusMicroHotspotSeed = {
  id: string;
  /** Rótulo curto no mapa. */
  shortLabelPt: string;
  /** Texto longo no tooltip nativo. */
  labelPt: string;
  hintPt: string;
  xPercent: number;
  yPercent: number;
};

/** Âncoras editoriais (% arte) — expandir sem peso runtime (sem sprites nem vídeo). */
export const CAMPUS_MICRO_HOTSPOTS: CampusMicroHotspotSeed[] = [
  {
    id: "micro-trichomes",
    shortLabelPt: "Tricomas",
    labelPt: "Microscópio — tricomas",
    hintPt: "Micro-learning: observação de tricomas",
    xPercent: 31,
    yPercent: 52
  },
  {
    id: "micro-leaf-fungi",
    shortLabelPt: "Praga",
    labelPt: "Folha com praga — fungos",
    hintPt: "Micro-learning: identificação fúngica",
    xPercent: 44,
    yPercent: 48
  },
  {
    id: "micro-tank-ph",
    shortLabelPt: "pH",
    labelPt: "Tanque — pH",
    hintPt: "Micro-learning: equilíbrio hídrico",
    xPercent: 58,
    yPercent: 62
  },
  {
    id: "micro-freeze-dry",
    shortLabelPt: "Freeze",
    labelPt: "Freezer — freeze dryer",
    hintPt: "Micro-learning: pós-colheita",
    xPercent: 72,
    yPercent: 44
  },
  {
    id: "micro-clone-tray",
    shortLabelPt: "Clone",
    labelPt: "Bandeja de clones — propagação",
    hintPt: "Micro-learning: propagação vegetativa",
    xPercent: 52,
    yPercent: 58
  }
];
