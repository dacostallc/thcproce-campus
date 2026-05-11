import { generateElevenLabsSpeech, ELEVENLABS_MAX_TEXT_LENGTH } from "@/lib/voice/elevenlabs";
import { requireCampusAdminApi } from "@/lib/admin/requireCampusAdminApi";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const denied = await requireCampusAdminApi();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Corpo da requisição JSON inválido." }, { status: 400 });
  }

  const text =
    typeof body === "object" && body !== null && "text" in body
      ? String((body as { text: unknown }).text ?? "")
      : "";

  const trimmed = text.trim();
  if (!trimmed) {
    return Response.json({ error: "O campo «text» é obrigatório." }, { status: 400 });
  }
  if (trimmed.length > ELEVENLABS_MAX_TEXT_LENGTH) {
    return Response.json(
      {
        error: `O texto excede o limite de ${ELEVENLABS_MAX_TEXT_LENGTH} caracteres.`
      },
      { status: 400 }
    );
  }

  try {
    const buffer = await generateElevenLabsSpeech(trimmed);
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Falha ao gerar narração.";
    return Response.json({ error: message }, { status: 502 });
  }
}
