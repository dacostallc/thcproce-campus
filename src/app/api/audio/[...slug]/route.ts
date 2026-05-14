import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/**
 * GET /api/audio/<courseId>/<lessonId>.mp3
 *
 * Serve arquivos MP3 de public/audio/<courseId>/ com suporte a Range Requests
 * (HTTP 206 Partial Content), necessário para o elemento <audio> nativo
 * funcionar corretamente em dev — o servidor estático do Next.js não suporta
 * Range requests, causando ERR_CONNECTION_RESET ao tentar seek ou stream.
 *
 * Mapeamento:
 *   URL  →  /api/audio/cannabis-101/c101-l01.mp3
 *   Disco →  public/audio/cannabis-101/c101-l01.mp3
 *
 * Em produção, áudios servidos pelo Supabase/CDN usam URL absoluta e ignoram
 * esta rota.
 */

export const dynamic = "force-dynamic";

const AUDIO_ROOT = path.join(process.cwd(), "public", "audio");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  // Next.js 15: params é uma Promise — deve ser aguardada
  const { slug } = await params;

  const relativePath = path.join(...slug);
  const fullPath = path.join(AUDIO_ROOT, relativePath);

  // Impede path traversal fora de public/audio/
  if (!fullPath.startsWith(AUDIO_ROOT)) {
    return new NextResponse("Acesso não autorizado.", { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return new NextResponse("Arquivo não encontrado.", { status: 404 });
  }

  const stat = fs.statSync(fullPath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  // ── Sem Range → arquivo completo (200) ───────────────────────────────────
  if (!range) {
    const fileStream = fs.createReadStream(fullPath);
    return new NextResponse(fileStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // ── Com Range → conteúdo parcial (206) ───────────────────────────────────
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (start >= fileSize || end >= fileSize || start > end) {
    return new NextResponse("Range não satisfatório.", {
      status: 416,
      headers: { "Content-Range": `bytes */${fileSize}` },
    });
  }

  const chunkSize = end - start + 1;
  const fileStream = fs.createReadStream(fullPath, { start, end });

  return new NextResponse(fileStream as unknown as ReadableStream, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": String(chunkSize),
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
