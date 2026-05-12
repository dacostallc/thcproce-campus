/**
 * Quebra muros de texto em linhas curtas e escaneáveis (tom campo / briefing).
 */

const MAX_DEFAULT_CHUNK = 210;
const MAX_BULLETS = 10;

/** Frases por pontuação forte + limite de caracteres por linha. */
export function splitIntoBreathingLines(text: string, maxChars = MAX_DEFAULT_CHUNK): string[] {
  const flat = text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
  if (!flat) return [];

  const rough = flat
    .split(/\n+/)
    .flatMap((para) =>
      para
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
    );

  const out: string[] = [];
  for (const sentence of rough) {
    if (sentence.length <= maxChars) {
      out.push(sentence);
      continue;
    }
    const words = sentence.split(/\s+/);
    let cur = "";
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (next.length > maxChars && cur) {
        out.push(cur.trim());
        cur = w;
      } else {
        cur = next;
      }
    }
    if (cur.trim()) out.push(cur.trim());
  }

  return out.filter(Boolean).slice(0, MAX_BULLETS);
}

/** Primeira ideia forte — até ao primeiro ponto final ou corte suave. */
export function firstImpactLine(text: string, hardMax = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const dot = t.match(/^.{1,240}?[.!?](?:\s|$)/);
  const s = dot ? dot[0].trim() : t;
  return s.length > hardMax ? `${s.slice(0, hardMax - 1).trim()}…` : s;
}

export function deriveBriefingTriple(params: {
  intro: string;
  practicalOpening: string;
}): { impact: string; humanContext: string; discovery: string } {
  const introLines = splitIntoBreathingLines(params.intro, 260);
  const bodyLines = splitIntoBreathingLines(params.practicalOpening, 260);

  const impact =
    firstImpactLine(introLines[0] || params.intro, 155) ||
    "Missão técnica: decisões claras, zero enrolação.";

  const humanContext =
    (introLines[1] && introLines[1].length < 280 ? introLines[1] : "") ||
    firstImpactLine(introLines[0]?.slice(impact.length) || "", 200) ||
    "Olhar de quem já viu bancada e legislação apertarem ao mesmo tempo.";

  const discovery =
    introLines[2] ||
    bodyLines[0] ||
    "Vais sair daqui com um critério simples para o próximo movimento — não com texto para decorar.";

  return {
    impact,
    humanContext: humanContext.length > 240 ? `${humanContext.slice(0, 237)}…` : humanContext,
    discovery: discovery.length > 240 ? `${discovery.slice(0, 237)}…` : discovery
  };
}
