/**
 * Progressão editorial THCProce — mantém faixas numéricas alinhadas a:
 * `src/lib/campus/campusMapPointRewardTiers.ts`
 *
 * Usado por `sync-campus-map-point-bundles.mjs` para rewards.json, metadata.json (jornada)
 * e seasonal.json (slots futuros, sem eventos ao vivo).
 */

/** @typedef {'campus'|'info'|'pratica'|'tecnica'|'mestre'} ProgressionTierKey */

/** @type {Record<ProgressionTierKey, { xp: number; greenCoins: number; growerMasterProgress: number; rarity: string }>} */
export const TIERS = {
  campus: { xp: 5, greenCoins: 2, growerMasterProgress: 1, rarity: "comum" },
  info: { xp: 5, greenCoins: 3, growerMasterProgress: 1, rarity: "comum" },
  pratica: { xp: 15, greenCoins: 5, growerMasterProgress: 2, rarity: "raro" },
  tecnica: { xp: 30, greenCoins: 8, growerMasterProgress: 3, rarity: "épico" },
  mestre: { xp: 45, greenCoins: 12, growerMasterProgress: 4, rarity: "lendário" }
};

/** @type {Record<string, ProgressionTierKey>} */
export const progressionTierBySlug = {
  "quiz-c101-intermediario-i": "pratica",
  "quiz-c101-intermediario-ii": "pratica",
  "campus-live-cinema": "campus",
  "cannabis-e-proibida": "info",
  "como-combate-acaros": "tecnica",
  "como-combate-spiders": "tecnica",
  "como-fazer-um-cha": "tecnica",
  "como-usar-melaco-de-cana": "tecnica",
  "curso-aplicacoes-terapeuticas": "tecnica",
  "curso-culinaria-cannabica": "tecnica",
  "curso-cultivo-101": "mestre",
  "curso-cultivo-greenhouse": "mestre",
  "curso-cultivo-indoor": "mestre",
  "curso-cultivo-outdoor": "mestre",
  "curso-extracao-de-oleo": "tecnica",
  "curso-germinacao-clones": "mestre",
  "curso-hashmaker": "tecnica",
  "curso-nutrientes": "mestre",
  "curso-podas-e-clones": "tecnica",
  "curso-pragas-e-doencas": "mestre",
  "curso-preparacao-do-solo": "mestre",
  "curso-sementes-feminizadas": "tecnica",
  "curso-transicao-floracao": "mestre",
  "curso-vegetativo": "mestre",
  "deixa-seu-recado": "campus",
  "leis-normas": "info",
  "programacao-do-dia": "campus",
  "qual-tamanho-do-vaso": "pratica",
  "quando-adubar-foliar": "pratica",
  "quando-adubar-solo": "pratica",
  "quando-plantar-outdoor": "pratica",
  "quando-pulverizar-preventivo": "tecnica",
  "souvenirs": "campus"
};

/** @type {Record<string, { prerequisites?: string[]; relatedAreas?: string[]; recommendedNext?: string[] }>} */
export const journeyBySlug = {
  "campus-live-cinema": {
    relatedAreas: ["programacao-do-dia", "deixa-seu-recado"],
    recommendedNext: ["curso-cultivo-101"]
  },
  "cannabis-e-proibida": {
    relatedAreas: ["leis-normas"],
    recommendedNext: ["curso-cultivo-101"]
  },
  "como-combate-acaros": {
    relatedAreas: ["como-combate-spiders", "curso-pragas-e-doencas", "quando-pulverizar-preventivo"],
    recommendedNext: ["curso-cultivo-greenhouse", "quando-pulverizar-preventivo"]
  },
  "como-combate-spiders": {
    relatedAreas: ["como-combate-acaros", "curso-pragas-e-doencas"],
    recommendedNext: ["como-combate-acaros"]
  },
  "como-fazer-um-cha": {
    relatedAreas: ["curso-preparacao-do-solo", "como-usar-melaco-de-cana"],
    recommendedNext: ["como-usar-melaco-de-cana"]
  },
  "como-usar-melaco-de-cana": {
    relatedAreas: ["curso-nutrientes", "quando-adubar-foliar", "quando-adubar-solo"],
    recommendedNext: ["quando-adubar-solo"]
  },
  "curso-aplicacoes-terapeuticas": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["leis-normas", "cannabis-e-proibida"],
    recommendedNext: ["leis-normas", "curso-nutrientes"]
  },
  "curso-culinaria-cannabica": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-hashmaker"],
    recommendedNext: ["curso-hashmaker"]
  },
  "curso-cultivo-101": {
    recommendedNext: [
      "quiz-c101-intermediario-i",
      "quiz-c101-intermediario-ii",
      "curso-germinacao-clones",
      "curso-preparacao-do-solo"
    ]
  },
  "curso-cultivo-greenhouse": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-cultivo-indoor", "como-combate-acaros"],
    recommendedNext: ["curso-nutrientes", "curso-pragas-e-doencas"]
  },
  "curso-cultivo-indoor": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-cultivo-greenhouse", "curso-cultivo-outdoor"],
    recommendedNext: ["curso-nutrientes"]
  },
  "curso-cultivo-outdoor": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["quando-plantar-outdoor", "qual-tamanho-do-vaso"],
    recommendedNext: ["curso-preparacao-do-solo"]
  },
  "curso-extracao-de-oleo": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-hashmaker"],
    recommendedNext: ["leis-normas"]
  },
  "curso-germinacao-clones": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-sementes-feminizadas", "curso-podas-e-clones"],
    recommendedNext: ["curso-preparacao-do-solo", "qual-tamanho-do-vaso"]
  },
  "curso-hashmaker": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-extracao-de-oleo", "curso-culinaria-cannabica"],
    recommendedNext: ["leis-normas"]
  },
  "curso-nutrientes": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["quando-adubar-foliar", "quando-adubar-solo", "como-usar-melaco-de-cana"],
    recommendedNext: ["curso-vegetativo"]
  },
  "curso-podas-e-clones": {
    prerequisites: ["curso-germinacao-clones"],
    relatedAreas: ["curso-vegetativo", "curso-transicao-floracao"],
    recommendedNext: ["curso-vegetativo"]
  },
  "curso-pragas-e-doencas": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["como-combate-acaros", "como-combate-spiders", "quando-pulverizar-preventivo"],
    recommendedNext: ["como-combate-acaros", "curso-cultivo-greenhouse"]
  },
  "curso-preparacao-do-solo": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["como-fazer-um-cha", "curso-nutrientes"],
    recommendedNext: ["curso-germinacao-clones"]
  },
  "curso-sementes-feminizadas": {
    prerequisites: ["curso-germinacao-clones"],
    relatedAreas: ["curso-podas-e-clones"],
    recommendedNext: ["curso-vegetativo"]
  },
  "curso-transicao-floracao": {
    prerequisites: ["curso-vegetativo"],
    relatedAreas: ["curso-nutrientes", "quando-adubar-foliar"],
    recommendedNext: ["curso-nutrientes", "quando-adubar-foliar", "curso-hashmaker"]
  },
  "curso-vegetativo": {
    prerequisites: ["curso-nutrientes"],
    relatedAreas: ["curso-podas-e-clones", "qual-tamanho-do-vaso"],
    recommendedNext: ["curso-transicao-floracao"]
  },
  "deixa-seu-recado": {
    relatedAreas: ["programacao-do-dia"],
    recommendedNext: ["campus-live-cinema"]
  },
  "leis-normas": {
    relatedAreas: ["cannabis-e-proibida"],
    recommendedNext: ["curso-aplicacoes-terapeuticas"]
  },
  "programacao-do-dia": {
    relatedAreas: ["campus-live-cinema"],
    recommendedNext: ["deixa-seu-recado"]
  },
  "qual-tamanho-do-vaso": {
    relatedAreas: ["curso-germinacao-clones", "curso-cultivo-outdoor"],
    recommendedNext: ["quando-adubar-solo"]
  },
  "quando-adubar-foliar": {
    relatedAreas: ["quando-adubar-solo", "curso-nutrientes"],
    recommendedNext: ["como-usar-melaco-de-cana"]
  },
  "quando-adubar-solo": {
    relatedAreas: ["curso-nutrientes", "como-usar-melaco-de-cana"],
    recommendedNext: ["curso-vegetativo"]
  },
  "quando-plantar-outdoor": {
    relatedAreas: ["curso-cultivo-outdoor", "qual-tamanho-do-vaso"],
    recommendedNext: ["curso-preparacao-do-solo"]
  },
  "quando-pulverizar-preventivo": {
    prerequisites: ["curso-pragas-e-doencas"],
    relatedAreas: ["como-combate-acaros", "como-combate-spiders"],
    recommendedNext: ["curso-cultivo-greenhouse"]
  },
  "quiz-c101-intermediario-i": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: ["curso-cultivo-101", "curso-germinacao-clones", "quiz-c101-intermediario-ii"],
    recommendedNext: [
      "quiz-c101-intermediario-ii",
      "curso-germinacao-clones",
      "curso-sementes-feminizadas"
    ]
  },
  "quiz-c101-intermediario-ii": {
    prerequisites: ["curso-cultivo-101"],
    relatedAreas: [
      "curso-cultivo-101",
      "quiz-c101-intermediario-i",
      "curso-preparacao-do-solo",
      "curso-cultivo-outdoor"
    ],
    recommendedNext: ["curso-preparacao-do-solo", "curso-cultivo-outdoor", "curso-germinacao-clones"]
  },
  "souvenirs": {
    relatedAreas: ["campus-live-cinema"],
    recommendedNext: ["programacao-do-dia"]
  }
};

/** Cenários editoriais — não disparam eventos; apenas estrutura para futuras campanhas. */
/** @type {Record<string, { scenarios: Array<{ id: string; label: string; summary: string; relatedSlugs?: string[] }> }>} */
export const seasonalBySlug = {
  "campus-live-cinema": {
    scenarios: [
      {
        id: "live-calor",
        label: "Calor extremo na sala",
        summary:
          "Em ondas de calor, lives sobre clima pedem mais pausas e checklist de ventilação — anota dicas sem copiar setup ilegal.",
        relatedSlugs: ["curso-cultivo-greenhouse"]
      },
      {
        id: "live-chuva",
        label: "Chuva forte no outdoor",
        summary: "Quando o tema for outdoor, cruza com humidade e drenagem — pergunta sempre sobre solo empapado.",
        relatedSlugs: ["curso-cultivo-outdoor"]
      }
    ]
  },
  "cannabis-e-proibida": {
    scenarios: [
      {
        id: "atualizacao-normativa",
        label: "Mudança legislativa em debate",
        summary:
          "Época de CPI, MP ou projeto de lei exige calma: aqui refinas perguntas ao advogado; não celebramos nem panicamos sem texto.",
        relatedSlugs: ["leis-normas"]
      }
    ]
  },
  "como-combate-acaros": {
    scenarios: [
      {
        id: "pragas-calor",
        label: "Pragas do calor",
        summary: "Ácaros explodem quando o ar fica seco na copa — sobe um pouco a umidade foliar com segurança e revisa ventilação.",
        relatedSlugs: ["curso-cultivo-greenhouse"]
      },
      {
        id: "fungos-verao",
        label: "Fungos no verão úmido",
        summary: "Calor + molhar folhas à noite vira festa para fungos; alterna tática conforme o estágio fenológico.",
        relatedSlugs: ["curso-pragas-e-doencas"]
      }
    ]
  },
  "como-combate-spiders": {
    scenarios: [
      {
        id: "umidade-media",
        label: "Ambiente úmido demais",
        summary: "Predadores somem e pragas soft body aparecem — equilibra umidade sem sufocar a copa.",
        relatedSlugs: ["curso-pragas-e-doencas"]
      }
    ]
  },
  "como-fazer-um-cha": {
    scenarios: [
      {
        id: "inverno-lento",
        label: "Inverno com microbiota lenta",
        summary: "Temperaturas baixas mudam o tempo de bolha — monitoriza cheiro com mais rigor.",
        relatedSlugs: ["curso-preparacao-do-solo"]
      },
      {
        id: "seca",
        label: "Seca prolongada",
        summary: "Sem água limpa não há chá honesto; planeja diluição para não queimar raízes fragilizadas.",
        relatedSlugs: ["quando-adubar-solo"]
      }
    ]
  },
  "como-usar-melaco-de-cana": {
    scenarios: [
      {
        id: "calor-extremo",
        label: "Calor extremo",
        summary: "Carboidrato calido pede EC mais baixo e leitura de transpiração antes de qualquer rega doce.",
        relatedSlugs: ["curso-nutrientes"]
      }
    ]
  },
  "curso-aplicacoes-terapeuticas": {
    scenarios: [
      {
        id: "acesso-saude",
        label: "Discussões de saúde no calor político",
        summary:
          "Épocas eleitorais incham fake news sobre cannabis medicinal — ancora-te em protocolos e fontes clínicas.",
        relatedSlugs: ["leis-normas"]
      }
    ]
  },
  "curso-culinaria-cannabica": {
    scenarios: [
      {
        id: "festas",
        label: "Mesas de fim de ano",
        summary: "Datas festivas pedem rotulagem honesta e doses conversadas com profissional — cozinha ética primeiro.",
        relatedSlugs: ["curso-hashmaker"]
      }
    ]
  },
  "curso-cultivo-101": {
    scenarios: [
      {
        id: "linha-base",
        label: "Arranque de safra",
        summary: "Novos ciclos combinam com revisão de licenças e espaço físico antes de comprar equipamento.",
        relatedSlugs: ["curso-germinacao-clones"]
      }
    ]
  },
  "curso-cultivo-greenhouse": {
    scenarios: [
      {
        id: "calor-estufa",
        label: "Calor preso na estufa",
        summary: "Painéis e sombrite viram prioridade antes de nutriente — microclima primeiro.",
        relatedSlugs: ["como-combate-acaros"]
      },
      {
        id: "chuva-forte",
        label: "Chuva batendo na estrutura",
        summary: "Entrada de água lateral altera VPD no chão — eleva vasos e revisa drenagem.",
        relatedSlugs: ["curso-cultivo-outdoor"]
      }
    ]
  },
  "curso-cultivo-indoor": {
    scenarios: [
      {
        id: "verao-eletrico",
        label: "Verão e conta de luz",
        summary: "Tarifa alta empurra LED eficiente e fotoperíodo disciplinado — planeja upgrades antes do pico.",
        relatedSlugs: ["curso-transicao-floracao"]
      }
    ]
  },
  "curso-cultivo-outdoor": {
    scenarios: [
      {
        id: "chuvas-fortes",
        label: "Chuvas fortes",
        summary: "Lavar nutrientes do solo exige plano B de cobertura leve e fertilização fracionada.",
        relatedSlugs: ["quando-plantar-outdoor"]
      },
      {
        id: "seca-outdoor",
        label: "Seca no campo",
        summary: "Mulching e horário de rega mudam o jogo — anota evapotranspiração real.",
        relatedSlugs: ["qual-tamanho-do-vaso"]
      }
    ]
  },
  "curso-extracao-de-oleo": {
    scenarios: [
      {
        id: "calor-solvente",
        label: "Calor + solvente",
        summary: "Verão aumenta risco em laboratório caseiro — se não tens infraestrutura legal, ficas na teoria.",
        relatedSlugs: ["leis-normas"]
      }
    ]
  },
  "curso-germinacao-clones": {
    scenarios: [
      {
        id: "noites-frias",
        label: "Noites frias na germinação",
        summary: "Tapete térmico honesto vale mais que improviso molhado que apodrece semente.",
        relatedSlugs: ["curso-sementes-feminizadas"]
      }
    ]
  },
  "curso-hashmaker": {
    scenarios: [
      {
        id: "umidade-do-ar",
        label: "Umidade alta na secagem",
        summary: "Tempestades de verão alteram tempo de washer wash — mede RH antes de fechar frasco.",
        relatedSlugs: ["curso-extracao-de-oleo"]
      }
    ]
  },
  "curso-nutrientes": {
    scenarios: [
      {
        id: "chuva-nutrientes",
        label: "Chuva lavando solo outdoor",
        summary: "Reposição fracionada evita picos de EC quando o céu não colabora.",
        relatedSlugs: ["quando-adubar-solo"]
      },
      {
        id: "calor-transpiracao",
        label: "Calor e transpiração alta",
        summary: "Plantas bebem mais e concentram sal — folha espia antes do fertirriga.",
        relatedSlugs: ["quando-adubar-foliar"]
      }
    ]
  },
  "curso-podas-e-clones": {
    scenarios: [
      {
        id: "umidade-clone",
        label: "Umidade errada no aeroporto de clones",
        summary: "Semanas úmidas pedem menos névoa e mais vento laminar para não apodrecer corte.",
        relatedSlugs: ["curso-germinacao-clones"]
      }
    ]
  },
  "curso-pragas-e-doencas": {
    scenarios: [
      {
        id: "pragas-verao",
        label: "Pragas do calor",
        summary: "Tripes e ácaros aceleram — agenda inspeção dupla nas folhas novas.",
        relatedSlugs: ["como-combate-acaros"]
      },
      {
        id: "fungos-chuva",
        label: "Fungos após chuva",
        summary: "Folhas molhadas sem vento são porta de entrada — ajusta estrutura antes do fungicida.",
        relatedSlugs: ["curso-cultivo-greenhouse"]
      }
    ]
  },
  "curso-preparacao-do-solo": {
    scenarios: [
      {
        id: "seca-argila",
        label: "Seca rachando barro",
        summary: "Agrega orgânico segura infiltração quando volta a chuva forte.",
        relatedSlugs: ["como-fazer-um-cha"]
      },
      {
        id: "inverno-composto",
        label: "Inverno devagar no compost",
        summary: "Decomposição lenta pede viragem assídua — não despejes mais nitrogênio só por impaciência.",
        relatedSlugs: ["como-usar-melaco-de-cana"]
      }
    ]
  },
  "curso-sementes-feminizadas": {
    scenarios: [
      {
        id: "oscilacao-termica",
        label: "Oscilação térmica na casa",
        summary: "Noites frias e dias quentes estressam plântulas — estabiliza microclima antes de criticar genética.",
        relatedSlugs: ["curso-germinacao-clones"]
      }
    ]
  },
  "curso-transicao-floracao": {
    scenarios: [
      {
        id: "calor-flora",
        label: "Calor na flora inicial",
        summary: "Stretch estranho costuma ser VPD, não só genética — mede ambiente antes de podar à toa.",
        relatedSlugs: ["curso-cultivo-indoor"]
      }
    ]
  },
  "curso-vegetativo": {
    scenarios: [
      {
        id: "verao-vegetativo",
        label: "Verão no vegetativo",
        summary: "Mais transpiração pede calendário de foliar com critério — não é festa de óleo essencial todo dia.",
        relatedSlugs: ["quando-adubar-foliar"]
      }
    ]
  },
  "deixa-seu-recado": {
    scenarios: [
      {
        id: "retorno-aulas",
        label: "Retorno de período letivo",
        summary: "Picos de mensagens pedem etiqueta: uma dúvida por cartão, dados mínimos.",
        relatedSlugs: ["programacao-do-dia"]
      }
    ]
  },
  "leis-normas": {
    scenarios: [
      {
        id: "mudanca-norma",
        label: "Projeto em tramitação",
        summary: "Quando a cidade debate zoning ou fiscalização, volta ao texto integral — não ao meme.",
        relatedSlugs: ["cannabis-e-proibida"]
      }
    ]
  },
  "programacao-do-dia": {
    scenarios: [
      {
        id: "evento-chuva",
        label: "Evento ao ar livre com chuva",
        summary: "Grade campus pode mudar — seasonal hooks aqui lembram backup digital.",
        relatedSlugs: ["campus-live-cinema"]
      }
    ]
  },
  "qual-tamanho-do-vaso": {
    scenarios: [
      {
        id: "raizes-calor",
        label: "Raízes cozinhando no verão",
        summary: "Vaso pequeno demais no calor vira panela — revisa volume antes de nutriente.",
        relatedSlugs: ["curso-cultivo-outdoor"]
      }
    ]
  },
  "quando-adubar-foliar": {
    scenarios: [
      {
        id: "sol-forte",
        label: "Sol forte no meio-dia",
        summary: "Calor extremo + foliar concentrado queima cera — desloca para crepúsculo autorizado.",
        relatedSlugs: ["curso-nutrientes"]
      }
    ]
  },
  "quando-adubar-solo": {
    scenarios: [
      {
        id: "solo-encharcado",
        label: "Chuva forte antes da fertirrigação",
        summary: "Água sobra lavando sal — empurra fertirrigação após drenagem real.",
        relatedSlugs: ["curso-preparacao-do-solo"]
      }
    ]
  },
  "quando-plantar-outdoor": {
    scenarios: [
      {
        id: "inverno-frio",
        label: "Inverno rigoroso",
        summary: "Datas médias não bastam — olha previsão de geada e vento marinho.",
        relatedSlugs: ["curso-cultivo-outdoor"]
      },
      {
        id: "seca-safra",
        label: "Seca na germinação direta",
        summary: "Sem irrigação planejada, outdoor vira loteria — ajusta solo antes do impulso emocional de plantar.",
        relatedSlugs: ["qual-tamanho-do-vaso"]
      }
    ]
  },
  "quando-pulverizar-preventivo": {
    scenarios: [
      {
        id: "ventania",
        label: "Ventania e deriva",
        summary: "Calor com vento forte cancela pulverização — protege vizinhos e polinizadores.",
        relatedSlugs: ["como-combate-acaros"]
      },
      {
        id: "chuva-iminente",
        label: "Chuva iminente",
        summary: "Molécula nova na folha precisa janela seca — seasonal hook para checklist meteorológico.",
        relatedSlugs: ["curso-pragas-e-doencas"]
      }
    ]
  },
  "souvenirs": {
    scenarios: [
      {
        id: "festas-campus",
        label: "Datas festivas no campus",
        summary: "Edições limitadas de merch carimbam a temporada — guarda como marco do teu progresso.",
        relatedSlugs: ["programacao-do-dia"]
      }
    ]
  }
};
