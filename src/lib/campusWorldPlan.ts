/**
 * Biomas de apoio (muito subtis): alinhados ao mapa oficial THC Academy.
 * Não substituem as zonas SVG — apenas reforçam clima por quadrante.
 */
import type { LucideIcon } from "lucide-react";
import {
  ChefHat,
  Dna,
  Factory,
  FlaskConical,
  LandPlot,
  Lightbulb,
  Microscope,
  Scale,
  Snowflake,
  Stethoscope,
  Theater,
  Trees,
  UsersRound,
  Warehouse,
  Wind
} from "lucide-react";

export type CampusBiomeLayer = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  night: string;
  day: string;
};

export const CAMPUS_BIOME_LAYERS: CampusBiomeLayer[] = [
  {
    cx: 12,
    cy: 30,
    rx: 18,
    ry: 26,
    night: "rgba(34,197,94,0.034)",
    day: "rgba(22,163,74,0.024)"
  },
  {
    cx: 46,
    cy: 18,
    rx: 14,
    ry: 12,
    night: "rgba(34,197,94,0.028)",
    day: "rgba(22,163,74,0.02)"
  },
  {
    cx: 74,
    cy: 18,
    rx: 22,
    ry: 14,
    night: "rgba(168,85,247,0.031)",
    day: "rgba(147,51,234,0.022)"
  },
  {
    cx: 87,
    cy: 28,
    rx: 14,
    ry: 24,
    night: "rgba(56,189,248,0.031)",
    day: "rgba(6,182,212,0.022)"
  },
  {
    cx: 50,
    cy: 50,
    rx: 20,
    ry: 20,
    night: "rgba(251,191,36,0.028)",
    day: "rgba(250,204,21,0.02)"
  },
  {
    cx: 54,
    cy: 64,
    rx: 16,
    ry: 14,
    night: "rgba(230,220,205,0.025)",
    day: "rgba(148,163,184,0.018)"
  }
];

export function campusBiomeBackgroundImage(mode: "day" | "night"): string {
  return CAMPUS_BIOME_LAYERS.map((L) => {
    const c = mode === "night" ? L.night : L.day;
    return `radial-gradient(ellipse ${L.rx}% ${L.ry}% at ${L.cx}% ${L.cy}%, ${c}, transparent 72%)`;
  }).join(", ");
}

export type CampusAreaVisual = {
  Icon: LucideIcon;
  mapHint: string;
  haloScale?: number;
};

const V: Record<string, CampusAreaVisual> = {
  "cannabis-101": {
    Icon: Theater,
    mapHint: "Sala de aula cultivo · telão e turma (mapa oficial)",
    haloScale: 1.05
  },
  "cultivo-greenhouse": {
    Icon: Warehouse,
    mapHint: "Estufas de vidro · extremo oeste do campus",
    haloScale: 1.12
  },
  "cultivo-outdoor": {
    Icon: Trees,
    mapHint: "Campo outdoor superior central · sol e fileiras",
    haloScale: 1.12
  },
  "cultivo-indoor": {
    Icon: Lightbulb,
    mapHint: "Bloco grow indoor · LED e salas seladas",
    haloScale: 1.08
  },
  genetica: {
    Icon: Dna,
    mapHint: "Viveiro de mudas · à esquerda da culinária",
    haloScale: 1.06
  },
  "secagem-cura": {
    Icon: Wind,
    mapHint: "Sala de secagem · fachada direita",
    haloScale: 1.05
  },
  "extracoes-solventless": {
    Icon: Snowflake,
    mapHint: "Almoxarifado · extração artesanal (gelo/prensa)",
    haloScale: 1.08
  },
  "extracao-oleo": {
    Icon: FlaskConical,
    mapHint: "Torre de ciências · extração óleo / inox",
    haloScale: 1.05
  },
  medicina: {
    Icon: Stethoscope,
    mapHint: "Instituto medicinal · torre direita",
    haloScale: 1.04
  },
  culinaria: {
    Icon: ChefHat,
    mapHint: "Escola de Culinária Canábica · centro do campus",
    haloScale: 1.06
  },
  laboratorio: {
    Icon: Microscope,
    mapHint: "Laboratório de análises · topo direito",
    haloScale: 1.05
  },
  legislacao: {
    Icon: Scale,
    mapHint: "Entrada THC Academy · letreiro e acolhimento jurídico",
    haloScale: 0.95
  },
  cooperativismo: {
    Icon: UsersRound,
    mapHint: "Lounge / área social · à frente da culinária",
    haloScale: 1.02
  },
  industria: {
    Icon: Factory,
    mapHint: "Armazenamento · doca e logística (inferior direito)",
    haloScale: 1.04
  }
};

export function getCampusAreaVisual(areaId: string): CampusAreaVisual | null {
  return V[areaId] ?? null;
}

export function getCampusAreaVisualFallback(): CampusAreaVisual {
  return { Icon: LandPlot, mapHint: "Área do campus", haloScale: 1 };
}
