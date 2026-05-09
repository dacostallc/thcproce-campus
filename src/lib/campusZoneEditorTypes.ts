import type { CampusZone } from "@/data/campusZones";
import { z } from "zod";

export const CAMPUS_ZONE_EDITOR_LS_KEY = "thc-campus-zone-editor-draft-v2";

export const campusAreaTypeSchema = z.enum([
  "cultivo",
  "laboratorio",
  "medicina",
  "culinaria",
  "social",
  "logistica",
  "entrada"
]) satisfies z.ZodType<CampusZone["areaType"]>;

export const campusZoneRectRecordSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().min(0.01).max(100),
  height: z.number().min(0.01).max(100),
  areaType: campusAreaTypeSchema.optional().default("cultivo"),
  courseIds: z.array(z.string()).default([])
});

/** Migra rascunhos v1 (`energy`, `areaIds`) para o modelo atual. */
function legacyEnergyToAreaType(energy: string): CampusZone["areaType"] {
  switch (energy) {
    case "culinaria":
      return "culinaria";
    case "science":
    case "solventless":
      return "laboratorio";
    case "legislacao":
      return "medicina";
    case "social":
    case "hub101":
      return "social";
    case "negocios":
      return "logistica";
    case "outdoor":
    case "indoor":
    case "greenhouse":
    case "secagem":
    case "genetica":
    default:
      return "cultivo";
  }
}

function migrateZoneRecord(input: unknown): unknown {
  if (!input || typeof input !== "object" || input === null) return input;
  const r = { ...(input as Record<string, unknown>) };
  if ("energy" in r && !("areaType" in r)) {
    r.areaType = legacyEnergyToAreaType(String(r.energy));
    delete r.energy;
  }
  if ("areaIds" in r && !("courseIds" in r)) {
    r.courseIds = r.areaIds;
    delete r.areaIds;
  }
  return r;
}

function migrateEditorFile(raw: unknown): unknown {
  if (!raw || typeof raw !== "object" || raw === null) return raw;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.zones)) return raw;
  return { ...o, zones: o.zones.map(migrateZoneRecord) };
}

export const campusZoneEditorFileSchema = z.preprocess(
  migrateEditorFile,
  z.object({
    version: z.literal(1),
    exportedAt: z.string().optional(),
    zones: z.array(campusZoneRectRecordSchema)
  })
);

export type CampusZoneRectRecord = z.infer<typeof campusZoneRectRecordSchema>;

export function newZoneId(): string {
  return `zone-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
