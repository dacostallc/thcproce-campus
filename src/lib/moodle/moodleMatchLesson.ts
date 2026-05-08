import type { MoodleFlatModule } from "./ws";

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Liga o rótulo do campus («Área modular · Atividade») a um módulo do curso no LMS.
 *
 * Nunca trata `lessonIndex` como índice direto no array achatado: o Moodle costuma ter
 * mais entradas / ordem ligeiramente diferente (rótulos, fóruns, recursos extra).
 * O índice só entra como desempate suave entre candidatos com pontuação semelhante.
 */
export function matchMoodleModuleForCampusLesson(
  items: MoodleFlatModule[],
  campusLessonTitle: string,
  lessonIndex: number
): MoodleFlatModule | null {
  if (items.length === 0) return null;

  const campusN = norm(campusLessonTitle);
  const rawParts = campusLessonTitle.split(" · ").map((p) => p.trim()).filter(Boolean);
  const campusLabel = rawParts.length ? norm(rawParts[rawParts.length - 1] ?? "") : "";
  const campusSec = rawParts.length >= 2 ? norm(rawParts.slice(0, -1).join(" · ")) : "";

  /** Palavras longas da “área modular” correspondem ao título de secção do LMS? */
  function secWeightedHits(sectionNorm: string): number {
    if (!campusSec || campusSec.length < 5) return 0;
    const words = campusSec.split(/\s+/).filter((w) => w.length > 3);
    if (!words.length) return 0;
    const hits = words.filter((w) => sectionNorm.includes(w)).length;
    return Math.round((100 * hits) / words.length);
  }

  type Row = { it: MoodleFlatModule; idx: number; score: number };
  const rows: Row[] = [];

  for (let idx = 0; idx < items.length; idx++) {
    const it = items[idx]!;
    const sec = norm(it.sectionTitle);
    const mod = norm(it.moduleName);
    const corpus = norm(`${it.sectionTitle} · ${it.moduleName}`);
    const bag = `${sec} ${mod}`;

    let score = 0;

    if (campusN.length > 8) {
      if (corpus === campusN) score += 120;
      else if (corpus.includes(campusN) || campusN.includes(corpus)) score += 92;
      else if (campusN.length >= 18 && corpus.includes(campusN.slice(0, 42))) score += 72;
      else if (corpus.length >= 18 && campusN.includes(corpus.slice(0, 42))) score += 58;
    }

    if (campusLabel.length > 2) {
      if (mod === campusLabel) score += 54;
      else if (mod.includes(campusLabel) || campusLabel.includes(mod)) score += 38;
      else if (campusLabel.length > 8 && mod.includes(campusLabel.slice(0, Math.min(campusLabel.length, 44))))
        score += 24;
    }

    const rawJoined = rawParts.join(" ");
    if (/questionario|questionário|quiz|prova final|prova integrada/i.test(norm(rawJoined))) {
      if (/(quiz|questionario|questionário|feedback|assign|lesson)/i.test(it.modname) || /\bquiz\b/.test(mod))
        score += 18;
    }

    if (campusSec.length > 6) {
      score += Math.min(32, Math.round((secWeightedHits(sec) / 100) * 32));
      if (sec.includes(campusSec.slice(0, Math.min(campusSec.length, 54)))) score += 18;
      if (bag.includes(campusSec.slice(0, Math.min(campusSec.length, 34)))) score += 10;
    }

    const idxDist = lessonIndex >= 0 ? Math.abs(idx - lessonIndex) : 99;
    score += Math.max(0, 12 - Math.min(12, idxDist)) * 0.85;

    rows.push({ it, idx, score });
  }

  rows.sort(
    (a, b) => b.score - a.score || Math.abs(a.idx - lessonIndex) - Math.abs(b.idx - lessonIndex)
  );

  const winner = rows[0];
  /** Mínimo: evitar associar texto de outra actividade só por palavras genéricas (ex.: “Página”). */
  if (!winner || winner.score < 40) return null;
  return winner.it;
}
