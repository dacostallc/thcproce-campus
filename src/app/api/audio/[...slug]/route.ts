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

type RouteParams = { params: Promise<{ slug: string[] }> };

/**
 * Resolve o caminho físico do arquivo de áudio.
 * Suporta dois layouts de pastas (migração progressiva):
 *   Novo:  public/audio/<courseId>/<lessonId>.mp3
 *   Legado: public/audio/lessons/<courseId>/<lessonId>.mp3
 */
async function resolveFilePath(
  params: Promise<{ slug: string[] }>,
): Promise<{ fullPath: string; safe: boolean }> {
  const { slug } = await params;

  const primary = path.join(AUDIO_ROOT, ...slug);
  const legacy  = path.join(AUDIO_ROOT, "lessons", ...slug);

  // Prefere o caminho novo; cai para legado se o arquivo já estiver lá
  const fullPath = fs.existsSync(primary) ? primary : legacy;

  return { fullPath, safe: fullPath.startsWith(AUDIO_ROOT) };
}

/**
 * Verifica se o arquivo existe E tem tamanho > 0.
 * Se existir mas estiver vazio (geração falhou a meio), apaga e retorna false
 * para que o front-end receba 404 e mostre o botão de geração novamente.
 */
function checkAudioFile(fullPath: string): "ok" | "not_found" | "deleted_empty" {
  if (!fs.existsSync(fullPath)) return "not_found";
  try {
    const { size } = fs.statSync(fullPath);
    if (size > 0) return "ok";
    fs.unlinkSync(fullPath);
    console.warn(`[audio] Arquivo vazio apagado: ${fullPath}`);
    return "deleted_empty";
  } catch {
    return "not_found";
  }
}

// HEAD — usado pelo LessonAudioPlayer para verificar se o arquivo existe
// sem baixar o conteúdo. Next.js exige handler explícito (senão retorna 405).
export async function HEAD(_req: NextRequest, { params }: RouteParams) {
  const { fullPath, safe } = await resolveFilePath(params);
  if (!safe) return new Response(null, { status: 403 });
  const check = checkAudioFile(fullPath);
  if (check !== "ok") return new Response(null, { status: 404 });
  return new Response(null, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes" },
  });
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
) {
  const { fullPath, safe } = await resolveFilePath(params);

  if (!safe) {
    return new NextResponse("Acesso não autorizado.", { status: 403 });
  }

  const check = checkAudioFile(fullPath);
  if (check !== "ok") {
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
