import type { Area } from "@/data/courses";
import { getOutlineForArea } from "@/data/courseOutlines";
import type { LessonQuizItem, LessonStreamContent } from "./types";

function hashKey(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const INTROS: Array<(a: Area, title: string, n: number, total: number) => string> = [
  (a, t, n, tot) =>
    `${a.name} — aula ${n}/${tot}: «${t}». Ancoramos prática em linguagem técnica THCProce e no contexto regulatório brasileiro comparado quando útil; nada aqui substitui orientação individual de profissional habilitado quando a lei exige.`,
  (a, t, n, tot) =>
    `Nesta sessão de ${a.name} avançamos «${t}» com método: premissa mensurável, decisão registrada, verificação cruzada em campo ou bancada. É o ${n}º passo de ${tot} no outline — cada aula fecha um degrau antes do próximo tópico.`,
  (a, t, n, tot) =>
    `Objetivo desta aula (${n}/${tot}): dominar «${t}» dentro de ${a.name}. Cruzo ${a.short} com boas práticas de documentação e segurança — produtor e profissional de saúde/indústrias reguladas sabem que rastro e evidência importam tanto quanto ‘feeling’ de oficina.`,
  (a, t) =>
    `Tema central: «${t}». Leia este texto como protocolo de estudo, não como autorização legal de conduta: mapeie riscos, recursos (tempo, equipe, capital) e incerteza explícita antes de aplicar qualquer técnica fora de ambiente autorizado.`,
  (a, t) =>
    `${a.name} posiciona «${t}» na interseção entre ciência aplicada e compliance. Quando encontrar lacuna de evidência, registre-a — honestidade metodológica é marca THCProce.`,
  (a, t, n, tot) =>
    `Progressão ${n}/${tot}: «${t}». Destaco ${a.highlights[0] ?? "fundamentos técnicos"} como fio condutor e alerto para ${a.highlights[1] ?? "riscos comuns"} quando o processo descola da documentação.`,
  (a, t) =>
    `«${t}» exige três óculos: técnico (o que fazer), jurídico (onde é lícito) e sanitário (como não porter terceiros em risco). O campus não dilui essas camadas numa frase de efeito.`
];

const BODY_A: Array<(a: Area, title: string) => string> = [
  (a, title) =>
    `Desdobre «${title}» em etapas verificáveis: insumos, equipamento, sequência temporal e critério de parada. Em ${a.name}, erro clássico é pular medição e corrigir ‘no olho’ — isto escala mal em equipe e em auditoria.`,
  (a, title) =>
    `Do ponto de vista de processo, «${title}» altera risco quando exposto a variáveis não controladas (clima, eletricidade, solvente, cadeia de frio). Liste variáveis e limite superior aceitável antes de otimizar rendimento.`,
  (a, title) =>
    `Relacione «${title}» ao conjunto ${a.category}: não existe peça isolada — o que acontece no ciclo anterior (genética, ambiente, extração) condiciona resultados e riscos posteriores.`,
  (a, title) =>
    `Para ${a.name}, trate «${title}» como hipótese testável: defina indicador (o que medir), instrumento (como medir) e frequência. Sem isso, ‘melhorou’ vira achismo coletivo.`,
  (a, title) =>
    `A transição de conhecimento tácito para SOP começa em «${title}»: quem treina deve ler o mesmo texto-base e assinar checklist — não versões paralelas em grupo de mensagens.`,
  (a, title) =>
    `Se «${title}» envolve pessoal externo (prestador, laboratório, transportador), o contrato mínimo e EPI/ERG não são detalhe — são parte do desenho de risco.`
];

const BODY_B: Array<(a: Area, title: string) => string> = [
  (a, title) =>
    `No contexto brasileiro, cruze «${title}» com exigências locais de biossegurança, descarte e documentação — normas podem mudar; mantenha canal com assessoria técnica e jurídica quando operação real estiver em jogo.`,
  (a, title) =>
    `Química e biologia recompõem risco de «${title}»: umidade, temperatura, tempo e contaminação cruzada são os ‘quatro cavaleiros’ da perda de lote em processos sensíveis.`,
  (a, title) =>
    `Se a operação incluir cannabis psicoativa ou preparações para pessoas, barreiras adicionais: rastreio, rotulagem e comunicação cuidadosa — a THCProce não acopla esta aula a consultório, mas acopla a prudência narrativa.`,
  (a, title) =>
    `Em escala cooperativa ou industrial, «${title}» conecta a dados de lote e a governança: assembleia lê número, não slogan — treine equipe para falar com planilha e COA, não só com retórica.`,
  (a, title) =>
    `Use dados secundários só com citação: transferir conclusão de estudo em população não equivalente para seu processo sem ajuste é erro científico e negócio ruim.`,
  (a, title) =>
    `Segurança de informação também se aplica: lotes, pacientes ou formulações internas não circulam em grupo aberto — LGPD e sensibilidade social de mercado regulado.`
];

const BODY_C: Array<(a: Area, title: string) => string> = [
  (a, title) =>
    `Feche «${title}» com um plano de ação de 7 dias: uma métrica, um ajuste, uma verificação — mesmo que simbólica em campo piloto. Educação THCProce valoriza hábito de fechamento, não lista infinita de leituras.`,
  (a, title) =>
    `Se «${title}» gerar dúvida jurídica concreta, o encaminhamento é advogado habilitado — o texto do campus constrói mapa mental, não substitui parecer.`,
  (a, title) =>
    `Compatibilize «${title}» com próximos módulos do campus: pós-colheita, laboratório ou medicina regulada dependem de coerência de vocabulário e de amostragem desde o cultivo.`,
  (a, title) =>
    `Marque a aula como vista após reler objetivos e responder ao quiz — o progresso no mapa reforça disciplina de estudo, não ‘gamificação vazia’.`,
  (a, title) =>
    `Checklist mental final: fiz anotações objetivas? Identifiquei um risco e um indicador para a próxima sessão em «${title}»? Se não, volte ao texto antes de avançar.`,
  (a, title) =>
    `Em discussão de forum, traga referência ou dado — opinião sem âncora dispersa a comunidade; a THCProce educa para densidade argumentativa.`
];

const CLOSINGS: Array<(a: Area, title: string) => string> = [
  (a, title) =>
    `Síntese: «${title}» passa a fazer parte do seu vocabulário operacional em ${a.name}. Próximo passo é aplicar o guia de mídia sugerida (vídeo/bancada/infográfico) quando disponível e cruzar com materiais do Moodle.`,
  (a, title) =>
    `Você fecha «${title}» com três frases próprias (anotadas) que explicam o tema a um colega leigo — se não consegue, releia o desenvolvimento antes do quiz.`,
  (a, title) =>
    `«${title}» está integrado ao tronco de competências de ${a.name}: use o resumo técnico como cola de revisão rápida antes de práticas avançadas em outras salas.`,
  (a, title) =>
    `Lembre: evidência e compliance caminham juntas — a operação que ignora uma delas compromete a outra. «${title}» não é exceção.`
];

const QUIZ_POOL: LessonQuizItem[] = [
  {
    question: "Qual atitude é mais alinhada ao método THCProce ao aplicar técnica nova em escala?",
    options: [
      "Escalar imediatamente após um sucesso anedótico",
      "Documentar premissas, medir indicador e rever em ciclo curto antes de escalar",
      "Evitar qualquer documentação para agilidade",
      "Substituir EPI por pressa se o lote for pequeno"
    ],
    correctIndex: 1
  },
  {
    question: "Diante de lacuna de evidência científica, o produtor deve:",
    options: [
      "Afirmar resultado como provado",
      "Declarar incerteza, testar hipótese pequena e registrar",
      "Copiar protocolo de outro bioma sem ajuste",
      "Silenciar falhas de lote"
    ],
    correctIndex: 1
  },
  {
    question: "Sobre orientação clínica individual:",
    options: [
      "O campus substitui consultório quando o aluno estudou bastante",
      "Dúvidas de saúde vão a profissional habilitado — aula é educação geral",
      "Fóruns entre alunos substituem prescrição",
      "Dosagem é sempre opcional"
    ],
    correctIndex: 1
  },
  {
    question: "Rastreabilidade de lote é relevante porque:",
    options: [
      "É detalhe burocrático sem impacto em segurança",
      "Permite recall, aprendizado de causa raiz e transparência regulatória",
      "Serve só para marketing de preço alto",
      "Substitui análise de qualidade"
    ],
    correctIndex: 1
  },
  {
    question: "Em comunicação sobre cannabis, compliance implica:",
    options: [
      "Usar claims terapêuticos amplos para vender",
      "Evitar promessas não sustentadas em rótulo ou post — respeitar vigilância sanitária",
      "Ignorar regras se o produto for ‘natural’",
      "Copiar texto de fora do Brasil sem adaptação"
    ],
    correctIndex: 1
  },
  {
    question: "Ao trabalhar com solventes ou elétrica em bancada:",
    options: [
      "Ventilação e norma de instalação são secundárias",
      "Seguir NR/local, ventilar, EPI e projeto elétrico adequado",
      "Usar extensão doméstica permanente",
      "Medir somente aroma, não risco"
    ],
    correctIndex: 1
  }
];

function pickQuiz(h: number, lessonIndex: number): readonly LessonQuizItem[] {
  const a = QUIZ_POOL[h % QUIZ_POOL.length]!;
  const b = QUIZ_POOL[(h + lessonIndex * 3 + 1) % QUIZ_POOL.length]!;
  let c = QUIZ_POOL[(h + lessonIndex * 5 + 2) % QUIZ_POOL.length]!;
  if (c.question === b.question) c = QUIZ_POOL[(h + 4) % QUIZ_POOL.length]!;
  return [a, b, c];
}

/**
 * Conteúdo editorial denso com variáveis por curso/índice — substituível por ficheiros manuais por aula.
 * Não usa texto fixo idêntico ao antigo `campusCourseRich` de uma linha: combina bancos rotacionados.
 */
export function generateDeterministicLesson(area: Area, lessonIndex: number): LessonStreamContent | null {
  const outline = getOutlineForArea(area.id);
  if (!outline || lessonIndex < 0 || lessonIndex >= outline.length) return null;
  const title = outline[lessonIndex]!;
  const total = outline.length;
  const n = lessonIndex + 1;
  const h = hashKey(`${area.id}:${lessonIndex}:${title}`);

  const intro = INTROS[h % INTROS.length](area, title, n, total);
  const p1 = BODY_A[h % BODY_A.length](area, title);
  const p2 = BODY_B[(h >> 3) % BODY_B.length](area, title);
  const p3 = BODY_C[(h >> 5) % BODY_C.length](area, title);
  const body = `${p1}\n\n${p2}\n\n${p3}`;
  const closingSummary = CLOSINGS[h % CLOSINGS.length](area, title);

  const objectives = [
    `Explicar «${title}» com vocabulário técnico de ${area.name} e indicar pelo menos um risco mitigável.`,
    `Conectar o tema a ${area.highlights[0] ?? area.short} e preparar transição para tópicos vizinhos do outline.`,
    `Aplicar checklist de medição, registro ou compliance conforme o tipo de operação discutida.`
  ] as const;

  const materials = [
    `Roteiro desta aula + espaço para medidas próprias (versão Moodle/PDF quando publicada).`,
    `Equipamento de medição recomendado conforme subtema de «${title}» — lista mínima na biblioteca do curso.`,
    `Bloco “Suas notas” no painel — sintetize dúvidas objetivas para o fórum moderado.`
  ] as const;

  const references = [
    `THCProce — documentos institucionais e links oficiais em thcproce.com.br/escola`,
    `Bibliografia por módulo (Moodle) — priorize revisões e fontes primárias citadas pelo professor responsável`,
    `Normas técnicas e sanitárias aplicáveis à sua região — atualize com assessoria quando operar de fato`
  ] as const;

  const professorNotes = `${area.professor}: desenvolva «${title}» com exemplos locais anônimos. Reforce limites legais e encaminhamentos. Esta camada é expansão editorial padrão — pode ser substituída por texto 100% manual no ficheiro da disciplina.`;

  const media = {
    needsVideo: true,
    needsImage: true,
    needsInfographic: (h % 3 !== 0) as boolean,
    needsSupportMaterial: true
  };

  return {
    title,
    introduction: intro,
    body,
    objectives,
    closingSummary,
    quiz: pickQuiz(h, lessonIndex),
    media,
    materials,
    references,
    professorNotes
  };
}
