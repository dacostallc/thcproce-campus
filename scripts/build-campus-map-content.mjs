/**
 * Gera o corpus editorial em Markdown para os 31 pontos navegáveis do mapa
 * (exclui apenas "boas-vindas" e "entrada principal"), sob `src/content/campus/map-points/`.
 *
 * Uso: node scripts/build-campus-map-content.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src", "content", "campus");
const MAP_ROOT = path.join(ROOT, "map-points");

const AVISO_EDUCATIVO =
  "> **Aviso:** Material educativo THCProce Campus. Não substitui acompanhamento médico nem assessoria jurídica. Em cultivo e pesquisa, respeite leis e licenças aplicáveis à sua situação.\n\n";

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function yamlFrontmatter(obj) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - "${esc(item)}"`);
    } else if (typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else if (typeof v === "number") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: "${esc(v)}"`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

function writeFile(rel, body) {
  const fp = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, body, "utf8");
}

function sevenBlock(parts) {
  return [
    "## Introdução",
    parts.intro,
    "## Fundamentos",
    parts.fundamentos,
    "## Parte técnica",
    parts.tecnica,
    "## Aplicações práticas",
    parts.pratica,
    "## Erros comuns",
    parts.erros,
    "## Segurança e responsabilidade",
    parts.seguranca,
    "## Resumo final",
    parts.resumo
  ].join("\n\n");
}

/** Texto modular por tema — linguagem didática, cinematográfica leve, sem jargão “stoner”. */
const T = {
  segurancaLegalBase:
    "Consulte sempre normas locais sobre pesquisa, cultivo autorizado e transporte. Em contexto medicinal, busque profissionais habilitados para prescrição e monitorização.",

  cienciaBase:
    "A cannabis é uma planta com história agronómica e farmacológica longa; hoje, boa parte do que ensinamos cruza botânica, fisiologia vegetal e evidência científica — sem promessas milagrosas.",

  indoorAmbiente:
    "Em ambiente fechado, a planta depende de você para luz, troca gasosa, temperatura, umidade e nutrição. O método consistente vence o improviso: observação diária + registo simples.",

  outdoorSolo:
    "Ao ar livre, o solo vivo e a microbiota são aliados. Trabalhamos matéria orgânica, drenagem e observação climática — sempre dentro do que for permitido legalmente na sua região.",

  nutricaoSolucao:
    "Nutrir não é ‘empurrar’ fertilizante por ansiedade; é calibrar demanda da planta com condutividade elétrica (EC), pH estável e transpiração saudável — sintomas guiam, números disciplinam.",

  pragasIPM:
    "Manejo integrado prioriza prevenção (higiene, ventilação, inspeção). Intervenções são escalonadas: remover foco mecânico, saneantes autorizados quando aplicável, e só depois químicos compatíveis com segurança.",

  solventless:
    "Extrações solventless exploram resinas sem hidrocarbonetos — água gelada, agitação mecânica, calor e pressão moderados. O foco é segurança doméstica e repetibilidade de processo.",

  oleoExtracao:
    "Óleos e tinturas exigem pensamento farmacêutico leigo: higiene, padronização aproximada, rotulagem honesta e cautela com solventes — sempre em conformidade legal.",

  medicinaResponsavel:
    "Falamos de quadros clínicos em nível educativo: possíveis mecanismos, limites de evidência e importância da titulação médica. Sintomas e doses individuais não se resolvem por mensagem informal.",

  geneticaProp:
    "Propagação disciplinada reduz drift genético e doenças. Da semente ao clone, cada escolha altera vigor, uniformidade e janelas de colheita.",

  legislacaoBR:
    "O quadro normativo brasileiro tem mudado; interprete fontes oficiais e órgãos competentes. Evite simplificações dramáticas — ‘legal’ e ‘ilegal’ mudam com contexto e tipo de atividade.",

  campusServico(p) {
    return `Este espaço do campus (${p.title}) organiza experiência e comunidade. Mantemos tom profissional: respeito, pontualidade em eventos e orientação clara quando houver transmissão ao vivo.`;
  }
};

/** @type {Record<string, (spec: object) => {intro:string,f:string,t:string,p:string,e:string,s:string,r:string}}>} */
const BODY_BUILDERS = {
  cannabis101_hub(spec) {
    const intro = `${T.cienciaBase} O **Cannabis 101** é a porta de entrada: você aprende vocabulário estável, diferencia usos e contextos legais em alto nível e prepara-se para trilhas técnicas sem ruído ideológico.`;
    const f =
      "Família botânica, morfologia básica (folhas, inflorescências), ciclo de vida anual/perene em cultivo, diferenças entre materiais de fibra (cânhamo) e genéticas ricas em canabinoides usadas em pesquisa autorizada.";
    const t =
      "Mapa conceitual de THC, CBD e terpenos; sistema endocanabinoide como rede reguladora — sempre como modelo educativo, não como receituário; formas comuns de preparação na pesquisa clínica.";
    const p =
      "Leia as aulas na ordem sugerida; faça anotações com suas próprias perguntas para levar a um profissional habilitado quando for caso de saúde ou projeto agrícola licenciado.";
    const e =
      "Confundir ‘natural’ com ‘sem risco’; misturar legislação brasileira com jurisdições estrangeiras; tomar conteúdo educativo como permissão para conduta irregular.";
    const s = `${T.segurancaLegalBase} Priorize fontes primárias e redução de danos quando o tema for uso por adultos.`;
    const r =
      "Você sai com mapa mental legível: planta, corpo, lei e próximos passos no campus — indoor, outdoor, extrações ou medicina — sem pressa e com método.";
    return { intro, f, t, p, e, s, r };
  },

  solventless_hub(spec) {
    const intro = `No laboratório solventless do campus, estudamos ${spec.focus}. O objetivo é domínio técnico com segurança doméstica e escala pequena — repetibilidade antes de ‘heroísmo’ de gramagem.`;
    const f =
      "Tricomas como glândulas produtoras de resina; influência de genética e maturação na lavagem; papel da temperatura na expressão mecânica; por que água gelada e não solventes orgânicos voláteis nesta trilha.";
    const t =
      "Malhas micronizadas, tempo de lavagem, lavagens múltiplas com disciplina de diluição; prensagem com rampas térmicas prudentes; cura do hash como estabilização aromática e textural.";
    const p =
      "Fluxo de trabalho limpo: desde material congelado estável até armazenamento em recipientes adequados; etiquetas com data e lote informal para seu caderno de campo.";
    const e =
      "Água quente demais destruindo terpenos; agitação excessiva carregando clorofila; pressão alta sem controle — pasta escura e sabor vegetal marcado.";
    const s =
      "Ventilação ao trabalhar com equipamentos elétricos; superfícies sanitárias; nunca misturar conceitos de solventless com extrações químicas caseiras sem supervisão legal/industrial.";
    const r =
      "Você compreende a gramática do bubble, rosin e curas associadas — quando avançar para vídeos, será capaz de nomear cada decisão técnica.";
    return { intro, f, t, p, e, s, r };
  },

  oil_hub(spec) {
    const intro = `${spec.focus}. Abordamos higiene, padronização aproximada e linguagem responsável sobre dosagens — sem rotular produtos caseiros como medicamentos registrados.`;
    const f =
      "Lipídios como solventes para canabinoides; decarboxilação como etapa química conceitual; importância de evitar contaminação microbiológica em infusões domésticas para pesquisa pessoal autorizada.";
    const t =
      "Escolha de matéria-prima seca e estável; titulação grosseira por diluição; filtração e clarificação conceituais; armazenamento com proteção de luz.";
    const p =
      "Planilha simples: volume, concentração alvo aproximada, lotes e datas — útil também para importação futura em LMS.";
    const e =
      "Superaquecimento que degrada terpenos; falta de rotulagem levando a erro de dose; uso de solventes tóxicos sem infraestrutura legal.";
    const s = `${T.oleoExtracao}`;
    const r =
      "Base para entender extrações orientadas a óleo dentro do arcé legal — pronto para aprofundar normas sanitárias quando aplicável.";
    return { intro, f, t, p, e, s, r };
  },

  culinary_hub(spec) {
    const intro = `A escola de culinária canábica ensina ${spec.focus}: técnica gastronómica primeiro, canabinoides como variável controlada depois.`;
    const f =
      "Ligação lipofílica; por que manteiga e óleos estáveis são vetores clássicos; importância de homogeneizar misturas para distribuição mais uniforme.";
    const t =
      "Decarboxilação conceitual aplicada à cozinha; térmicas suaves versus longos cozidos; microdosagem culinária e etiquetagem doméstica ‘para adultos informados’.";
    const p =
      "Roteiros de receita com checkpoints de tempo/temperatura; fichas de porção para discussão responsável em comunidade.";
    const e =
      "Dosagem impulsiva; misturar bebidas alcoólicas sem critério educativo; falta de comunicação clara em ambiente social.";
    const s =
      "Armazenamento fora do alcance de crianças e animais; rotulagem visível; alertas para grupos sensíveis conforme orientação profissional.";
    const r =
      "Você articula cozinha séria com cannabis como ingrediente técnico — respeito e clareza antes de ‘efeito’.";
    return { intro, f, t, p, e, s, r };
  },

  medicinal_hub(spec) {
    const intro = `${T.medicinaResponsavel} Este hub (${spec.title}) organiza leituras sobre ${spec.focus}.`;
    const f =
      "CB1/CB2 como pontos de partida; limites do que sabemos por ensaios clínicos versus dados observacionais; importância do encaminhamento quando há comorbidades.";
    const t =
      "Vias de administração na pesquisa; farmacocinética em linhas gerais; interações potenciais — lista para discutir com prescritor, não para autor-medicação.";
    const p =
      "Diário de sintomas template (sem interpretação médica na nossa parte); perguntas úteis para levar à consulta.";
    const e =
      "Automedicação por influenciadores; abandonar tratamentos prescritos; diagnosticar pela internet.";
    const s =
      "Privacidade de dados de saúde; ética em comunidade; conformidade com prescrição quando existir programa legal.";
    const r =
      "Quadro honesto: cannabis medicinal como campo em evolução — método e humildade científica.";
    return { intro, f, t, p, e, s, r };
  },

  genetics_hub(spec) {
    const intro = `${T.geneticaProp} ${spec.focus}`;
    const f =
      "Sexagem conceitual; uniformidade versus heterogeneidade em populações; sanidade de clones e índice simples de vigor.";
    const t =
      spec.tech ??
      "Germinação com umidade estável; substratos aerados; luz suave na plântula; endurecimento gradual.";
    const p =
      "Protocolo de etiquetas (genética, data, fenótipo observado); fotografia documental para seleção futura.";
    const e =
      "Substrato encharcado; luz forte demais em mudas; clones com ferramentas sem sanitização.";
    const s =
      "Uso de materiais de propagação apenas onde permitido; não transportar material vegetal atravessando jurisdições restritivas.";
    const r =
      "Propagação disciplinada como base de todo cultivo previsível.";
    return { intro, f, t, p, e, s, r };
  },

  outdoor_hub(spec) {
    const intro = `No campo outdoor: ${spec.focus}. ${T.outdoorSolo}`;
    const f =
      "Fotoperíodo natural; impacto de latitude tropical; chuva e drenagem; vento como moldador de estrutura.";
    const t =
      spec.tech ??
      "Escolha de local com insolação honesta; sopés e sombras parciais; microclimas junto a muros vegetação.";
    const p =
      "Cronograma de observação semanal; plano de tutoramento simples; proteções pluviais leves.";
    const e =
      "Plantio tardio demais na estação; ignorar drenagem em vasos ao ar livre; vigilância sanitária ausente.";
    const s =
      "EPIs simples ao manejar estercos/compostos; respeito a vizinhança e normas ambientais locais.";
    const r =
      "Outdoor como disciplina de planeamento — sol e solo como parceiros, não inimigos.";
    return { intro, f, t, p, e, s, r };
  },

  greenhouse_hub(spec) {
    const intro = `Greenhouse une sol natural e controle parcial: ${spec.focus}.`;
    const f =
      "Efeito estufa local; pontos de orvalho e condensação; CO₂ como variável secundária após ventilação adequada.";
    const t =
      "Ventilação lateral/superior; sombreamento sazonal; suplementação LED pontual em dias encobertos.";
    const p =
      "Checklist diário: temperatura máx/mín, UR média, pontos de escoamento de água.";
    const e =
      "Estanqueidade excessiva sem renovação de ar; microclimas estagnados favorecendo fungos.";
    const s =
      "Estruturas estáveis (vento); electrificação segura em ambiente úmido.";
    const r =
      "Microclima pensado como cinematografia lenta — cada dia reescreve um pouco o filme da safra.";
    return { intro, f, t, p, e, s, r };
  },

  indoor_hub(spec) {
    const intro = `${T.indoorAmbiente} Foco: ${spec.focus}.`;
    const f =
      "PPFD como linguagem de luz; VPD como ponte entre temperatura e transpiração; circadiano artificial coerente.";
    const t =
      spec.tech ??
      "Layout de luminárias; fotoperíodo vegetativo/floração; curva de secagem prévia ao ambiente de flora.";
    const p =
      "Ronda diária com quatro olhares: folhas novas, folhas médias, substrato, odor ambiente.";
    const e =
      "Rega por calendário sem observação; bloquear totalmente entrada de ar fresco em nome do ‘cheiro’;";
    const s =
      "Segurança elétrica; umidificadores higienizados; extintor acessível quando usar equipamento aquecido.";
    const r =
      "Indoor como orquestra — cada subsistema precisa partitura, não improviso contínuo.";
    return { intro, f, t, p, e, s, r };
  },

  indoor_micro(spec) {
    const intro = `Este marcador do mapa aprofunda **${spec.angle}** dentro da trilha de cultivo indoor.`;
    const f = `${T.indoorAmbiente} Relacionamos sintomas foliares com hipóteses testáveis antes de mudanças bruscas.`;
    const t = spec.tecnica;
    const p = spec.pratica;
    const e = spec.erros;
    const s =
      "Ventilação e máscaras quando aplicar produtos; desligar luminárias ao manusear cabos molhados.";
    const r = spec.resumo;
    return { intro, f, t, p, e, s, r };
  },

  outdoor_micro(spec) {
    const intro = `Marcador outdoor: **${spec.angle}**. ${T.outdoorSolo}`;
    const f = "Integração com solo vivo, calendarização local e prevenção sanitária.";
    const t = spec.tecnica;
    const p = spec.pratica;
    const e = spec.erros;
    const s = "Respeitar intervalos de segurança em produtos; proteger nascentes e corpos hídricos.";
    const r = spec.resumo;
    return { intro, f, t, p, e, s, r };
  },

  ipm_micro(spec) {
    const intro = `${T.pragasIPM} Foco específico: **${spec.pest}**.`;
    const f =
      "Identificação por danos típicos e inspeção na face inferior das folhas; limiar de tolerância em cultivo educativo.";
    const t = spec.tecnica;
    const p = spec.pratica;
    const e = spec.erros;
    const s =
      "Registrar produtos utilizados com doses e datas; usar EPI; não misturar tanques sem folha de segurança.";
    const r = spec.resumo;
    return { intro, f, t, p, e, s, r };
  },

  legislacao_micro(spec) {
    const intro = `${T.legislacaoBR} ${spec.angle}`;
    const f =
      "Leitura de diplomas e fontes oficiais; distinção entre autorização individual, projetos de pesquisa e mercados regulados — sempre atualizar com advogado quando necessário.";
    const t =
      "Checklist de perguntas para profissional jurídico: tipo de atividade, volume, localidade, finalidade;";
    const p =
      "Quadro comparativo anotado pelo aluno (sem conselhos finais do curso) para discussão externa.";
    const e =
      "Crédulo com ‘achismos’ legais em redes sociais; extrapolar decisões de outros países;";
    const s =
      "Privacidade e segurança digital ao documentar projetos sensíveis.";
    const r =
      "Tom de sobriedade: direito muda; método de pesquisa jurídica permanece.";
    return { intro, f, t, p, e, s, r };
  },

  service_community(spec) {
    const intro = T.campusServico(spec);
    const f =
      "Como navegar eventos ao vivo, registrar interesse e manter etiqueta de auditório digital.";
    const t =
      "Integrações futuras com LMS para credenciais opcionais; leitura de programação diária;";
    const p =
      "Use este espaço para organizar estudo em grupo com moderadores THCProce quando disponível.";
    const e =
      "Spam, assédio ou partilha de dados pessoais em mural público;";
    const s =
      "Reporte conteúdos que violem guidelines da comunidade educativa.";
    const r =
      "Campus também é convivência cordial — tecnologia serve ao aprendizado.";
    return { intro, f, t, p, e, s, r };
  }
};

/** Catálogo dos 31 pontos — IDs iguais ao `campusMapAreasCatalog.seed.ts` (exceto welcome + entrar). */
const POINTS = [
  {
    id: "curso-cultivo-101",
    title: "Cannabis 101",
    panelTitle: "Cannabis 101 · curso introdutório",
    linkedCourseId: "cannabis-101",
    difficulty: "Iniciante",
    category: "Fundamentos",
    tags: ["botanica", "canabinoides", "legalidade", "ECS", "reducao-de-danos"],
    focus: "porta de entrada conceitual ao campus",
    builder: "cannabis101_hub",
    modules: [
      "Porta de entrada metodológica",
      "Planta e vocabulário estável",
      "Corpo, contextos e responsabilidade",
      "Panorama legal em alto nível"
    ],
    lessons: [
      "Primeira travessia: como estudar no campus",
      "Cannabis como planta e como objeto cultural",
      "Do laboratório ao campo autorizado",
      "Canabinoides sem hype",
      "Leituras honestas sobre uso e lei"
    ]
  },
  {
    id: "curso-hashmaker",
    title: "Hashmaker · solventless",
    panelTitle: "Extrações solventless & hash",
    linkedCourseId: "extracoes-solventless",
    difficulty: "Avançado",
    category: "Extrações",
    tags: ["bubble-hash", "rosin", "piatella", "agua-gelada", "seguranca"],
    focus: "bubble hash, rosin e curas solventless",
    builder: "solventless_hub",
    modules: [
      "Resina e maturação",
      "Lavagem e separação",
      "Prensagem responsável",
      "Cura e armazenamento"
    ],
    lessons: [
      "Tricomas sob o prisma da lavagem",
      "Construir uma lavagem limpa",
      "Rosin: rampas térmicas prudentes",
      "Do puck ao tempo de cura",
      "Check-list de higiene doméstica"
    ]
  },
  {
    id: "curso-extracao-de-oleo",
    title: "Extração de óleo",
    panelTitle: "Laboratório de óleos",
    linkedCourseId: "extracao-oleo",
    difficulty: "Avançado",
    category: "Laboratório",
    tags: ["oleos", "tinturas", "lipideos", "padronizacao", "higiene"],
    focus: "óleos, tinturas e disciplina de laboratório doméstico autorizado",
    builder: "oil_hub",
    modules: ["Fundamentos lipídicos", "Processo e claridade", "Dosagem simbólica", "Rotulagem e arquivo"],
    lessons: ["Por que vetores lipídicos importam", "Higiene antes de elegância", "Planilhas de lote educativo", "Luz, oxigénio e vida útil", "Quando escalar para ambiente regulado"]
  },
  {
    id: "curso-culinaria-cannabica",
    title: "Culinária cannábica",
    panelTitle: "Escola de culinária",
    linkedCourseId: "culinaria",
    difficulty: "Intermediário",
    category: "Gastronomia",
    tags: ["edibles", "decarboxilacao", "porcoes", "seguranca-alimentar"],
    focus: "técnicas gastronómicas com vetores lipídicos e dosagem consciente",
    builder: "culinary_hub",
    modules: ["Gastronomia primeiro", "Thermal & tempo", "Porções e comunicação", "Ética social"],
    lessons: ["Mise en place mental", "Óleos estáveis versus delicados", "Ficha de porção modelo", "Rotulagem doméstica", "Ambientes sociais responsáveis"]
  },
  {
    id: "curso-aplicacoes-terapeuticas",
    title: "Aplicações terapêuticas",
    panelTitle: "Instituto medicinal",
    linkedCourseId: "medicina",
    difficulty: "Todos os níveis",
    category: "Medicina canabinoide",
    tags: ["ECS", "evidencia", "titulacao", "encaminhamento"],
    focus: "quadros educativos sem substituir consultório",
    builder: "medicinal_hub",
    modules: ["ECS como mapa", "Evidência viva", "Vias e cautelas", "Diário para o prescritor"],
    lessons: ["Perguntas úteis na consulta", "Limites dos ensaios clínicos", "Interações: lista de conversa", "Privacidade em comunidade", "Cannabis não é panaceia"]
  },
  {
    id: "curso-sementes-feminizadas",
    title: "Sementes feminizadas",
    panelTitle: "Genética de sementes",
    linkedCourseId: "genetica",
    difficulty: "Avançado",
    category: "Genética",
    tags: ["sementes", "fenotipos", "uniformidade", "viveiro"],
    focus: "sementes, uniformidade e seleção inicial",
    builder: "genetics_hub",
    tech: "Critérios de loja confiável para pesquisa; germinação legal; registo fenotípico precoce;",
    modules: ["Mercado e ciência", "Da semente à plântula", "Seleção precoce", "Documentação"],
    lessons: ["O que ‘feminizada’ implica em campo", "Germinar com paciência", "Primeiras folhas verdadeiras", "Erros que custam vigor", "Caderno de fenótipos"]
  },
  {
    id: "curso-preparacao-do-solo",
    title: "Preparação do solo",
    panelTitle: "Solo vivo para outdoor",
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Iniciante",
    category: "Cultivo outdoor",
    tags: ["solo", "composto", "drenagem", "microbiota"],
    focus: "solo vivo, drenagem e matéria orgânica responsável",
    builder: "outdoor_hub",
    tech: "Análise simples: textura, infiltração; correções com compostagem madura; mulch;",
    modules: ["Leitura de solo", "Correções lentas", "Irrigação consciente", "Observação sazonal"],
    lessons: ["Textura e água", "Composto maduro versus fresco", "Camadas e respiração radicular", "Erros de compactação", "Checklist antes do plantio"]
  },
  {
    id: "curso-nutrientes",
    title: "Nutrientes & soluções",
    panelTitle: "Nutrição em solução",
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Cultivo indoor",
    tags: ["nutricao", "EC", "pH", "transpiracao"],
    focus: "nutrição em solução, EC/pH e leitura da planta",
    builder: "indoor_micro",
    angle: "nutrição mineral orgânica balanceada em sistema fechado",
    tecnica: `${T.nutricaoSolucao} Relação N-P-K como narrativa aproximada; micrones como pitadas — não como mágica.`,
    pratica:
      "Cronograma de soluções começa fraco sobe conforme demanda; observe pontas novas e mais velhas; mantenha diário de EC/pH na matriz;",
    erros:
      "Corrigir pH à pancada; ignorar temperatura da solução; fertilizar planta que não transpira por stress térmico;",
    resumo:
      "Nutrir indoor é diálogo entre números na solução e performance transpirativa — ouça os dois lados.",
    modules: ["Demanda vegetal", "EC/pH na prática", "Diagnóstico foliar", "Ritmo de soluções"],
    lessons: ["Quando a planta ‘pede’ menos", "Pontas novas contam histórias diferentes das velhas", "Temperatura da solução importa", "Flush conceitual sem dogma", "Regresso ao equilíbrio"]
  },
  {
    id: "curso-transicao-floracao",
    title: "Transição floração",
    panelTitle: "Do vegetativo ao 12/12",
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Cultivo indoor",
    tags: ["fotoperiodo", "stretch", "temperatura", "UR"],
    focus: "mudança de fotoperíodo e primeiras semanas de floração",
    builder: "indoor_micro",
    angle: "transição vegetativo → floração e gestão do ‘stretch’",
    tecnica:
      "Queda gradual ou direta de fotoperíodo conforme genética; ajuste fino de UR para reduzir risco fúngico em densidade;",
    pratica:
      "Quadro semanal: altura, espaçamento lateral, cheiros suaves de alerta; monitorização elétrica estável;",
    erros:
      "UR alta com folhas espremidas; ventilação ociosa que seca bruscamente;",
    resumo:
      "Floração começa antes das flores visíveis — começa na decisão de luz e espaço.",
    modules: ["Relógio biológico", "Ambiente na viragem", "Nutrição na viragem", "Observação fenológica"],
    lessons: ["12/12 como promessa e disciplina", "Stretch não é acidente — é genética + microclima", "Primeiras semanas ditam estrutura final", "Checar pontos de sombra", "Registar decisões"]
  },
  {
    id: "curso-vegetativo",
    title: "Fase vegetativa",
    panelTitle: "Crescimento antes da flora",
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Cultivo indoor",
    tags: ["vegetativo", "PPFD", "VAS", "estrutura"],
    focus: "estrutura vegetativa robusta antes da floração",
    builder: "indoor_micro",
    angle: "desenvolvimento vegetativo com luz e espaço bem negociados",
    tecnica:
      "PPFD progressivo; ventilação que fortalece pecíolo; poda de formação apenas com objetivo claro;",
    pratica:
      "Treinos mecânicos leves; mapa de dossel para igualdade de luz;",
    erros:
      "Saltar floração com dossel desigual; PPFD baixo demais gerando nós longos frágeis;",
    resumo:
      "Vegetativo é edição de filme — cada corte ou treino altera o enquadramento final.",
    modules: ["Arquitetura da copa", "Luz e ritmo", "Manejo suave", "Checklists"],
    lessons: ["Nós e intervalos", "Quando treinar sem drama", "Ventilação como exercício", "Fotoperíodo vegetativo estável", "Revisão antes da flora"]
  },
  {
    id: "curso-germinacao-clones",
    title: "Germinação & clones",
    panelTitle: "Plântulas e propagação",
    linkedCourseId: "genetica",
    difficulty: "Intermediário",
    category: "Genética",
    tags: ["clonagem", "sementes", "sanidade", "ummidade"],
    focus: "propagação limpa e vigor inicial",
    builder: "genetics_hub",
    tech: "Germinação legal em substrato aerado; clones com ferramentas esterilizadas; ambiente úmido não encharcado;",
    modules: ["Biologia da propagação", "Ambiente de mudas", "Clones com método", "Erros estruturais"],
    lessons: ["Umidade ≠ encharcamento", "Transplante no tempo certo", "Clones: superfícies e lâminas", "Vigor versus pressa", "Documentação genética"]
  },
  {
    id: "curso-cultivo-outdoor",
    title: "Cultivo outdoor",
    panelTitle: "Campo sob o sol",
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Iniciante",
    category: "Cultivo outdoor",
    tags: ["sol", "solo", "calendario", "clima"],
    focus: "planeamento de safra ao ar livre dentro da lei",
    builder: "outdoor_hub",
    tech: "Escolha de formato (solo vs contenção); proteções climáticas simples; observação de pragas precose;",
    modules: ["Sol e latitude", "Água no ritmo certo", "Proteção e tutoria", "Segurança comunitária"],
    lessons: ["Microclimas no seu quintal autorizado", "Irrigação que responde ao clima", "Tutores que não ferem", "Planeamento sazonal BR", "Quando pedir ajuda técnica"]
  },
  {
    id: "curso-cultivo-greenhouse",
    title: "Cultivo em estufa",
    panelTitle: "Greenhouses & microclima",
    linkedCourseId: "cultivo-greenhouse",
    difficulty: "Intermediário",
    category: "Cultivo estufa",
    tags: ["microclima", "ventilacao", "CO2", "sombreamento"],
    focus: "microclima protetivo sem sufocar a planta",
    builder: "greenhouse_hub",
    modules: ["Física da estufa", "Ar novo sempre", "Luz suplementar pontual", "Doenças de ambiente fechado"],
    lessons: ["Orvalho nas superfícies — amigo ou inimigo?", "Ventilar antes de suplementar CO₂", "Sombreamento sazonal", "Registrar temperatura em três alturas", "Check-list antes da temporada úmida"]
  },
  {
    id: "curso-cultivo-indoor",
    title: "Cultivo indoor",
    panelTitle: "Salas técnica & clima selado",
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Cultivo indoor",
    tags: ["LED", "clima", "seguranca-eletrica", "fluxo"],
    focus: "sala técnica, clima e segurança elétrica",
    builder: "indoor_hub",
    tech: "Desenho de fluxo de ar; pontos de medição; redundâncias simples em timers;",
    modules: ["Camadas do ambiente", "Luz como instrumento", "Segurança e robustez", "Rotina do cultivador"],
    lessons: ["Medir onde a planta ‘respira’", "Timers e falhas humanas", "Higienização periódica", "Cheiro e vizinhança — responsabilidade", "Diário técnico de 2 minutos"]
  },
  {
    id: "souvenirs",
    title: "Souvenirs & loja",
    panelTitle: "Loja do campus",
    linkedCourseId: null,
    difficulty: "Iniciante",
    category: "Campus",
    tags: ["loja", "comunidade", "suporte"],
    focus: "experiência comercial cordial e suporte ao estudante",
    builder: "service_community",
    modules: ["Experiência do visitante", "Objetos educativos", "Pagamentos e suporte", "Ética de marca"],
    lessons: ["Peça pelo catálogo oficial", "Evitar falsificações", "Garantias e trocas", "Privacidade na compra", "Relação loja ↔ LMS"]
  },
  {
    id: "leis-normas",
    title: "Leis e normas",
    panelTitle: "Legislação brasileira",
    linkedCourseId: "legislacao",
    difficulty: "Todos os níveis",
    category: "Legislação",
    tags: ["BR", "normas", "pesquisa", "autorizacao"],
    focus: "panorama responsável do ordenamento jurídico",
    builder: "legislacao_micro",
    angle: "como ler mudanças normativas sem pânico nem euforia",
    modules: ["Fontes e método", "Tipos de autorização", "Riscos de interpretação solitária", "Encaminhamento jurídico"],
    lessons: ["O que é ‘fonte primária’", "Perguntas para advogado", "Erro comum: meme como doutrina", "Privacidade digital", "Atualização contínua"]
  },
  {
    id: "curso-pragas-e-doencas",
    title: "Pragas & biosegurança",
    panelTitle: "Manejo sanitário ao ar livre",
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Intermediário",
    category: "Sanidade vegetal",
    tags: ["IPM", "fungo", "insetos", "prevencao"],
    focus: "diagnóstico e prevenção em campo",
    builder: "ipm_micro",
    pest: "pragas e doenças associadas a outdoor",
    tecnica:
      "Rodízio de observação; identificação por padrão de dano; intervenção mínima eficaz;",
    pratica:
      "Mapa do talhão/containers; fotografias datadas; remoção mecânica de focos;",
    erros:
      "Pulverizar sem diagnóstico; repetir o mesmo modo de ação;",
    resumo:
      "Campo saudável é vigilância gentil — não guerra diária.",
    modules: ["Vigilância", "Diagnóstico", "Escada de intervenção", "Recuperação"],
    lessons: ["Folha de baixo conta verdades", "Limite económico em hobby autorizado", "Registar clima após lesões", "Fungo versus splash-back", "Documentação para técnico"]
  },
  {
    id: "curso-podas-e-clones",
    title: "Podas & clones",
    panelTitle: "Estrutura de copa",
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Cultivo indoor",
    tags: ["poda", "LST", "clone", "sanidade"],
    focus: "estrutura de copa e propagação vegetativa limpa",
    builder: "indoor_micro",
    angle: "podas de formação e clones em ambiente indoor",
    tecnica:
      "Ferramentas afiadas e alcoolizadas; cortes inclinados; ambiente úmido estável para enraizamento;",
    pratica:
      "Roteiro LST leve antes de cortes drásticos; clones etiquetados por genética e data;",
    erros:
      "Poda excessiva sob stress térmico; clones em substrato anaeróbio;",
    resumo:
      "Copa é escultura lenta — cada intervenção altera microluz interna.",
    modules: ["Por que podar", "Ferramentas e cortes", "Clonagem indoor", "Stress e recuperação"],
    lessons: ["Quando não podar", "Ângulos que cicatrizam", "Umidade para raízes jovens", "Treino antes da tesoura", "Registar resposta em 48h"]
  },
  {
    id: "como-combate-acaros",
    title: "Combate aos ácaros",
    panelTitle: null,
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Sanidade indoor",
    tags: ["acaro", "IPM", "ventilacao"],
    focus: "ácaros em ambiente fechado",
    builder: "ipm_micro",
    pest: "ácaros em indoor",
    tecnica:
      "Inspeção magnética nas proximidades de nervuras; aumentar fluxo de ar sem secar extremidades; banhos de água controlados como primeira linha;",
    pratica:
      "Isolar plantas afetadas quando possível; folhas descartadas seladas; ciclo de revisão a cada 48h;",
    erros:
      "Ignorar estruturas adjacentes (cabos, vasos, bases); excesso de umidade estagnada;",
    resumo:
      "Ácaros odeiam ventilação organizada e hábito de olhar de perto.",
    modules: ["Biologia resumida", "Primeiras linhas", "Escada química prudente", "Pós-intervenção"],
    lessons: ["Lupa ou macro no telemóvel", "Água como ferramenta — limites", "Rotação de abordagens", "Quando chamar orientação agronómica", "Lições para o próximo ciclo"]
  },
  {
    id: "como-combate-spiders",
    title: "Combate a aracnídeos indesejados",
    panelTitle: null,
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Sanidade indoor",
    tags: ["teia", "preventivo", "higiene"],
    focus: "pequenos aracnídeos e teias em grow indoor",
    builder: "ipm_micro",
    pest: "aracnídeos/teias em indoor",
    tecnica:
      "Limpeza perimetral de sala; aspiração suave de teias em suportes; monitorização pegajosa colocada estrategicamente;",
    pratica:
      "Rodízio de entrada na sala; roupa/toca dedicada em ambientes sensíveis;",
    erros:
      "Confundir predadores benéficos em ecossistemas externos com problema indoor;",
    resumo:
      "Higiene espacial reduz surpresas — especialmente em cantos esquecidos.",
    modules: ["Identificação segura", "Prevenção estrutural", "Intervenção", "Lições"],
    lessons: ["Cantos esquecidos", "Monitorização", "Química só com diagnóstico", "Ventilação e teias", "Checklist semanal"]
  },
  {
    id: "como-fazer-um-cha",
    title: "Como preparar fertilizantes em chá",
    panelTitle: null,
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Iniciante",
    category: "Nutrição outdoor",
    tags: ["composto", "extrato", "solo-vivo"],
    focus: "extratos orgânicos ou compost teas responsáveis",
    builder: "outdoor_micro",
    tecnica:
      "Aerobicidade versus fermentação indesejada; tempo máximo seguro de ‘chá’; diluição antes da aplicação;",
    pratica:
      "Testar em poucas plantas; aplicar no início da noite em dias sem vento extremo;",
    erros:
      "Chá anaeróbio fedorento aplicado mesmo assim; misturar ingredientes sem rácio;",
    resumo:
      "Chá bom cheira a solo vivo equilibrado — não a ovo podre.",
    angle: "compost teas e extratos para solo vivo",
    modules: ["Microbiologia leiga", "Receita-base segura", "Aplicação", "Armazenamento"],
    lessons: ["Oxigénio é ingrediente", "Cheiro como sensor", "Diluir sempre", "Intervalos entre aplicações", "Abortar o lote ruim"]
  },
  {
    id: "como-usar-melaco-de-cana",
    title: "Melado & carbo rápido",
    panelTitle: null,
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Iniciante",
    category: "Nutrição outdoor",
    tags: ["carboidratos", "solo", "moderacao"],
    focus: "carbono rápido via melado com moderação",
    builder: "outdoor_micro",
    tecnica:
      "Melado como complemento, não base; atenção à fauna microbiana e à umidade do substrato;",
    pratica:
      "Pequenas doses diluídas em regas esparsas; monitorizar atratividade a insetos;",
    erros:
      "Excesso criando substrato pegajoso e mosquinhas;",
    resumo:
      "Doçura no solo pede equilíbrio — menos é cinematografia, mais é ruído.",
    angle: "melado de cana e fertilidade microbiana",
    modules: ["Por que carboidratos", "Dose prudente", "Sinergias", "Armadilhas"],
    lessons: ["Leitura do solo úmido", "Insetos e doces", "Alternativas", "Registar cheiros e textura", "Pausa obrigatória"]
  },
  {
    id: "quando-adubar-foliar",
    title: "Quando usar adubo foliar",
    panelTitle: null,
    linkedCourseId: "cultivo-indoor",
    difficulty: "Intermediário",
    category: "Nutrição indoor",
    tags: ["foliar", "stomata", "spray"],
    focus: "pulverização foliar com critério",
    builder: "indoor_micro",
    angle: "quando e como foliar faz sentido",
    tecnica:
      "pH da solução de foliar; gotículas finas; evitar luz forte imediata; horários estáveis;",
    pratica:
      "Teste em ramo menor; observar 24–48h antes de generalizar;",
    erros:
      "Cocktails excessivos; foliar como atalho para raiz não saudável;",
    resumo:
      "Foliar é pontuação musical — não tapete contínuo.",
    modules: ["Fisiologia foliar", "Janelas seguras", "Receitas simples", "Stop rules"],
    lessons: ["Estômatos e luz", "Ordem de mistura", "Quando parar", "Interação com IPM", "Registar resultado"]
  },
  {
    id: "quando-adubar-solo",
    title: "Quando fertilizar solo vivo",
    panelTitle: null,
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Iniciante",
    category: "Nutrição outdoor",
    tags: ["solo", "mineralizacao", "calendario"],
    focus: "timing de fertilização em solo orgânico vivo",
    builder: "outdoor_micro",
    angle: "ritmo de fertilização no solo vivo",
    tecnica:
      "Esperar sinais de consumo da biomassa do solo; usar temperatura do substrato como proxy de atividade microbiana;",
    pratica:
      "Camadas de mulch para modular liberação; regas com nutriente diluído em horários estáveis;",
    erros:
      "Espigas nutricionais antes da planta estabilizar após estresse;",
    resumo:
      "Solo vivo pede conversa — nutrientes entram quando a microbiota e a raiz respondem.",
    modules: ["Leitura do solo", "Gatilhos seguros", "Janelas sazonais", "Revisão"],
    lessons: ["Após chuva forte", "Calor e mineralização", "Sinais na folha média", "Pausas obrigatórias", "Diário simples"]
  },
  {
    id: "quando-pulverizar-preventivo",
    title: "Pulverização preventiva",
    panelTitle: null,
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Intermediário",
    category: "Sanidade outdoor",
    tags: ["preventivo", "calendario", "EPI"],
    focus: "calendário preventivo coerente",
    builder: "outdoor_micro",
    angle: "quando pulverizar preventivamente faz sentido",
    tecnica:
      "Produtos autorizados ao contexto; alternância de modos de ação quando aplicável; respeitar flora não-alvo;",
    pratica:
      "Mapa de pulverização; condição meteorológica mínima (vento, chuva iminente);",
    erros:
      "Calendário religioso sem observação; tank mix sem ordem segura;",
    resumo:
      "Preventivo inteligente observa clima — não superstição.",
    modules: ["Conceito IPM", "Meteorologia mínima", "Produto e dose", "Ética ambiental"],
    lessons: ["Ventos e deriva", "Chuva iminente — abortar", "Registrar lote", "Vizinhança", "Reavaliar redundância"]
  },
  {
    id: "quando-plantar-outdoor",
    title: "Quando plantar outdoor",
    panelTitle: null,
    linkedCourseId: "cultivo-outdoor",
    difficulty: "Iniciante",
    category: "Planeamento outdoor",
    tags: ["calendario", "latitude", "fenologia"],
    focus: "janelas de plantio regionais",
    builder: "outdoor_micro",
    angle: "timing de plantio ao ar livre",
    tecnica:
      "Mediana de mínimas estáveis; comprimento de dia vs genética; contenção versus solo direto;",
    pratica:
      "Semana tipo meteorológica antes do plantio definitivo; endurecimento gradual se vier de viveiro;",
    erros:
      "Plantar antes de últimas ondas de frio locais; ignorar encharcamento primaveril;",
    resumo:
      "Calendário bom nasce de dados locais — não de meme hemisférico.",
    modules: ["Clima local", "Genética e dias", "Transição viveiro→campo", "Segurança"],
    lessons: ["Apps meteorológicos como roteiro", "Pequenos testes antes do lote", "Solo encharcado — esperar", "Fotoperíodo natural", "Backup de plano B"]
  },
  {
    id: "qual-tamanho-do-vaso",
    title: "Tamanho correto do vaso",
    panelTitle: null,
    linkedCourseId: "cultivo-indoor",
    difficulty: "Iniciante",
    category: "Cultivo indoor",
    tags: ["vaso", "raizes", "substrato"],
    focus: "volume de vaso e oxigenação radicular",
    builder: "indoor_micro",
    angle: "escolha de volume de vaso e transplant em indoor",
    tecnica:
      "Incrementos de ~2× volume até dossel estabilizar; substratos com drenagem real; aeroporos;",
    pratica:
      "Sentir peso do vaso seco vs molhado; observar circling severo;",
    erros:
      "Vaso gigante precoce causando anaerobiose periférica; vaso minúsculo cronicamente;",
    resumo:
      "Raiz feliz é oxigénio + água alternando com disciplina — vaso é parte da respiração.",
    modules: ["Raiz precisa de ar", "Escalonamento", "Sinais de aperto", "Transplante"],
    lessons: ["Peso do vaso como guia", "Drenagem não é luxo", "Stress de transplant minimizado", "Último vaso antes da flora", "Erro do ‘logo grande’"]
  },
  {
    id: "cannabis-e-proibida",
    title: "\"Cannabis é proibida… e agora?\"",
    panelTitle: null,
    linkedCourseId: "legislacao",
    difficulty: "Todos os níveis",
    category: "Legislação",
    tags: ["BR", "debate", "fontes"],
    focus: "desmistificar slogans legais",
    builder: "legislacao_micro",
    angle: "pergunta frequente — resposta metódica, não emocional",
    modules: ["Slogan versus texto legal", "Casos típicos", "Fontes", "Próximo passo"],
    lessons: ["Ler diploma inteiro", "Comparar datas", "Evitar conselho de grupo", "Advogado quando?", "Atualizar sempre"]
  },
  {
    id: "deixa-seu-recado",
    title: "Mural dos alunos",
    panelTitle: "Deixa o teu recado",
    linkedCourseId: null,
    difficulty: "Iniciante",
    category: "Comunidade",
    tags: ["mural", "etiqueta", "moderacao"],
    focus: "partilha respeitosa e moderada",
    builder: "service_community",
    modules: ["Por que mural existe", "Boas práticas", "Moderación", "Impacto na comunidade"],
    lessons: ["Mensagens construtivas", "Privacidade", "Feedback THCProce", "Denúncias", "Celebrar progresso"]
  },
  {
    id: "programacao-do-dia",
    title: "Programação do dia",
    panelTitle: "Programação do dia",
    linkedCourseId: null,
    difficulty: "Iniciante",
    category: "Eventos",
    tags: ["agenda", "lives", "horarios"],
    focus: "agenda diária do campus",
    builder: "service_community",
    modules: ["Como ler a agenda", "Lembretes", "Replays futuros", "Netiquette"],
    lessons: ["Fuso horário BR", "Check-in antes da live", "Perguntas objetivas", "Respeitar monitores", "Salvar links oficiais"]
  },
  {
    id: "campus-live-cinema",
    title: "Cinema & ao vivo",
    panelTitle: "Cinema & ao vivo",
    linkedCourseId: null,
    difficulty: "Iniciante",
    category: "Eventos",
    tags: ["cinema", "streaming", "experiencia"],
    focus: "experiência audiovisual longa no campus",
    builder: "service_community",
    modules: ["Formato cinema", "Qualidade técnica doméstica", "Discussão pós-sessão", "Integração futura com LMS"],
    lessons: ["Áudio decente > resolução máxima", "Sem spoilers tóxicos", "Notas durante exibição", "Créditos também contam", "Feedback construtivo aos realizadores campus"]
  }
];

function expandLesson(title, idx, pointTitle, pieces) {
  const slots = [
    `### Texto didático — bloco A\n${pieces.intro}\n\n${pieces.f}`,
    `### Texto didático — bloco B\n${pieces.t}\n\n${pieces.p}`,
    `### Texto didático — bloco C\n${pieces.e}\n\n${pieces.s}`,
    `### Texto didático — bloco D\n${pieces.f}\n\n${pieces.t}`,
    `### Texto didático — síntese\n${pieces.r}\n\n${pieces.intro}`
  ];
  const core = slots[idx] ?? slots[0];
  return `# ${title}\n\n${AVISO_EDUCATIVO}**Área do mapa:** ${pointTitle}  \n**Aula ${idx + 1}/5**\n\n## Gancho\n${title} aparece aqui como frente cinematográfica do seu caderno técnico: imagine um plano‑médio na planta e um plano‑detalhe na folha que você está observando. Sem pressa, sem slogan.\n\n## Objetivos rápidos\n- Traduzir o subtítulo desta aula em uma hipótese testável no seu contexto autorizado.\n- Separar **sinal** (o que a planta mostra) de **ruído** (suposições aceleradas).\n- Escrever uma pergunta objetiva para técnico/advogado/prescritor quando o tema ultrapassar educação informal.\n\n${core}\n\n## Exercício de fixação\nEm 6–10 linhas: descreva um erro que você *não* cometerá na próxima semana por causa desta aula — linguagem simples, tom profissional.\n\n## Fecho\nAvance quando conseguir explicar em voz alta *por que* esta aula existe dentro de **${pointTitle}**, não só *o que* ela lista.\n`;
}

function expandModule(title, idx, point, bodyPieces) {
  const blocks = [
    `## Núcleo narrativo\n${bodyPieces.intro}\n\n### Profundamento\n${bodyPieces.f}`,
    `## Núcleo técnico\n${bodyPieces.t}\n\n### Campo de prática\n${bodyPieces.p}`,
    `## Diagnóstico\n${bodyPieces.e}\n\n### Responsabilidades\n${bodyPieces.s}`,
    `## Integração\n${bodyPieces.r}\n\n### Ponte com ${point.title}\n${bodyPieces.intro}`
  ];
  const core = blocks[idx] ?? blocks[0];
  return `# ${title}\n\n${AVISO_EDUCATIVO}**Módulo ${idx + 1}/4 · ${point.title}**\n\n${core}\n\n## Vocabulário‑chave\n- método, observação, registo simples\n- responsabilidade jurídica e sanitária\n- linguagem cinematográfica = olhar atento no tempo, não drama barato\n\n## Atividade sugerida (Moodle / caderno)\nEscreva 12–15 linhas no formato **hipótese → evidência observada → próximo teste seguro** para o tema "${title}". Anexe data e condições ambientais se aplicável.\n\n## Critérios de qualidade\n- Sem promessas terapêuticas ou jurídicas vindas do texto-base.\n- Sem romantização de risco; segurança falada com naturalidade adulta.\n\n## Ponte para o próximo módulo\nConserva o mesmo ficheiro de notas: o próximo módulo troca o ângulo da câmara, não o elenco responsável.\n`;
}

function glossaryFor(point) {
  const common = [
    "**EC (condutividade):** proxy da concentração iónica na solução — interpretar sempre com temperatura e estádio fenológico.",
    "**pH:** escala de acidez/alcalinidade que influencia absorção de nutrientes.",
    "**IPM:** manejo integrado de pragas — escada de opções, não botão único.",
    "**VPD:** défice de pressão de vapor — liga temperatura, umidade e transpiração.",
    "**Fotoperíodo:** horas de luz vs escuro que orientam desenvolvimento vegetativo/floral em genéticas fotoperiódicas.",
    "**Tricomas:** estruturas glandulares na superfície floral/foliar ligadas à resinagem — tema central em solventless.",
    "**ECS:** sistema endocanabinoide — rede reguladora; conceito educativo, não auto-diagnóstico.",
    "**Compliance:** aderência a normas aplicáveis ao seu projeto — sempre contextual."
  ];
  const extra =
    point.linkedCourseId === "legislacao"
      ? ["**Fonte primária:** diploma ou página oficial, não thread viral."]
      : point.linkedCourseId === "medicina"
        ? ["**Titulação:** ajuste gradual sob supervisão — tema médico, não lay."]
        : [];
  return `# Glossário · ${point.title}\n\n${[...common, ...extra].join("\n\n")}\n`;
}

function quizSeed(point) {
  return `# Quiz seed (importação futura) · ${point.title}\n\n> Pasta reservada para JSON/YAML de perguntas — gere versões por LMS.\n\n## Sugestão de blueprint (5 itens)\n1. **Recordação:** defina ${point.tags[0] || "conceito‑chave"} em uma frase.\n2. **Compreensão:** explique por que observação antecede intervenção agressiva.\n3. **Aplicação:** proponha um teste seguro e reversível no seu contexto autorizado.\n4. **Análise:** compare dois erros comuns listados no texto e suas causas.\n5. **Síntese:** escreva mini‑resumo (≤120 palavras) com linguagem acolhedora e precisa.\n`;
}

function buildPoint(point) {
  const builderFn = BODY_BUILDERS[point.builder];
  if (!builderFn) throw new Error(`Sem builder: ${point.builder}`);
  const pieces = builderFn(point);
  const overviewBody = sevenBlock({
    intro: pieces.intro,
    fundamentos: pieces.f,
    tecnica: pieces.t,
    pratica: pieces.p,
    erros: pieces.e,
    seguranca: `${pieces.s}\n\n${T.segurancaLegalBase}`,
    resumo: pieces.r
  });

  const shortDescription =
    point.panelTitle?.replace(/·.*/, "").trim() ||
    `${point.title}: núcleo ${point.category.toLowerCase()} no THCProce Campus.`;
  const longDescription = `${point.focus}. Trilha textual preparada para LMS, portal web e futuras peças audiovisuais — prioriza método, segurança e clareza jurídico‑sanitária.`;

  const fm = yamlFrontmatter({
    mapPointId: point.id,
    title: point.title,
    panelTitle: point.panelTitle || point.title,
    linkedCourseId: point.linkedCourseId || "",
    shortDescription,
    longDescription,
    introduction: pieces.intro.replace(/\*\*/g, "").slice(0, 280),
    objectives: [
      "Compreender fundamentos e limites do tema em linguagem acessível.",
      "Aplicar checklist práticos sem improvisação perigosa.",
      "Relacionar observação, registo e decisão técnica gradual.",
      "Reconhecer erros comuns e corrigi-los com método.",
      "Manter ética, legalidade e segurança como critérios não negociáveis."
    ],
    summary: pieces.r,
    difficulty: point.difficulty,
    category: point.category,
    tags: point.tags,
    moduleTitles: point.modules,
    lessonTitles: point.lessons,
    contentVersion: 1,
    locale: "pt-BR"
  });

  const overview = `${fm}\n\n# ${point.title}\n\n${AVISO_EDUCATIVO}${overviewBody}\n`;

  const base = path.join("map-points", point.id);
  writeFile(path.join(base, "overview.md"), overview);

  point.modules.forEach((mTitle, i) => {
    writeFile(path.join(base, "modules", `mod-${String(i + 1).padStart(2, "0")}.md`), expandModule(mTitle, i, point, pieces));
  });

  point.lessons.forEach((lessonTitle, i) => {
    writeFile(
      path.join(base, "lessons", `les-${String(i + 1).padStart(2, "0")}.md`),
      expandLesson(lessonTitle, i, point.title, pieces)
    );
  });

  writeFile(path.join(base, "glossary", "glossary.md"), glossaryFor(point));
  writeFile(path.join(base, "quiz-seed", "quiz-outline.md"), quizSeed(point));
}

function main() {
  fs.rmSync(MAP_ROOT, { recursive: true, force: true });
  fs.mkdirSync(MAP_ROOT, { recursive: true });

  const catalog = {
    generatedAt: new Date().toISOString(),
    locale: "pt-BR",
    mapPointCount: POINTS.length,
    note:
      "31 pontos = todos os hotspots do campusMapAreasCatalog.seed.ts exceto bem-vindo e entrada principal.",
    points: POINTS.map((p) => ({
      id: p.id,
      title: p.title,
      linkedCourseId: p.linkedCourseId,
      difficulty: p.difficulty,
      category: p.category,
      tags: p.tags,
      path: `map-points/${p.id}/`
    }))
  };

  for (const p of POINTS) buildPoint(p);

  writeFile("catalog.json", JSON.stringify(catalog, null, 2));
  console.log(`[campus-content] Gerados ${POINTS.length} pontos em ${MAP_ROOT}`);
}

main();
