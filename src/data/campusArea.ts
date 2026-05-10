import type { PolygonPoint } from "@/lib/geo/isPointInPolygon";

/** Polígono simples no plano do mapa (vértices ordenados; mesmo espaço que `Area.position`, tipicamente %). */
export type Polygon = ReadonlyArray<PolygonPoint>;

export type CampusAreaType =
  | "course"
  | "lesson"
  | "live"
  | "community"
  | "lab"
  | "greenhouse"
  | "library"
  | "cinema";

export type CampusAreaStatus = "available" | "coming_soon" | "locked" | "live";

/**
 * Modelo-alvo para fichas de zona no campus (mapa + progressão).
 * O catálogo em produção continua em `Area` (`src/data/courses.ts`); este tipo serve para novos fluxos,
 * migração gradual e contratos API/editor.
 */
export type CampusArea = {
  id: string;
  slug: string;
  title: string;
  type: CampusAreaType;
  position: {
    x: number;
    y: number;
  };
  bounds?: Polygon;
  linkedCourses?: string[];
  linkedLessons?: string[];
  locked?: boolean;
  requiredXp?: number;
  status?: CampusAreaStatus;
  visualVariant?: string;
};
