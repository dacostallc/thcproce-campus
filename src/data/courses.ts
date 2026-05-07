export type AreaColor = "canna" | "purple" | "amber" | "cyan" | "rose";

export type Area = {
  id: string;
  name: string;
  /** Label no mapa — se omitido, usa `name`. */
  mapLabel?: string;
  short: string;
  category: string;
  level: "Iniciante" | "Intermediário" | "Avançado" | "Todos os níveis";
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

export const areas: Area[] = [
  {
    id: "cannabis-101",
    name: "Cannabis 101",
    short: "Fundamentos da cannabis medicinal",
    category: "Anfiteatro",
    level: "Iniciante",
    color: "amber",
    position: { x: 70, y: 21 },
    description:
      "Fundamentos científicos e responsáveis: sistema endocanabinoide; THC, CBD, CBN, CBG e terpenos; uso medicinal ético; distinção entre adulto, medicinal e educacional; base de evidências; e o caminho do aluno na escola antes de qualquer área avançada.",
    highlights: [
      "ECS (CB1/CB2) em linguagem aplicável",
      "Moléculas e matriz terpenica — leitura integrada",
      "Medicinal responsável vs educação institucional",
      "Onboarding THCProce: trilha, Moodle e próximos módulos"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "9h"
  },
  {
    id: "cultivo-greenhouse",
    name: "Cultivo Greenhouse",
    short: "Estufa: o equilíbrio entre indoor e outdoor",
    category: "Cultivo",
    level: "Intermediário",
    color: "canna",
    position: { x: 14, y: 11 },
    description:
      "Cultivo em estufa controlada. Aproveita o sol, mas com proteção e suplementação. Aprenda controle climático, ventilação, suplementação de luz e produção em escala.",
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
    short: "A céu aberto, do plantio à colheita",
    category: "Cultivo",
    level: "Iniciante",
    color: "canna",
    position: { x: 40, y: 11 },
    description:
      "Cultivo a céu aberto, ciclo natural com o sol. Ideal pra grandes volumes e cooperativas medicinais. Aprende-se desde o preparo do terreno até o cronograma estacional.",
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
    short: "Floração, fotoperíodo e LED",
    category: "Cultivo",
    level: "Intermediário",
    color: "purple",
    position: { x: 62, y: 9 },
    description:
      "Cultivo controlado em ambiente fechado. Foco em floração, manejo de luz LED, controle climático e técnicas de poda (LST, SCROG, defoliação).",
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
    short: "Sementes feminizadas e cruzamentos",
    category: "Pesquisa",
    level: "Avançado",
    color: "canna",
    position: { x: 14, y: 42 },
    description:
      "Produção de sementes feminizadas, cruzamentos, estabilização de fenótipos e seleção de mães. Inclui técnicas com prata coloidal e STS.",
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
    short: "Onde o aroma e a potência se preservam",
    category: "Pós-colheita",
    level: "Intermediário",
    color: "amber",
    position: { x: 8, y: 22 },
    description:
      "A diferença entre uma flor mediana e uma flor premium está na secagem e cura. Umidade, temperatura, escuridão e tempo — a paciência que vale ouro.",
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
    short: "Bubble Hash, Rosin, Piatella",
    category: "Extrações",
    level: "Avançado",
    color: "amber",
    position: { x: 22, y: 22 },
    description:
      "Extrações sem solvente — as mais limpas e medicinais. Bubble Hash com gelo e malhas, Rosin a quente sob pressão, e Piatella curado: o ouro da cannabis.",
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
    short: "Óleo medicinal e tinturas",
    category: "Extrações",
    level: "Avançado",
    color: "canna",
    position: { x: 84, y: 11 },
    description:
      "RSO, FECO, tinturas alcoólicas, óleo full spectrum. Extrações com solvente para uso terapêutico, com foco em segurança, dosagem e padronização.",
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
    short: "Aplicações terapêuticas",
    category: "Saúde",
    level: "Todos os níveis",
    color: "cyan",
    position: { x: 80, y: 32 },
    description:
      "Uso medicinal da cannabis: dor crônica, ansiedade, epilepsia, oncologia, autismo. Indicações, contra-indicações, interações medicamentosas e protocolos.",
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
    short: "Edibles, manteiga e óleos",
    category: "Gastronomia",
    level: "Intermediário",
    color: "amber",
    position: { x: 42, y: 36 },
    description:
      "Da decarboxilação à dosagem precisa em receitas. Manteiga canábica, óleos infundidos, brownies, doces e pratos salgados — tudo com cálculo de mg por porção.",
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
    short: "Cromatografia, potência e segurança",
    category: "Pesquisa",
    level: "Avançado",
    color: "cyan",
    position: { x: 92, y: 13 },
    description:
      "Como analisar a sua flor: cromatografia básica, leitura de COA (certificado de análise), métodos rápidos, controle de qualidade e detecção de contaminantes.",
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
    short: "Habeas corpus, RDC 660 e Anvisa",
    category: "Direito",
    level: "Todos os níveis",
    color: "rose",
    position: { x: 18, y: 78 },
    description:
      "Cenário regulatório no Brasil: habeas corpus para autocultivo, RDC 660 da Anvisa, importação de produtos, papel das associações e Justiça.",
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
    short: "Como montar uma associação medicinal",
    category: "Negócio",
    level: "Avançado",
    color: "purple",
    position: { x: 72, y: 47 },
    description:
      "Estruturação de associações de pacientes: estatuto, governança, prestação de contas, parcerias com médicos, produção em escala e habeas corpus coletivo.",
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
    short: "Mercado, marcas e produção em escala",
    category: "Negócio",
    level: "Avançado",
    color: "rose",
    position: { x: 78, y: 65 },
    description:
      "Mercado global, branding de marcas canábicas, produção em escala industrial, cadeia de suprimentos, regulação internacional e oportunidades de carreira.",
    highlights: [
      "Mercado BR vs LATAM vs EUA/EU",
      "Branding e produto",
      "Cadeia de suprimentos",
      "Carreiras e oportunidades"
    ],
    professor: "Prof THC",
    lessons: 10,
    hours: "8h"
  }
];

export type AreaId = (typeof areas)[number]["id"];
