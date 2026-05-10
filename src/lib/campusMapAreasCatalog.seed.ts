/**
 * Image-map gerado manualmente (`image-map.net`) — Fevereiro 2026.
 * `coords` literais brutos sobre arte 1536×1024; não reordenados.
 * Backup do catálogo anterior: `campusMapAreasCatalog.seed.ts.old.bak`.
 *
 * @see docs/campus-map-areas-authoring.md
 */

import type { CampusMapInteractiveArea } from "./campusMapAreasInteractive.types";

export const CAMPUS_MAP_INTERACTIVE_AREAS: CampusMapInteractiveArea[] = [
  {
    id: "seus-desejos-serao-atendidos",
    title: "Desejos e boas‑vindas",
    panelTitle: "Os teus desejos são atendidos aqui",
    studentSummary:
      "Bem‑vindo ao THCProce Campus: este halo marca o momento em que curiosidade e intenção se encontram antes da jornada.\n\nCada porta do mapa responde a quem parte com método — há salas grandes para mergulhar nos cursos, recantos rápidos para dúvidas pontuais e espaços só nossos para partilhar com a comunidade.\n\nRespira, escolhe o próximo gesto sem pressa, e atravessa o campus como quem faz cinema com o próprio tempo.",
    coords: "681,869,60",
    shape: "circle",
    type: "community",
    status: "open",
    target: { kind: "welcome_intro" },
    metadata: { imageMapAlt: "seus-desejos-serao-atendidos" }
  },
  {
    id: "entrar-no-site",
    title: "Entrada principal",
    panelTitle: "Entrar no campus",
    coords: "337,846,370,816,387,728,313,681,287,710,295,765,264,796",
    shape: "poly",
    type: "event",
    status: "open",
    target: { kind: "route", href: "/entrar" },
    metadata: { imageMapAlt: "entrar-no-site" }
  },
  {
    id: "curso-cultivo-101",
    title: "Cannabis 101",
    panelTitle: "Cannabis 101 · curso introdutório",
    shortDescription:
      "Introdução à planta, ao corpo e ao contexto legal — método THCProce · onze aulas em português.",
    ctaLabel: "Entrar",
    secondaryCtaLabel: "Ver aulas",
    courseSlug: "cannabis-101",
    lessonSlug: "c101-l02-o-que-e-cannabis",
    coords: "387,457,226,374,396,267,537,331",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "cannabis-101" },
    metadata: { imageMapAlt: "curso-cultivo-101" },
    lighting: { preset: "primary" }
  },
  {
    id: "curso-hashmaker",
    title: "Hashmaker · solventless",
    panelTitle: "Extrações solventless & hash",
    coords: "1248,580,1131,709,1345,819,1451,673",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "extracoes-solventless" },
    metadata: { imageMapAlt: "curso-hashmaker" },
    lighting: { preset: "primary" }
  },
  {
    id: "curso-extracao-de-oleo",
    title: "Extração de óleo",
    panelTitle: "Laboratório de óleos",
    coords: "1157,262,1413,347,1519,165,1295,107",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "extracao-oleo" },
    metadata: { imageMapAlt: "curso-extracao-de-oleo" },
    lighting: { preset: "primary" }
  },
  {
    id: "curso-culinaria-cannabica",
    title: "Culinária cannábica",
    panelTitle: "Escola de culinária",
    coords: "763,344,573,476,990,685,1120,534,1043,499,1039,449",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "culinaria" },
    metadata: { imageMapAlt: "curso-culinaria-cannabica" },
    lighting: { preset: "primary" }
  },
  {
    id: "curso-aplicacoes-terapeuticas",
    title: "Aplicações terapêuticas",
    panelTitle: "Instituto medicinal",
    coords: "1050,283,841,214,929,144,1116,197",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "medicina" },
    metadata: { imageMapAlt: "curso-aplicacoes-terapeuticas" }
  },
  {
    id: "curso-sementes-feminizadas",
    title: "Sementes feminizadas",
    panelTitle: "Genética de sementes",
    coords: "1055,31,1013,61,949,127,1138,179,1214,99,1174,83,1178,60",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "genetica" },
    metadata: { imageMapAlt: "curso-sementes-feminizadas" }
  },
  {
    id: "curso-preparacao-do-solo",
    title: "Preparação do solo",
    panelTitle: "Solo vivo para outdoor",
    coords: "419,561,257,691,61,562,225,437",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "curso-preparacao-do-solo" }
  },
  {
    id: "curso-nutrientes",
    title: "Nutrientes & soluções",
    panelTitle: "Nutrição em solução",
    coords: "1215,540,1066,475,1064,448,1047,429,1123,354,1153,352,1257,396,1316,422,1268,484",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "curso-nutrientes" }
  },
  {
    id: "curso-transicao-floracao",
    title: "Transição floração",
    panelTitle: "Do vegetativo ao 12/12",
    coords: "1297,540,1438,608,1516,502,1372,445",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "curso-transicao-floracao" }
  },
  {
    id: "curso-vegetativo",
    title: "Fase vegetativa",
    panelTitle: "Crescimento antes da flora",
    coords: "875,87,694,42,788,5,900,12,936,18,969,19",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "curso-vegetativo" }
  },
  {
    id: "curso-germinacao-clones",
    title: "Germinação & clones",
    panelTitle: "Plântulas e propagação",
    coords: "686,707,792,627,891,681,799,768",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "genetica" },
    metadata: { imageMapAlt: "curso-germinacao-clones" }
  },
  {
    id: "curso-cultivo-outdoor",
    title: "Cultivo outdoor",
    panelTitle: "Campo sob o sol",
    coords: "440,208,699,302,751,289,838,125,638,66",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "curso-cultivo-outdoor" },
    lighting: { preset: "primary" }
  },
  {
    id: "curso-cultivo-greenhouse",
    title: "Cultivo em estufa",
    panelTitle: "Greenhouses & microclima",
    coords: "510,81,340,187,208,119,406,11",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "cultivo-greenhouse" },
    metadata: { imageMapAlt: "curso-cultivo-greenhouse" },
    lighting: { preset: "primary" }
  },
  {
    id: "curso-cultivo-indoor",
    title: "Cultivo indoor",
    panelTitle: "Salas técnica & clima selado",
    coords: "10,231,124,307,284,203,185,132,107,174",
    shape: "poly",
    type: "course",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "curso-cultivo-indoor" },
    lighting: { preset: "primary" }
  },
  {
    id: "souvenirs",
    title: "Souvenirs & loja",
    panelTitle: "Loja do campus",
    coords: "896,879,940,819,853,770,805,822",
    shape: "poly",
    type: "library",
    status: "open",
    target: { kind: "hud_store" },
    metadata: { imageMapAlt: "souvenirs" }
  },
  {
    id: "leis-normas",
    title: "Leis e normas",
    panelTitle: "Legislação brasileira",
    coords: "933,123,892,102,908,77,951,45,982,28,1006,52,953,96",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "legislacao" },
    metadata: { imageMapAlt: "leis-normas" }
  },
  {
    id: "curso-pragas-e-doencas",
    title: "Pragas & biosegurança",
    panelTitle: "Manejo sanitário ao ar livre",
    coords: "539,509,747,618,647,703,491,604,501,545",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "curso-pragas-e-doencas" }
  },
  {
    id: "curso-podas-e-clones",
    title: "Podas & clones",
    panelTitle: "Estrutura de copa",
    coords: "987,401,1026,355,812,285,778,331,877,369,933,388,961,397",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "curso-podas-e-clones" }
  },
  {
    id: "como-combate-acaros",
    title: "Combate aos ácaros",
    coords: "1056,751,1112,804,1074,861,1012,815",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "como-combate-acaros" }
  },
  {
    id: "como-combate-spiders",
    title: "Combate a aracnídeos indesejados",
    coords: "940,897,986,845,1033,883,986,933",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "como-combate-spiders" }
  },
  {
    id: "como-fazer-um-cha",
    title: "Como preparar fertilizantes em chá",
    coords: "486,909,557,953,580,940,526,844",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "como-fazer-um-cha" }
  },
  {
    id: "como-usar-melaco-de-cana",
    title: "Melado & carbo rápido",
    coords: "497,770,539,834,594,783,542,724,516,741",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "como-usar-melaco-de-cana" }
  },
  {
    id: "quando-adubar-foliar",
    title: "Quando usar adubo foliar",
    coords: "584,340,625,368,573,414,531,382,561,355",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "quando-adubar-foliar" }
  },
  {
    id: "quando-adubar-solo",
    title: "Quando fertilizar solo vivo",
    coords: "515,395,562,423,516,464,472,433",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "quando-adubar-solo" }
  },
  {
    id: "quando-pulverizar-preventivo",
    title: "Pulverização preventiva",
    coords: "423,589,336,662,386,698,444,637",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "quando-pulverizar-preventivo" }
  },
  {
    id: "quando-plantar-outdoor",
    title: "Quando plantar outdoor",
    coords: "888,749,952,791,993,746,926,707",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-outdoor" },
    metadata: { imageMapAlt: "quando-plantar-outdoor" }
  },
  {
    id: "qual-tamanho-do-vaso",
    title: "Tamanho correto do vaso",
    coords: "465,442,503,468,455,510,417,483",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "cultivo-indoor" },
    metadata: { imageMapAlt: "qual-tamanho-do-vaso" }
  },
  {
    id: "cannabis-e-proibida",
    title: "\"Cannabis é proibida… e agora?\"",
    coords: "404,707,454,667,476,713,431,760",
    shape: "poly",
    type: "lesson",
    status: "open",
    target: { kind: "course", courseId: "legislacao" },
    metadata: { imageMapAlt: "cannabis-e-proibida" }
  },
  {
    id: "deixa-seu-recado",
    title: "Mural dos alunos",
    panelTitle: "Deixa o teu recado",
    coords: "652,998,820,906,850,936,713,1015",
    shape: "poly",
    type: "community",
    status: "open",
    target: { kind: "campus_mural_feed" },
    metadata: { imageMapAlt: "deixa-seu-recado" }
  },
  {
    id: "programacao-do-dia",
    title: "Programação do dia",
    panelTitle: "Programação do dia",
    coords: "409,831,406,793,427,772,480,808,459,830,459,861,431,848",
    shape: "poly",
    type: "event",
    status: "open",
    target: { kind: "schedule_day" },
    metadata: { imageMapAlt: "programacao-do-dia" }
  },
  {
    id: "campus-live-cinema",
    title: "Cinema & ao vivo",
    panelTitle: "Cinema & ao vivo",
    coords: "1180,833,1310,899,1151,1006,1064,970",
    shape: "poly",
    type: "event",
    status: "open",
    target: { kind: "cinema_live_rail" },
    metadata: { imageMapAlt: "campus-live-cinema" },
    live: true
  }
];
