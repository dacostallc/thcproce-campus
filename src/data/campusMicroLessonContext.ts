/**
 * Contexto educativo por **zona do mapa** — base estrutural para microaulas contextualizadas.
 *
 * - As microaulas **não são aleatórias**: nascem do `CampusMapZoneLabel` resolvido a partir do hotspot legado
 *   (`campusMapAreasCatalog.seed.ts`) e/ou do `courseId`.
 * - `campusArea.label` no sentido de produto = este **rótulo de zona** (`CampusMapZoneLabel`): define tema visual,
 *   tema pedagógico, agrupamento e progressão temática sugerida.
 *
 * @see CAMPUS_MAP_INTERACTIVE_AREAS — coords/hits actuais
 * @see CAMPUS_MAP_ITEMS — registo semântico paralelo (`campusMapRegistry.ts`)
 */

import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";

/** Rótulo estável de zona — categoriza visual + pedagógico + microaulas. */
export type CampusMapZoneLabel =
  | "fundamentos"
  | "greenhouse"
  | "outdoor_cultivo"
  | "indoor_cultivo"
  | "viveiro_genetica"
  | "laboratorio_extracao"
  | "laboratorio_solventless"
  | "escola_culinaria"
  | "instituto_medicinal"
  | "biblioteca_ciencia_legal"
  | "comunidade_social"
  | "arena_eventos"
  | "cinema"
  | "loja_campus";

/** Blueprint editorial — conteúdo real virá depois; estrutura já contextualizada pela zona. */
export type CampusMicroLessonBlueprint = {
  /** Identificador estável para progressão / analytics */
  id: string;
  slug: string;
  title: string;
  /** Objetivo pedagógico (linha principal) */
  objective: string;
  /** Problema típico do aluno neste tema */
  problem?: string;
  /** Explicação prática curta */
  explanation?: string;
  /** Erro comum */
  commonMistake?: string;
  /** Dica THCProce */
  proceTip?: string;
  /** CTA para curso completo */
  cta?: { label: string; courseId?: string };
  /** Duração alvo (minutos), típico 2–5 */
  durationMin?: number;
  xpReward?: number;
  /** Categoria editorial (cultivo, extração, …) */
  microCategory?: string;
  /** Keywords pedagógicas extra (além do tema da zona) */
  keywords?: readonly string[];
};

export function findMicroLessonBlueprintById(
  blueprintId: string
): { blueprint: CampusMicroLessonBlueprint; zone: CampusMapZoneLabel } | null {
  const labels = Object.keys(ZONE_CTX) as CampusMapZoneLabel[];
  for (const z of labels) {
    const bp = ZONE_CTX[z].microLessonBlueprints.find((b) => b.id === blueprintId);
    if (bp) return { blueprint: bp, zone: z };
  }
  return null;
}

/** Preenche campos opcionais com cópia editorial segura (sem alterar o objeto original). */
export function enrichMicroLessonBlueprint(
  bp: CampusMicroLessonBlueprint
): Required<
  Pick<
    CampusMicroLessonBlueprint,
    | "problem"
    | "explanation"
    | "commonMistake"
    | "proceTip"
    | "durationMin"
    | "xpReward"
    | "microCategory"
  >
> &
  CampusMicroLessonBlueprint {
  const explanation = bp.explanation ?? bp.objective;
  return {
    ...bp,
    problem: bp.problem ?? "Como aplicar isto sem improviso nem risco desnecessário?",
    explanation,
    commonMistake: bp.commonMistake ?? "Saltar o método e copiar valores sem contexto climático.",
    proceTip:
      bp.proceTip ??
      "Regista temperatura, UR e decisões — o campus premia método, não heroísmo.",
    durationMin: bp.durationMin ?? 4,
    xpReward: bp.xpReward ?? 16,
    microCategory: bp.microCategory ?? "cultivo"
  };
}

export function countMicroLessonsInZone(zone: CampusMapZoneLabel): number {
  return ZONE_CTX[zone].microLessonBlueprints.length;
}

export type CampusZoneEducationalTheme = {
  id: string;
  title: string;
  summary: string;
  /** Palavras-chave para herança automática em UI/copy */
  keywords: readonly string[];
};

/**
 * Perfil completo da zona: o que `campusArea.label` (conceito de produto) passa a significar no código.
 */
export type CampusZoneEducationalContext = {
  /** Igual ao {@link CampusMapZoneLabel} */
  zoneLabel: CampusMapZoneLabel;
  /** Texto curto para HUD / chips (PT-BR) */
  mapLabel: string;
  /** Token para variantes visuais futuras (temas CSS, ilustração, som ambiente) */
  visualVariant: string;
  theme: CampusZoneEducationalTheme;
  /** Microaulas **possíveis** nesta zona — herdam automaticamente `theme` + `visualVariant` */
  microLessonBlueprints: readonly CampusMicroLessonBlueprint[];
  /** Notas para ambientação futura (áudio, particle, hora do dia) — só metadata */
  ambienceNotes?: string;
  /** Como pensar progressão temática dentro desta zona */
  progressionHint: string;
};

const ZONE_CTX: Record<CampusMapZoneLabel, CampusZoneEducationalContext> = {
  fundamentos: {
    zoneLabel: "fundamentos",
    mapLabel: "Fundamentos · Cannabis 101",
    visualVariant: "zone-fundamentos-anfiteatro",
    theme: {
      id: "theme-fundamentos",
      title: "Base científica e responsável",
      summary: "Vocabulário, planta, corpo e enquadramento legal sem sensacionalismo.",
      keywords: ["botanica", "canabinoides", "ecs", "reducao-de-danos", "lei"]
    },
    progressionHint: "Do conceito à prática de leitura crítica (rótulos, COA, consultas).",
    microLessonBlueprints: [
      {
        id: "ml-c101-tricomas-leitura",
        slug: "fundamentos-tricomas-leitura",
        title: "Ler tricomas com método",
        objective:
          "Associar estádio de tricomas a decisões educativas de colheita — sem prometer resultados clínicos.",
        problem: "Julgar maturação só pela cor no zoom do telemóvel ou pela ansiedade para cortar.",
        explanation:
          "Observa translúcido vs leitoso vs âmbar em vários pontos da copa; cruza com aroma e tempo de floração registrados.",
        commonMistake: "Confundir stress ambiental (calor/UV) com maturação real.",
        proceTip:
          "Faz duas leituras por dia em folhas médias e registra imagens — método simples evita decisões impulsivas.",
        cta: { label: "Abrir primeira aula na sala virtual", courseId: CANNABIS101_AREA_ID },
        durationMin: 4,
        xpReward: 18,
        keywords: ["tricomas", "colheita-educativa", "criticos-de-leitura"],
        microCategory: "fundamentos"
      },
      {
        id: "ml-c101-coaproximo",
        slug: "fundamentos-coa-resumo",
        title: "Interpretar um COA em cinco minutos",
        objective: "Navegar potência, segurança analítica e limites do relatório."
      },
      {
        id: "ml-c101-vocabulario-dose",
        slug: "fundamentos-vocabulario-clinico",
        title: "Do mg ao contexto: vocabulário sem autoprescrição",
        objective: "Separar educação geral de orientação médica."
      }
    ]
  },
  greenhouse: {
    zoneLabel: "greenhouse",
    mapLabel: "Estufa · microclima",
    visualVariant: "zone-greenhouse-glass",
    theme: {
      id: "theme-greenhouse",
      title: "Cultivo protegido e microclima",
      summary: "Luz natural auxiliar, ventilação, VPD conceitual e decisões de irrigação.",
      keywords: ["microclima", "ventilacao", "irrigação", "nutrientes", "pragas"]
    },
    progressionHint: "Microclima estável → irrigação → nutrição → vigilância sanitária.",
    ambienceNotes: "Luz difusa, vidro condensado, sons de ventoinha suaves.",
    microLessonBlueprints: [
      {
        id: "ml-gh-vpd-intro",
        slug: "estufa-vpd-introducao",
        title: "VPD em linguagem de estufa",
        objective: "Ligar temperatura, UR e transpiração sem folha de campo ilegal."
      },
      {
        id: "ml-gh-irrigacao-passo",
        slug: "estufa-irrigacao-passo-a-passo",
        title: "Montar um ciclo de irrigação confiável",
        objective: "Peso do substrato, dreinos e sinais de erro comuns."
      },
      {
        id: "ml-gh-pragas-prevencao",
        slug: "estufa-pragas-prevencao",
        title: "Biosegurança na estufa",
        objective: "Entradas de ar, ferramentas e isolamento — foco educativo."
      },
      {
        id: "ml-gh-nutricao-calibration",
        slug: "estufa-nutrientes-calibragem",
        title: "Nutrientes: calibrar EC/pH no espaço protegido",
        objective: "Checklist de leitura de solução e registro em diário de cultivo."
      }
    ]
  },
  outdoor_cultivo: {
    zoneLabel: "outdoor_cultivo",
    mapLabel: "Outdoor · campo",
    visualVariant: "zone-outdoor-sun",
    theme: {
      id: "theme-outdoor",
      title: "Cultivo ao ar livre e solo vivo",
      summary: "Solo, calendário sazonal, pragas e fertirrigação em linguagem de campo.",
      keywords: ["solo", "pragas", "irrigacao", "nutrientes", "preventivo"]
    },
    progressionHint: "Solo e água → plantio → nutrição → MIP → colheita planeada.",
    microLessonBlueprints: [
      {
        id: "ml-out-substrato-tecnicolor",
        slug: "outdoor-substrato-drenagem",
        title: "Preparar camada de drenagem e substrato outdoor",
        objective: "Relacionar textura, oxigenação radicular e erros comuns."
      },
      {
        id: "ml-out-pulverizacao",
        slug: "outdoor-pulverizacao-preventiva",
        title: "Quando faz sentido pulverização preventiva",
        objective: "Critérios meteorológicos e registro — não receita clandestina."
      },
      {
        id: "ml-out-cha-nutritivo",
        slug: "outdoor-cha-nutritivo-seguro",
        title: "Chás nutritivos: protocolo educativo",
        objective: "Higiene, maturação e limites legais locais."
      },
      {
        id: "ml-out-pragas-identifica",
        slug: "outdoor-pragas-diagnostico-visual",
        title: "Diagnóstico visual de pragas frequentes",
        objective: "Fluxograma observação → confirmação → recurso técnico licenciado."
      }
    ]
  },
  indoor_cultivo: {
    zoneLabel: "indoor_cultivo",
    mapLabel: "Indoor · sala técnica",
    visualVariant: "zone-indoor-purple",
    theme: {
      id: "theme-indoor",
      title: "Ambiente fechado e fotoperíodo",
      summary: "Luz, clima, nutrição em mesa, podas e pragas em espaço confinado.",
      keywords: ["led", "12-12", "nutrientes", "podas", "acaros"]
    },
    progressionHint: "Clima → vegetativo → transição → floração → pós-floração técnica.",
    microLessonBlueprints: [
      {
        id: "ml-in-vaso-transplantio",
        slug: "indoor-vaso-transplantio",
        title: "Tamanho de vaso e transplantio seguro",
        objective: "Critérios de raiz e stress hídrico educativo."
      },
      {
        id: "ml-in-flora-transicao",
        slug: "indoor-flora-transicao",
        title: "Passagem vegetativo → floração: checklist",
        objective: "Fotoperíodo, ambiente e nutrição em linguagem de sala técnica."
      },
      {
        id: "ml-in-foliar",
        slug: "indoor-adubo-foliar-quando",
        title: "Adubo foliar: quando e porquê",
        objective: "Evitar sobreposição irresponsável com outros tratamentos."
      },
      {
        id: "ml-in-acaro-protocolo",
        slug: "indoor-acaros-protocolo-educativo",
        title: "Ácaros indoor: protocolo de contenção educativo",
        objective: "Isolar zona, limpar ferramentas, escalar para técnico quando necessário."
      }
    ]
  },
  viveiro_genetica: {
    zoneLabel: "viveiro_genetica",
    mapLabel: "Viveiro · genética",
    visualVariant: "zone-viveiro-green",
    theme: {
      id: "theme-viveiro",
      title: "Propagação e genética aplicada",
      summary: "Germinação, clones, seleção e sanidade de mudas.",
      keywords: ["clones", "sementes", "mudas", "sanidade", "genetica"]
    },
    progressionHint: "Sanidade → germinação → clone estável → registro fenotípico.",
    microLessonBlueprints: [
      {
        id: "ml-viv-germinacao",
        slug: "viveiro-germinacao-metodo",
        title: "Germinação com registro de variedade",
        objective: "Umidade, temperatura e identificação — foco educativo."
      },
      {
        id: "ml-viv-clone-corte",
        slug: "viveiro-clone-corte-higiene",
        title: "Corte de clone e higiene de superfície",
        objective: "Fluxo limpo, ferramentas e tempo de enraizamento conceitual."
      },
      {
        id: "ml-viv-selecao-fenotipo",
        slug: "viveiro-selecao-fenotipica-intro",
        title: "Introdução à seleção fenotípica responsável",
        objective: "Critérios observáveis sem prometer genética milagrosa."
      }
    ]
  },
  laboratorio_extracao: {
    zoneLabel: "laboratorio_extracao",
    mapLabel: "Laboratório · extração",
    visualVariant: "zone-lab-blue",
    theme: {
      id: "theme-lab-extracao",
      title: "Laboratório e óleos",
      summary: "Segurança química, métodos analíticos e leitura de laudos.",
      keywords: ["extracao", "solventes", "seguranca", "coa", "limpeza"]
    },
    progressionHint: "Segurança → método → caracterização → interpretação de COA.",
    ambienceNotes: "Cabines, EPI, etiquetas neutras — sem incentivo a labor caseiro ilegal.",
    microLessonBlueprints: [
      {
        id: "ml-lab-seguranca-base",
        slug: "lab-seguranca-base",
        title: "Checklist de segurança em laboratório educativo",
        objective: "Ventilação, EPI e armazenamento — quadro regulatório referido."
      },
      {
        id: "ml-lab-limpeza-cruzada",
        slug: "lab-prevencao-contaminacao",
        title: "Limpeza e prevenção de contaminação cruzada",
        objective: "Fluxo amostra → superfície → descarte."
      },
      {
        id: "ml-lab-coa-leitura",
        slug: "lab-coa-para-formadores",
        title: "COA para formadores: campos essenciais",
        objective: "Potência, solventes residuais e microbiologia em alto nível."
      },
      {
        id: "ml-lab-cadeia-rastreio",
        slug: "lab-rastreabilidade-amostra",
        title: "Rastreabilidade de amostra em laboratório",
        objective: "IDs de lote e documentação — alinhado a boas práticas GMP conceituais."
      }
    ]
  },
  laboratorio_solventless: {
    zoneLabel: "laboratorio_solventless",
    mapLabel: "Laboratório · solventless",
    visualVariant: "zone-lab-solventless",
    theme: {
      id: "theme-solventless",
      title: "Solventless e mechanical separation",
      summary: "Hash, rosin e métodos mecânicos térmicos controlados — quadro educativo.",
      keywords: ["hash", "rosin", "solventless", "temperatura", "higiene"]
    },
    progressionHint: "Matéria-prima → separação mecânica → térmica responsável → conservação.",
    microLessonBlueprints: [
      {
        id: "ml-slv-material-partida",
        slug: "solventless-materia-partida",
        title: "Critérios de matéria-prima para solventless",
        objective: "Umidade, frescura e sanidade — linguagem técnica."
      },
      {
        id: "ml-slv-bubble-intro",
        slug: "solventless-bubble-introducao",
        title: "Bubble hash: princípios físicos",
        objective: "Água gelada, agitação e separação — sem tutorial ilegal."
      },
      {
        id: "ml-slv-rosin-janela",
        slug: "solventless-rosin-janela-termica",
        title: "Rosin: janela térmica e pressão como conceitos",
        objective: "Entender trade-offs sem valores específicos irresponsáveis."
      }
    ]
  },
  escola_culinaria: {
    zoneLabel: "escola_culinaria",
    mapLabel: "Escola · culinária",
    visualVariant: "zone-kitchen-warm",
    theme: {
      id: "theme-culinaria",
      title: "Formulação e dose educativa",
      summary: "Infusões, padronização e segurança alimentar em contexto regulado.",
      keywords: ["infusao", "dosagem", "formulação", "seguranca-alimentar"]
    },
    progressionHint: "Decarboxilação conceitual → miscibilidade → rotulagem doméstica segura.",
    microLessonBlueprints: [
      {
        id: "ml-cul-agitacao-temporal",
        slug: "culinaria-agitacao-temporal",
        title: "Agitação e tempo na infusão — controlo educativo",
        objective: "Registrar protocolo e variáveis sensoriais."
      },
      {
        id: "ml-cul-particao-grativa",
        slug: "culinaria-particao-gordura",
        title: "Escolher veículo lipídico com critério",
        objective: "Compatibilidade e segurança — não doses terapêuticas."
      }
    ]
  },
  instituto_medicinal: {
    zoneLabel: "instituto_medicinal",
    mapLabel: "Instituto · medicinal",
    visualVariant: "zone-clinic-soft",
    theme: {
      id: "theme-medicinal",
      title: "Ciência clínica e comunicação com prescritores",
      summary: "Evidência, ética e interações — sem consultório.",
      keywords: ["evidencia", "prescritor", "interacoes", "titulacao", "paciente"]
    },
    progressionHint: "Sinais → perguntas ao médico → leitura de evidência → redução de danos.",
    microLessonBlueprints: [
      {
        id: "ml-med-diario-sintomas",
        slug: "medicinal-diario-sinais",
        title: "Diário estruturado para conversa clínica",
        objective: "Montar relatório útil ao prescritor sem autoprescrever."
      },
      {
        id: "ml-med-interacoes-busca",
        slug: "medicinal-interacoes-como-perguntar",
        title: "Interações: como perguntar em farmácia",
        objective: "Lista de medicamentos + horários + sintomas associados."
      },
      {
        id: "ml-med-literacia-evidencia",
        slug: "medicinal-literacia-estudos",
        title: "Ler um abstract sem hype",
        objective: "N vs eficácia observada, limitações e conflitos de interesse."
      }
    ]
  },
  biblioteca_ciencia_legal: {
    zoneLabel: "biblioteca_ciencia_legal",
    mapLabel: "Biblioteca · lei & ciência",
    visualVariant: "zone-library-amber",
    theme: {
      id: "theme-legislacao",
      title: "Legislação e literacia regulatoria",
      summary: "Fontes primárias, atualização e limites do autodidata.",
      keywords: ["lei", "anvisa", "fontes-oficiais", "jurisprudencia", "paciente"]
    },
    progressionHint: "Fonte primária → data → âmbito territorial → escalar a advogado quando necessário.",
    microLessonBlueprints: [
      {
        id: "ml-leg-pesquisa-planalto",
        slug: "legislacao-pesquisa-fonte-oficial",
        title: "Pesquisar norma sem meme jurídico",
        objective: "Fluxo Planalto / órgãos reguladores com registro de data."
      },
      {
        id: "ml-leg-caso-vs-politica",
        slug: "legislacao-caso-individual-vs-politica",
        title: "Decisão judicial individual ≠ política geral",
        objective: "Calibrar expectativas com rigor."
      },
      {
        id: "ml-leg-ciencia-regulatorio",
        slug: "legislacao-ciencia-vs-marketing",
        title: "Onde a ciência encontra o regulador",
        objective: "Anvisa, inclusão de produto e limites educativos."
      }
    ]
  },
  comunidade_social: {
    zoneLabel: "comunidade_social",
    mapLabel: "Comunidade · redes",
    visualVariant: "zone-community-rose",
    theme: {
      id: "theme-comunidade",
      title: "Comunidade, ética digital e networking",
      summary: "Partilha responsável, mural e integração com eventos.",
      keywords: ["comunidade", "networking", "etica", "acolhimento"]
    },
    progressionHint: "Ouvir → contribuir com evidência → conectar com mentoria institucional.",
    microLessonBlueprints: [
      {
        id: "ml-com-post-etica",
        slug: "comunidade-post-etico",
        title: "Publicar dúvida sem espalhar mitos",
        objective: "Estrutura: contexto → fonte tentada → pergunta específica."
      },
      {
        id: "ml-com-networking-campus",
        slug: "comunidade-networking-campus",
        title: "Networking dentro das regras da escola",
        objective: "Quando usar mural vs chat vs evento síncrono."
      }
    ]
  },
  arena_eventos: {
    zoneLabel: "arena_eventos",
    mapLabel: "Arena · eventos ao vivo",
    visualVariant: "zone-events-live",
    theme: {
      id: "theme-eventos",
      title: "Eventos síncronos e programa",
      summary: "Agenda, lembretes e integração com livestreams institucionais.",
      keywords: ["live", "programacao", "convites", "sincrono"]
    },
    progressionHint: "Programação → lembrete → participação → recap com links oficiais.",
    microLessonBlueprints: [
      {
        id: "ml-evt-pre-live-checklist",
        slug: "eventos-pre-live-checklist",
        title: "Checklist pré-live para estudante",
        objective: "Som, fuso horário e materiais sugeridos pelo formador."
      },
      {
        id: "ml-evt-pergunta-moderada",
        slug: "eventos-pergunta-moderada",
        title: "Formular pergunta moderável em chat ao vivo",
        objective: "Clareza, brevidade e respeito ao tempo coletivo."
      }
    ]
  },
  cinema: {
    zoneLabel: "cinema",
    mapLabel: "Cinema · sessões",
    visualVariant: "zone-cinema-noir",
    theme: {
      id: "theme-cinema",
      title: "Conteúdo longo e discussão guiada",
      summary: "Sessões especiais, fichas de visionamento e debate estruturado.",
      keywords: ["sessao", "debate", "ficha", "audiovisual"]
    },
    progressionHint: "Visionamento → notas → discussão moderada → recurso aprofundado.",
    microLessonBlueprints: [
      {
        id: "ml-cin-ficha-viewing",
        slug: "cinema-ficha-visionamento",
        title: "Ficha de visionamento científica",
        objective: "Separar factos da ficção e citar timestamps."
      },
      {
        id: "ml-cin-clube-discussao",
        slug: "cinema-clube-discussao",
        title: "Participar de clube de discussão sem spoilers tóxicos",
        objective: "Regras de moderacao e resumo útil."
      }
    ]
  },
  loja_campus: {
    zoneLabel: "loja_campus",
    mapLabel: "Loja · campus",
    visualVariant: "zone-store-gold",
    theme: {
      id: "theme-loja",
      title: "Economia simbólica do campus",
      summary: "Créditos, inventário e progressão lúdica — não é loja física real.",
      keywords: ["creditos", "inventario", "progressao", "gamificacao"]
    },
    progressionHint: "Explorar catálogo → objetivos de missão → uso ético de créditos.",
    microLessonBlueprints: [
      {
        id: "ml-loj-economia-campus",
        slug: "loja-economia-campus-explicada",
        title: "Como funcionam créditos e inventário no campus",
        objective: "Separar economia virtual de mercado regulado real."
      }
    ]
  }
};

/** Hit legado (`CampusMapInteractiveArea.id` no seed) → zona pedagógica */
export const CAMPUS_LEGACY_HIT_ID_TO_ZONE_LABEL: Partial<
  Record<string, CampusMapZoneLabel>
> = {
  "seus-desejos-serao-atendidos": "comunidade_social",
  "entrar-no-site": "comunidade_social",
  "curso-cultivo-101": "fundamentos",
  "curso-hashmaker": "laboratorio_solventless",
  "curso-extracao-de-oleo": "laboratorio_extracao",
  "curso-culinaria-cannabica": "escola_culinaria",
  "curso-aplicacoes-terapeuticas": "instituto_medicinal",
  "curso-sementes-feminizadas": "viveiro_genetica",
  "curso-preparacao-do-solo": "outdoor_cultivo",
  "curso-nutrientes": "indoor_cultivo",
  "curso-transicao-floracao": "indoor_cultivo",
  "curso-vegetativo": "indoor_cultivo",
  "curso-germinacao-clones": "viveiro_genetica",
  "curso-cultivo-outdoor": "outdoor_cultivo",
  "curso-cultivo-greenhouse": "greenhouse",
  "curso-cultivo-indoor": "indoor_cultivo",
  souvenirs: "loja_campus",
  "leis-normas": "biblioteca_ciencia_legal",
  "curso-pragas-e-doencas": "outdoor_cultivo",
  "curso-podas-e-clones": "indoor_cultivo",
  "como-combate-acaros": "indoor_cultivo",
  "como-combate-spiders": "indoor_cultivo",
  "como-fazer-um-cha": "outdoor_cultivo",
  "como-usar-melaco-de-cana": "outdoor_cultivo",
  "quando-adubar-foliar": "indoor_cultivo",
  "quando-adubar-solo": "outdoor_cultivo",
  "quando-pulverizar-preventivo": "outdoor_cultivo",
  "quando-plantar-outdoor": "outdoor_cultivo",
  "qual-tamanho-do-vaso": "indoor_cultivo",
  "cannabis-e-proibida": "biblioteca_ciencia_legal",
  "deixa-seu-recado": "comunidade_social",
  "programacao-do-dia": "arena_eventos",
  "campus-live-cinema": "cinema"
};

/** Fallback quando só há `courseId` (sem hit específico ou hit não mapeado). */
export const CAMPUS_COURSE_ID_TO_ZONE_LABEL: Partial<Record<string, CampusMapZoneLabel>> =
  {
    "cannabis-101": "fundamentos",
    "cultivo-greenhouse": "greenhouse",
    "cultivo-outdoor": "outdoor_cultivo",
    "cultivo-indoor": "indoor_cultivo",
    genetica: "viveiro_genetica",
    "extracao-oleo": "laboratorio_extracao",
    "extracoes-solventless": "laboratorio_solventless",
    culinaria: "escola_culinaria",
    medicina: "instituto_medicinal",
    legislacao: "biblioteca_ciencia_legal",
    industria: "loja_campus",
    laboratorio: "laboratorio_extracao",
    "secagem-cura": "indoor_cultivo",
    cooperativismo: "comunidade_social"
  };

export function getCampusZoneEducationalContext(
  label: CampusMapZoneLabel
): CampusZoneEducationalContext {
  return ZONE_CTX[label];
}

/** Rótulo curto PT para tooltip / presença social (sem dados sensíveis). */
export function campusZonePublicTitle(zoneLabel: string): string {
  if (!(zoneLabel in ZONE_CTX)) {
    return zoneLabel.replace(/_/g, " ");
  }
  return getCampusZoneEducationalContext(zoneLabel as CampusMapZoneLabel).mapLabel;
}

/** Lista todas as zonas com perfil (útil para CMS / debug). */
export function listCampusZoneEducationalContexts(): readonly CampusZoneEducationalContext[] {
  return Object.freeze(Object.values(ZONE_CTX));
}

export type ResolveCampusZoneLabelInput = {
  legacyHitId?: string | null;
  courseId?: string | null;
};

/**
 * Resolve o rótulo de zona usado como base das microaulas.
 * Prioridade: hit legado → curso → fundamentos.
 */
export function resolveCampusMapZoneLabel(input: ResolveCampusZoneLabelInput): CampusMapZoneLabel {
  const hid = input.legacyHitId?.trim();
  if (hid && CAMPUS_LEGACY_HIT_ID_TO_ZONE_LABEL[hid]) {
    return CAMPUS_LEGACY_HIT_ID_TO_ZONE_LABEL[hid]!;
  }
  const cid = input.courseId?.trim();
  if (cid && CAMPUS_COURSE_ID_TO_ZONE_LABEL[cid]) {
    return CAMPUS_COURSE_ID_TO_ZONE_LABEL[cid]!;
  }
  return "fundamentos";
}

export function resolveCampusZoneEducationalContext(
  input: ResolveCampusZoneLabelInput
): CampusZoneEducationalContext {
  return getCampusZoneEducationalContext(resolveCampusMapZoneLabel(input));
}

/**
 * Herança automática de tema para uma microaula (estrutura editorial).
 * UI pode aplicar `visualVariant` + keywords ao cartão / som ambiente.
 */
export function inheritMicroLessonThemeFromZone<T extends Record<string, unknown>>(
  zoneLabel: CampusMapZoneLabel,
  draft: T
): T & {
  zoneLabel: CampusMapZoneLabel;
  visualVariant: string;
  thematicKeywords: readonly string[];
  educationalThemeId: string;
  educationalThemeTitle: string;
} {
  const ctx = getCampusZoneEducationalContext(zoneLabel);
  return {
    ...draft,
    zoneLabel,
    visualVariant: ctx.visualVariant,
    thematicKeywords: ctx.theme.keywords,
    educationalThemeId: ctx.theme.id,
    educationalThemeTitle: ctx.theme.title
  };
}
