import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

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
  return names.filter((n) => /\.(mp3|wav)$/i.test(n));
}

/**
 * Lista `.mp3` / `.wav` em `public/audio/ambience`, `radio`, `cinema` e legado `mp3`.
 * Deploy: copiar assets para estas pastas (servidas estaticamente em produção).
 */
export async function GET() {
  const tracks: CampusAudioTrackDto[] = [];

  const scan = (category: CampusAudioCategory, segments: string[]) => {
    const dir = path.join(AUDIO_ROOT, ...segments);
    const files = audioFilenames(safeReadDir(dir)).sort((a, b) => a.localeCompare(b, "pt"));
    const prefix = `/audio/${segments.join("/")}`;
    for (const filename of files) {
      tracks.push({
        category,
        filename,
        url: `${prefix}/${encodeURIComponent(filename)}`
      });
    }
  };

  scan("ambience", ["ambience"]);
  scan("radio", ["radio"]);
  scan("cinema", ["cinema"]);
  scan("legacy", ["mp3"]);

  return NextResponse.json({ tracks });
}
