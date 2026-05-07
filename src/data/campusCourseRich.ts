import type { Area } from "@/data/courses";
import type { LessonRichContent } from "@/data/lessonRichTypes";
import { COURSE_LESSON_THEMES } from "@/data/courseLessonThemes";

type CourseVoice = {
  /** Tom editorial THCProce (pré-lançamento fundador). */
  lead: string;
  axis: string;
  safety: string;
};

const VOICES: Record<string, CourseVoice> = {
  "cultivo-greenhouse": {
    lead: "Greenhouse é o meio-termo entre sol pleno e indoor fechado: você molda o clima sem perder a escala.",
    axis: "Controle ambiental honesto (luz suplementar, CO₂ quando faz sentido, VPD e ventilação) sem promessas de yield mágico.",
    safety: "Sempre ventilação, elétrica adequada e registro de decisões — produtor consciente documenta o que faz."
  },
  "cultivo-outdoor": {
    lead: "Outdoor é conversa com o terreno, o calendário e a comunidade ao redor da área.",
    axis: "Solo, pragas, irrigação e realismo de clima BR — a aula ancora prática sem incentivar ilegalidade.",
    safety: "Segurança pessoal, boa vizinhança e atenção a riscos de campo (maquinário, tempo, equipe)."
  },
  "cultivo-indoor": {
    lead: "Indoor é engenharia de ambiente: luz, ar, água e nutrientes sob medida.",
    axis: "LED, fotos, VPD e diagnóstico — linguagem técnica, sem hype de equipamento caro como atalho moral.",
    safety: "Fogo, umidade e elétrica: NR e bom senso antes de “potência máxima”."
  },
  "secagem-cura": {
    lead: "Pós-colheita é onde aroma e suavidade nascem — pressa destrói terpenos.",
    axis: "Curvas de umidade, frascos e paciência reprodutível; comparamos erros comuns vs protocolo premium.",
    safety: "Higiene, frascos limpos e armazenamento que evita mofo — saúde primeiro."
  },
  "extracoes-solventless": {
    lead: "Solventless é ofício de bancada: gelo, inox, tempo e limpeza.",
    axis: "Malhas, processo, temperatura e respeito ao material — sem atalhos de solvente.",
    safety: "PEG, água e ergonomia; este curso é educativo, não receita industrial fechada."
  },
  "extracao-oleo": {
    lead: "Óleos e tinturas exigem rigor de processo e clareza sobre o que é (e não é) orientação clínica.",
    axis: "Decarb, concentrações aproximadas e responsabilidade — sempre no quadro educativo THCProce.",
    safety: "Solventes inflamáveis e ventilação; rotulagem honesta e prudência com terceiros."
  },
  laboratorio: {
    lead: "Alfabetização em COA e método é poder: você enxerga marketing vs dado.",
    axis: "Cannabinoides, terpenos e limites dos testes rápidos — honestidade sobre incerteza.",
    safety: "Nada de improviso químico sem treino; a sala ensina leitura, não substitui laboratório credenciado."
  },
  medicina: {
    lead: "Medicina canabinoide aqui é educação científica e ética — não consultório nem prescrição online.",
    axis: "ECS, titulação, interações em linguagem prudente; encaminhamos dúvidas clínicas ao profissional.",
    safety: "Privacidade do paciente e limites legais da comunicação educativa."
  },
  culinaria: {
    lead: "Cozinha com cannabis exige matemática de porção e higiene como qualquer cozinha séria.",
    axis: "Infusão, dosagem por porção e armazenamento — receitas como veículo pedagógico.",
    safety: "Alertas a crianças/pets, rotulagem doméstica e responsabilidade social em eventos."
  },
  genetica: {
    lead: "Genética aplicada é seleção, registro e calma — estabilidade leva ciclos.",
    axis: "Cruzamentos, feminização responsável em moldura educativa, bancos e fenótipos.",
    safety: "STS e produtos químicos — só o que cabe em treinamento supervisionado, sem receita clandestina."
  },
  legislacao: {
    lead: "Direito e regulatório mudam — aqui construímos mapa conceitual e perguntas certas ao advogado.",
    axis: "Brasil, comparações internacionais e compliance de comunicação; nada de assessoria jurídica personalizada.",
    safety: "Encaminhamento a profissional habilitado para casos específicos."
  },
  cooperativismo: {
    lead: "Cooperativismo medicinal exige estatuto, transparência e cuidado com pessoas reais.",
    axis: "Governança mínima viável, produção associada e rastreio — sem romantizar escala irresponsável.",
    safety: "Conflitos e finanças: mediação antes de ruptura; documentação amigável ao auditor."
  },
  industria: {
    lead: "Indústria regulada é marca, lote e compliance — não é só embalagem bonita.",
    axis: "Licenças em visão panorâmica, supply chain, carreira — conteúdo em expansão no pré-lançamento.",
    safety: "Claims, rotulagem e marketing: prudência para não prometer o que a lei não sustenta."
  }
};

function voiceFor(area: Area): CourseVoice {
  return (
    VOICES[area.id] ?? {
      lead: area.description.slice(0, 240) + (area.description.length > 240 ? "…" : ""),
      axis: area.short,
      safety: "Mantenha registro das suas práticas e busque mentoria oficial THCProce quando disponível."
    }
  );
}

/**
 * Conteúdo rico editorial para cursos do campus (exceto Cannabis 101 — módulo próprio).
 */
export function getCampusCourseLessonRich(
  area: Area,
  lessonIndex: number,
  lessonTitle: string
): LessonRichContent {
  const n = lessonIndex + 1;
  const v = voiceFor(area);
  const theme = COURSE_LESSON_THEMES[area.id];

  const intro = `${area.name} — aula ${n} de ${area.lessons} (pré-lançamento fundador THCProce). ${v.lead}

Nesta sessão trabalhamos «${lessonTitle}»: ${v.axis}

${theme?.mood ? `Identidade visual do módulo: ${theme.mood}` : ""} O material completo segue liberação progressiva — veja o roteiro à esquerda para aulas disponíveis vs “Em breve”.`;

  const summary = `Foco técnico: «${lessonTitle}». Integramos ${area.short.toLowerCase()} com vocabulário de cultivo/processo THCProce, exemplos brasileiros quando aplicável e ressalvas honestas onde a evidência ainda é incipiente. Esta aula não substitui acompanhamento profissional quando a lei ou a segurança exigirem.`;

  const objectives = [
    `Dominar o núcleo de «${lessonTitle}» dentro de ${area.name}.`,
    `Relacionar o tema a: ${area.highlights[0] ?? "fundamentos do módulo"}.`,
    area.highlights[1]
      ? `Preparar transição para: ${area.highlights[1]}.`
      : `Aplicar checklist prático ao final da sessão (bloco “Materiais”).`
  ];

  const materials = [
    `Roteiro THCProce desta aula (texto central + abas) — PDFs complementares virão no Moodle conforme calendário.`,
    `Equipamento e insumos sugeridos aparecem nas seções técnicas; adapte ao orçamento sem comprometer segurança.`,
    `Bloco “Suas notas” ao final — leve dúvidas estruturadas ao fórum oficial quando aberto.`
  ];

  const references = [
    "THCProce — thcproce.com.br/escola (políticas e materiais autorizados)",
    "Bibliografia indicada pelo professor no Moodle por aula (em atualização no pré-lançamento)",
    "Normas sanitárias, elétricas e ambientais aplicáveis à sua operação (consulte especialista local)"
  ];

  const professorNotes = `${area.professor}: conteúdo em construção colaborativa — priorizamos segurança, evidência e transparência. Dúvidas de saúde ou jurídicas vão ao profissional habilitado. Marque a aula como vista para consolidar XP e trilha no campus. ${v.safety}`;

  return {
    intro,
    summary,
    objectives,
    materials,
    references,
    professorNotes
  };
}
