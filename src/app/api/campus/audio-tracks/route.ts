import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { CAMPUS_AUDIO_MANIFEST } from "@/data/campusAudioManifest";

export const dynamic = "force-dynamic";

export type CampusAudioCategory = "ambience" | "radio" | "cinema" | "legacy";

export type CampusAudioTrackDto = {
  category: CampusAudioCategory;
  filename: string;
  /** URL pública servida por Next (`public/audio/...`). */
  url: string;
};

const AUDIO_ROOT = path.join(process.cwd(), "public", "audio");

function safeReadDir(absDir: string): string[] {
  try {
    return fs.readdirSync(absDir);
  } catch {
    return [];
  }
}

function audioFilenames(names: string[]): string[] {
  return names.filter((n) => /\.(mp3|wav|ogg|m4a|opus|flac)$/i.test(n));
}

function dedupeTracks(tracks: CampusAudioTrackDto[]): CampusAudioTrackDto[] {
  const seen = new Set<string>();
  const out: CampusAudioTrackDto[] = [];
  for (const t of tracks) {
    if (seen.has(t.url)) continue;
    seen.add(t.url);
    out.push(t);
  }
  return out;
}

function manifestTrackUrl(segments: string[], filename: string): string {
  const baseUrl = segments.length === 0 ? "/audio" : `/audio/${segments.join("/")}`;
  return `${baseUrl}/${encodeURIComponent(filename)}`;
}

function manifestTracks(): CampusAudioTrackDto[] {
  return CAMPUS_AUDIO_MANIFEST.map((entry) => ({
    category: entry.category,
    filename: entry.filename,
    url: manifestTrackUrl(entry.segments, entry.filename)
  }));
}

/**
 * Lista áudio em `public/audio/ambience`, `radio`, `cinema`, `mp3` (legado) **e**
 * ficheiros soltos directamente em `public/audio/` (muitos autor colocam MP3 na raiz).
 * Deploy: copiar assets para estas pastas (servidas estaticamente em produção).
 */
export async function GET() {
  const tracks: CampusAudioTrackDto[] = [];

  const scan = (category: CampusAudioCategory, segments: string[]) => {
    const dir = path.join(AUDIO_ROOT, ...segments);
    const files = audioFilenames(safeReadDir(dir)).sort((a, b) => a.localeCompare(b, "pt"));
    const baseUrl =
      segments.length === 0 ? "/audio" : `/audio/${segments.join("/")}`;
    for (const filename of files) {
      tracks.push({
        category,
        filename,
        url: `${baseUrl}/${encodeURIComponent(filename)}`
      });
    }
  };

  scan("ambience", ["ambience"]);
  scan("radio", ["radio"]);
  scan("cinema", ["cinema"]);
  scan("legacy", ["mp3"]);
  /** Raiz `public/audio/` — aparece como ambiente no HUD (URLs `/audio/ficheiro.mp3`). */
  scan("ambience", []);

  const resolvedTracks = tracks.length > 0 ? tracks : manifestTracks();

  return NextResponse.json(
    { tracks: dedupeTracks(resolvedTracks) },
    {
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0"
      }
    }
  );
}
