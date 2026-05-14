import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/audio/<courseId>/<lessonId>.mp3
 *
 * Serve arquivos MP3 de public/audio/lessons/ com suporte a Range Requests
 * (HTTP 206 Partial Content), necessário para o elemento <audio> nativo
 * funcionar corretamente em dev (o servidor estático do Next.js não suporta
 * Range requests, causando ERR_CONNECTION_RESET).
 *
 * Em produção, os arquivos são servidos pelo Supabase Storage (URL pública),
 * então esta rota só é usada quando o áudio está armazenado localmente.
 */

export const dynamic = "force-dynamic";

const AUDIO_ROOT = path.join(process.cwd(), "public", "audio", "lessons");
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9\-_.]*$/i;

function isSafePath(segments: string[]): boolean {
  return (
    segments.length >= 1 &&
    segments.every((s) => SAFE_SEGMENT.test(s) && !s.includes(".."))
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  const slug = params.slug ?? [];

  if (!isSafePath(slug)) {
    return NextResponse.json({ error: "Caminho inválido." }, { status: 400 });
  }

  const filePath = path.join(AUDIO_ROOT, ...slug);

  // Impede path traversal fora de AUDIO_ROOT
  if (!filePath.startsWith(AUDIO_ROOT)) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  let stat: fs.Stats;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
  }

  const fileSize = stat.size;
  const rangeHeader = req.headers.get("range");

  // ── Sem Range → resposta completa (200) ──────────────────────────────────
  if (!rangeHeader) {
    const stream = fs.createReadStream(filePath);
    return new Response(stream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // ── Com Range → resposta parcial (206) ───────────────────────────────────
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${fileSize}` },
    });
  }

  const start = match[1] ? parseInt(match[1], 10) : 0;
  const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

  if (start > end || end >= fileSize) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${fileSize}` },
    });
  }

  const chunkSize = end - start + 1;
  const stream = fs.createReadStream(filePath, { start, end });

  return new Response(stream as unknown as ReadableStream, {
    status: 206,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": String(chunkSize),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
