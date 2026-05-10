import type { LessonQuizItem } from "@/data/lessonContent/types";
import type { LessonMediaHints } from "@/data/lessonContent/types";

function q(
  question: string,
  correctIndex: 0 | 1 | 2 | 3,
  a: string,
  b: string,
  c: string,
  d: string
): LessonQuizItem {
  return { question, correctIndex, options: [a, b, c, d] as const };
}

const MEDIA_STANDARD: LessonMediaHints = {
  needsVideo: true,
  needsImage: true,
  needsInfographic: true,
  needsSupportMaterial: true
};

const MEDIA_INTRO: LessonMediaHints = {
  needsVideo: true,
  needsImage: false,
  needsInfographic: true,
  needsSupportMaterial: true
};

/** Parágrafos didáticos — sem Markdown (o painel não interpreta ## ou negrito). */
export type Cannabis101LessonBody = {
  introduction: string;
  body: string;
  objectives: readonly string[];
  closingSummary: string;
  quiz: readonly LessonQuizItem[];
  professorNotes: string;
  media: LessonMediaHints;
};

function linkClosing(officialLabel: string): string {
  return `Textos longos, vídeos institucionais e avaliações com validade escolar ficam na ${officialLabel}. Aqui priorizamos clareza e ritmo; use Materiais quando quiser aprofundar com o arquivo oficial THCProce.`;
}

export const CANNABIS101_LESSON_BODIES: Record<string, Cannabis101LessonBody> = {
  "c101-l01-boas-vindas": {
    introduction:
      "Seja bem-vindo ou bem-vinda ao Cannabis 101 — um espaço de estudo calmo para quem quer entender a planta, o corpo e o contexto social sem ruído de internet. Não precisa de experiência prévia: vamos construir vocabulário e confiança passo a passo.",
    body: [
      "Este curso é pensado para iniciantes curiosos, profissionais de áreas vizinhas e qualquer pessoa que prefira aprender com linguagem direta, acolhimento e responsabilidade. O objetivo é organizar ideias — não substituir conversas com médicos, advogados ou outros especialistas quando o seu caso pedir apoio personalizado.",
      "Ao longo das onze aulas você vai encontrar conceitos sobre botânica básica, compostos da planta, sistema endocanabinoide, formas de consumo, redução de danos e um panorama legal em alto nível sobre Brasil e Estados Unidos. Repetimos com transparência: isto é educação geral, não consultório clínico nem consultoria jurídica.",
      "Sugerimos que avance uma aula de cada vez, faça o pequeno quiz ao final e anote dúvidas para trazer à comunidade ou à equipa pedagógica dentro das regras da escola. Respeite o seu ritmo: compreender bem o básico vale mais do que correr a lista.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Reconhecer o propósito do Cannabis 101 e o perfil de estudante a quem se dirige.",
      "Distinguir conteúdo educativo do campus do arquivo formal na sala oficial THCProce.",
      "Comprometer-se com um estudo responsável: perguntar, pausar e rever quando algo não ficar claro."
    ],
    closingSummary:
      "Você já sabe o tom e o alcance desta trilha. Reflexão rápida: escreva uma frase sobre o que espera aprender sem rodeios — e outra sobre o que promete não fazer (por exemplo, automedicação por conta própria ou compartilhar produtos com menores). No quiz, fixamos expectativas comuns.",
    quiz: [
      q(
        "Qual é a função principal do Cannabis 101 neste campus?",
        0,
        "Oferecer uma introdução educativa, responsável e em português sobre conceitos básicos",
        "Substituir acompanhamento médico prescrito",
        "Emitir licenças de cultivo em qualquer país",
        "Garantir efeitos terapêuticos para qualquer condição de saúde"
      ),
      q(
        "Sobre a relação entre este curso e a sala oficial THCProce, o mais correto é:",
        1,
        "São a mesma coisa e substituem-se mutuamente",
        "O campus prioriza leitura fluida; a sala oficial concentra materiais formais e certificação quando existirem",
        "A sala oficial só serve para vídeos de entretenimento",
        "Este curso dispensa totalmente o Moodle ou plataforma da escola"
      ),
      q(
        "Qual atitude alinha melhor com o espírito desta formação?",
        3,
        "Copiar doses de amigos sem contexto",
        "Tratar artigos de blog como verdade absoluta",
        "Esconder informação de profissionais de saúde deliberadamente",
        "Estudar com curiosidade, cuidado com leis locais e respeito pelo próprio corpo"
      )
    ],
    professorNotes:
      "Acolha perguntas sobre expectativas; reforce que nenhuma aula promete cura nem orienta condutas ilegais. Indique canais oficiais da escola para dúvidas administrativas.",
    media: MEDIA_INTRO
  },

  "c101-l02-o-que-e-cannabis": {
    introduction:
      "Cannabis é um nome de planta — e também um conjunto de tradições, debates políticos e ciência. Nesta aula consolidamos uma definição simples e útil para tudo o que vem depois.",
    body: [
      "Em termos científicos, costuma falar-se da espécie Cannabis sativa L. (com variedades cultivadas ao longo do tempo). A planta produz flores ricas em óleos resinóssos onde se concentram canabinoides, terpenos e outros compostos. O cultivo, o manejo genético e as condições de colheita influenciam o perfil químico — por isso duas amostras com o mesmo nome popular podem ser diferentes em laboratório.",
      "Historicamente, humanos usaram fibra, semente, papel, medicamentos e, em várias culturas, a flor como recurso medicinal ou recreativo. Hoje coexistem mercados legais regulados, programas clínicos e realidades onde a planta continua proibida para fins não autorizados. Conhecer essa diversidade ajuda a evitar generalizações.",
      "Nenhuma descrição educativa substitui regras do seu país, estado ou município. Use esta aula como base conceptual; para decisões que envolvam lei ou saúde, procure fontes oficiais e profissionais habilitados.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Nomear a planta em linguagem científica e popular sem confundir espécie com produto acabado.",
      "Relacionar genes, ambiente de cultivo e perfil químico em nível introdutório.",
      "Reconhecer que contextos legais e culturais mudam conforme o lugar e o tempo."
    ],
    closingSummary:
      "A cannabis deixou de ser só “mito urbano” e passa a ser um mapa de conceitos. Reflexão: descreva com suas palavras a diferença entre falar da planta inteira e falar de um óleo ou de uma infusão pronta — isso evita confusão nas próximas aulas.",
    quiz: [
      q(
        "Cannabis sativa L. refere-se principalmente a:",
        0,
        "Uma planta da qual se estudam fibras, sementes e compostos presentes nas flores",
        "Um medicamento universal para qualquer diagnóstico",
        "Um tipo de bebida alcoólica",
        "Uma substância sintética criada só em laboratório farmacêutico"
      ),
      q(
        "Por que duas flores vendidas com nomes parecidos podem ter efeitos diferentes?",
        2,
        "Porque o nome popular determina 100% da química",
        "Porque todas as flores têm sempre a mesma concentração",
        "Porque genética, cultivo, colheita e pós-colheita alteram o perfil de canabinoides e terpenos",
        "Porque o efeito depende apenas da cor da embalagem"
      ),
      q(
        "Qual afirmação é mais prudente neste curso introdutório?",
        3,
        "A planta é legal em todo o mundo da mesma forma",
        "Ciência e lei são sempre idênticas em qualquer país",
        "Blogs anónimos substituem reguladores e universidades",
        "Leis e políticas variam; confirme sempre fontes oficiais para o seu contexto"
      )
    ],
    professorNotes:
      "Evite debates políticos infindáveis; mantenha foco em botânica básica e neutralidade. Traga um espécime ou imagem licenciada se houver demonstração ao vivo.",
    media: MEDIA_STANDARD
  },

  "c101-l03-canhamo-maconha-medicinal": {
    introduction:
      "As palavras “cânhamo”, “maconha” e “cannabis medicinal” aparecem em notícias e conversas do dia a dia — muitas vezes misturadas. Aqui organizamos diferenças úteis sem julgar escolhas pessoais.",
    body: [
      "Cânhamo industrial costuma designar cultivares com teores muito baixos de THC, orientados a fibra, sementes alimentares ou extração de CBD para cadeias legais específicas. Maconha, na linguagem cotidiana brasileira, muitas vezes refere-se à flor rica em THC consumida informalmente — termo carregado politicamente, mas útil para entender debates públicos.",
      "Cannabis medicinal descreve usos orientados por profissionais, produtos autorizados ou programas clínicos conforme o país. Pode incluir flores secas, óleos padronizados ou formulados farmacêuticos. Ter receita ou autorização não significa que qualquer vizinho possa cultivar igual; cada jurisdição define regras.",
      "Evite estereótipos: pessoas que usam canabinoides terapêuticos navegam estigma; pessoas que pesquisam cânhamo não estão automaticamente “falando de droga ilegal”. Escolher vocabulário neutro ajuda a aprender com respeito.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Separar, em linhas gerais, cânhamo de baixo THC de flores ricas em THC na conversa pública.",
      "Definir cannabis medicinal como categoria regulada e acompanhada — não um rótulo de marketing vazio.",
      "Identificar quando é preciso confirmar legislação local em vez de confiar só em títulos de notícia."
    ],
    closingSummary:
      "Você já distingue três mundos que às vezes se confundem no mesmo parágrafo de jornal. Reflexão: imagine explicar a um familiar a diferença entre “CBD de loja”, “óleo prescrito” e “flor informal”, em três frases curtas, sem incentivar nada ilegal.",
    quiz: [
      q(
        "Cânhamo industrial, neste contexto educativo, associa-se sobretudo a:",
        1,
        "Flores com teores altos de THC sem qualquer regulação",
        "Cultivares e usos legais como fibra, semente ou extrações de baixo THC conforme a lei aplicável",
        "Apenas plantas ornamentais de jardim",
        "Qualquer produto vendido em redes sociais"
      ),
      q(
        "Cannabis medicinal, em termos gerais, implica:",
        0,
        "Produtos ou estratégias terapêuticas inseridas em quadros legais e frequentemente com acompanhamento profissional",
        "Automedicação livre sem qualquer orientação",
        "Substituir qualquer outro tratamento sem conversa médica",
        "Legalização imediata de todo o mercado informal"
      ),
      q(
        "Qual frase demonstra cuidado com fontes?",
        3,
        "“Vi num meme, logo é verdade.”",
        "“Se está na internet é oficial.”",
        "“Meu grupo de chat substitui Anvisa e tribunais.”",
        "“Vou confirmar em site de governo e com profissional habilitado.”"
      )
    ],
    professorNotes:
      "Sensibilize para estigma de pacientes; não polemize sobre consumo adulto além do âmbito educativo. Reforce que nomes populares mudam entre países.",
    media: MEDIA_STANDARD
  },

  "c101-l04-canabinoides": {
    introduction:
      "THC, CBD, CBG e CBN são nomes que aparecem em rótulos, artigos e conversas sobre cannabis. Entender o que cada um sugere quimicamente ajuda a ler informação com mais calma — sem esperar milagres.",
    body: [
      "Canabinoides são um grupo de compostos; o mais conhecido no debate público é o delta-9-tetrahidrocanabinol (THC), associado a efeitos psicoativos variáveis conforme dose, via de administração e pessoa. O canabidiol (CBD) não provoca “barato” da mesma forma que THC em doses usuais, mas interage com medicamentos e precisa de contexto clínico quando usado como terapêutico.",
      "CBG é mencionado como “canabinoide menor” na planta em muitas genéticas, foco de investigação sobre vários alvos biológicos. CBN surge frequentemente associado à degradação oxidativa do THC — o que lembra que tempo, luz e armazenamento alteram a química da flor. Nenhum destes nomes deve ser lido como promessa de cura.",
      "Laboratórios medem miligramas e percentagens; rótulos sérios mostram lotes e ensaios. Desconfie de produtos sem transparência ou de influencers que garantem resultados clínicos sem evidência verificável.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Associar THC e CBD a ideias gerais de efeito e cautela, sem enumerar “receitas mágicas”.",
      "Reconhecer CBG e CBN como compostos discutidos em ciência e mercado, dependentes de contexto.",
      "Valorizar laudos e padronização frente a marketing vago."
    ],
    closingSummary:
      "Os rótulos começam a fazer mais sentido. Reflexão: olhe um produto hipotético com “30% THC” e pergunte — o que falta saber (lote, via, histórico pessoal) antes de tirar conclusões fortes?",
    quiz: [
      q(
        "Sobre THC em contexto educativo, qual afirmação é mais equilibrada?",
        2,
        "THC não interage com o organismo humano",
        "THC tem sempre a mesma intensidade para todas as pessoas em qualquer dose",
        "THC pode ter efeitos psicoativos variáveis conforme dose, via de administração e biologia individual",
        "THC substitui qualquer terapia psicológica sem supervisão"
      ),
      q(
        "CBD é descrito frequentemente como:",
        1,
        "Composto que nos textos populares provoca os mesmos efeitos de doses altas de THC",
        "Canabinoide estudado em vários contextos, mas que também pode interagir com medicamentos",
        "Substância sem qualquer efeito fisiológico",
        "Elemento que torna legítimo conduzir veículos sempre, em qualquer quantidade"
      ),
      q(
        "CBN é muitas vezes mencionado porque:",
        0,
        "Pode aumentar quando o THC envelhece ou se oxida em certas condições de armazenamento",
        "É sempre adicionado artificialmente a todas as flores frescas",
        "Não existe na planta",
        "É a sigla de um programa governamental único em todo o planeta"
      )
    ],
    professorNotes:
      "Não compare potency entre países sem explicar diferenças de medição. Evite claims terapêuticos; cite revisões ou portais educativos neutros.",
    media: MEDIA_STANDARD
  },

  "c101-l05-terpenos": {
    introduction:
      "Terpenos são moléculas de aroma presentes em frutas, ervas e flores — inclusive na cannabis. Eles ajudam a explicar cheiros distintos e integram conversas sobre perfil sensorial e ciência sem esoterismo.",
    body: [
      "Cada cultivar pode apresentar combinações de terpenos como mirceno, limoneno, pineno, linalool e outros — nomes que soam a laboratório mas descrevem cheiros conhecidos (terra, cítrico, pinho, floral). O olfato influencia a experiência subjetiva, embora “o aroma” não determine sozinho efeitos clínicos.",
      "Técnicas de análise identificam terpenos voláteis; no entanto, a percepção humana varia. Por isso fichas técnicas usam gráficos e não promessas subjetivas. Armazenar flor com umidade equilibrada e longe de calor excessivo ajuda a preservar terpenos.",
      "Cuidado com narrativas que dizem “este terpeno cura X”: são simplificações perigosas. Prefira linguagem como “área de investigação” ou “discussão preliminar na literatura”.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Definir terpenos como responsáveis relevantes pelo perfil aromático da planta.",
      "Relacionar conservação e pós-colheita com perda ou manutenção de voláteis.",
      "Rejeitar claims de cura baseadas só no nome de um terpeno."
    ],
    closingSummary:
      "Cheiro deixa de ser mistério total e passa a ser parte da biologia. Reflexão: descreva dois aromas que você já associou a plantas ou alimentos e imagine como um laboratório os classificaria — treino de humildade sensorial.",
    quiz: [
      q(
        "Terpenos, nesta aula, aparecem principalmente como:",
        3,
        "Proteínas estruturais das folhas",
        "Substâncias responsáveis só por correr mal em laboratório",
        "Elementos ilegais por definição",
        "Compostos voláteis que contribuem para aroma e perfil sensorial"
      ),
      q(
        "Por que armazenamento inadequado importa para terpenos?",
        1,
        "Porque terpenos adoram calor extremo e humidade descontrolada",
        "Porque calor, luz e oxidação podem degradar voláteis e alterar cheiro e frescura percebida",
        "Porque terpenos não mudam nunca após a colheita",
        "Porque a embalagem nunca influencia o resultado"
      ),
      q(
        "Qual postura é crítica e responsável?",
        0,
        "Tratar promessas de cura ligadas a terpenos isolados com ceticismo e pedir evidência",
        "Aceitar qualquer poster colorido como prova científica",
        "Acreditar que nariz substitui laudo laboratorial em decisões médicas",
        "Assumir que toda cannabis tem o mesmo perfil porque cheira verde"
      )
    ],
    professorNotes:
      "Traga amostras de outros vegetais para exercício aromático paralelo. Desligue associações místicas exageradas.",
    media: MEDIA_INTRO
  },

  "c101-l06-sistema-endocanabinoide": {
    introduction:
      "O organismo humano possui um sistema chamado endocanabinoide: um conjunto de receptores e moléculas internas que ajuda a regular humor, apetite, sono, dor e outros processos — sem ser uma “máquina de chapar”. Vamos traduzir isso para uma analogia simples.",
    body: [
      "Imagine um sistema de mensagens internas que procura manter o corpo em equilíbrio (homeostasia). Os receptores CB1 e CB2 são como portas onde encaixam sinais — naturalmente produzidos pelo corpo ou introduzidos de fora em contextos específicos. Por isso canabinoides de planta podem interagir com esse sistema, mas também explicam por que há efeitos colaterais e interações.",
      "Pesquisas sérias continuam; nem tudo está fechado em livros definitivos. É normal encontrar perguntas em aberto em livros-texto e conferências. Reduza ansiedade de querer “entender tudo já”: o básico já evita mitos enormes.",
      "Linguagem corporal importa — literalmente. Durante exposição a canabinoides, algumas pessoas sentem taquicardia, tontura ou alteração de pressão; outras, sonolência. Isso reforça por que acompanhamento profissional importa em contexto medicinal, e por que autocuidado importa sempre.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Descrever o sistema endocanabinoide como rede reguladora — não como botão de “modo diversão”.",
      "Relacionar receptores com ideia de sinalização e interação com canabinoides.",
      "Reconhecer limitações do conhecimento público e importância de fontes científicas."
    ],
    closingSummary:
      "O corpo já tinha “orelhas” para essas mensagens antes de qualquer cultivar. Reflexão: liste duas funções do dia a dia (por exemplo, sono e apetite) e pense como equilíbrio — não excesso — poderia ser desejável.",
    quiz: [
      q(
        "O sistema endocanabinoide é melhor entendido como:",
        2,
        "Um aplicativo instalado só em quem consome cannabis",
        "Um músculo específico no joelho",
        "Uma rede de sinalização envolvendo receptores e moléculas que modulam funções corporais",
        "Um osso ligado ao nariz"
      ),
      q(
        "Receptores CB1 e CB2 aparecem nas explicações introdutórias porque:",
        0,
        "São pontos de ligação relevantes para sinais endógenos e canabinoides exógenos em estudos clássicos",
        "São sinônimos exatos de vitamina C",
        "Existem apenas em plantas",
        "Não têm papel em farmacologia"
      ),
      q(
        "Qual atitude acompanha melhor o nível de detalhe desta aula?",
        1,
        "Encerrar qualquer discussão médica com base só nela",
        "Usar o mapa básico para fazer perguntas melhores a profissionais de saúde",
        "Assumir que tudo já está provado sem espaço para investigação",
        "Ignorar interações medicamentosas porque “é natural”"
      )
    ],
    professorNotes:
      "Esquemas simples superam jargão. Não compare ECS a software pirateado — mantenha respeito ao público leigo.",
    media: { ...MEDIA_STANDARD, needsInfographic: true }
  },

  "c101-l07-usos-e-reducao-de-danos": {
    introduction:
      "Medicina, uso adulto regulamentado e mercados informais coexistem no planeta. Esta aula organiza vocabulário e princípios de redução de danos — sem glamourização e sem moralismo vazio.",
    body: [
      "Uso medicinal supervisionado envolve diagnóstico, acompanhamento, titulação e monitoramento de interações — quando permitido por lei. Automedicação improvisada pode cruzar com ansiolíticos, anticoagulantes ou outros fármacos com risco real.",
      "Uso adulto, onde legal, ainda exige regras claras: idade mínima, limites de posse, proibição de conduzir sob influência e responsabilidade com terceiros. Onde não é legal, o risco jurídico e social existe independentemente da opinião pessoal.",
      "Redução de danos inclui começar com doses baixas quando há orientação profissional, evitar misturas perigosas, não operar máquinas pesadas sob efeito, guardar produtos longe de crianças e animais e procurar ajuda em situações de dependência ou crise de saúde mental.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Diferenciar cuidados clínicos de escolhas informais sem apoio profissional.",
      "Listar pelo menos três práticas concretas de redução de danos.",
      "Reconhecer que legalidade e risco variam geograficamente."
    ],
    closingSummary:
      "Respeito ao contexto legal e ao corpo entram no mesmo pacote educativo. Reflexão: que situação você considera de “risco evitável” relacionada a cannabis — e que apoio procuraria se precisasse?",
    quiz: [
      q(
        "Redução de danos, nesta aula, inclui ideias como:",
        0,
        "Evitar conduzir ou operar equipamentos perigosos sob efeito psicoativo",
        "Incentivar uso compulsivo sem pausas",
        "Esconder problemas de saúde de médicos para sempre",
        "Misturar substâncias sem informação porque “todo mundo faz”"
      ),
      q(
        "Sobre uso medicinal responsável:",
        3,
        "Basta ler um fórum anônimo",
        "Substituir todos os medicamentos de uma vez sem orientação",
        "Comprar qualquer óleo e dobrar a dose se não sentir nada num dia",
        "Dialogar com prescritor sobre interações, objetivos terapêuticos e monitoramento"
      ),
      q(
        "Uso adulto regulamentado ainda implica:",
        2,
        "Ausência total de regras",
        "Permissão automática para vender a menores",
        "Leis locais sobre idade, quantidades e locais permitidos — quando existirem",
        "Isenção de qualquer consequência social"
      )
    ],
    professorNotes:
      "Disponibilize linhas de apoio locais se existirem. Não demonize usuários; foque comportamentos de risco moduláveis.",
    media: MEDIA_STANDARD
  },

  "c101-l08-formas-consumo": {
    introduction:
      "Inalar vapor, ingerir, aplicar topicamente ou usar preparações farmacêuticas muda tempo de início, duração e riscos percebidos. Vamos falar disso com linguagem responsável — sem tutoriais de produção clandestina.",
    body: [
      "Vaporização de flores aquecidas sem combustão completa pode reduzir alguns subprodutos da queima, mas não elimina todos os riscos respiratórios nem substitui avaliação médica quando há condição pulmonar. Fumar com combustão traz carcinogénios clássicos associados à fumaça — tema de saúde pública.",
      "Edibles e óleos ingeridos costumam demorar mais a surgir efeito comparado à inalação; erro comum é re-dosar cedo demais pensando que “não bateu”. Daí a máxima orientada clinicamente de paciência e planeamento — sempre com supervisão quando for terapia.",
      "Vias topicas discutidas na literatura nem sempre produzem efeitos sistémicos significativos; muitos produtos cosméticos exploram marketing. Pergunte sempre o que há de evidência e transparência de lote.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Contrastar início rápido versus tardio entre vias comuns em nível introdutório.",
      "Explicar erro de reforço de dose em comestíveis sem orientação.",
      "Associar combusão com maiores preocupações respiratórias genéricas."
    ],
    closingSummary:
      "A via de entrada muda a experiência — e alguns equívocos clássicos. Reflexão: por que “esperar mais tempo” pode ser mais seguro do que repetir dose em produto oral quando se está a aprender?",
    quiz: [
      q(
        "Em termos gerais educativos, inalação comparada a ingestão oral costuma:",
        1,
        "Ter início mais lento sempre",
        "Apresentar efeito subjetivo mais rápido, enquanto oral tende a demorar mais",
        "Ser igual em tempo e intensidade para todas as pessoas sempre",
        "Impedir qualquer efeito"
      ),
      q(
        "Sobre comestíveis e paciência:",
        2,
        "Deve-se sempre tomar segunda dose imediata se nada acontecer em cinco minutos",
        "Tempo não importa",
        "Efeito pode tardar; reforço precoce de dose sem orientação aumenta risco de desconforto",
        "Óleo ingerido age sempre em menos de um minuto"
      ),
      q(
        "Fumar material vegetal (combustão) levanta, em saúde pública:",
        3,
        "Zero problemas porque é natural",
        "Questões só estéticas de dedo amarelo",
        "Preocupações unicamente sociais",
        "Preocupações respiratórias associadas à fumaça — comparáveis em espírito a outras fumaças, sem minimizar"
      )
    ],
    professorNotes:
      "Não ensine fabrico caseiro de extratos potentes nesta fase. Reforce diferença entre educação e receita clandestina.",
    media: MEDIA_STANDARD
  },

  "c101-l09-legalidade-br-eua": {
    introduction:
      "Leis mudam, interpretações judiciais acompanham e plataformas de notícias nem sempre distinguem programas federais de regras estaduais. Aqui cabe um mapa mental, não parecer jurídico.",
    body: [
      "No Brasil, discussões incluem descriminalização, casos judiciais individuais, importação sob normas da Anvisa para alguns produtos prescritos e associações de pacientes em vários quadrantes — tudo em movimento enquanto escrevemos. Nada nesta linha substitui conferir texto legal atualizado ou conversar com advogado.",
      "Nos Estados Unidos, muitos estados regulam uso adulto ou medicinal, mas o quadro federal permanece tensão histórica em várias áreas. Cruzar fronteiras com produtos continua arriscado mesmo quando um estado vizinho parece permissivo.",
      "Para estudantes, o melhor hábito é anotar a data em que leu algo e procurar a fonte primária (diários oficiais, agências reguladoras). Campus THCProce pode oferecer pontes, mas quem assina contratos ou abre empresa precisa de assessoria profissional.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Reconhecer que Brasil e EUA têm camadas legais distintas e em evolução.",
      "Evitar conclusões definitivas baseadas só em títulos de redes sociais.",
      "Saber quando escalar dúvidas a profissional jurídico."
    ],
    closingSummary:
      "Dúvida honesta é sinal de maturidade jurídica. Reflexão: qual pergunta específica você faria a um advogado — e que documentos levaria para não perder tempo?",
    quiz: [
      q(
        "Sobre esta aula, qual aviso é central?",
        0,
        "É visão geral educativa, não consultoria jurídica pessoal",
        "Resume todas as leis planetárias em carácter definitivo",
        "Substitui inscrição em ordem dos advogados",
        "Garante isenção fiscal automática"
      ),
      q(
        "Nos EUA, frequentemente:",
        1,
        "Uma única frase de Twitter explica todo o sistema",
        "Regras estaduais podem coexistir com tensões em nível federal conforme o tema",
        "Nada nunca é regulado em lado nenhum",
        "Leis internas de campus substituem leis federais sempre"
      ),
      q(
        "No Brasil, para estudante consciente:",
        3,
        "Basta ouvir um podcast e encerrar pesquisa",
        "Leis nunca mudam desde 1920",
        "Anvisa e tribunais são irrelevantes",
        "Convém acompanhar fontes oficiais porque o cenário pode mudar"
      )
    ],
    professorNotes:
      "Atualize slides com datas quando usar em sala ao vivo. Não simule parecer jurídico; indique serviços de assessoria da instituição se existirem.",
    media: { ...MEDIA_STANDARD, needsInfographic: true }
  },

  "c101-l10-seguranca-limites": {
    introduction:
      "Antes de seguir para trilhas avançadas, combinamos o contrato pedagógico: o que prometemos entregar, o que fica fora, e como manter você e quem está ao seu redor mais seguros.",
    body: [
      "Este curso não promete curar doenças, não prescreve doses para casos individuais e não orienta evasão de fiscalização. O que fazemos é linguagem acessível, referências para aprofundar e quizzes para reflexão. Crítica saudável a fontes faz parte do aprendizado.",
      "Segurança inclui menores: não compartilhe produtos nem incentive consumo com adolescentes. Inclui armazenamento responsável e comunicação franca com profissionais de saúde quando necessário. Inclui cuidado psíquico — substâncias psicoactivas podem interagir mal com quadros de ansiedade ou psicose em histórias sensíveis.",
      "Se algo neste material despertar desconforto emocional intenso, pause, respire procurar apoio — colegas de confiança, serviços da escola ou linhas de emergência locais conforme gravidade.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Listar limites explícitos do Cannabis 101 em três frases.",
      "Identificar práticas que protegem menores e espaços escolares.",
      "Reconhecer sinais de que é hora de pedir ajuda profissional de saúde."
    ],
    closingSummary:
      "Clareza contratual deixa estudo mais leve. Reflexão: escreva para si mesma ou si mesmo o que você considera linha ética pessoal ao conversar sobre cannabis em redes sociais depois deste curso.",
    quiz: [
      q(
        "O Cannabis 101 compromete-se explicitamente a:",
        2,
        "Substituir tratamentos médicos prescritos sem discussão",
        "Fornecer liminar judicial",
        "Educar com responsabilidade dentro de limites claros, sem prometer curas individuais",
        "Garantir rendimento financeiro em mercados ilegais"
      ),
      q(
        "Sobre menores:",
        0,
        "É inaceitável promover ou facilitar acesso ao consumo em adolescentes dentro do espírito desta formação",
        "Menos importa só para estatísticas distantes",
        "Redes sociais substituem responsabilidade parental sempre",
        "Campus incentiva brincadeiras com produtos potentes em festas escolares"
      ),
      q(
        "Se a leitura detona ansiedade forte:",
        3,
        "Ignore completamente",
        "Aumente dose de qualquer substância para «passar»",
        "Isole-se sem contar a ninguém para sempre",
        "Pause o estudo e procure apoio de saúde ou serviço de acolhimento conforme gravidade"
      )
    ],
    professorNotes:
      "Tenha folha com contactos de bem-estar estudantil. Reforce zero tolerância a assédio ou pressão no grupo.",
    media: MEDIA_INTRO
  },

  "c101-l11-proximas-trilhas": {
    introduction:
      "Você chegou ao fecho do 101 com mapa mental mais organizado. As portas seguintes no campus THCProce aprofundam cultivo, extrações de óleo, solventless, medicina canabinoide, legislação e mais — sempre com pré-requisito de respeito e segurança.",
    body: [
      "Trilhas de cultivo exigem disciplines de biologia aplicada, segurança elétrica e atenção jurídica local — não são “hobby steril” sem consequências. Extrações envolvendo solventes pertencem a laboratórios adequados; solventless também pede higiene e boas práticas para não desperdiçar material ou criar riscos.",
      "Medicina canabinoide no campus avança sobre interações, documentação clínica e ética de comunicação — não sobre pirotecnia de marketing. Legislação aprofunda casos e leitura de normas com orientação de especialistas.",
      "Volte a este 101 quando precisar realinhar bases com amigos ou colegas novos. Ensinar com humildade multiplica o cuidado coletivo.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Escolher pelo menos uma trilha alinhada ao seu interesse profissional ou pessoal responsável.",
      "Reconhecer que cada módulo avançado presume maturidade e segurança.",
      "Saber onde retomar o 101 como referência futura."
    ],
    closingSummary:
      "O primeiro ciclo fecha aqui — a jornada continua nas salas vizinhas. Reflexão: qual trilha você explorará nas próximas semanas e qual pergunta ainda leva consigo para pesquisar com método?",
    quiz: [
      q(
        "Qual combinação resume a transição sugerida?",
        0,
        "Fundamentos sólidos antes de mergulhar em cultivo, extração ou medicina avançada",
        "Ignorar segurança porque já leu um post",
        "Saltar diretamente para solventes sem formação",
        "Abandonar curiosidade científica"
      ),
      q(
        "Extrações solventless ainda exigem:",
        1,
        "Zero higiene",
        "Boas práticas de limpeza, temperatura e armazenamento",
        "Apenas sorte",
        "Capacidade de ignorar regulamentação laboral"
      ),
      q(
        "Medicina canabinoide avançada deve:",
        3,
        "Substituir ética profissional",
        "Basear-se só em rumores",
        "Prometer cura para anunciantes",
        "Respeitar limites de prescritores e evidência clínica em construção"
      )
    ],
    professorNotes:
      "Apresente roadmap visual do campus. Convide alumni a partilhar caminho sem autopromoção irresponsável.",
    media: MEDIA_INTRO
  }
};
