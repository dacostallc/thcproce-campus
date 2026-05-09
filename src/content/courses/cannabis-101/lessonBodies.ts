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
  return `PDF caprichado, vídeo longo, entrega com peso na formação? Isso vive na ${officialLabel}, onde a equipa THCProce deixa tudo assinado e organizado. Aqui no campus a gente vai direto ao ponto — quando bater vontade de mergulhar fundo, é só abrir o link em Materiais.`;
}

export const CANNABIS101_LESSON_BODIES: Record<string, Cannabis101LessonBody> = {
  "c101-intro-p1": {
    introduction:
      "Bem-vindo ao Cannabis 101 — a temporada em que a THCProce te coloca por dentro da planta, da cultura e do cultivo com respeito. Nesta abertura a gente te conta pra quem é esse rolê, como a trilha foi montada e como aproveitar cada episódio sem virar maratona maçante.",
    body: [
      "O 101 é pra quem tá começando agora ou pra quem já curte a planta há tempo mas quer organizar a cabeça: botânica que importa no dia a dia, variedades sem mitologia de Instagram, preparar o espaço com segurança, acompanhar o ciclo do começo ao fim, pós-colheita com capricho e um fecho que conecta com certificação quando fizer sentido pro teu caminho.",
      "Ao longo dos capítulos você vê texto direto, objetivos claros e, nos módulos certos, quiz levinho pra carimbar o que aprendeu — tipo checkpoint de game, só que o save é conhecimento de verdade.",
      "Tom da casa: acessível pra iniciante, mas sem tratar você como bot. Quando o tema aperta na técnica, a gente vai junto com calma.",
      "Transparência THCProce: isso é formação educativa — não substitui advogado, médico ou agrônomo quando você precisar de orientação fechada pro seu caso. Cultivo, posse e o que envolve lei no Brasil têm nuances e mudam; confirma em fonte oficial e com profissional habilitado.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Explicar com suas palavras o que é o Cannabis 101 e quem se identifica com essa trilha.",
      "Mapear os blocos grandes — intro, variedades, preparo, ciclo, manutenção, pós-colheita, fecho.",
      "Separar o que rola no campus (experiência, progressão) do que fica na sala oficial (arquivo pesado e certificação)."
    ],
    closingSummary:
      "Você já entrou no clima do 101. No próximo episódio: como usar o painel pra estudar com lógica — busca, XP e hora de pular pra sala oficial.",
    quiz: [],
    professorNotes:
      "Reforce que o curso é formação geral: convide o grupo a anotar dúvidas pro fórum, sem prometer milagre legal ou clínico na conversa.",
    media: MEDIA_INTRO
  },

  "c101-intro-p2": {
    introduction:
      "Agora o papo é interface: como surfar o painel da aula, marcar que você passou por ali (e ganhar aquele XP), e quando vale a pena abrir a sala oficial pra PDF maroto ou prova com nome na lista.",
    body: [
      "Segue a ordem do programa ao lado — é a narrativa que a turma THCProce desenhou. Lê o miolo, bate o olho nos objetivos, fecha com o recap e só então parte pro próximo episódio.",
      "O botão de marcar como vista é seu “check” no mapa: ajuda a manter ritmo e alimenta XP na conta logada. Oficial mesmo (entrega, nota que importa pro certificado) continua onde a escola registra — não confunde as duas coisas.",
      "Busca na lista salva vidas: digita “rega”, “flora”, “cura”… Os filtros mostram o que tá liberado, o que você já zerou ou o que o calendário ainda não soltou.",
      "Quer ir fundo? PDF longo, vídeo caprichado, roteiro completo — Materiais e Referências te empurram pra sala oficial. Aqui a prioridade é clareza e ritmo; lá é arquivo cheio.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Descrever o fluxo natural: ler, bater meta dos objetivos, quiz se tiver, marcar vista.",
      "Separar progresso “de quadro” no campus do que a coordenação exige na sala oficial.",
      "Usar busca e filtros pra achar tema de novo sem rolar a lista inteira."
    ],
    closingSummary:
      "Painel na mão, estudo fica menos estresse. Próximo bloco: lives, links e calendário — entrando no clima de comunidade.",
    quiz: [],
    professorNotes:
      "Mostre o painel ao vivo (busca, filtros, marcar vista). Dê 2 min pra cada pessoa achar um tema pelo índice — vira ritual de turma.",
    media: { ...MEDIA_INTRO, needsVideo: false }
  },

  "c101-live-resources": {
    introduction:
      "Hora de sincronizar com a hive: lives, onde bate papo com a galera, e aquele calendário que você não quer perder. É o capítulo ‘tamo junto’ da formação — presença importa tanto quanto o PDF.",
    body: [
      "Quando rolar transmissão ou encontro síncrono, número e link costumam aparecer na sala oficial e às vezes ganham aviso no campus ou e-mail da escola — fica de olho nos canais que a coordenação indicar.",
      "Chega cedo, testa fone, deixa pergunta objetiva anotada: pergunta boa vira conteúdo pra todo mundo, igual mesa redonda depois do show.",
      "Gravação e slide, quando liberarem, entram no repositório do curso — nem toda call vira VOD público, então segue o que a equipe comunicar sem ficar no ‘cadê o link?’.",
      "Perdeu ao vivo? Usa o roteiro gravado + fórum ou tutoria — mantém o respeito com as regras da comunidade, sem caos no grupo.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Achar onde calendário e links de live aparecem de verdade.",
      "Montar checklist básico antes de entrar na call (áudio, material, fuso).",
      "Saber onde catar gravação ou plano B quando não der pra estar online."
    ],
    closingSummary:
      "Agora você entra nas lives sem susto. Na sequência a gente mergulha na planta de verdade — botânica e ciclo de vida.",
    quiz: [],
    professorNotes:
      "Atualize com links reais do Moodle se tiver. Reforce netiqueta leve — todo mundo quer vibe boa na call.",
    media: { ...MEDIA_STANDARD, needsVideo: true }
  },

  "c101-cultivo-intro-p1": {
    introduction:
      "Pra cultivar com consciência, você precisa conhecer a protagonista: a planta. Partes, fases, o que muda entre vegetativo e flora — é o kit básico que evita confusão quando a gente falar de luz, rega e colheita lá na frente.",
    body: [
      "A Cannabis sativa L. é uma planta angiosperma dicotiledônea. Você trabalhará com raiz, caule, nós, entrenós, folhas, estípulas e inflorescências. Reconhecer essas estruturas ajuda a diagnosticar problemas e a escolher momento de poda ou colheita.",
      "No ciclo anual típico sob luz natural, a planta germina, desenvolve sistema radicular e folhas, cresce em vegetativo e, quando o regime lumínico indica, inicia floração. Em ambientes controlados, o cultivador reproduz esse ritmo ajustando fotoperíodo ou genética automática.",
      "Plantas dioicas produzem indivíduos femininos e masculinos; na produção de flores para inflorescência, prioriza-se geralmente material feminino estável para evitar polinização acidental.",
      "Documentação fotográfica simples (folhas, nós, brotos) acelera o aprendizado. Anote datas de mudança de fase: isso será útil ao calibrar rega e fertilização nas aulas seguintes.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Apontar raiz, caule, folha e flor num esquema ou foto.",
      "Explicar por cima (mas certo) vegetativo vs flora.",
      "Ligar mudança de luz ou genética automática com o momento em que a planta floresce."
    ],
    closingSummary:
      "Anatomia e ciclo na cabeça. Na próxima aula a conversa fica mais spicy: sexagem, fotoperíodo e o papo sério (mas honesto) sobre lei.",
    quiz: [],
    professorNotes:
      "Use um diagrama ou planta real em vídeo. Evite prometer identificação sexual 100% precoce sem contexto de genética e idade.",
    media: MEDIA_STANDARD
  },

  "c101-cultivo-intro-p2": {
    introduction:
      "Agora a conversa afunila: sinais que a planta dá antes da flora, como a luz manda no relógio dela, e um disclaimer THCProce — a gente ensina ciência e responsabilidade, não atalho pra liminar nem promessa vazia.",
    body: [
      "Em muitas genéticas fotoperiódicas, sinais sexuais surgem após mudança de regime lumínico ou desenvolvimento suficiente na pré-floração. Pré-flores masculinas e femininas diferem na morfologia dos primórdios: estudo com lupa ou microscópio barato reduz erro.",
      "Variedades de dias curtos respondem ao aumento do período escuro para iniciar floração; automáticas florescem após certo tempo de desenvolvimento independente do fotoperíodo, segundo o cruzamento utilizado.",
      "No Brasil, situações de cultivo medicinal autorizado seguem regras específicas e decisões judiciais ou registros que podem mudar. Este curso não orienta quantidade, local nem registro: direciona você a fontes oficiais e suporte jurídico quando necessário.",
      "Do ponto de vista técnico, plantas estressadas podem hermarfroditar. Fatores comuns incluem picos térmicos, irregularidade lumínica durante o escuro e manejo agressivo na floração.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Explicar em conversa de sofá a diferença entre fotoperiódica e automática.",
      "Listar três estresses clássicos que atrapalham a flora.",
      "Admitir com naturalidade: lei de verdade você confirma com profissional — a aula não é consultório nem fórum."
    ],
    closingSummary:
      "Sexagem, luz e responsabilidade no bolso. Bora pro quiz desse módulo antes de mergulhar em variedades.",
    quiz: [],
    professorNotes:
      "Se perguntarem sobre leis, indique veículos oficiais e equipe jurídica da escola. Mantenha foco em botânica e risco técnico.",
    media: MEDIA_STANDARD
  },

  "c101-cultivo-intro-quiz": {
    introduction:
      "Checkpoint do módulo: pergunta de múltipla escolha pra ver se o conteúdo pegou. Errar é normal — relê o trecho e vem de novo, estilo arcade.",
    body: [
      "Antes de responder, relembre: ciclo vegetativo versus reprodutivo, papéis morfológicos básicos e influência do fotoperíodo ou genética automática.",
      "Cada questão possui uma única resposta correta. Erros são parte do processo: volte ao trecho se necessário antes de avançar ao módulo sobre variedades.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Demonstrar compreensão do ciclo de vida e das fases principais.",
      "Aplicar conceitos de fotoperíodo e genética automática em situações exemplo.",
      "Reforçar distinção entre formação educativa e aconselhamento jurídico."
    ],
    closingSummary:
      "Módulo base fechado com chave. Próximo tema: morfologia, terpenos sem misticismo e como ler genética sem cair em papo furado.",
    quiz: [
      q(
        "Qual estrutura é primariamente responsável por absorver água e nutrientes solúveis no substrato?",
        1,
        "Folha palmatocomposta",
        "Sistema radicular",
        "Inflorescência apical",
        "Caule lenhoso primário"
      ),
      q(
        "Em genéticas fotoperiódicas sem manipulação, o que costuma induzir floração em Cannabis?",
        0,
        "Aumento relativo do período de escuro contínuo (noites mais longas)",
        "Redução total da umidade abaixo de 20% o tempo todo",
        "Eliminação de qualquer ventilação no ambiente",
        "Uso exclusivo de substrato inerte sem drenagem"
      ),
      q(
        "Sobre orientação jurídica personalizada para cultivo no Brasil, o curso adota qual postura?",
        3,
        "Substitui advogado e prescreve quantidades seguras",
        "Garante registro automático junto a órgãos federais",
        "Autoriza comercialização entre alunos",
        "Mantém-se educativo e encaminha dúvidas legais a profissionais e fontes oficiais"
      )
    ],
    professorNotes:
      "Corrija em grupo as dúvidas mais frequentes antes de abrir variedades.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-variedades-p1": {
    introduction:
      "Indica, sativa, híbrido — esses rótulos viraram marketing na loja de semente. Aqui a gente traduz: formato de planta, tempo de ciclo e o que isso manda na sua casa ou no grow, sem romance de embalagem.",
    body: [
      "Indicas tendem a porte mais compacto, folhas largas, ciclos algo mais curtos em relação a muitas sativas de porte alto e folhas mais estreitas. Na prática, a genética moderna é majoritariamente híbrida: o rótulo descreve tendência, não garantia.",
      "Sativas altas exigem mais controle de altura em espaços internos (técnicas de treinamento, estratégia lumínica). Indicas compactas podem tolerar menor pé-direito, mas ainda precisam de ar e luz uniformes.",
      "Ao escolher genética, considere: espaço disponível, tempo que pode dedicar, resistência a pragas relatada pelo banco de sementes ou clonador, e estabilidade da linhagem quando informada.",
      "Mantenha registro da cultivar, data de plantio e observações. Isso evita repetir erros e facilita comparar colheitas entre ciclos.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Comparar tendências morfológicas clássicas indica e sativa com ressalva sobre híbridos.",
      "Relacionar formato de planta com necessidade de espaço e treinamento.",
      "Justificar importância de anotar genética e datas ao longo do ciclo."
    ],
    closingSummary:
      "Morfologia na cabeça. Próximo: THC, CBD, terpenos e laudo — como ler sem virar doutor em um parágrafo.",
    quiz: [],
    professorNotes:
      "Evite claims médicos. Fale em tendências agronômicas e químicas descritivas.",
    media: MEDIA_STANDARD
  },

  "c101-variedades-p2": {
    introduction:
      "Cannabis é fábrica de cheiro e molécula — THC, CBD, terpenos. Esta aula é o papo de bar bem informado: vocabulário honesto, como ler laudo quando você tem um na mão, e o que não dá pra adivinhar só pelo nome da strain.",
    body: [
      "THC e CBD são canabinoides frequentemente citados. Concentrações relativas, junto de terpenos e flavonoides, contribuem para o perfil da amostra analisada em laboratório credenciado — não para suposições visuais na planta viva.",
      "Terpenos são voláteis responsáveis por grande parte do aroma. Eles alteram a percepção olfativa e interagem com o perfil químico em pesquisas científicas, mas não autorizam generalizações médicas simplistas.",
      "Relatórios de análise devem indicar método, limite de detecção e unidade. Compare sempre lotes por critérios consistentes e desconfie de números sem contexto metodológico.",
      "Para o cultivador iniciante, o aprendizado útil é: escolher genética alinhada ao objetivo educativo/legal vigente, manter sanidade da planta e só então discutir otimização química com base em dados, não em achismos.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Definir canabinoides e terpenos em nível introdutório.",
      "Interpretar com cautela relatórios laboratoriais (método, unidade, lote).",
      "Evitar inferências clínicas ou de dosagem a partir apenas do nome da cultivar."
    ],
    closingSummary:
      "Química descritiva sem hype. Quiz na sequência pra carimbar morfologia + leitura crítica de rótulo.",
    quiz: [],
    professorNotes:
      "Traga um exemplo de COA anonimizado se possível. Reforce ética em claims de saúde.",
    media: MEDIA_STANDARD
  },

  "c101-variedades-quiz": {
    introduction:
      "Hora de testar se você não cai em história de strain milagrosa. Foco: corpo da planta no espaço e cabeça fria na hora de ler números.",
    body: [
      "Releia mentalmente as limitações dos rótulos indica/sativa e a importância de laudos laboratoriais.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Avaliar escolhas de genética com base em espaço e tempo de ciclo.",
      "Diferenciar descrição educativa de claims médicos.",
      "Reforçar hábito de documentação de cultivar e datas."
    ],
    closingSummary:
      "Variedades check. Agora é montar o estúdio: espaço, luz e ar antes da primeira semente no meio.",
    quiz: [
      q(
        "Por que o rótulo “indica” ou “sativa” sozinho pode enganar o cultivador?",
        2,
        "Porque cores de folha sempre indicam concentração química exata",
        "Porque plantas automáticas não têm genótipo",
        "Porque a maioria das linhagens comerciais é híbrida e fenótipo ambiente interage com genótipo",
        "Porque substrato orgânico proíbe variabilidade genética"
      ),
      q(
        "O que um relatório de laboratório deve esclarecer para comparação honesta entre lotes?",
        0,
        "Método analítico, unidades e contexto da amostra",
        "Apenas a cor da embalagem",
        "Somente o preço de varejo",
        "Idade do analista"
      ),
      q(
        "Em cultivo indoor com pé-direito limitado, qual estratégia costuma ser mais coerente?",
        3,
        "Apenas sativas altíssimas sem treinamento",
        "Eliminar ventilação para ganhar altura",
        "Ignorar fotoperíodo",
        "Híbridos compactos ou técnicas de treinamento associados a genética adequada"
      )
    ],
    professorNotes:
      "Debata respostas incorretas com exemplos de projeto real bem e mal dimensionado.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-preparativos-p1": {
    introduction:
      "Antes de jogar semente no meio, desenha o cenário: indoor, outdoor fechadinho ou estufa. Planejar agora evita drama elétrico, layout ruim e dor de cabeça quando a planta já tá grande.",
    body: [
      "Defina se o projeto é indoor, outdoor protegido ou estufa. Cada modo tem perfis distintos de investimento inicial, controle climático e exposição a pragas.",
      "Liste equipamentos: iluminação, exaustão, circulação interna, temporizadores, estabilização de energia quando necessário e instrumentação mínima (termo-higrômetro, eventual medidor de pH/EC).",
      "Revise instalações elétricas: circuitos dedicados, fiação compatível com carga, disjuntor correto e distância segura de líquidos. Nunca misturar improviso elétrico com ambiente úmido.",
      "Planeje fluxo de trabalho: entrada de materiais, área de mistura de substrato, espaço para lavar ferramentas e descarte responsável de resíduos vegetais conforme normas locais.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Elaborar checklist inicial de espaço modo indoor/outdoor.",
      "Identificar riscos elétricos e de umidade a tratar antes do plantio.",
      "Organizar fluxo físico mínimo (entrada, bancada, descarte)."
    ],
    closingSummary:
      "Esboço do espaço pronto. Próximo capítulo: fazer a luz e o ar trabalharem a seu favor — sem virar obcecado por watt de marketing.",
    quiz: [],
    professorNotes:
      "Insista em normas locais de obra elétrica. Não ensine gambiarras.",
    media: MEDIA_STANDARD
  },

  "c101-preparativos-p2": {
    introduction:
      "Luz e ar são o duo dinâmico: sem eles a planta até cresce, mas sofre feio. Aqui a gente fala potência com senso crítico, luz uniforme (não só um ponto quente) e quanto de renovação de ar faz sentido começar.",
    body: [
      "Fontes comuns incluem LED de espectro completo, HPS tradicional (onde ainda permitido por projeto) e sol natural em outdoor. LEDs modernos costumam oferecer melhor eficiência energética e menos calor radiante por watt útil.",
      "Uniformidade importa mais que pico pontual de luminância: plantas em bordas com pouca luz esticam e perdem qualidade. Use reflexivos adequados e altura de luminária ajustável.",
      "Ventilação de exaustão remove calor e umidade estagnada; circulação interna fortalece caules e reduz micropontos de mofo. Dimensione silenciadores e curvas suaves de duto para não strangler fluxo.",
      "Registre temperatura e UR em vários pontos do dia. Padrões estáveis evitam estresses que aparecerão como sintomas foliares mais adiante.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Explicar diferença conceitual entre exaustão e circulação interna.",
      "Relacionar uniformidade lumínica com desenvolvimento homogêneo do dossel.",
      "Definir importância de registro diário de temperatura e umidade."
    ],
    closingSummary:
      "Luz e ventilação com lógica. Falta fechar substrato, vaso e água — trio que manda na raiz.",
    quiz: [],
    professorNotes:
      "Se possível, demonstre termo-higrômetro e leitura de altura de luminária.",
    media: MEDIA_STANDARD
  },

  "c101-preparativos-p3": {
    introduction:
      "Solo, coco, perlita, tamanho de vaso, qualidade da água — é aqui que erro burro vira drama duas semanas depois. Vamos deixar a base sólida antes da vida brotar de verdade.",
    body: [
      "Substratos podem ser solo vivo, misturas fibra de coco com aditivos, ou combinações com perlita, vermiculita e compostos orgânicos. O essencial é oxigenação radicular e drenagem previsível.",
      "Vasos pequenos limitam raiz cedo; vasos grandes demais com rega inadequada criam zonas anaeróbias. Evolução escalonada de volume é uma prática comum em cultivo em container.",
      "Água com excesso de cloro pode ser deixada repousar ou tratada conforme protocolo da operação; alguns cultivadores filtram ou ajustam pH da solução de irrigação — sempre com medição, não achismo.",
      "Teste simples de drenagem: aplicar volume de água e observar tempo até saída uniforme na base. Ajuste composição antes de plantar definitivamente.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Listar componentes típicos de substrato bem drenado.",
      "Explicar trade-off entre volume de vaso, retenção hídrica e oxigenação.",
      "Reconhecer necessidade de medir pré-tratamento de água em projetos sensíveis."
    ],
    closingSummary:
      "Material e água alinhados. Quiz dos preparativos e aí sim entramos no ciclo da planta de verdade.",
    quiz: [],
    professorNotes:
      "Convide a preparar uma mistura demonstrativa (fora da sala se houver restrição).",
    media: MEDIA_STANDARD
  },

  "c101-preparativos-quiz": {
    introduction:
      "Teste rápido: se você misturar espaço ruim, luz torta e substrato encharcado, o que acontece? Relaciona os blocos anteriores antes de ir pro ciclo.",
    body: [
      "Pense em causa e efeito: má ventilação leva a perfis microclimáticos diferentes; substrato mal drenado limita oxigenação radicular.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Aplicar critérios de segurança elétrica e umidade.",
      "Dimensionar mentalmente exaustão versus circulação.",
      "Avaliar adequação de substrato e vaso a um cenário hipotético."
    ],
    closingSummary:
      "Preparativos validados. Agora é botar a mão na massa: germinação, veg e flora no mesmo fluxo contínuo.",
    quiz: [
      q(
        "Qual prática melhora a uniformidade luminosa no dossel?",
        1,
        "Centralizar todas as plantas em um único ponto sob foco estreito",
        "Ajustar altura e ângulo das luminárias e usar superfícies reflexivas adequadas",
        "Desligar circulação interna permanentemente",
        "Evitar qualquer medição de temperatura"
      ),
      q(
        "Exaustão mal dimensionada tende a causar:",
        0,
        "Acúmulo de calor e umidade com risco fúngico elevado",
        "Floração instantânea em qualquer genética",
        "Eliminação natural de clorofila sem fotossíntese",
        "Substituição automática de nutrientes no solo"
      ),
      q(
        "Substrato encharcado persistente sem oxigenação suficiente prejudica principalmente:",
        2,
        "Apenas folhas velhas superiores",
        "Fotoperíodo solar",
        "Metabolismo radicular e absorção de água/transpiração equilibrada",
        "Cor das pétalas"
      )
    ],
    professorNotes:
      "Peça aos alunos um mini-diagrama do duto de exaustão antes de corrigir.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-processo-p1": {
    introduction:
      "Primeiro capítulo da vida visível: germinar com carinho, não deixar a plântula virar macarrão esticado pra luz, e saber a hora de mudar de casa (vaso). Aqui nasce o resto do ciclo.",
    body: [
      "Métodos comuns: papel umedecido em ambiente estável, cubo de lã de rocha, plugcoco ou plantio direto em vaso pequeno com umidade controlada. O fator transversal é umidade alta sem encharcar anaerobicamente.",
      "Temperaturas muito baixas atrasam metabolismo; muito altas favorecem patógenos. Monitore e ajuste com aquecimento de base quando necessário.",
      "Plântulas precisam de luz suave e distância correta para não estiolarem nem queimarem. A primeira folha verdadeira indica início robusto da fotossíntese autotrófica.",
      "Transplante precoce machuca raízes finas; tardio pode causar entortamento e stressing mecânico. Observe anel de raízes na lateral do vaso como sinal empírico.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Comparar três métodos básicos de germinação e respectivos cuidados.",
      "Reconhecer sinais de estiolamento e possível excesso luminoso.",
      "Identificar indícios de necessidade de transplante."
    ],
    closingSummary:
      "Broto estável? Segue o bonde do vegetativo — hora de folha, galho e dossel.",
    quiz: [],
    professorNotes:
      "Evite incentivar germinação clandestina onde proibida; contexto educativo geral.",
    media: MEDIA_STANDARD
  },

  "c101-processo-p2": {
    introduction:
      "Vegetativo é hype de crescimento: a planta monta esqueleto pra segurar flor depois. Aqui entra treino leve (LST, poda com critério), sem transformar o grow em trilha de cirurgia plástica vegetal.",
    body: [
      "Nitrogênio costuma ser mais demandado no vegetativo vigoroso; porém ajuste fino depende de genética, substrato e programa nutricional completo (tópico aprofundado nas aulas de manutenção).",
      "Treinos como LST flexionam caule para planificar dossel. Poda apical pode multiplicar brotações, mas atrasa recuperação se mal timingada.",
      "Evite saturar solo ou fibra com solução nutritiva antes da planta consumir: menas regas frequentes com enxurrada leve costumam superar muitas micro-irrigacões superficiais.",
      "Fotossíntese eficiente exige folhas limpas, boa circulação e temperaturas moderas: combinação favorece taxas de crescimento estáveis.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Descrever função do vegetativo no projeto global de colheita.",
      "Listar duas técnicas de dossel e seus trade-offs mínimos.",
      "Relacionar hígiene foliar e circulação com eficiência fotossintética."
    ],
    closingSummary:
      "Corpo da planta encaminhado. Próximo ato: floração — cheira mais, exige mais olho vivo.",
    quiz: [],
    professorNotes:
      "Demonstração de LST em modelo ou planta de treino reduz medo de erro.",
    media: MEDIA_STANDARD
  },

  "c101-processo-p3": {
    introduction:
      "Floração é quando a energia vai pras flores — e os detalhezinhos de clima viram prioridade. Umidade, ar parado e nutriente na dose certa (ou errada) aparecem na cara bem aqui.",
    body: [
      "Transição muito abrupta de umidade ou temperatura pode estressar. Planeje ajustes graduais quando possível e monitore substratos mais lentos na resposta hídrica.",
      "Demanda de fósforo e potássio tende a subir relativo ao nitrogênio em determinadas abordagens de fertilização; sempre calibrado ao programa adotado e leitura de planta.",
      "UR elevada com pouco movimento de ar favorece botrytis em inflorescências densas. Circulação estratégica reduz microbolsões saturados.",
      "Evite pulverizações agressivas na floração tardia sem critério técnico: resíduos e umidade foliar podem migrar problemas para dentro das estruturas florais.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Explicar por que controle de umidade e ventilação ganha peso na floração.",
      "Reconhecer mudança de foco nutricional típica (conceitual).",
      "Listar riscos de pulverização descoordenada na fase final."
    ],
    closingSummary:
      "Ciclo completo narrado. Quiz pra ver se você liga germinação → veg → flora sem confundir sintomas.",
    quiz: [],
    professorNotes:
      "Mostre imagem de cinza botrytis anônima se existir; sensibilize sem alarmismo.",
    media: MEDIA_STANDARD
  },

  "c101-processo-quiz": {
    introduction:
      "Liga os pontos: plântula esticada, bud denso com ar parado, raiz apertada no vaso — qual capítulo do ciclo grita em cada caso?",
    body: [
      "Revise especialmente transplante, estiolamento, mudança nutricional conceitual e ventilação na floração.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Diagnosticar em múltipla escolha problemas típicos de germinação.",
      "Associar práticas vegetativas a objetivos estruturais.",
      "Aplicar raciocínio de microclima na floração."
    ],
    closingSummary:
      "Ciclo de cultivo carimbado. Agora o grind diário: rega com lógica, planta falando, pragas na mira.",
    quiz: [
      q(
        "Estiolamento alongado com internódios fracos logo após emergência costuma indicar:",
        2,
        "Excesso de exaustão trocando ar demais",
        "Deficiência exclusiva de potássio",
        "Luz insuficiente ou distância lumínica inadequada para plântulas",
        "Colheita atrasada"
      ),
      q(
        "Na floração, combinação de inflorescências densas, UR alta e ar parado aumenta risco de:",
        0,
        "Podridão fúngica (especialmente botrytis)",
        "Automaticamente induzir novo vegetativo",
        "Eliminar necessidade de nutrientes",
        "Aumentar fotoperíodo natural"
      ),
      q(
        "Sinal empírico comum de vaso pequeno para o sistema radicular:",
        1,
        "Folhas instantaneamente brancas",
        "Raízes circulando visíveis nas laterais e crescimento foliar estagnando",
        "Plantas florescem antes de qualquer folha",
        "Declínio exclusivo noturno de pH sem medição"
      )
    ],
    professorNotes:
      "Corrija explicando fototropismo versus estiolamento extremo.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-manutencao-p1": {
    introduction:
      "A maioria dos ‘deficit miracles’ na internet é rega ou pH zuado disfarçado. Vamos organizar a rotina: quando molhar de verdade, como ler medição simples e não surtar a cada folha amarela.",
    body: [
      "Determine peso do vaso ou sonda de umidade, se usar, para evitar rega por calendário cego. O objetivo é oscilar levemente entre ciclos úmido e levemente seco conforme substrato.",
      "pH fora da faixa de absorção causa bloqueios iônicos mesmo com nutrientes presentes. A faixa aceitável comum em soluções hidropônicas ou drenagem de coco situa-se em tornos citados pelo fabricante — meça, não estime visualmente.",
      "EC (condutividade elétrica) estima força iônica total da solução. Subidas bruscas podem osmotizar raiz; descidas prolongadas podem indicar subnutrição.",
      "Observe padrões de sintoma: simetria, velhas versus novas folhas, velocidade de progressão. Diário fotográfico acelera aprendizado.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Justificar rega orientada a sinais em vez de calendário fixo rígido.",
      "Explicar em linhas gerais papel de pH e EC.",
      "Registrar sintomas com método de observação estruturado."
    ],
    closingSummary:
      "Rega e medição com senso. Próximo: NPK na prática e sintoma sem Dr. House imaginário.",
    quiz: [],
    professorNotes:
      "Traga medidores reais ou simulador de leitura. Destaque limpeza de eletrodos.",
    media: MEDIA_STANDARD
  },

  "c101-manutencao-p2": {
    introduction:
      "NPK não é só abreviação bonita — mas também não é bola de cristal. Sintomas ‘clássicos’ ajudam; stress, pathogen e rega podem imitar a mesma carinha triste na folha. Aqui a gente aprende a duvidar com método.",
    body: [
      "Amarelecimento de folhas basais com necrose progressiva pode sugerir mobilização de nitrogênio; porém sobre-rega, compactação ou patógeno radicular imitam quadros.",
      "Interveinal clorótico em folhas médias pode apontar magnésio, mas também pH incorreto bloqueando absorção.",
      "Sempre cruze: histórico de rega, leituras recentes, lado iluminado versus sombra, simetria, velocidade, genética e idade foliar.",
      "Correção: ajuste um fator de cada vez quando possível e aguarde intervalo mínimo de resposta antes de empilhar mudanças drásticas.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Nomear macronutrientes principais e função geral mnemônica agronômica.",
      "Aplicar regra de cruzar múltiplas causas antes do diagnóstico final.",
      "Priorizar mudanças incrementais na nutrição."
    ],
    closingSummary:
      "Nutrição com humildade técnica. Próximo: olhar lupa, pragas e treinos mais loucos — sempre com pé na realidade.",
    quiz: [],
    professorNotes:
      "Mostre quadro comparativo clássico com ressalvas. Incentive fotos em luz neutra.",
    media: MEDIA_STANDARD
  },

  "c101-manutencao-p3": {
    introduction:
      "Manejo integrado soa chique, mas é mindset: prevenir, observar, intervir sem sair tacando veneno achando que é perfume. Foco em quem tá começando e precisa de cultura, não de guerra química.",
    body: [
      "Inspeção semanal com lupa identifica trips, ácaros e ovos antes da explosão populacional. Folhas novas e raio inferior são prioritários.",
      "Predadores benéficos existem comercialmente em alguns mercados; aplicação requer compatibilidade ambiental e ausência de pesticidas de amplo espectro incompatíveis.",
      "Treinos avançados (SCROG, podas múltiplas) exigem timing e recuperação. Documente cada intervenção com data para correlacionar com eventuais estresses.",
      "Qualquer produto fitossanitário deve ser verificado para legalidade local, segurança humano-animal e período de carência em contextos agrícolas aplicáveis — não prescrevemos produtos.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Definir inspeção sistemática como primeira linha de defesa.",
      "Reconhecer trade-off entre treino agressivo e tempo de recuperação.",
      "Afirmar que escolha de defensivo exige compliance legal e técnico."
    ],
    closingSummary:
      "Rotina + pragas na prateleira mental. Quiz e seguimos pro pós-colheita — onde muita gente desmancha o esforço com pressa.",
    quiz: [],
    professorNotes:
      "Se a turma for predominância jurídica sensível, mantenha IPM em nível teórico.",
    media: MEDIA_STANDARD
  },

  "c101-manutencao-quiz": {
    introduction:
      "Check final do módulo manutenção: pH, umidade, tentativa desesperada de corrigir cinco coisas de uma vez — o que é coisa de gente sensata?",
    body: [
      "Priorize causalidade múltipla e mudanças graduais — eixo recorrente deste módulo.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Testar raciocínio sobre pH/EC versus sintoma.",
      "Avaliar cenários de umidade e fungo.",
      "Reforçar inspeção preventiva."
    ],
    closingSummary:
      "Manutenção no bolso. Agora é a reta final produtiva: colheita, secagem, cura — respira, não apressa o processo.",
    quiz: [
      q(
        "Corrigir três parâmetros de uma vez após um sintoma isolado costuma ser:",
        3,
        "Ideal sempre",
        "Obrigatório por lei",
        "Impossível tecnicamente",
        "Arriscado, pois impede saber qual mudança funcionou"
      ),
      q(
        "Sobre-rega crônica em substrato mal arejado frequentemente leva a:",
        1,
        "Automático aumento de THC foliar",
        "Asfixia radicular e sintomas que imitam deficiências",
        "Eliminação de necessidade de luz",
        "Uniformização instantânea de pH sem medição"
      ),
      q(
        "Primeira linha em programa IPM conscientizado é:",
        0,
        "Inspeção e monitoramento antes de intervenção química ampla",
        "Aplicação preventiva sem identificar organismo",
        "Ignorar folhas inferiores",
        "Aumentar UR ao máximo"
      )
    ],
    professorNotes:
      "Questões devem provocar discussão sobre método científico na bancada.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-pos-p1": {
    introduction:
      "Decidir quando cortar mistura ciência, paciência e referência visual — tricoma, maturação, objetivo do perfil. Sem fanfic: amostra em vários pontos da planta, ferramenta limpa, respeito ao arcabouço que vale pro seu contexto.",
    body: [
      "Tricomas glandulares mudam de translúcidos para leitosos e âmbar em cronologia dependente da genética e ambiente. Amostragem representativa evita decisão por um único bud.",
      "Corte integral versus colheita escalonada altera distribuição de maturação. Ferramentas limpas reduzem vectores de contaminação fúngica.",
      "Planeje espaço de secagem com escuro relativo, fluxo de ar suave e parâmetros monitorados. Transição abrupta de campo úmido para ambiente estagnado aumenta risco.",
      "Documentação fotográfica e data de corte ajudam a correlacionar resultados futuros.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Descrever importância de amostragem de tricomas em múltiplos pontos.",
      "Listar boas práticas higiênicas no corte.",
      "Planejar mentalmente ambiente de secagem inicial."
    ],
    closingSummary:
      "Corte com critério. Próximo: secagem que não vira forno e cura que abre aroma sem drama.",
    quiz: [],
    professorNotes:
      "Microscópio USB ao projetor fascina turma; use anonimização visual.",
    media: MEDIA_STANDARD
  },

  "c101-pos-p2": {
    introduction:
      "Secagem e cura são onde cultivo vira experiência sensorial estável. Apertar esse processo é jogar meses de trabalho no lixo — aqui é devagar, observando, como quem mima vinho caseiro.",
    body: [
      "Secagem muito rápida sela externo e aprisiona umidade interna; muito lenta sem ventilação mínima molda superfícies. Busque perda gradual monitorsada.",
      "Curing em recipiente hermético com abertura periódica (burghulio) homogeneiza umidade interna dos floretes e permite troca gasosa. Controle cheiro e segurança conforme norma local.",
      "Temperaturas elevadas durante cura degradam terpenos voláteis perceptivelmente. Estabilidade térmica vale mais que apressar processo.",
      "Registre peso ou tacto de haste ao dobrar para calibrar experiência entre ciclos futuros.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Contrastar secagem rápida prejudicial versus processo gradual equilibrado.",
      "Explicar função do burghulio em curing.",
      "Relacionar temperatura alta a perda de compostos voláteis."
    ],
    closingSummary:
      "Pós-colheita explicada. Quiz e depois a prova final que puxa tudo que você viu na trilha.",
    quiz: [],
    professorNotes:
      "Traga frasco demonstrativo vazio selado para explicar pressão sem produto real se necessário.",
    media: MEDIA_STANDARD
  },

  "c101-pos-quiz": {
    introduction:
      "Último teste antes da grande revisão: secagem com bolso úmido, amostragem de tricoma e calor abusivo na cura — qual erro dói mais no bolso?",
    body: [
      "Associe monitoração contínua a redução de risco fúngico e qualidade final.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Avaliar cenários de secagem subótima.",
      "Reforçar importância de amostragem na decisão de maturação.",
      "Conectar cura a homogeneização hídrica."
    ],
    closingSummary:
      "Pós-colheita check. Respira fundo: vem a avaliação integrada — tipo season finale com pegada de prova.",
    quiz: [
      q(
        "Secagem com bolso de umidade interno em botões densos sugere:",
        2,
        "Sucesso garantido sem monitoração",
        "Imposição automática de genética automática",
        "Risco elevado de problema microbiano se não ajustar fluxo de ar e monitorar",
        "Necessidade zero de escuro"
      ),
      q(
        "Amostragem de tricomas deve ser:",
        0,
        "Representativa (várias flores / alturas) em vez de um único ponto",
        "Apenas folha basal",
        "Somente ao meio-dia solar externo",
        "Realizada só após seis meses"
      ),
      q(
        "Temperaturas altas durante cura tendem a:",
        3,
        "Aumentar apenas massa foliar vegetativa",
        "Congelar tricomas",
        "Eliminar necessidade de troca gasosa",
        "Degradar voláteis aromáticos mais rapidamente"
      )
    ],
    professorNotes:
      "Use pergunta 1 para falar de liability em produto mal seco.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-avaliacao-final": {
    introduction:
      "Season finale em formato prova: planejamento, ciclo, manutenção, pós e postura séria com lei. Distrai com alternativa plausível é parte do jogo — lê com calma.",
    body: [
      "Leia cada enunciado com calma. Alguns itens deliberadamente trazem distratores plausíveis exigindo compreensão conceitual, não memorização mecânica.",
      "Após submeter mentalmente, reflita quais unidades merecem revisão antes de solicitar certificação oficial conforme regras da sala de formação.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Integrar conhecimentos entre módulos aparentemente separados.",
      "Identificar lacunas pessoais para plano de revisão.",
      "Preparar transição para etapas administrativas de encerramento."
    ],
    closingSummary:
      "Prova base cruzada. Agora os episódios finais: considerações humanas, certificado e aquela mensagem de ‘valeu por colar com a gente’.",
    quiz: [
      q(
        "Qual combinação melhor resume uma estratégia de prevenção de fungos em floração tardia?",
        1,
        "UR alta, ar parado e pulverização foliar noturna frequente",
        "Circulação eficiente, monitoração de umidade e evitar acúmulo de água em estruturas densas",
        "Eliminar exaustão para economizar energia",
        "Substituir medição por cor da parede do grow"
      ),
      q(
        "Ao diagnosticar possível deficiência nutricional, o passo mais responsável é:",
        3,
        "Aplicar dose máxima do fertilizante mais caro",
        "Trocar genética imediatamente",
        "Ignorar histórico de rega",
        "Cruzar sintomas com histórico hídrico, leituras recentes e mudanças incrementais"
      ),
      q(
        "Sobre cultivo e legislação individual no Brasil, o curso orienta:",
        0,
        "Buscar referências oficiais e assessoria qualificada para casos concretos",
        "Garantir automaticamente legalidade pela mera matrícula",
        "Substituir integralmente advogado e médico",
        "Fixar quantidades padrão para qualquer pessoa"
      )
    ],
    professorNotes:
      "Para certificação formal, siga instrumento avaliativo da sala oficial; este quiz é didático.",
    media: { ...MEDIA_STANDARD, needsVideo: false }
  },

  "c101-consideracoes-p1": {
    introduction:
      "Curso não acaba no último vídeo — continua na comunidade, nos estudos que você escolhe depois e na humildade de admitir que a planta sempre ensina algo novo. Este episódio é sobre ritmo sustentável, não burnout de grower.",
    body: [
      "Lei e pesquisa mudam o tempo todo — combina fonte séria com o que a THCProce publica pros alunos; evita virar refém de post viral.",
      "Diário de ciclo é truque de jogador experiente: mesmo que não dê pra postar fotos, anotar data e decisão salva o aprendizado.",
      "Errar em voz alta num fórum moderado vale ouro; gabar vitória sem dados ajuda ninguém.",
      "Privacidade e responsabilidade jurídica continuam valendo quando a conversa esquenta — meme não substitui consentimento nem respeito.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Montar plano simples de atualização contínua de conhecimento.",
      "Valorizar documentação privada estruturada.",
      "Reconhecer limites de compartilhamento público."
    ],
    closingSummary:
      "Plano de vida pós-101 esboçado. Falta o abraço final da equipe e os detalhes do certificado.",
    quiz: [],
    professorNotes:
      "Indique publicações confiáveis da instituição. Evite hype de influencer.",
    media: MEDIA_INTRO
  },

  "c101-consideracoes-p2": {
    introduction:
      "Último recado da casa: cultivo responsável combina técnica, ética e respeito com quem tá ao redor. Orgulho do que você aprendeu — sem achar que virou raiz zenith da internet.",
    body: [
      "Formação de base bem feita corta desperdício, fake news e discurso irresponsável. Siga aplicando método e transparência com você mesma(o).",
      "Se for pra cursos mais específicos (extração, medicina avançada…), leva esse caderno de erros e acertos — é seu loot mais valioso.",
      "Valeu demais por dividir esse tempo com a THCProce. Cada episódio completo é também voto de confiança no coletivo que faz a escola existir.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Articular ética profissional e técnica como eixos contínuos.",
      "Visualizar trilhas de especialização futuras.",
      "Fechar ciclo com reconhecimento do esforço investido."
    ],
    closingSummary:
      "Parte motivacional fechada. Agora o institucional: requisitos de certificado com linguagem clara, sem caça ao clique.",
    quiz: [],
    professorNotes:
      "Convide depoimentos breves; celebre sem exageros promocionais.",
    media: MEDIA_INTRO
  },

  "c101-cert-requisitos": {
    introduction:
      "Papelada que importa: o que a sala oficial pede pra emitir certificado, onde ler a versão atualizada (porque regra muda) e como não confundir progresso bonito no campus com validação formal.",
    body: [
      "Normalmente incluem frequência mínima, entregas avaliativas aprovadas e conformidade com prazos institucionais. O campus pode exibir progresso visual, mas a validação formal segue o que o Moodle ou sistema parallel registrar.",
      "Taxas, documentação pessoal e política de nome no certificado constam nos comunicados oficiais. Direcione dúvidas ao suporte acadêmico.",
      "Guarde comprovantes de pagamento e e-mails institucionais relevantes enquanto o processo não for concluído.",
      "Após emissão, verifique ortografia do nome e carga horária impressa antes de arquivar definitivamente.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Localizar onde ler requisitos atualizados de certificação.",
      "Diferenciar progresso simbólico no campus de validação formal.",
      "Listar documentos que convém arquivar durante o processo."
    ],
    closingSummary:
      "Você sabe onde confirmar os requisitos de verdade. Última parada: mensagem de encerramento e aquela sensação de missão cumprida.",
    quiz: [],
    professorNotes:
      "Atualize números de carga horária se normativa mudar; desmereça rumores de 'certificado automático'.",
    media: { ...MEDIA_INTRO, needsInfographic: false }
  },

  "c101-cert-encerramento": {
    introduction:
      "Missão cumprida no Cannabis 101 do campus. Revisa com carinho os capítulos onde ainda sente ponta solta antes de pedir certificação ou pular pro próximo nível da escola.",
    body: [
      "Revise uma última vez os módulos onde suas notas pessoais indicaram maior dúvida antes de solicitar certificação ou iniciar novo curso avançado.",
      "Mantenha contato com tutores através dos canais oficiais e participe construtivamente das comunidades associadas.",
      "Este material permanece disponível para consulta enquanto sua matrícula institucional permitir — aproveite como repositório vivo.",
      linkClosing("sala digital oficial da formação THCProce")
    ].join("\n\n"),
    objectives: [
      "Planejar revisão final personalizada antes de encerramento administrativo.",
      "Identificar canais de suporte contínuo.",
      "Reconhecer valor de manter acesso ao conteúdo para reforço."
    ],
    closingSummary:
      "É isso — você cruzou a trilha textual do 101 por aqui. Segue com método, responsabilidade legal e sede de aprender: a cultura da planta agradece em silêncio (e no aroma quando você capricha no pós-colheita).",

    quiz: [],
    professorNotes:
      "Cerimônia breve opcional; destaque pesquisadores e reguladores a acompanhar.",
    media: { ...MEDIA_INTRO, needsVideo: false }
  }
};
