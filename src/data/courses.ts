import type { AreaColor, AreaLevelLabel } from "./areaTokens";
import { getCourseManifest } from "@/content/courses/coursesRegistry";
import type { CourseManifest } from "@/content/courses/types";

export type { AreaColor } from "./areaTokens";

export type Area = {
  id: string;
  name: string;
  /** Label no mapa — se omitido, usa `name`. */
  mapLabel?: string;
  short: string;
  category: string;
  level: AreaLevelLabel;
  color: AreaColor;
  /**
   * Posição do hotspot sobre a imagem do campus (em %).
   * x: 0 = esquerda, 100 = direita
   * y: 0 = topo, 100 = base
   * Ajustável via /campus?edit (modo de edição visual).
   */
  position: { x: number; y: number };
  description: string;
  highlights: string[];
  professor: string;
  lessons: number;
  hours: string;
};

/** Fallback territorial do mapa (hotspots fixos); campos editorial sobrescritos quando há manifest registado. */
const AREA_FALLBACK_ROWS: Area[] = [
  {
    id: "cannabis-101",
    name: "Cannabis 101",
    mapLabel: "Cannabis 101",
    short:
      "Introdução à planta, ao corpo e ao contexto legal — método THCProce · sala oficial com materiais formais",
    category: "Anfiteatro",
    level: "Iniciante",
    color: "amber",
    position: { x: 86, y: 36 },
    description:
      "No campus THC Academy, o **Cannabis 101** é a sala introdutória em português: o que é a planta, cânhamo e contextos de uso, canabinoides e terpenos, sistema endocanabinoide, consumo responsável, formas de administração e um panorama legal de alto nível (Brasil e EUA), sem consultoria jurídica nem promessas terapêuticas. Aprofundamentos em cultivo, extrações e medicina canabinoide estão nas salas vizinhas. Materiais formais e certificação, quando existirem, continuam na sala digital THCProce.",
    highlights: [
      "Dezessete aulas com resumo, pontos-chave, reflexão e quiz de três perguntas em cada tópico",
      "Conteúdo pensado para iniciantes: linguagem acolhedora, ciência sem sensacionalismo e redução de danos",
      "Ponte explícita para trilhas de cultivo, solventless, óleo e medicina quando quiser continuar",
      "Não substitui orientação médica, jurídica ou profissional do seu caso; confirme leis e tratamentos com quem está habilitado"
    ],
    professor: "Equipa THCProce",
    lessons: 17,
    hours: "≈6h (estimativa + materiais na sala oficial)"
  },
  {
    id: "cultivo-greenhouse",
    name: "Cultivo Greenhouse",
    mapLabel: "Estufas",
    short: "Estufa: o equilíbrio entre indoor e outdoor",
    category: "Cultivo",
    level: "Intermediário",
    color: "canna",
    position: { x: 10, y: 32 },
    description:
      "As **estufas de vidro** no extremo oeste do campus — fileiras sob arco, clima úmido e planta viva. Cultivo em estufa controlada: aproveita o sol, mas com proteção e suplementação. Aprenda controle climático, ventilação, suplementação de luz e produção em escala.",
    highlights: [
      "Estruturas e tipos de greenhouse",
      "Controle de temperatura e umidade",
      "Suplementação de CO₂ e LED",
      "Manejo integrado de pragas"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "16h"
  },
  {
    id: "cultivo-outdoor",
    name: "Cultivo Outdoor",
    mapLabel: "Cultivo outdoor",
    short: "A céu aberto, do plantio à colheita",
    category: "Cultivo",
    level: "Iniciante",
    color: "canna",
    position: { x: 46, y: 18 },
    description:
      "O **campo outdoor** na parte superior central do mapa — sol, terra e fileiras ao ar livre. Cultivo a céu aberto, ciclo natural com o sol. Ideal pra grandes volumes e cooperativas medicinais. Aprende-se desde o preparo do terreno até o cronograma estacional.",
    highlights: [
      "Análise de solo e preparação",
      "Genéticas adequadas para outdoor",
      "Calendário de plantio (BR)",
      "Proteção contra pragas e clima"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "13h"
  },
  {
    id: "cultivo-indoor",
    name: "Cultivo Indoor",
    mapLabel: "Cultivo indoor",
    short: "Floração, fotoperíodo e LED",
    category: "Cultivo",
    level: "Intermediário",
    color: "purple",
    position: { x: 72, y: 16 },
    description:
      "O **bloco grow indoor** ao norte-direita — luz roxa/azul, salas seladas, planta sob controle total. Cultivo em ambiente fechado: floração, manejo de luz LED, clima e técnicas de poda (LST, SCROG, defoliação).",
    highlights: [
      "Fotoperíodo 18/6 e 12/12",
      "Tipos de LED e PPFD",
      "Técnicas de poda e treinamento",
      "Cronograma de floração e colheita"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "21h"
  },
  {
    id: "genetica",
    name: "Genética & Sementes",
    mapLabel: "Viveiro de mudas",
    short: "Sementes feminizadas e cruzamentos",
    category: "Pesquisa",
    level: "Avançado",
    color: "canna",
    position: { x: 41, y: 50 },
    description:
      "O **viveiro** à esquerda da escola de culinária — mudas em bandejas, clima estável, banco vivo de genética. Produção de sementes feminizadas, cruzamentos, estabilização de fenótipos e seleção de mães. Inclui técnicas com prata coloidal e STS.",
    highlights: [
      "Polinização controlada",
      "Sementes feminizadas com STS",
      "Seleção de fenótipos",
      "Banco de mães e clones"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "10h"
  },
  {
    id: "secagem-cura",
    name: "Secagem & Cura",
    mapLabel: "Sala de secagem",
    short: "Onde o aroma e a potência se preservam",
    category: "Pós-colheita",
    level: "Intermediário",
    color: "amber",
    position: { x: 93, y: 44 },
    description:
      "A **sala de secagem** na fachada direita — flores penduradas, escuridão e umidade sob controle. A diferença entre uma flor mediana e uma flor premium está na secagem e cura. Umidade, temperatura, escuridão e tempo — a paciência que vale ouro.",
    highlights: [
      "Curva de secagem ideal",
      "Cura em vidro com Boveda",
      "Erros que destroem terpenos",
      "Armazenamento de longo prazo"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "5h"
  },
  {
    id: "extracoes-solventless",
    name: "Extrações Solventless",
    mapLabel: "Almoxarifado",
    short: "Bubble Hash, Rosin, Piatella",
    category: "Extrações",
    level: "Avançado",
    color: "amber",
    position: { x: 24, y: 46 },
    description:
      "Entre **estufas e viveiro**, o **almoxarifado** é o canto da extração artesanal — gelo, lavagem, prensa e cura do hash sem drama de solvente. Bubble Hash com malhas, Rosin sob pressão, Piatella curado: o ouro da cannabis.",
    highlights: [
      "Bubble Hash em 6 telas",
      "Rosin: pressão, temperatura e papel",
      "Piatella: cura e fermentação do hash",
      "Limpeza e armazenamento"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "12h"
  },
  {
    id: "extracao-oleo",
    name: "Extração de Óleo",
    mapLabel: "Extração óleo",
    short: "Óleo medicinal e tinturas",
    category: "Extrações",
    level: "Avançado",
    color: "canna",
    position: { x: 82, y: 22 },
    description:
      "Faixa **industrial/científica** da torre direita — inox, vidro e processo clínico. RSO, FECO, tinturas alcoólicas, óleo full spectrum, com foco em segurança, dosagem e padronização.",
    highlights: [
      "Decarboxilação correta",
      "RSO e FECO passo-a-passo",
      "Cálculo de dosagem (mg/ml)",
      "Filtragem, winterização e clareamento"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "11h"
  },
  {
    id: "medicina",
    name: "Medicina Canabinoide",
    mapLabel: "Instituto medicinal",
    short: "Aplicações terapêuticas",
    category: "Saúde",
    level: "Todos os níveis",
    color: "cyan",
    position: { x: 87, y: 26 },
    description:
      "Instituto **clean e sofisticado** na torre de ciências (mesmo enclave do laboratório): protocolos, posologia e evidência. Uso medicinal da cannabis: dor crônica, ansiedade, epilepsia, oncologia, autismo; interações e titulação.",
    highlights: [
      "Sistema endocanabinoide aplicado",
      "Protocolos por condição",
      "Titulação e ajuste de dose",
      "Interações com outros medicamentos"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "14h"
  },
  {
    id: "culinaria",
    name: "Culinária com Cannabis",
    mapLabel: "Escola de culinária",
    short: "Edibles, manteiga e óleos",
    category: "Gastronomia",
    level: "Intermediário",
    color: "amber",
    position: { x: 53, y: 48 },
    description:
      "A **Escola de Culinária Canábica** — cozinha aberta grande, bancadas e gente em movimento. Da decarboxilação à dosagem por porção: manteiga, óleos infundidos, receitas doces e salgadas.",
    highlights: [
      "Decarbox em forno e banho-maria",
      "Manteiga e óleo infundidos",
      "Cálculo de mg por porção",
      "Receitas doces e salgadas"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "8h"
  },
  {
    id: "laboratorio",
    name: "Laboratório de Análise",
    mapLabel: "Laboratório de análises",
    short: "Cromatografia, potência e segurança",
    category: "Pesquisa",
    level: "Avançado",
    color: "cyan",
    position: { x: 91, y: 20 },
    description:
      "O **Laboratório de Análises** no topo direito — estações, telas e equipamento de QC. Cromatografia básica, leitura de COA, detecção de contaminantes e padronização de lotes.",
    highlights: [
      "TLC (cromatografia em camada fina)",
      "Leitura de COA profissional",
      "Detecção de pesticidas e mofo",
      "Padronização de lotes"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "8h"
  },
  {
    id: "legislacao",
    name: "Legislação Cannabis",
    mapLabel: "Entrada THC Academy",
    short: "Habeas corpus, RDC 660 e Anvisa",
    category: "Direito",
    level: "Todos os níveis",
    color: "rose",
    position: { x: 16, y: 84 },
    description:
      "A **entrada principal** com letreiro e guarita — primeiro contato com o campus. Legislação cannabis no Brasil: habeas corpus, RDC 660, importação, associações e direitos de pacientes.",
    highlights: [
      "Habeas corpus passo-a-passo",
      "RDC 660 e RDC 327",
      "Importação de produtos via Anvisa",
      "Direito de pacientes e cuidadores"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "6h"
  },
  {
    id: "cooperativismo",
    name: "Cooperativismo",
    mapLabel: "Lounge · social",
    short: "Como montar uma associação medicinal",
    category: "Negócio",
    level: "Avançado",
    color: "purple",
    position: { x: 54, y: 64 },
    description:
      "A **área social / lounge** à frente da culinária — mesas, conversa e comunidade. Cooperativismo e associações: estatuto, governança, transparência e modelo de distribuição.",
    highlights: [
      "Estatuto e regulamento interno",
      "Governança e transparência",
      "Habeas corpus coletivo",
      "Modelo de produção e distribuição"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "6h"
  },
  {
    id: "industria",
    name: "Indústria Cannabis",
    mapLabel: "Armazenamento",
    short: "Mercado, marcas e produção em escala",
    category: "Negócio",
    level: "Avançado",
    color: "rose",
    position: { x: 79, y: 74 },
    description:
      "O **armazenamento** no quadrante inferior direito — caixas, doca e logística. Indústria cannabis: mercado, branding, escala, cadeia de suprimentos e carreiras.",
    highlights: [
      "Mercado BR vs LATAM vs EUA/EU",
      "Branding e produto",
      "Cadeia de suprimentos",
      "Carreiras e oportunidades"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "8h"
  },
  {
    id: "hash-maker",
    name: "Hash Maker",
    mapLabel: "Hash Maker",
    short: "Do charas artesanal ao full-melt premium — técnicas de extração sem solventes",
    category: "Extrações",
    level: "Intermediário",
    color: "amber",
    position: { x: 30, y: 60 },
    description:
      "**Hash Maker** mergulha nas técnicas de produção de hash sem solventes: história milenar do concentrado, técnicas tradicionais (charas, pollinators), modernas (dry sift, bubble hash full-melt) e a arte da cura e avaliação de qualidade.",
    highlights: [
      "História e cultura do hash — do Afeganistão à Espanha canábica",
      "Charas, pollinators, dry sift e bubble hash — técnicas sem solvente",
      "Avaliação de qualidade: cor, textura, aroma e ponto de fusão (full-melt)",
      "Armazenamento, cura e apresentação profissional do produto final",
    ],
    professor: "Equipa THCProce",
    lessons: 1,
    hours: "em construção",
  },
  {
    id: "extracoes-101",
    name: "Extrações 101",
    mapLabel: "Extrações",
    short: "Do rosin caseiro ao CO₂ profissional — fundamentos, segurança e qualidade",
    category: "Extração",
    level: "Iniciante",
    color: "purple",
    position: { x: 62, y: 58 },
    description:
      "Do vocabulário básico às técnicas sem e com solvente, leitura de COA, armazenamento e ética do extratista — 17 aulas em PT-BR, tom técnico, sem receitas ilegais.",
    highlights: [
      "Rosin, bubble hash, dry sift e hash artesanal — sem solvente, seguro em casa",
      "QWET, QWISO e CO₂ — com solvente: riscos, ventilação e purga",
      "Leitura de COA: potência, terpenos e contaminantes",
      "Marco legal BR e ética profissional do extratista"
    ],
    professor: "Equipa THCProce",
    lessons: 17,
    hours: "≈6h"
  }
];

function mergeRegisteredManifestIntoArea(base: Area, manifest: CourseManifest): Area {
  const mk = manifest.marketing;
  const position =
    mk?.mapPosition != null
      ? { x: mk.mapPosition.x, y: mk.mapPosition.y }
      : base.position;

  const highlights =
    mk?.highlights != null && mk.highlights.length > 0 ? [...mk.highlights] : base.highlights;

  return {
    ...base,
    id: manifest.areaId,
    name: manifest.displayName,
    short: mk?.short ?? base.short,
    category: mk?.category ?? base.category,
    level: mk?.level ?? base.level,
    color: mk?.color ?? base.color,
    position,
    description: mk?.description ?? base.description,
    highlights,
    professor: mk?.professor ?? base.professor,
    lessons: manifest.stats.lessonCount,
    hours: manifest.stats.hoursLabel,
    mapLabel: base.mapLabel
  };
}

function applyRegisteredManifestIfAny(area: Area): Area {
  const manifest = getCourseManifest(area.id);
  return manifest ? mergeRegisteredManifestIntoArea(area, manifest) : area;
}

/**
 * Lista de áreas do mapa: baseline territorial + overlays editoriais vindos dos manifests registados (`registerCourse`).
 */
export function getCampusAreasFromRegisteredCourses(fallbackAreas: Area[] = AREA_FALLBACK_ROWS): Area[] {
  return fallbackAreas.map(applyRegisteredManifestIfAny);
}

/** Áreas efectivas para o campus (hotspots preservados; manifest define copy/stats onde existir registo). */
export const areas: Area[] = getCampusAreasFromRegisteredCourses();

export type AreaId = (typeof areas)[number]["id"];
