"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Lock, Map, RotateCcw, Sprout, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AncoraCurva = {
  x: number;
  y: number;
  nome?: string;
  raio: number;
};

type PontoPixel = {
  x: number;
  y: number;
  nome?: string;
  raio?: number;
};

type MarcoCurso = {
  nome: string;
  x: number;
  y: number;
  raio: number;
  courseSlug: string;
};

type CasaEstrada = {
  id: number;
  x: number;
  y: number;
  nome?: string;
  raio: number;
  temSeedCoin: boolean;
};

type StatusCasa = "correto" | "errado" | "neutro";

type PerguntaEstrada = {
  pergunta: string;
  apoio: string;
  opcoes: string[];
  correta: number;
};

const MAPA_LARGURA = 1672;
const MAPA_ALTURA = 941;
const RAIO_PADRAO_QUESTAO = 24;

const PONTOS_ESTRADA_PIXELS: PontoPixel[] = [
  { x: 877, y: 906, raio: 23, nome: "A1" },
  { x: 930, y: 869, raio: 24, nome: "A2" },
  { x: 965, y: 822, raio: 23, nome: "A3" },
  { x: 1001, y: 784, raio: 21, nome: "A4" },
  { x: 1061, y: 803, raio: 22, nome: "A5" },
  { x: 1132, y: 804, raio: 22, nome: "A6" },
  { x: 1194, y: 824, raio: 22, nome: "A7" },
  { x: 1250, y: 841, raio: 22, nome: "A8" },
  { x: 1314, y: 842, raio: 24, nome: "A9" },
  { x: 1212, y: 886, raio: 23, nome: "B1" },
  { x: 1160, y: 908, raio: 26, nome: "B2" },
  { x: 1191, y: 758, raio: 24, nome: "B3" },
  { x: 1207, y: 702, raio: 25, nome: "B4" },
  { x: 1154, y: 674, raio: 24, nome: "B5" },
  { x: 1092, y: 653, raio: 23, nome: "B6" },
  { x: 1033, y: 624, raio: 23, nome: "B7" },
  { x: 1064, y: 579, raio: 23, nome: "B8" },
  { x: 1111, y: 545, raio: 23, nome: "B9" },
  { x: 1148, y: 468, raio: 23, nome: "C1" },
  { x: 1331, y: 485, raio: 22, nome: "C2" },
  { x: 1391, y: 499, raio: 25, nome: "C3" },
  { x: 1461, y: 535, raio: 25, nome: "C4" },
  { x: 1518, y: 551, raio: 25, nome: "C5" },
  { x: 1441, y: 591, raio: 24, nome: "C6" },
  { x: 1395, y: 629, raio: 25, nome: "C7" },
  { x: 1433, y: 675, raio: 24, nome: "C8" },
  { x: 1210, y: 424, raio: 24, nome: "C9" },
  { x: 1265, y: 393, raio: 26, nome: "D1" },
  { x: 1324, y: 356, raio: 29, nome: "D2" },
  { x: 1371, y: 307, raio: 27, nome: "D3" },
  { x: 1287, y: 279, raio: 27, nome: "D4" },
  { x: 1116, y: 414, raio: 26, nome: "D5" },
  { x: 970, y: 624, raio: 25, nome: "D6" },
  { x: 925, y: 771, raio: 23, nome: "D7" },
  { x: 866, y: 733, raio: 24, nome: "D8" },
  { x: 785, y: 703, raio: 26, nome: "D9" },
  { x: 704, y: 737, raio: 24, nome: "E1" },
  { x: 643, y: 775, raio: 26, nome: "E2" },
  { x: 583, y: 821, raio: 25, nome: "E3" },
  { x: 524, y: 848, raio: 26, nome: "E4" },
  { x: 593, y: 901, raio: 24, nome: "E5" },
  { x: 429, y: 870, raio: 27, nome: "E6" },
  { x: 902, y: 618, raio: 26, nome: "E7" },
  { x: 912, y: 682, raio: 28, nome: "E8" },
  { x: 838, y: 587, raio: 24, nome: "E9" },
  { x: 779, y: 542, raio: 26, nome: "F1" },
  { x: 747, y: 481, raio: 24, nome: "F2" },
  { x: 705, y: 445, raio: 24, nome: "F3" },
  { x: 632, y: 479, raio: 29, nome: "F4" },
  { x: 525, y: 477, raio: 29, nome: "F5" },
  { x: 562, y: 531, raio: 26, nome: "F6" },
  { x: 653, y: 408, raio: 26, nome: "F7" },
  { x: 580, y: 378, raio: 25, nome: "F8" },
  { x: 517, y: 351, raio: 24, nome: "F9" },
  { x: 579, y: 317, raio: 26, nome: "G1" },
  { x: 652, y: 294, raio: 26, nome: "G2" },
  { x: 599, y: 247, raio: 26, nome: "G3" },
  { x: 716, y: 267, raio: 26, nome: "G4" },
  { x: 785, y: 237, raio: 26, nome: "G5" },
  { x: 841, y: 211, raio: 24, nome: "G6" },
  { x: 913, y: 240, raio: 27, nome: "G7" },
  { x: 968, y: 266, raio: 25, nome: "G8" },
  { x: 1025, y: 296, raio: 25, nome: "G9" },
  { x: 984, y: 335, raio: 25, nome: "K1" },
  { x: 919, y: 364, raio: 27, nome: "K2" },
  { x: 860, y: 399, raio: 27, nome: "K3" },
  { x: 782, y: 423, raio: 28, nome: "K4" }
];

const MARCOS_CURSO_PIXELS: MarcoCurso[] = [
  { nome: "Cannabis 101", x: 641, y: 592, raio: 69, courseSlug: "cannabis-101" },
  { nome: "HashMaker", x: 994, y: 430, raio: 64, courseSlug: "hash-maker" },
  { nome: "Extracao de oleo", x: 1233, y: 539, raio: 83, courseSlug: "extracao-oleo" },
  { nome: "Medicina Cannabica", x: 1413, y: 390, raio: 61, courseSlug: "aplicacoes-terapeuticas" },
  { nome: "Cultivo GreenHouse", x: 1007, y: 144, raio: 62, courseSlug: "vegetacao" },
  { nome: "Cultivo Light Deprivation", x: 732, y: 118, raio: 71, courseSlug: "transicao-floracao" },
  { nome: "Germinacao de sementes", x: 1026, y: 706, raio: 56, courseSlug: "germinacao" },
  { nome: "Secagem e Cura", x: 1157, y: 299, raio: 75, courseSlug: "transicao-floracao" },
  { nome: "Nutricao da planta", x: 1389, y: 205, raio: 72, courseSlug: "nutrientes" },
  { nome: "Cozinha Cannabica", x: 1374, y: 752, raio: 68, courseSlug: "culinaria" },
  { nome: "Cultivo Indoor", x: 407, y: 236, raio: 115, courseSlug: "cannabis-101" },
  { nome: "Preparacao do solo", x: 348, y: 473, raio: 80, courseSlug: "preparacao-solo" },
  { nome: "Cultivo Outdoor", x: 197, y: 724, raio: 162, courseSlug: "cannabis-101" },
  { nome: "Clones e sementes", x: 749, y: 846, raio: 83, courseSlug: "producao-sementes" },
  { nome: "Sua Situacao", x: 1063, y: 884, raio: 55, courseSlug: "cannabis-101" }
];

const normalizarPonto = (ponto: PontoPixel): AncoraCurva => ({
  x: Number(((ponto.x / MAPA_LARGURA) * 100).toFixed(2)),
  y: Number(((ponto.y / MAPA_ALTURA) * 100).toFixed(2)),
  nome: ponto.nome,
  raio: Number((((ponto.raio ?? RAIO_PADRAO_QUESTAO) / MAPA_LARGURA) * 100).toFixed(2))
});

const normalizarMarco = (marco: MarcoCurso) => ({
  ...marco,
  x: Number(((marco.x / MAPA_LARGURA) * 100).toFixed(2)),
  y: Number(((marco.y / MAPA_ALTURA) * 100).toFixed(2)),
  raio: Number(((marco.raio / MAPA_LARGURA) * 100).toFixed(2))
});

const COORDENADAS_CURVAS = PONTOS_ESTRADA_PIXELS.map(normalizarPonto);
const MARCOS_CURSO = MARCOS_CURSO_PIXELS.map(normalizarMarco);
const TOTAL_CASAS = COORDENADAS_CURVAS.length;
const TEMPO_MAXIMO_CURSO = 30;
const PERGUNTAS_POR_CASA = 3;

const PERGUNTAS_DEMO: PerguntaEstrada[] = [
  {
    pergunta: "Qual e o primeiro passo antes de escolher um metodo de cultivo?",
    apoio: "A trilha reforca planejamento, legalidade local e seguranca antes da pratica.",
    opcoes: [
      "Comprar equipamentos antes de estudar o ambiente",
      "Entender regras locais, objetivo educativo e condicoes do espaco",
      "Comecar pela fase de floracao",
      "Ignorar registro de observacoes"
    ],
    correta: 1
  },
  {
    pergunta: "Por que a germinacao exige cuidado especial?",
    apoio: "A semente esta em uma fase sensivel, em que excesso e falta de agua podem prejudicar o desenvolvimento.",
    opcoes: [
      "Porque a planta ja suporta estresse alto",
      "Porque nutrientes fortes sempre aceleram a raiz",
      "Porque umidade, temperatura e manejo definem o inicio saudavel",
      "Porque luz intensa e obrigatoria desde o primeiro minuto"
    ],
    correta: 2
  },
  {
    pergunta: "Na fase vegetativa, qual observacao e mais importante?",
    apoio: "Folhas, crescimento, cor e resposta ao ambiente indicam a saude geral da planta.",
    opcoes: [
      "Observar vigor, folhas e sinais de estresse",
      "Forcar floracao sem avaliar a planta",
      "Trocar tudo todo dia",
      "Anotar apenas o tamanho do vaso"
    ],
    correta: 0
  },
  {
    pergunta: "O que torna o solo vivo mais estavel para iniciantes?",
    apoio: "Um substrato equilibrado tende a amortecer pequenas variacoes de manejo.",
    opcoes: [
      "Ausencia total de vida microbiana",
      "Uso obrigatorio de sais fortes",
      "Microbioma, estrutura e retencao equilibrada de umidade",
      "Secagem completa todos os dias"
    ],
    correta: 2
  }
];

const PERGUNTAS_POR_CURSO: Record<string, PerguntaEstrada[]> = {
  "cannabis-101": [
    PERGUNTAS_DEMO[0],
    {
      pergunta: "Qual atitude combina melhor com estudo responsavel no CultivoSim?",
      apoio: "O aluno deve pensar em planejamento, limites legais e observacao antes de qualquer decisao.",
      opcoes: ["Pular as etapas basicas", "Registrar objetivo, ambiente e riscos", "Copiar qualquer receita pronta", "Ignorar seguranca"],
      correta: 1
    },
    {
      pergunta: "Por que o mapa usa progresso por etapas?",
      apoio: "A trilha transforma conhecimento em sequencia, evitando que o aluno pule fundamentos importantes.",
      opcoes: ["Para liberar tudo sem criterio", "Para esconder os cursos", "Para construir base antes dos modulos avancados", "Para remover os quizzes"],
      correta: 2
    }
  ],
  germinacao: [
    PERGUNTAS_DEMO[1],
    {
      pergunta: "O que deve ser evitado na fase inicial da semente?",
      apoio: "A germinacao e sensivel ao excesso, a falta de umidade e a mudancas bruscas.",
      opcoes: ["Ambiente estavel", "Observacao diaria", "Excesso de agua e manejo agressivo", "Registro do progresso"],
      correta: 2
    },
    {
      pergunta: "Qual sinal indica que a germinacao precisa de atencao?",
      apoio: "Mudancas de cor, demora incomum e substrato inadequado pedem revisao do ambiente.",
      opcoes: ["Raiz surgindo com vigor", "Substrato sempre encharcado", "Temperatura estavel", "Anotacoes consistentes"],
      correta: 1
    }
  ],
  vegetacao: [
    PERGUNTAS_DEMO[2],
    {
      pergunta: "Durante a vegetacao, o que o aluno deve acompanhar?",
      apoio: "Crescimento, cor das folhas e resposta ao ambiente mostram se a planta esta equilibrada.",
      opcoes: ["Somente a data final", "Vigor, folhas e sinais de estresse", "Apenas o nome do vaso", "Nada ate a floracao"],
      correta: 1
    },
    {
      pergunta: "Qual pratica ajuda a aprender com a fase vegetativa?",
      apoio: "Registro comparativo facilita entender padroes sem depender de memoria.",
      opcoes: ["Registrar observacoes", "Trocar tudo ao mesmo tempo", "Ignorar sintomas", "Forcar mudancas diarias"],
      correta: 0
    }
  ],
  "transicao-floracao": [
    {
      pergunta: "O que a transicao para floracao exige?",
      apoio: "A fase pede leitura do desenvolvimento e cuidado para nao estressar a planta.",
      opcoes: ["Mudancas bruscas sem observar", "Acompanhamento de sinais e estabilidade", "Remover todos os registros", "Aumentar estresse de proposito"],
      correta: 1
    },
    {
      pergunta: "Por que secagem e cura aparecem como etapa propria?",
      apoio: "Elas influenciam conservacao, qualidade e seguranca do material final.",
      opcoes: ["Porque nao precisam de controle", "Porque substituem o cultivo", "Porque exigem tempo, ambiente e observacao", "Porque anulam a floracao"],
      correta: 2
    },
    {
      pergunta: "Na floracao, qual olhar e mais util?",
      apoio: "Acompanhamento cuidadoso ajuda a reconhecer desenvolvimento e possiveis problemas.",
      opcoes: ["Observar sinais da planta", "Ignorar umidade", "Pular para extracao", "Trocar tudo diariamente"],
      correta: 0
    }
  ],
  nutrientes: [
    {
      pergunta: "Qual e a melhor leitura sobre nutrientes?",
      apoio: "Nutricao equilibrada depende de contexto, substrato e resposta da planta.",
      opcoes: ["Quanto mais, melhor", "Equilibrio e observacao da resposta", "Nunca observar folhas", "Usar sempre a mesma dose"],
      correta: 1
    },
    PERGUNTAS_DEMO[3],
    {
      pergunta: "O que indica possivel desequilibrio nutricional?",
      apoio: "Cor, crescimento e padroes nas folhas ajudam no diagnostico educativo.",
      opcoes: ["Folhas sempre identicas", "Mudancas de cor e crescimento fora do esperado", "Anotacoes claras", "Ambiente estavel"],
      correta: 1
    }
  ],
  "preparacao-solo": [
    PERGUNTAS_DEMO[3],
    {
      pergunta: "Por que preparar o solo antes evita problemas?",
      apoio: "Estrutura, microbioma e umidade influenciam todo o ciclo.",
      opcoes: ["Porque elimina observacao", "Porque melhora base fisica e biologica", "Porque substitui a agua", "Porque acelera qualquer erro"],
      correta: 1
    },
    {
      pergunta: "Qual registro ajuda no modulo de solo?",
      apoio: "Comparar umidade, textura e resposta da planta cria aprendizado real.",
      opcoes: ["Registrar textura, umidade e resposta", "Anotar so o dia da colheita", "Nao medir nada", "Trocar o substrato todo dia"],
      correta: 0
    }
  ],
  "hash-maker": [
    {
      pergunta: "No Hash Maker, o que vem antes da tecnica?",
      apoio: "Seguranca, limpeza, materia-prima e objetivo definem a qualidade do processo.",
      opcoes: ["Improvisar sem higiene", "Planejar seguranca e materia-prima", "Ignorar temperatura", "Misturar etapas sem criterio"],
      correta: 1
    },
    {
      pergunta: "Qual fator mais protege a qualidade do material?",
      apoio: "Controle de contaminacao e manejo cuidadoso reduzem perdas.",
      opcoes: ["Superficie suja", "Pressa", "Limpeza e controle do processo", "Exposicao desnecessaria"],
      correta: 2
    },
    {
      pergunta: "Por que comparar metodos de hash?",
      apoio: "Cada metodo muda rendimento, textura e complexidade.",
      opcoes: ["Porque todos sao identicos", "Para escolher conforme objetivo e risco", "Para evitar estudo", "Para ignorar materia-prima"],
      correta: 1
    }
  ],
  "extracao-oleo": [
    {
      pergunta: "Em extracao de oleo, qual principio vem primeiro?",
      apoio: "O modulo deve reforcar seguranca, rastreabilidade e entendimento do metodo.",
      opcoes: ["Seguranca do processo", "Pressa no resultado", "Ignorar solventes", "Nao registrar nada"],
      correta: 0
    },
    {
      pergunta: "Por que comparar RSO, QWISO e BHO no estudo?",
      apoio: "Metodos diferentes exigem riscos, equipamentos e cuidados diferentes.",
      opcoes: ["Porque todos tem o mesmo risco", "Porque cada metodo tem cuidados proprios", "Porque dispensa conhecimento", "Porque elimina controle"],
      correta: 1
    },
    {
      pergunta: "Qual resposta mostra postura responsavel?",
      apoio: "O aluno deve reconhecer limites, riscos e necessidade de procedimento seguro.",
      opcoes: ["Pular etapas", "Fazer sem ventilacao", "Priorizar seguranca e rastreio", "Ignorar origem do material"],
      correta: 2
    }
  ],
  culinaria: [
    {
      pergunta: "Na culinaria cannabica, o que precisa ser controlado?",
      apoio: "Dosagem, preparo e rotulagem reduzem erros e confusao.",
      opcoes: ["Dosagem e identificacao", "Apenas sabor", "Nada alem da receita", "Improviso total"],
      correta: 0
    },
    {
      pergunta: "Por que descarboxilacao aparece no curso?",
      apoio: "Ela muda o perfil de compostos e precisa de controle de tempo e temperatura.",
      opcoes: ["Porque e decorativa", "Porque depende de tempo e temperatura", "Porque dispensa medicao", "Porque substitui dosagem"],
      correta: 1
    },
    {
      pergunta: "Qual cuidado evita consumo acidental?",
      apoio: "Separacao, identificacao e orientacao clara sao parte do uso responsavel.",
      opcoes: ["Guardar sem rotulo", "Misturar com comida comum", "Rotular e separar claramente", "Nao avisar ninguem"],
      correta: 2
    }
  ],
  "aplicacoes-terapeuticas": [
    {
      pergunta: "Em aplicacoes terapeuticas, qual postura e mais segura?",
      apoio: "Uso medicinal exige informacao, acompanhamento e registro de resposta.",
      opcoes: ["Ajustar sem criterio", "Registrar efeitos e buscar orientacao qualificada", "Ignorar interacoes", "Prometer cura"],
      correta: 1
    },
    {
      pergunta: "Por que microdose entra no conteudo?",
      apoio: "O conceito ajuda a discutir resposta individual e reducao de danos.",
      opcoes: ["Para aumentar risco", "Para ignorar tolerancia", "Para pensar resposta individual", "Para dispensar acompanhamento"],
      correta: 2
    },
    {
      pergunta: "Qual informacao deve ser acompanhada?",
      apoio: "Dose, horario, efeito percebido e reacoes ajudam a avaliar com mais clareza.",
      opcoes: ["Dose, horario e efeito", "Somente o nome do produto", "Nada depois do uso", "Apenas opinioes de terceiros"],
      correta: 0
    }
  ],
  "producao-sementes": [
    {
      pergunta: "No curso de sementes, por que selecionar fenotipos?",
      apoio: "A selecao ajuda a entender estabilidade, vigor e objetivo do projeto.",
      opcoes: ["Para escolher ao acaso", "Para observar caracteristicas desejadas", "Para eliminar registros", "Para pular germinacao"],
      correta: 1
    },
    {
      pergunta: "Qual cuidado vale para clones e sementes?",
      apoio: "Identificacao evita confusao entre linhagens e etapas.",
      opcoes: ["Etiqueta e registro", "Misturar lotes", "Nao datar nada", "Trocar nomes depois"],
      correta: 0
    },
    {
      pergunta: "O que define um bom banco de observacao?",
      apoio: "Historico, origem e caracteristicas permitem comparar resultados.",
      opcoes: ["Memoria informal", "Origem, data e caracteristicas", "Ausencia de dados", "Fotos sem contexto"],
      correta: 1
    }
  ]
};

function perguntasDoCurso(courseSlug: string) {
  return PERGUNTAS_POR_CURSO[courseSlug] ?? PERGUNTAS_DEMO;
}

function embaralharPerguntas(total = PERGUNTAS_DEMO.length) {
  return Array.from({ length: total }, (_, index) => index).sort(() => Math.random() - 0.5);
}

function gerarEstradaOz(pontos: AncoraCurva[]): CasaEstrada[] {
  return pontos.map((ponto, index) => ({
    id: index + 1,
    x: ponto.x,
    y: ponto.y,
    raio: ponto.raio,
    nome: ponto.nome,
    temSeedCoin: (index + 1) % 7 === 0
  }));
}

function perguntaPorIndice(indicePergunta: number) {
  return PERGUNTAS_DEMO[indicePergunta % PERGUNTAS_DEMO.length];
}

function distanciaEntrePontos(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function cursoMaisProximoDaCasa(casa: CasaEstrada) {
  return MARCOS_CURSO.reduce((maisProximo, marco) => {
    return distanciaEntrePontos(marco, casa) < distanciaEntrePontos(maisProximo, casa) ? marco : maisProximo;
  }, MARCOS_CURSO[0]);
}

function proximaPerguntaIndex(indiceAtual: number, totalPerguntas: number) {
  return totalPerguntas > 0 ? (indiceAtual + 1) % totalPerguntas : 0;
}

export function EstradaConhecimentoOz({
  mapaUrl = "/cultivosim/estrada-oz.png"
}: {
  mapaUrl?: string;
}) {
  const listaQuadradinhos = useMemo(() => gerarEstradaOz(COORDENADAS_CURVAS), []);
  const casaMaisProximaPorCurso = useMemo(() => {
    return MARCOS_CURSO.reduce<Record<string, number>>((acc, marco) => {
      const casaMaisProxima = listaQuadradinhos.reduce((maisProxima, casa) => {
        return distanciaEntrePontos(marco, casa) < distanciaEntrePontos(marco, maisProxima) ? casa : maisProxima;
      }, listaQuadradinhos[0]);

      acc[marco.nome] = casaMaisProxima.id;
      return acc;
    }, {});
  }, [listaQuadradinhos]);

  const roteiroCursos = useMemo(() => {
    return MARCOS_CURSO.map((marco) => ({
      marco,
      casaId: casaMaisProximaPorCurso[marco.nome] ?? 1
    })).sort((a, b) => a.casaId - b.casaId);
  }, [casaMaisProximaPorCurso]);

  const [passoAtual, setPassoAtual] = useState(1);
  const [historicoCasas, setHistoricoCasas] = useState<Record<number, StatusCasa>>({});
  const [cursosLiberados, setCursosLiberados] = useState<string[]>([]);
  const [seedCoinsColetadas, setSeedCoinsColetadas] = useState<number[]>([]);
  const [quizAberto, setQuizAberto] = useState(false);
  const [ordemPerguntasTrilha, setOrdemPerguntasTrilha] = useState(() => embaralharPerguntas());
  const [indicePerguntaTrilha, setIndicePerguntaTrilha] = useState(0);
  const [feedback, setFeedback] = useState<"correto" | "errado" | null>(null);
  const [usarFallbackMapa, setUsarFallbackMapa] = useState(false);
  const [cursoAtivo, setCursoAtivo] = useState<(typeof MARCOS_CURSO)[number] | null>(null);
  const [casaCursoAtiva, setCasaCursoAtiva] = useState<number | null>(null);
  const [cursoConcluido, setCursoConcluido] = useState(false);
  const [statusCasaConcluida, setStatusCasaConcluida] = useState<StatusCasa>("neutro");
  const [indicePerguntaCurso, setIndicePerguntaCurso] = useState(0);
  const [ordemPerguntasCurso, setOrdemPerguntasCurso] = useState(() => embaralharPerguntas());
  const [tempoCurso, setTempoCurso] = useState(TEMPO_MAXIMO_CURSO);
  const [feedbackCurso, setFeedbackCurso] = useState<"correto" | "errado" | null>(null);
  const [placarCurso, setPlacarCurso] = useState({ certas: 0, erradas: 0 });

  const casaAtual = listaQuadradinhos[passoAtual - 1];
  const cursoDestinoAtual = useMemo(() => {
    if (!casaAtual) return MARCOS_CURSO[0];
    return roteiroCursos.find((item) => item.casaId >= casaAtual.id)?.marco ?? roteiroCursos[roteiroCursos.length - 1]?.marco ?? cursoMaisProximoDaCasa(casaAtual);
  }, [casaAtual, roteiroCursos]);
  const cursosDeChegadaDaCasaAtual = useMemo(() => {
    if (!casaAtual) return [];
    return roteiroCursos.filter((item) => item.casaId === casaAtual.id).map((item) => item.marco);
  }, [casaAtual, roteiroCursos]);
  const chegouAoCursoAtual = cursosDeChegadaDaCasaAtual.length > 0;
  const perguntasDoDestinoAtual = useMemo(
    () => perguntasDoCurso(cursoDestinoAtual.courseSlug),
    [cursoDestinoAtual]
  );
  const perguntaAtual =
    perguntasDoDestinoAtual[
      (ordemPerguntasTrilha[indicePerguntaTrilha % ordemPerguntasTrilha.length] ?? indicePerguntaTrilha) %
        perguntasDoDestinoAtual.length
    ] ?? perguntaPorIndice(indicePerguntaTrilha);
  const perguntasDoCursoAtivo = useMemo(
    () => (cursoAtivo ? perguntasDoCurso(cursoAtivo.courseSlug) : PERGUNTAS_DEMO),
    [cursoAtivo]
  );
  const perguntaCursoAtual = perguntasDoCursoAtivo[ordemPerguntasCurso[indicePerguntaCurso % ordemPerguntasCurso.length]];
  const terminou = passoAtual >= listaQuadradinhos.length;

  useEffect(() => {
    if (!cursoAtivo || feedbackCurso || cursoConcluido) return;

    if (tempoCurso <= 0) {
      responderPerguntaCurso(-1);
      return;
    }

    const timer = window.setTimeout(() => setTempoCurso((tempo) => tempo - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cursoAtivo, cursoConcluido, feedbackCurso, tempoCurso]);

  const coletarSeedCoinSeHouver = (casa: CasaEstrada) => {
    if (!casa.temSeedCoin) return;
    setSeedCoinsColetadas((prev) => (prev.includes(casa.id) ? prev : [...prev, casa.id]));
  };

  const liberarCursosDaCasa = (casaId: number) => {
    const proximosCursos = MARCOS_CURSO.filter((marco) => casaMaisProximaPorCurso[marco.nome] === casaId).map(
      (marco) => marco.nome
    );

    if (!proximosCursos.length) return;
    setCursosLiberados((prev) => Array.from(new Set([...prev, ...proximosCursos])));
  };

  const responderQuiz = (opcaoEscolhida: number) => {
    if (!casaAtual) return;

    const acertou = opcaoEscolhida === perguntaAtual.correta;
    setFeedback(acertou ? "correto" : "errado");
    setHistoricoCasas((prev) => ({ ...prev, [passoAtual]: acertou ? "correto" : "errado" }));
    coletarSeedCoinSeHouver(casaAtual);
    window.setTimeout(() => {
      setQuizAberto(false);
      setFeedback(null);
      setIndicePerguntaTrilha((indice) => {
        const proximoIndice = proximaPerguntaIndex(indice, perguntasDoDestinoAtual.length);
        if (proximoIndice === 0) {
          setOrdemPerguntasTrilha(embaralharPerguntas(perguntasDoDestinoAtual.length));
        }
        return proximoIndice;
      });
      setPassoAtual((prev) => Math.min(listaQuadradinhos.length, prev + 1));
    }, 650);
  };

  const reiniciar = () => {
    setPassoAtual(1);
    setHistoricoCasas({});
    setCursosLiberados([]);
    setSeedCoinsColetadas([]);
    setOrdemPerguntasTrilha(embaralharPerguntas());
    setIndicePerguntaTrilha(0);
    setQuizAberto(false);
    setFeedback(null);
    fecharQuizCurso();
  };

  const abrirQuizDaCasaAtual = () => {
    if (!casaAtual) return;
    if (chegouAoCursoAtual) {
      abrirQuizCurso(cursosDeChegadaDaCasaAtual[0] ?? cursoDestinoAtual, casaAtual.id);
      return;
    }
    setQuizAberto(true);
  };

  const abrirQuizCurso = (marco: (typeof MARCOS_CURSO)[number], casaId: number | null = null) => {
    setCursoAtivo(marco);
    setCasaCursoAtiva(casaId);
    setCursoConcluido(false);
    setStatusCasaConcluida("neutro");
    setIndicePerguntaCurso(0);
    setOrdemPerguntasCurso(embaralharPerguntas(perguntasDoCurso(marco.courseSlug).length));
    setTempoCurso(TEMPO_MAXIMO_CURSO);
    setFeedbackCurso(null);
    setPlacarCurso({ certas: 0, erradas: 0 });
  };

  const fecharQuizCurso = () => {
    setCursoAtivo(null);
    setCasaCursoAtiva(null);
    setCursoConcluido(false);
    setFeedbackCurso(null);
  };

  const finalizarCasaCurso = (status: StatusCasa) => {
    if (casaCursoAtiva === null) return;
    const casaFinalizada = listaQuadradinhos[casaCursoAtiva - 1];
    setHistoricoCasas((prev) => ({ ...prev, [casaCursoAtiva]: status }));
    coletarSeedCoinSeHouver(casaFinalizada);
    liberarCursosDaCasa(casaCursoAtiva);
    setPassoAtual((prev) => Math.min(listaQuadradinhos.length, prev + 1));
    fecharQuizCurso();
  };

  const responderPerguntaCurso = (opcaoEscolhida: number) => {
    if (!cursoAtivo || feedbackCurso || cursoConcluido) return;

    const acertou = opcaoEscolhida === perguntaCursoAtual.correta;
    const proximoPlacar = {
      certas: placarCurso.certas + (acertou ? 1 : 0),
      erradas: placarCurso.erradas + (acertou ? 0 : 1)
    };
    const proximaPergunta = indicePerguntaCurso + 1;
    const concluiuCasa = casaCursoAtiva !== null && proximaPergunta >= PERGUNTAS_POR_CASA;
    const statusFinal = proximoPlacar.certas >= proximoPlacar.erradas ? "correto" : "errado";

    setFeedbackCurso(acertou ? "correto" : "errado");
    setPlacarCurso(proximoPlacar);

    window.setTimeout(() => {
      setFeedbackCurso(null);
      if (concluiuCasa) {
        setCursoConcluido(true);
        setStatusCasaConcluida(statusFinal);
        return;
      }
      setTempoCurso(TEMPO_MAXIMO_CURSO);
      setIndicePerguntaCurso((indice) => {
        if ((indice + 1) % perguntasDoCursoAtivo.length === 0) {
          setOrdemPerguntasCurso(embaralharPerguntas(perguntasDoCursoAtivo.length));
        }
        return indice + 1;
      });
    }, 750);
  };

  return (
    <div className="min-h-screen bg-[#07110b] px-3 py-4 text-white sm:px-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-900/60 bg-[#0c1710]/95 px-4 py-3 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-500 text-[#06100a]">
              <Map size={22} aria-hidden />
            </span>
            <div>
              <h1 className="text-lg font-black tracking-normal text-emerald-50">Estrada do Conhecimento Cannabico</h1>
              <p className="text-xs text-emerald-100/70">Clique apenas na casa brilhante, responda e avance pela trilha.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
            <span className="rounded-md border border-emerald-800 bg-emerald-950/70 px-3 py-2 text-emerald-100">
              Progresso {passoAtual} / {TOTAL_CASAS}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-yellow-700/70 bg-yellow-950/40 px-3 py-2 text-yellow-100">
              <Sprout size={15} aria-hidden /> SeedCoin {seedCoinsColetadas.length}
            </span>
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 transition hover:bg-zinc-800"
            >
              <RotateCcw size={15} aria-hidden /> Reiniciar
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-lg border border-emerald-900/55 bg-[#10170f] shadow-2xl">
          <div className="relative aspect-[16/9] min-h-[460px] w-full overflow-hidden">
            {usarFallbackMapa ? (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(36,90,55,.62),transparent_32%),radial-gradient(circle_at_72%_20%,rgba(81,60,31,.62),transparent_25%),linear-gradient(135deg,#183823,#26391f_46%,#122418)]" />
            ) : (
              <img
                src={mapaUrl}
                alt="Mapa CultivoSim"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                draggable={false}
                onError={() => setUsarFallbackMapa(true)}
              />
            )}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.04),transparent_50%),linear-gradient(to_bottom,rgba(4,8,5,.08),rgba(4,8,5,.42))]" />

            {MARCOS_CURSO.map((marco) => {
              const cursoLiberado = cursosLiberados.includes(marco.nome);

              return (
                <button
                  type="button"
                  key={marco.nome}
                  disabled={!cursoLiberado}
                  aria-label={
                    cursoLiberado
                      ? `Abrir quiz do curso ${marco.nome}`
                      : `Curso ${marco.nome} bloqueado. Chegue pela trilha para liberar o desafio.`
                  }
                  title={
                    cursoLiberado
                      ? `Abrir quiz do curso ${marco.nome}`
                      : `Bloqueado: chegue pela trilha para liberar o desafio.`
                  }
                  onClick={() => abrirQuizCurso(marco)}
                  className={cn(
                    "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200",
                    cursoLiberado
                      ? "cursor-pointer border-emerald-100/70 bg-emerald-300/10 shadow-[0_0_34px_rgba(16,185,129,.62)] hover:bg-emerald-200/15"
                      : "cursor-not-allowed border-zinc-200/10 bg-zinc-950/20 opacity-45 grayscale shadow-[0_0_16px_rgba(0,0,0,.55)]"
                  )}
                  style={{
                    left: `${marco.x}%`,
                    top: `${marco.y}%`,
                    width: `${marco.raio * 2}%`,
                    height: `${marco.raio * 2}%`
                  }}
                >
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full rounded-md border px-1.5 py-0.5 text-[9px] font-semibold shadow-lg",
                      cursoLiberado
                        ? "border-emerald-700 bg-zinc-950/90 text-emerald-50"
                        : "border-zinc-800 bg-zinc-950/80 text-zinc-400"
                    )}
                  >
                    {marco.nome}
                  </span>
                </button>
              );
            })}

            {listaQuadradinhos.map((casa) => {
              const ehCasaAtual = casa.id === passoAtual;
              const statusDaCasa = historicoCasas[casa.id] || "neutro";
              const seedCoinColetada = seedCoinsColetadas.includes(casa.id);

              return (
                <button
                  key={casa.id}
                  type="button"
                  disabled={!ehCasaAtual}
                  aria-label={`Casa ${casa.id}${casa.nome ? `, ${casa.nome}` : ""}`}
                  onClick={abrirQuizDaCasaAtual}
                  onPointerDown={() => {
                    if (ehCasaAtual) abrirQuizDaCasaAtual();
                  }}
                  className={cn(
                    "absolute z-[18] grid place-items-center rounded-md border px-1 text-[9px] font-black leading-none transition duration-200",
                    "[-webkit-transform:translate(-50%,-50%)] [transform:translate(-50%,-50%)]",
                    statusDaCasa === "neutro" && "border-white/10 bg-zinc-950/78 text-white/90 opacity-100 shadow-[0_2px_8px_rgba(0,0,0,.65)]",
                    statusDaCasa === "correto" && "border-blue-100 bg-blue-500/75 text-white opacity-100 shadow-[0_0_22px_7px_rgba(59,130,246,.85)]",
                    statusDaCasa === "errado" && "border-red-100 bg-red-500/75 text-white opacity-100 shadow-[0_0_22px_7px_rgba(220,38,38,.85)]",
                    ehCasaAtual &&
                      "z-[30] scale-125 cursor-pointer border-white bg-emerald-400 text-emerald-950 opacity-100 shadow-[0_0_30px_10px_rgba(16,185,129,.95)] animate-pulse",
                    !ehCasaAtual && "cursor-not-allowed"
                  )}
                  style={{
                    left: `${casa.x}%`,
                    top: `${casa.y}%`,
                    width: "1.55rem",
                    height: "1.12rem"
                  }}
                >
                  {casa.temSeedCoin && !seedCoinColetada ? (
                    <span className="absolute -top-2 h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_7px_rgba(254,240,138,.9)]" />
                  ) : null}

                  {ehCasaAtual ? (
                    <span className="absolute -top-7 grid h-6 w-6 place-items-center rounded-full border border-white/70 bg-emerald-500 text-[10px] font-black text-emerald-950 shadow-lg">
                      EU
                    </span>
                  ) : null}

                  <span className="pointer-events-none">{ehCasaAtual ? "EU" : casa.nome ?? casa.id}</span>

                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-900/50 bg-[#07110b]/92 px-4 py-3 text-xs text-emerald-100/75">
            <span className="inline-flex items-center gap-2">
              <Lock size={14} aria-hidden /> So a casa atual fica clicavel. No caminho, o quiz segue o curso de destino; na chegada, vale o relogio.
            </span>
            <span>{terminou ? "Jornada concluida." : "Azul indica acerto; vermelho indica erro. O brilho marca o historico da trilha."}</span>
          </div>
        </section>

        {quizAberto ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-3">
            <div className="w-full max-w-2xl rounded-lg border border-emerald-800 bg-[#0d1710] p-5 shadow-2xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Casa {passoAtual} - rumo a {cursoDestinoAtual.nome}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-emerald-50">{perguntaAtual.pergunta}</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/75">{perguntaAtual.apoio}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuizAberto(false)}
                  className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200 transition hover:bg-zinc-800"
                >
                  Fechar
                </button>
              </div>

              <div className="grid gap-2">
                {perguntaAtual.opcoes.map((opcao, index) => (
                  <button
                    key={opcao}
                    type="button"
                    disabled={feedback !== null}
                    onClick={() => responderQuiz(index)}
                    className="flex items-center gap-3 rounded-md border border-emerald-900/70 bg-emerald-950/25 px-4 py-3 text-left text-sm text-emerald-50 transition hover:border-emerald-400 hover:bg-emerald-900/40 disabled:cursor-wait disabled:opacity-80"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-500/60 text-xs font-black">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{opcao}</span>
                  </button>
                ))}
              </div>

              {feedback ? (
                <div
                  className={cn(
                    "mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold",
                    feedback === "correto"
                      ? "border-blue-500/70 bg-blue-950/50 text-blue-100"
                      : "border-red-500/70 bg-red-950/50 text-red-100"
                  )}
                >
                  {feedback === "correto" ? <CheckCircle2 size={18} aria-hidden /> : <XCircle size={18} aria-hidden />}
                  {feedback === "correto" ? "Resposta certa. A casa ficou azul e o aluno segue rumo ao curso." : "Resposta errada. A casa ficou vermelha, mas o aluno continua a jornada."}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {cursoAtivo ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-3">
            <div className="w-full max-w-2xl rounded-lg border border-emerald-800 bg-[#0d1710] p-5 shadow-2xl">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Desafio contra o relogio - {cursoAtivo.nome}
                  </p>
                  {cursoConcluido ? (
                    <>
                      <h2 className="mt-1 text-xl font-black text-emerald-50">Casa finalizada</h2>
                      <p className="mt-2 text-sm leading-6 text-emerald-100/75">
                        Resultado: {placarCurso.certas} certas e {placarCurso.erradas} erradas. Ao voltar para o mapa, o aluno segue para a proxima posicao.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-1 text-xl font-black text-emerald-50">{perguntaCursoAtual.pergunta}</h2>
                      <p className="mt-2 text-sm leading-6 text-emerald-100/75">{perguntaCursoAtual.apoio}</p>
                    </>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {!cursoConcluido ? (
                    <div
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm font-black",
                        tempoCurso <= 10
                          ? "border-red-500/80 bg-red-950/70 text-red-100"
                          : "border-yellow-600/70 bg-yellow-950/50 text-yellow-100"
                      )}
                    >
                      {tempoCurso}s
                    </div>
                  ) : null}
                  {casaCursoAtiva && !cursoConcluido ? (
                    <span className="rounded-md border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400">
                      finalize para sair
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={casaCursoAtiva ? () => finalizarCasaCurso(statusCasaConcluida) : fecharQuizCurso}
                      className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200 transition hover:bg-zinc-800"
                    >
                      {casaCursoAtiva ? "Voltar ao mapa" : "Fechar"}
                    </button>
                  )}
                </div>
              </div>

              {!cursoConcluido ? (
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                  <div
                    className={cn("h-full transition-all duration-1000", tempoCurso <= 10 ? "bg-red-500" : "bg-yellow-400")}
                    style={{ width: `${(tempoCurso / TEMPO_MAXIMO_CURSO) * 100}%` }}
                  />
                </div>
              ) : null}

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-100/70">
                <span>
                  Pergunta {casaCursoAtiva ? Math.min(indicePerguntaCurso + 1, PERGUNTAS_POR_CASA) : indicePerguntaCurso + 1}
                  {casaCursoAtiva ? ` de ${PERGUNTAS_POR_CASA}` : ""}
                </span>
                <span>
                  Certas {placarCurso.certas} - Erradas {placarCurso.erradas}
                </span>
              </div>

              {cursoConcluido ? (
                <div
                  className={cn(
                    "rounded-md border px-4 py-3 text-sm font-bold",
                    statusCasaConcluida === "correto"
                      ? "border-blue-500/70 bg-blue-950/50 text-blue-100"
                      : "border-red-500/70 bg-red-950/50 text-red-100"
                  )}
                >
                  A casa sera marcada em {statusCasaConcluida === "correto" ? "azul" : "vermelho"} no mapa.
                </div>
              ) : (
                <div className="grid gap-2">
                  {perguntaCursoAtual.opcoes.map((opcao, index) => (
                    <button
                      key={`${cursoAtivo.courseSlug}-${indicePerguntaCurso}-${opcao}`}
                      type="button"
                      disabled={feedbackCurso !== null}
                      onClick={() => responderPerguntaCurso(index)}
                      className="flex items-center gap-3 rounded-md border border-emerald-900/70 bg-emerald-950/25 px-4 py-3 text-left text-sm text-emerald-50 transition hover:border-emerald-400 hover:bg-emerald-900/40 disabled:cursor-wait disabled:opacity-80"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-500/60 text-xs font-black">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{opcao}</span>
                    </button>
                  ))}
                </div>
              )}

              {feedbackCurso ? (
                <div
                  className={cn(
                    "mt-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold",
                    feedbackCurso === "correto"
                      ? "border-blue-500/70 bg-blue-950/50 text-blue-100"
                      : "border-red-500/70 bg-red-950/50 text-red-100"
                  )}
                >
                  {feedbackCurso === "correto" ? <CheckCircle2 size={18} aria-hidden /> : <XCircle size={18} aria-hidden />}
                  {feedbackCurso === "correto" ? "Certa. Proxima pergunta em instantes." : "Errada ou tempo esgotado. Proxima pergunta em instantes."}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
