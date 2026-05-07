import type { LessonRichContent } from "@/data/lessonRichTypes";

const PILLARS = `Introdução ao sistema endocanabinoide (ECS) e aos receptores CB1/CB2; THC, CBD, CBN, CBG e o papel dos terpenos; uso medicinal responsável dentro de marcos legais e éticos; diferença clara entre uso adulto recreativo, uso medicinal supervisionado e educação científica na escola; base bibliográfica inicial (revisões, diretrizes e fontes primárias quando citadas); e o caminho do aluno dentro da THCProce — deste módulo às outras áreas do campus com progressão segura.`;

/**
 * Conteúdo textual premium para todas as aulas do Cannabis 101 (tabs Aula/Objetivos/…).
 */
export function getCannabis101LessonRichContent(
  lessonIndex: number,
  lessonTitle: string
): LessonRichContent {
  const n = lessonIndex + 1;

  const intro =
    `Módulo Cannabis 101 — aula ${n}. ${PILLARS} ` +
    `Nesta sessão aprofundamos «${lessonTitle}»: ancora teoria, segurança e narrativa do percurso do aluno na escola.`;

  const summary = `Foco desta aula: «${lessonTitle}». Integramos ciência da cannabis (canabinoides, terpenos, ECS), perspectiva clínica quando aplicável, e o posicionamento THCProce: educação com rigor, transparência sobre incertezas e compromisso com uso ético e legal.`;

  const objectives = [
    `Relacionar «${lessonTitle}» ao ECS e às moléculas-chave (THC, CBD, CBN, CBG) e aos terpenos, com vocabulário preciso.`,
    "Distinguir uso adulto, uso medicinal supervisionado e educação científica — sem misturar finalidades, públicos ou compliance.",
    "Consolidar base científica inicial e o lugar deste módulo na jornada do aluno na escola (próximos cursos e aprofundamentos)."
  ];

  const materials = [
    "Apostila e PDFs oficiais na sala Moodle (liberação conforme calendário do corpo docente)",
    "Bloco “Suas notas” nesta página — registre dúvidas para o fórum ou tutorias",
    "Roteiro da aula e checklist de leitura recomendada ao final de cada módulo"
  ];

  const references = [
    "THCProce — materiais e políticas em thcproce.com.br/escola",
    "Diretrizes e sínteses citadas em aula (quando o professor publicar referências no Moodle)",
    "Literatura científica primária / revisões — sempre com avaliação crítica em sala (nível de evidência, população, viés)"
  ];

  const professorNotes = `Prof. THC / equipe: Cannabis 101 é a base de toda a trilha. Reforce distinção entre informação educativa e indicação clínica individualizada. Encaminhe dúvidas de saúde ao profissional habilitado. O campus soma XP e progresso — marque a aula como concluída após revisar o conteúdo.`;

  return {
    intro,
    summary,
    objectives,
    materials,
    references,
    professorNotes
  };
}
