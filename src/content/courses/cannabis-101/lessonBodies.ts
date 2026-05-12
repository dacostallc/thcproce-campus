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

/** Fonte canónica do texto das aulas Cannabis 101 no painel do campus: `lessonBodies` → `lessons.ts` → `getLessonRichContent`. Moodle/embed não alimenta este painel. */

/** Nota institucional única — substitui o parágrafo longo repetido em todas as aulas. */
const FOOTNOTE_MATERIALS =
  "Nota institucional: vídeos completos, PDFs e provas com validade formal ficam na sala digital THCProce; neste painel mantemos texto denso para estudo rápido no campus.";

export const CANNABIS101_LESSON_BODIES: Record<string, Cannabis101LessonBody> = {
  "c101-l01-boas-vindas": {
    introduction:
      "Bem-vindo ao Cannabis 101 na THCProce. Antes de flores, tricomas e laboratório, precisamos da mesma ferramenta que atravessa todas as trilhas: saber quando redes sociais trocam evidência por empurrão de produto. Mini-cenário: Ana recebe no feed um corte vertical sobre um óleo — música empática, \"natural\", mil curtidas e o destino do link é uma loja. Ela quer saber \"se serve\" e \"se pode\". Esta sessão não diz sim ou não ao caso dela (isso é médico e quadro legal individuais); ensina o freio mental para não propagar achismo nem comprar narrativa por estética.",
    body: [
      "O Cannabis 101 assume três compromissos que você verá repetidos: linguagem técnica quando falamos de planta e química; redução de danos sem romantizar uso informal; respeito ao ordenamento brasileiro sem jurismo de grupo. Autoprescrição, doses para terceiros e influencer como \"fonte científica\" ficam fora do contrato.",
      "Quando surgir áudio, reel ou thread sobre óleo, flor, THC ou CBD, passe esta lista antes de acreditar ou compartilhar — vale guardar no bloco de notas.\n\n• Está diante do documento integral (lei, portaria, estudo, bula, COA) ou só de um recorte?\n\n• Data da norma ou publicação; instituição; financiamento ou marca por trás?\n\n• Promessa de cura, dose para outras pessoas, \"legalização genérica\" ou atalho fiscal? Pause até validar com profissional habilitado e fonte primária.\n\n• Se isto for verdade, que alteração concreta faz na sua vida (marcar consulta, pedir COA, reler rótulo, não cultivar onde não pode)?",
      "Rotina que sustenta as próximas dez aulas.\n\n• Bloco de tempo sem multitarefa — vocabulário exige atenção.\n\n• Três perguntas antes de ler (planta ou produto? qual canabinoide aparece? qual evidência ou lei?).\n\n• Sublinhe onde o texto diz \"onde isto aplica-se\" (cozinha segura, laudo, conversa clínica, cultivo só onde permitido).\n\n• Ao terminar: uma ação — pergunta ao médico, verificação de fonte, lista de dúvidas.\n\n• Nenhuma ficha substitui receita nem parecer jurídico individual.",
      "Armadilhas frequentes no ecossistema cannabis: review patrocinado por marca de vaporizador; \"CBD acalma\" sem população nem dose; Europa/Brazil misturados num mesmo vídeo; produtor formal sem alinhar lote, COA e ficha técnica. Em cada caso: registe fonte, data e nível de evidência.",
      "Evite fingir domínio por velocidade de leitura, copiar doses de estranhos, usar meme como texto legal ou esconder uso do médico.",
      "Glossário vivo — acrescentamos ao longo do curso. COA — certificado de análise. LOD/LOQ — limite de detecção / quantificação. THCA/CBDA — precursores ácidos. THC/CBD — formas neutras após tempo ou calor. CB1/CB2 — receptores centrais do sistema endocanabinoide. Fonte primária — texto oficial integral ou estudo referenciável, não só manchete ou thread.",
      "Fluxo desta abertura: perguntas → leitura focada → nota de aplicação → quiz sem autoengano → dúvidas datadas para conferir na fonte.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Usar três perguntas-guia antes de cada leitura sobre cannabis e anotar onde o conteúdo mexe na vida real.",
      "Aplicar a checklist THCProce para separar evidência, marketing e rumor em redes.",
      "Declarar em voz alta os limites do curso (sem prescritor nem advogado embutidos) antes de avançar para botânica e COA."
    ],
    closingSummary:
      "Num papel físico, escreva o que recusa fazer neste curso (passar dose a terceiros; cultivo fora da lei) e uma competência que vai treinar (pedir e ler COA; levar perguntas objetivas ao médico). Guarde o papel — é o seu contrato com o conteúdo.",
    quiz: [
      q(
        "Qual sequência melhor descreve o método sugerido nesta aula?",
        0,
        "Definir perguntas → ler com foco → registrar onde aplicar → quiz honesto → anotar dúvidas datadas",
        "Correr todas as aulas num dia sem notas",
        "Substituir conversa médica por quiz online",
        "Aceitar qualquer influencer como fonte primária"
      ),
      q(
        "Fonte primária, no sentido usado aqui, é:",
        2,
        "Thread viral sem links",
        "Resumo de terceiros sem citação",
        "Documento ou estudo original consultado na íntegra ou portal oficial",
        "Comentário em grupo fechado"
      ),
      q(
        "Sobre limites do curso, a postura correta é:",
        3,
        "Ensinar evasão fiscal como skill extra",
        "Prescrever THC por mensagem privada",
        "Garantir resultado clínico para todos",
        "Educar com linguagem técnica e responsável, sem substituir prescritor nem advogado"
      )
    ],
    professorNotes:
      "Contrato oral de sala: perguntas bem-vindas; autopromoção irresponsável não. Indique apoio psicológico institucional se existir.",
    media: MEDIA_INTRO
  },

  "c101-l02-o-que-e-cannabis": {
    introduction:
      "Cannabis sativa L. não é slogan — é organismo vivo cujo manejo altera química da inflorescência. Pense como agrônomo consciente e consumidor informado: genética, ambiente, colheita e pós-colheita são alavancas mensuráveis. Mais à frente, na aula sobre canabinoides e COA, você lerá como essa variabilidade aparece em números de laboratório.",
    body: [
      "OBJETIVO. Relacionar estrutura botânica básica, ciclo reprodutivo das flores femininas e fatores de cultivo com o perfil químico observável em laboratório.",
      "EXPLICAÇÃO. Glândulas tricomáticas nas brácteas acumulam resina rica em canabinoides e terpenos. O momento da colheita altera a proporção de precursores ácidos versus formas neutras após decarboxilação térmica ou tempo. Substrato com boa drenagem e raízes oxigenadas sustentam metabolismo secundário — daí \"substrato equilibrado\" em manuais sérios de horticultura onde o cultivo é permitido.",
      "O MESMO GENÓTIPO NÃO GARANTE O MESMO RESULTADO. Duas plantas com etiqueta genética parecida podem divergir forte se uma viveu estufa controlada e outra campo úmido; se uma foi colhida cedo e outra tardia; se secagens diferiram em temperatura e oxigénio. Por isso laboratório reporta lote e método — tema central quando formos ler THCA, THC total e estabilidade química na aula de canabinoides.",
      "PASSO A PASSO — avaliar qualidade de informação sobre uma cultivar (sem julgar legalidade local).\n\n1. Peça nome botânico ou registro, não só apelido de rede social.\n\n2. Peça dados de colheita: indoor/outdoor, clima, idade fenológica.\n\n3. Busque COA com data e laboratório credenciado quando o produto for legalmente comercializado.\n\n4. Compare dois lotes com nome parecido: se química diverge muito, questione padronização ou rótulo genérico.",
      "EXEMPLOS. Duas \"Purple\" podem ter terpenos diferentes em estufa versus campo; óleo com 30 mg/mL no rótulo precisa casar com método analítico declarado; semente de fibra não conversa com flor medicinal regulada.",
      "ERROS COMUNS. Analogia vaga sem métricas; ignorar que fotoperíodo e estresse hídrico moderado alteram expressão química; assumir cor como proxy de potência.",
      "DICAS. Esboce flor feminina (bráctea, pistilo, tricoma); pause vídeos nos gráficos tempo × temperatura de secagem.",
      "TERMOS. Cultivar — linhagem estabilizada ou seleção comercial. Fenótipo — resultado observável de genótipo + ambiente. Pós-colheita — secagem, cura e armazenamento que mudam aroma e canabinoides menores.",
      "SÍNTESE. Cannabis é planta mensurável: genes não bastam sem registro de ambiente e processo — prepara leitura de COA e compreensão de variação entre sessões de uso.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Nomear partes da flor relevantes para acúmulo de resina e explicar por que colheita importa.",
      "Relacionar substrato, saúde radicular e metabolismo secundário em nível conceitual.",
      "Questionar rótulos marketeiros usando evidência mínima (lote, método, laboratório)."
    ],
    closingSummary:
      "Duas colunas: \"mesmo nome genético\" versus \"mesmo perfil químico garantido\" — liste o que teria de ser igual para a segunda coluna ser verdadeira (ambiente, colheita, análise de lote).",
    quiz: [
      q(
        "Tricomas glandulares são citados nesta aula principalmente porque:",
        1,
        "Determinam cor legal da planta no Brasil",
        "Concentram resina rica em canabinoides e terpenos na superfície floral",
        "Substituem necessidade de irrigação",
        "Provem que a planta não precisa de luz"
      ),
      q(
        "Por que \"mesmo nome\" de cultivar não garante experiência idêntica?",
        2,
        "Porque nomes são aleatórios em lei",
        "Porque laboratórios proíbem medição",
        "Porque ambiente, manejo e pós-colheita alteram o perfil químico observado",
        "Porque genética não existe em cannabis"
      ),
      q(
        "Substrato com boa drenagem aparece na explicação como:",
        3,
        "Modo de aumentar THC ilegalmente",
        "Detalhe cosmético irrelevante",
        "Substituto de supervisão médica",
        "Base para raízes oxigenadas e metabolismo secundário estável em horticultura séria"
      )
    ],
    professorNotes:
      "Se possível, planta demonstrativa não cannabis (tomateiro, manjericão) e observação microscópica de tricomas como paralelo seguro.",
    media: MEDIA_STANDARD
  },

  "c101-l03-canhamo-maconha-medicinal": {
    introduction:
      "Cânhamo, maconha e cannabis medicinal travam políticas porque misturam botânica, lei e estigma. Trate como analista de rótulo e categoria — não como manchete. Normas mudam: sempre registre a data da sua pesquisa em fonte oficial.",
    body: [
      "OBJETIVO. Separar cadeias típicas de baixo THC (fibra, semente, cosméticos com limites), mercados informais de flores psicoativas e programas medicinais com prescrição e rastreabilidade.",
      "EXPLICAÇÃO. No Brasil, canabinoides prescritos seguem canais específicos (importação autorizada, registrados quando existirem). Decisões judiciais individuais criam camadas que mudam — cite sempre quando leu. Nos EUA, permissão estadual não apaga tensões federais em vários domínios.",
      "TABELA EM PROSA (três mundos).\n\nMundo A — Baixo THC industrial / alimentar / fibra: foco em limite legal de THC declarado e uso não psicoativo da matéria-prima.\n\nMundo B — Medicinal regulado: prescrição, rótulo com teores, farmácia ou canal autorizado, rastreio de lote quando aplicável.\n\nMundo C — Informal sem rastreio: ausência de COA confiável e ausência de supervisão clínica estruturada — alto risco legal e sanitário.",
      "PASSO A PASSO — ler rótulo ou resumo de portaria.\n\n1. Classifique: alimento, cosmético, suplemento vedado localmente ou medicamento.\n\n2. Leia THC e CBD com unidade (mg por dose, % massa/massa).\n\n3. Busque selo GMP ou farmácia autorizada quando couber.\n\n4. Cruze com prescritor — rótulo não substitui monitoramento clínico.",
      "PERGUNTAS PARA COPIAR NA CONSULTA (médico ou farmacêutico).\n\n• Como esta forma farmacêutica interage com meus medicamentos atuais?\n\n• Qual esquema temporal devo registrar (horários, refeições)?\n\n• Quais sinais devem me levar a ligar antes da próxima consulta?\n\n• Onde encontro informação oficial atualizada sobre importação ou dispensação?",
      "EXEMPLOS. Óleo importado regulado versus frasco informal; flor medicinal com rastreio versus flor sem origem; cosmético com CBD sem dose terapêutica declarada.",
      "ERROS COMUNS. Achar que \"CBD de shopping\" resolve quadro psiquiátrico grave sem avaliação; confundir permissão individual com política geral; presumir UE = Brasil.",
      "SÍNTESE. Você distingue mundos por critérios objetivos (rótulo, prescrição, rastreio) e sabe quando escalar para advogado ou farmacêutico.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Classificar produtos por categoria regulatória genérica usando rótulo e documentação.",
      "Explicar por que decisões jurídicas individuais não substituem consulta personalizada.",
      "Preparar perguntas objetivas ao prescritor sobre titulação e interações usando o bloco copiável desta aula."
    ],
    closingSummary:
      "Fluxograma em três caixas: Baixo THC industrial; Medicinal regulado; Informal sem rastreio — uma pergunta por caixa que só profissional habilitado fecha.",
    quiz: [
      q(
        "Cannabis medicinal, neste curso, significa sobretudo:",
        0,
        "Uso enquadrado legalmente com produtos/prescrito e acompanhamento profissional quando aplicável",
        "Qualquer óleo comprado online sem receita",
        "Maconha social renomeada para parecer ciência",
        "Automedicação sem monitoramento porque é natural"
      ),
      q(
        "Ao ler rótulo, qual é o primeiro passo útil?",
        3,
        "Escolher a embalagem mais bonita",
        "Ignorar unidades de medida",
        "Assumir dose pelo peso corporal sozinho",
        "Identificar categoria do produto (medicamento, cosmético etc.) e teores declarados"
      ),
      q(
        "Sobre Brasil versus outros países:",
        1,
        "Leis são idênticas em todos os continentes",
        "Requer conferência em fonte oficial atualizada; cenário muda e há camadas estaduais/federais nos EUA",
        "Redes sociais substituem Diário Oficial",
        "Se é legal em Amsterdam, é legal no seu endereço automaticamente"
      )
    ],
    professorNotes:
      "Datas nos slides. Evite nomes reais de pacientes. Reforce confidencialidade e estigma.",
    media: MEDIA_STANDARD
  },

  "c101-l04-canabinoides": {
    introduction:
      "THC, CBD, CBG e CBN não são encantamentos — são moléculas com assinatura em COA. Esta aula é o seu laboratório textual: porcentagens, mg/g, LOD/LOQ e degradação por oxidação. Conecta diretamente ao que vimos na aula da planta: colheita e armazenagem alteram o que o laudo pode mostrar.",
    body: [
      "OBJETIVO. Interpretar laudos quantitativos básicos e relacionar armazenamento com perfil de canabinoides, sem promessa clínica.",
      "EXPLICAÇÃO. COA lista THCA, CBDA, THC total e CBD total estimados por soma após decarboxilação teórica — cada laboratório declara equação; compare sempre método e unidade. LOD/LOQ informam confiança em valores baixos. THCA alto exposto a luz e oxigénio pode migrar para THC neutro e oxidar a CBN — literatura descreve envelhecimento químico mensurável.",
      "PERGUNTAS ÚTEIS AO LABORATÓRIO OU FORNECEDOR (quando legalmente aplicável).\n\n• Qual acreditação e qual versão de método para potência?\n\n• Unidade é massa seca da flor ou produto acabado?\n\n• Há painel de segurança (pesticidas, metais, micotoxinas) neste lote?\n\n• Como reproduzir o mesmo ensaio em lote futuro?",
      "EXERCÍCIO FICTÍCIO — DUAS LINHAS DE COA (números ilustrativos, não prescrevem uso).\n\nLote 1: THCA 22 %; THC total declarado 19 %; data há 40 dias; armazenagem mal vedada.\n\nLote 2: THCA 22 %; THC total declarado 18,5 %; CBN subiu vs relatório anterior do mesmo cultivar; data há 120 dias.\n\nPergunta de raciocínio: o que mudar primeiro na hipótese — genética ou tempo/oxigénio? Por quê?",
      "PASSO A PASSO — ler COA de produto legal.\n\n1. Laboratório, acreditação, data.\n\n2. Unidade (% massa seca vs mg por unidade).\n\n3. THC total vs THCA isolado — entender precursor.\n\n4. Contaminantes antes de celebrar potência.\n\n5. Guardar PDF com número de lote se acompanha titulação clínica autorizada.",
      "EXEMPLOS. Flor potente com micotoxina acima do permitido reprova; óleo 25 mg/dose pode variar ± faixa do método; CBN alto sugere estoque velho ou armazenagem ruim.",
      "ERROS COMUNS. Comparar países sem converter unidades; ignorar umidade da amostra; \"full spectrum\" sem dados numéricos.",
      "TERMOS. Decarboxilação — perda do grupo carboxila gerando formas neutras. Titulação — ajuste gradual supervisionado clinicamente. Farmacocinética — tempo × concentração plasmática conforme via.",
      "SÍNTESE. COA é documento técnico; envelhecimento impróprio altera química observável — prepara comparação com vias de consumo mais adiante.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Explicar diferença entre THCA/CBDA e THC/CBD neutros em nível introdutório.",
      "Navegar seções típicas de COA: potência, segurança, método.",
      "Relacionar oxidação e tempo com aumento relativo de CBN descrito na literatura."
    ],
    closingSummary:
      "Faça download de COA público anónimo e circule: THC total; data; LOD de contaminantes. O que não entender vira pergunta ao farmacêutico ou prescritor.",
    quiz: [
      q(
        "Por que CBN frequentemente sobe em amostras antigas mal guardadas?",
        2,
        "Porque laboratórios sempre adulteram resultados",
        "Porque CBD vira automaticamente vitamina",
        "Porque THC pode oxidar-se formando mais CBN ao longo do tempo sob luz/oxigénio",
        "Porque terpenos viram THC mágico"
      ),
      q(
        "Ao ler COA, qual prioridade esta aula defende?",
        1,
        "Potência máxima antes de qualquer outra linha",
        "Integridade do laboratório, data, unidades e painel de segurança quando disponível",
        "Ignorar método analítico",
        "Assumir todos os laudos iguais sem acreditação"
      ),
      q(
        "THCA no laudo representa, em linguagem simples:",
        0,
        "Forma ácida precursora que pode converter-se em THC neutro com calor ou tempo",
        "Álcool etílico adicionado ilegalmente",
        "Terpeno aromático",
        "Tipo de fertilizante"
      )
    ],
    professorNotes:
      "Slide com COA anonimizado real. Conversão de unidades simbólica — sem ensinar fraude em ensaio.",
    media: MEDIA_STANDARD
  },

  "c101-l05-terpenos": {
    introduction:
      "Terpenos são voláteis: ditam aroma e parte da percepção. Leia como processista — temperatura, oxigénio, luz e tempo são controles de conservação, não moda. Esta aula corta o hábito de transformar nome de terpeno em promessa clínica.",
    body: [
      "OBJETIVO. Correlacionar compostos voláteis com percepção, protocolos caseiros de conservação (onde legal possuir flor seca) e sanidade frente a claims milagrosos.",
      "CIÊNCIA SEM HYPE. Mirceno tende a notas herbáceas; limoneno cítrico; pineno resinoso; linalool floral. Cromatografia mede µg/g — o nariz não é GC-MS. Declarações terapêuticas por terpeno isolado costumam extrapolar evidência; aqui usamos terpenos para entender fragilidade química e qualidade sensorial, não para prescrever tratamento.",
      "EXEMPLO LOTE A VS LOTE B (fictício). Mesmo nome comercial; Lote A secagem lenta em escuro com vedante real mantém topo cítrico; Lote B secagem quente e pote transparente no parapeito perde voláteis leves — mesmo THC total no papel pode parecer \"flat\" ao usuário. Nariz não substitui COA, mas discordância nariz×rótulo merece investigação de processo.",
      "EXPLICAÇÃO. Secagem lenta em escuro com ar suave preserva monoterpenos sensíveis que evaporam acima de ~30–35 °C prolongados (faixa ilustrativa — matriz e equipamento importam).",
      "PASSO A PASSO — conservação doméstica responsável (produto legal).\n\n1. Recipiente opaco com vedante sério.\n\n2. Reguladores de humidade conforme orientação clínica ou protocolo local — decisão médica, não escolar.\n\n3. Evite geladeira se não controlar condensação — risco de mofo.\n\n4. Abrir o pote o mínimo; oxigénio fragmenta terpenos.",
      "EXEMPLOS. Vidro âmbar melhor que pote claro na janela; concentrado aquecido no bolso perde topo aromático; café ao lado contamina odor.",
      "ERROS COMUNS. Congelar sem embalar; misturar genéticas sem etiqueta; confundir cheiro forte com potência alta.",
      "TERMOS. Evaporação — perda física de voláteis. Oxidação — alteração química. Cura — redistribuição de umidade após secagem inicial.",
      "SÍNTESE. Terpenos são ingredientes frágeis: técnica de armazenamento define o que resta ao nariz.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Nomear três terpenos frequentes e associá-los a notas aromáticas.",
      "Descrever como calor, luz e oxigénio degradam voláteis.",
      "Rejeitar narrativa de cura baseada só no nome de um terpeno sem evidência clínica específica."
    ],
    closingSummary:
      "Liste quatro controles (luz, temperatura, oxigénio, umidade) e diga qual sacrificaria primeiro se morasse em lugar muito úmido — e por quê.",
    quiz: [
      q(
        "Secagem muito quente e rápida tende a:",
        1,
        "Aumentar monoterpenos sensíveis",
        "Perder voláteis leves e empobrecer aroma percebido",
        "Ser irrelevante para química",
        "Eliminar necessidade de armazenamento"
      ),
      q(
        "Afirmar que \"limoneno cura ansiedade\" só pelo nome é:",
        3,
        "Evidência nível I",
        "Conduta recomendada em sala",
        "Equivalente a RCT duplo-cego",
        "Redução perigosa de ciência complexa a slogan"
      ),
      q(
        "Recipiente opaco com vedante visa principalmente:",
        0,
        "Reduzir luz e oxigénio que degradam compostos voláteis",
        "Impedir leitura do rótulo",
        "Substituir orientação médica",
        "Aumentar THC por telepatia"
      )
    ],
    professorNotes:
      "Estações com especiarias para treinar nariz sem cannabis, se política permitir.",
    media: MEDIA_INTRO
  },

  "c101-l06-sistema-endocanabinoide": {
    introduction:
      "O sistema endocanabinoide modula dor, humor, sono e inflamação via receptores e ligantes endógenos — linguagem de feedback biológico, não \"modo turbo\". Use o mapa ECS para fazer perguntas melhores na consulta e para entender por que vias de consumo (aula seguinte sobre formas de uso) e sedação (aula de redução de danos) mudam risco.",
    body: [
      "OBJETIVO. Descrever CB1/CB2 como interfaces de sinalização e listar sinais que devem ser comunicados ao prescritor quando canabinoides fazem parte de tratamento autorizado.",
      "EXPLICAÇÃO. CB1 concentrado no SNC modula neurotransmissão; CB2 mais presente em tecido imune associa-se, em modelos experimentais, a modulação inflamatória. Canabinoides exógenos perturbam equilíbrio — daí taquicardia, hipotensão ortostática ou sonolência com variabilidade individual.",
      "SINAIS PARA AGENDAR CONTATO EM ATÉ 48 H (exemplos educativos, não checklist diagnóstica).\n\n• Novo episódio persistente de palpitação ou tontura ao iniciar ou ajustar.\n\n• Sonolência que interfere em trabalho seguro ou cuidado infantil.\n\n• Náusea ou vómito incomuns após mudança de formulação.",
      "URGÊNCIA OU LINHA DE EMERGÊNCIA.\n\n• Dor torácica, falta de ar súbita, confusão nova, pensamentos de autolesão — ligar serviço de emergência ou CVV conforme protocolo local imediatamente, independentemente de estar ou não usando cannabis.",
      "PASSO A PASSO — preparar consulta.\n\n1. Medicamentos atuais com dose e horário.\n\n2. Sintomas-alvo com escalas simples (dor/sono 0–10).\n\n3. Eventos adversos com data.\n\n4. Perguntar sobre anticoagulantes, antiepilépticos, ansiolíticos.\n\n5. Não cessar psicofármaco por conta própria ao introduzir canabinoides.",
      "EXEMPLOS. Paciente em varfarina precisa monitorização INR reforçada; clobazam altera clearance de CBD em estudos; THC pode exacerbar taquicardia ansiosa transitória.",
      "ERROS COMUNS. \"Natural\" para ignorar farmacologia; ECS como interruptor único; esperar que esta aula substitua semiologia médica.",
      "TERMOS. Homeostase — equilíbrio dinâmico. Agonismo parcial — ativação incompleta do receptor. Sinergia prescrita — decisão clínica documentada, não slogan de rótulo.",
      "SÍNTESE. Mapa ECS serve para cooperar com prescritor — não para automedicar com precisão fingida.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Definir ECS como rede moduladora com exemplos fisiológicos cotidianos.",
      "Montar checklist de informações para consulta sobre canabinoides.",
      "Distinguir sinais que pedem contacto prioritário versus emergência imediata."
    ],
    closingSummary:
      "Cinco linhas de \"relato estruturado\" após uma semana de uso autorizado: sintomas-alvo, horários, eventos leves, sono, hidratação — levar impresso.",
    quiz: [
      q(
        "CB1 é destacado nesta aula principalmente por:",
        2,
        "Existir só na pele das mãos",
        "Ser vitamina",
        "Concentrar-se no sistema nervoso central e modular neurotransmissão",
        "Eliminar necessidade de sono"
      ),
      q(
        "Qual item pertence a uma consulta bem preparada?",
        0,
        "Lista atualizada de medicamentos com doses e horários",
        "Ocultar ansiolíticos porque são constrangedores",
        "Decidir dose sozinho antes de chegar",
        "Negar episódios adversos para parecer forte"
      ),
      q(
        "Variabilidade entre pessoas sugere:",
        3,
        "Que protocolos caseiros copiados são sempre seguros",
        "Que ECS não existe",
        "Que não há interações medicamentosas",
        "Que titulação e acompanhamento profissional fazem sentido quando permitido"
      )
    ],
    professorNotes:
      "Convide farmacêutico nos minutos finais se permitido. Sem humor grosseiro sobre intoxicação.",
    media: { ...MEDIA_STANDARD, needsInfographic: true }
  },

  "c101-l07-usos-e-reducao-de-danos": {
    introduction:
      "Redução de danos é engenharia de risco quando há exposição real a psicoativos — não \"liberar geral\". Você monta cenários com checklist. Importante: partilhar informação pública de segurança não é prescrever dose; orientar terceiros sobre quantidade ou combinação ultrapassa o papel deste curso.",
    body: [
      "OBJETIVO. Construir protocolos situacionais (evento, estrada, lar com crianças) que reduzam trauma, sobrecarga subjetiva intensa e consequências jurídicas, sem romantizar uso.",
      "ÉTICA AO \"AJUDAR\" ALGUÉM. Pode indicar números de emergência, incentivar conversa com profissional e partilhar materiais educativos neutros. Não copie doses, não recomende misturas sedativas, não incentive condução ou trabalho perigoso sob influência — mesmo que \"todo mundo faça\".",
      "EXPLICAÇÃO. Baixa dose inicial com supervisão clínica quando aplicável reduz episódios \"too much\". Mistura com álcool ou benzodiazepínicos aumenta sedação e queda. Dirigir sob THC onde proibido ou com tolerância zero é risco jurídico e de vida.",
      "CENÁRIO EVENTO (uso onde legal para adultos).\n\n1. Limite prévio por escrito.\n\n2. Água e alimento leve disponíveis.\n\n3. Pessoa sóbria de confiança.\n\n4. Endereço de emergência salvo.\n\n5. Produto em embalagem original rotulada.",
      "CENÁRIO LAR COM CRIANÇAS.\n\n1. Armário trancado alto.\n\n2. Embalagem à prova de criança.\n\n3. Linguagem honesta — nunca \"doce\".\n\n4. Descarte conforme farmácia/local.",
      "SINAIS DE ALARME (acionar ajuda formal).\n\n1. Confusão súbita ou desorientação nova.\n\n2. Dor torácica ou falta de ar.\n\n3. Pensamentos de autolesão ou violência.\n\n4. Vómito incoercível ou desidratação grave.",
      "EXEMPLOS. Comestível sem rótulo levando a PS; CNH perdida por teste saliva; interações com psicofármacos subnotificadas.",
      "SÍNTESE. Dois fluxogramas — adulto fora de casa e guardião em casa — centrados em transparência e ajuda formal.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Redigir checklist de redução de danos para dois cenários distintos.",
      "Explicar por que misturas com depressores do SNC são especialmente perigosas.",
      "Distinguir partilha educativa segura de orientação clandestina sobre dose ou mistura."
    ],
    closingSummary:
      "Troque com colega um item que cada checklist esqueceu — objetivo é cobrir risco social real.",
    quiz: [
      q(
        "Misturar THC com álcool ou benzodiazepínicos tende a:",
        1,
        "Reduzir sempre o efeito",
        "Potencializar sedação e risco de trauma por queda ou parada respiratória em extremos",
        "Ser neutro farmacologicamente",
        "Substituir hidratação"
      ),
      q(
        "Guarda doméstica responsável inclui:",
        2,
        "Deixar flora na mesa para \"naturalizar\" criança",
        "Rotular como docinho para não assustar",
        "Armazenamento trancado, embalagem à prova de criança e linguagem honesta sobre risco",
        "Esconder produtos sem sistema — suficiente se adulto está em casa"
      ),
      q(
        "Redução de danos no trânsito implica:",
        0,
        "Não dirigir sob influência psicoativa onde proibido ou inseguro",
        "Dirigir devagar compensa",
        "Cannabis não altera tempo de reação",
        "Polícia não testa THC em lugar nenhum"
      )
    ],
    professorNotes:
      "Cartão com emergência regional e CVV. Zero glamourização de uso excessivo.",
    media: MEDIA_STANDARD
  },

  "c101-l08-formas-consumo": {
    introduction:
      "Via de administração redesenha curva tempo × efeito e risco pulmonar ou gastrointestinal. Você compara inalação térmica, combustão, ingestão oral e tópica — ligando à leitura de COA da aula de canabinoides (potência no papel não diz velocidade no organismo).",
    body: [
      "OBJETIVO. Comparar vias quanto a início, duração e armadilhas clássicas.",
      "EXPLICAÇÃO. Inalação atinge picos mais rápidos; primeira passagem hepática na ingestão atrasa pico e aumenta variabilidade enzimática. Tópicos frequentemente não geram níveis sistémicos altos — marketing costuma superestimar absorção sistémica.",
      "LINHA DO TEMPO ESBOÇADA — ORAL VS INALAÇÃO ÚNICA (modelo didático, não dose individual).\n\nInalação (ilustrativo): efeito perceptível costuma subir mais cedo no eixo de horas; declínio tende a ser mais rápido que oral.\n\nOral: curva prolongada — erro típico é reforçar dose antes das 1,5–2 h porque \"não bateu\", precipitando sobrecarga quando o primeiro delta ainda está subindo.",
      "PASSO A PASSO — ingestível em contexto adulto onde permitido.\n\n1. Registre horário da primeira dose pequena.\n\n2. Aguarde pelo menos 120 minutos antes de complementar salvo orientação profissional contrária.\n\n3. Não misture com álcool na mesma curva de aprendizado.\n\n4. Ambiente calmo na primeira experiência oral.",
      "PASSO A PASSO — inalação térmica versus combustão.\n\n1. Vaporização reduz mas não elimina irritantes respiratórios.\n\n2. DPOC/asma: evitar inalação sem pneumologista.\n\n3. Limpar equipamento para evitar biofilme.",
      "EXEMPLOS. Turista come brownie inteiro porque \"demorou\"; idoso com enzimas competindo com medicamentos; vídeo de dab caseiro — risco térmico/químico.",
      "ERROS COMUNS. Converter mg oral em mg inalado sem clínica; achar que vape descartável é \"só vapor\"; solventes domésticos para extrair — incêndio.",
      "TERMOS. Biodisponibilidade — fração que chega à circulação. Primeira passagem — metabolização hepática inicial.",
      "SÍNTESE. Escolha via sabendo troca velocidade × previsibilidade; evita reforço precoce oral.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Contrastar curvas de início rápido versus tardio entre vias.",
      "Explicar erro de re-dose precoce em via oral usando a linha do tempo desta aula.",
      "Relacionar combustão com agravo respiratório genérico e COA com biodisponibilidade, não com velocidade automática."
    ],
    closingSummary:
      "Desenhe 0–8 h com duas curvas grosseiras (oral vs inalação) e marque onde usuários costumam errar ao tomar segunda dose.",
    quiz: [
      q(
        "Por que esperar antes de reforçar dose oral?",
        3,
        "Porque metabolismo não existe",
        "Porque oral age sempre em 30 segundos",
        "Porque THC oral não passa fígado",
        "Porque o pico pode tardar horas e uma dose extra precipita desconforto intenso"
      ),
      q(
        "Vaporizar versus fumar, em saúde respiratória de alto nível:",
        1,
        "São idênticos biologicamente",
        "Vapor pode reduzir subprodutos da combustão mas não isenta risco respiratório",
        "Fumar é sempre mais seguro",
        "Ambos curam DPOC"
      ),
      q(
        "Tópicos cosméticos frequentemente:",
        2,
        "Garantem efeito sistêmico forte sempre",
        "Substituem Rx sem estudo",
        "Têm absorção sistêmica limitada dependendo da formulação — checar evidência",
        "São irrelevantes para dermatologia"
      )
    ],
    professorNotes:
      "Proibir tutorial de solvente. Curvas esquemáticas sem doses numéricas irresponsáveis.",
    media: MEDIA_STANDARD
  },

  "c101-l09-legalidade-br-eua": {
    introduction:
      "Lei é texto que muda; jurisprudência cria precedentes. Formato desta aula: investigação guiada — você coleta fontes datadas e sabe quando pagar advogado. Conecta-se à aula de categorias regulatórias: lá vimos rótulo; aqui vemos onde verificar norma.",
    body: [
      "OBJETIVO. Executar protocolo multi-fonte Brasil/EUA sem equivalências falsas.",
      "PROTOCOLO BRASIL.\n\n1. Palavra-chave em domínio `.gov.br` oficial.\n\n2. Conferir data da matéria com data da lei hiperligada.\n\n3. Preferir PDF do Diário Oficial.\n\n4. Caso judicial: leia ementa integral — manchete pode omitir limite.",
      "PROTOCOLO EUA (turismo ou negócio).\n\n1. Estado + \"cannabis statute\".\n\n2. Limites flora vs extrato — conversões diferem.\n\n3. Aeroportos e transporte interestadual seguem regras federais em muitos pontos.",
      "MODELO DE FICHA DE PESQUISA (copiar).\n\n1. Pergunta jurídica em uma frase.\n\n2. URL oficial copiado.\n\n3. Data da norma ou decisão.\n\n4. Data em que você consultou.\n\n5. Lacuna que só advogado fecha (caso concreto).",
      "ERRO-TIPO — MANCHETE VS EMENTA. Jornal diz \"Supremo liberou cultivo\" mas ementa limita a hipótese específica; quem só lê título constrói plano ilegal. Sempre abrir documento.",
      "EXEMPLOS. Importação Anvisa ≠ mala de familiar; Colorado adult-use versus conta bancária federal; servidor público sujeito a teste apesar de receita.",
      "SÍNTESE. Você deixa de depender de headline e entrega pacote organizado ao advogado.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Enumerar fontes primárias prioritárias Brasil/EUA para cannabis.",
      "Produzir ficha de pesquisa com URL datada usando o modelo desta aula.",
      "Reconhecer erro típico de confiar só em manchete sem ler texto oficial."
    ],
    closingSummary:
      "Preencha ficha modelo deixando um campo vazio intencionalmente para interpretação de caso concreto — levar à consulta jurídica.",
    quiz: [
      q(
        "Esta aula substitui advogado?",
        0,
        "Não — ensina higiene de pesquisa e quando escalar",
        "Sim para crimes federais nos EUA",
        "Sim para contratos internacionais multimillionários",
        "Sim se você usou Ctrl+F no Twitter"
      ),
      q(
        "Por que leis estaduais nos EUA não \"apagam\" tensões federais?",
        2,
        "Porque Twitter disse que sim",
        "Porque não existem estados",
        "Porque domínios federais (transporte interestadual, certos empregos, bancos) podem conflitar",
        "Porque cannabis virou mineral"
      ),
      q(
        "Boas práticas ao pesquisar Brasil incluem:",
        3,
        "Usar apenas meme",
        "Ignorar data",
        "Confiar em cópia não hiperlinkada",
        "Checar texto oficial em domínio governamental e registrar data de consulta"
      )
    ],
    professorNotes:
      "Atualizar URLs a cada semestre; sessão opcional com advogado voluntário.",
    media: { ...MEDIA_STANDARD, needsInfographic: true }
  },

  "c101-l10-seguranca-limites": {
    introduction:
      "Esta aula fecha o arco ético: o que o Cannabis 101 entrega com rigor e o que está fora de escopo. É complementar à boas-vindas (método) e à redução de danos (cenários), mas focada em políticas editoriais, menores, saúde mental e comunicação online.",
    body: [
      "O QUE ESTE CURSO OFERECE. Alfabetização técnica: ler COA, entender vias, reconhecer voláteis, preparar perguntas clínicas, pesquisar lei em fonte primária, aplicar redução de danos responsável e encaminhar para salas avançadas do campus com pré-requisitos claros.",
      "O QUE ESTE CURSO NÃO FAZ. Não prescreve, não promete cura, não ensina crime nem evasão de fiscalização, não substitui psiquiatria ou advocacia.",
      "LIMITES E SEGURANÇA. Histórico de psicose ou bipolaridade não tratados exige conversa psiquiátrica antes de experimentação recreativa com THC — não é moralismo, é farmacologia de risco.",
      "PASSO A PASSO — casa segura.\n\n1. Inventário honesto de psicoativos incluindo álcool.\n\n2. Travas físicas e digitais com menores.\n\n3. Conversa franca com rede de apoio sobre objetivos terapêuticos autorizados.",
      "INTERNET RESPONSÁVEL.\n\n1. Não filmar terceiros intoxicados sem consentimento.\n\n2. Sem tutorial de solvente ou explosivo.\n\n3. Rotular opinião versus evidência ao compartilhar.",
      "CONCEITOS (PORTUGUÊS). Dever de cuidado (duty of care) — obrigação mínima de não agravar risco alheio com conselho negligente. Gatilho (trigger) — estímulo que pode reativar quadro psiquiátrico em pessoa vulnerável — comunicar ao profissional.",
      "EXEMPLOS. Crise de ansiedade isolada sem ajuda; adolescente acha produto \"legal\" porque pai escondeu mal; post irresponsável custando emprego.",
      "SÍNTESE. Contrato ético explícito — menos ambiguidade, menos acidente previsível.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Listar três entregas positivas do Cannabis 101 e três limites duros.",
      "Planejar mitigação doméstica para convivência com menores.",
      "Explicar dever de cuidado e gatilho em contexto de comunicação responsável."
    ],
    closingSummary:
      "Uma frase de política pessoal de postagem prudente — exemplo: \"Compartilho apenas comunicados oficiais ou artigos com métodos explícitos citados\".",
    quiz: [
      q(
        "O Cannabis 101 compromete-se a:",
        2,
        "Receita magistral universal",
        "Evasão de fiscalização como módulo bonus",
        "Educação responsável sem prometer cura nem orientar crime",
        "Garantia de emprego na indústria ilegal"
      ),
      q(
        "Histórico de psicose não tratada e THC recreativo:",
        1,
        "Combinação trivia irrelevante",
        "Deve ser discutido urgentemente com psiquiatra antes de qualquer experimentação",
        "É sempre seguro em baixa dose mágica",
        "Substitui antipsicótico"
      ),
      q(
        "Armazenamento com menores exige:",
        3,
        "Gaveta sem tranca porque confiança",
        "Rotular como vitaminas",
        "Mostrar como piada",
        "Barreira física e linguagem honesta sobre risco"
      )
    ],
    professorNotes:
      "Folha CAPS/CVV e política escolar sobre substâncias. Sem culpar vítimas.",
    media: MEDIA_INTRO
  },

  "c101-l11-proximas-trilhas": {
    introduction:
      "Fecho orientador: você escolhe trilhas avançadas no campus com critérios de segurança jurídica, física e biossegurança. Formato: matriz decisória com ids reais dos cursos THCProce.",
    body: [
      "OBJETIVO. Selecionar próximo módulo usando objetivo declarado, pré-requisitos e riscos típicos.",
      "MATRIZ DECISÓRIA (IDS DE CURSO NO MAPA).\n\n• Cultivo coberto / estufa — cultivo-greenhouse.\n\n• Campo aberto — cultivo-outdoor.\n\n• Sala fechada LED — cultivo-indoor.\n\n• Pós-colheita — secagem-cura.\n\n• Hash ice/rosin — extracoes-solventless.\n\n• Óleos e solventes (ciência + ética + segurança) — extracao-oleo.\n\n• Bancada analítica — laboratorio.\n\n• Medicina aprofundada — medicina.\n\n• Cozinha infundida — culinaria.\n\n• Genética — genetica.\n\n• Direito e políticas — legislacao.\n\n• Cooperativas — cooperativismo.\n\n• Indústria e carreira — industria.",
      "PREPARAÇÃO FÍSICA GENÉRICA. Área ventilada para aromas fortes; kit EPI básico (luvas nitrílicas, óculos, máscara PFF2 para poeiras se política permitir) antes mesmo de aulas teóricas de extração.",
      "PASSO A PASSO — escolha de carreira.\n\n1. Declare objetivo: pesquisa agronómica licenciada, apoio a paciente, comunicação científica, extração industrial.\n\n2. Liste lacunas (matemática de solução nutritiva, bioestatística, ética).\n\n3. Escolha uma trilha principal e uma paralela leve para manter base.",
      "RISCOS SEM FORMAÇÃO ADICIONAL. Solventes hidrocarbonetos — incêndio; comunicação de doses sem contexto — responsabilidade ética; consultoria sem atualizar portarias — multa a cliente.",
      "REVISÃO. Antes de indoor/outdoor, releia checklist da aula da planta e quiz da aula de COA — coerência técnica.",
      "SÍNTESE. Curiosidade madura evita acidente previsível; retorno periódico ao 101 mantém ética.",
      FOOTNOTE_MATERIALS
    ].join("\n\n"),
    objectives: [
      "Selecionar trilha alinhada a objetivo declarado citando ao menos dois ids de curso do mapa.",
      "Reconhecer riscos específicos de extração e cultivo sem formação complementar.",
      "Planejar revisão periódica do Cannabis 101 como âncora ética."
    ],
    closingSummary:
      "Escolha um id de curso da matriz, um manual oficial ou livro-texto para 30 dias e um lembrete na agenda — compromisso público consigo.",
    quiz: [
      q(
        "Antes de extração com solvente industrial:",
        0,
        "Curso específico de segurança química e ambiente legalmente adequado — não improvisação doméstica",
        "Ventilar cozinha aberta é suficiente sempre",
        "YouTube substitui CREA",
        "ETILENO improvisado em garrafa PET é ok"
      ),
      q(
        "Cultivo profissional demanda:",
        3,
        "Só paixão",
        "Ignorar diários ambientais",
        "Evitar NR por ser chata",
        "Registro de variáveis ambientais, lei local e segurança elétrica"
      ),
      q(
        "Melhor uso futuro deste 101:",
        1,
        "Encadernar e esquecer",
        "Reconsultar quando ensinar iniciantes ou atualizar políticas internas",
        "Substituir mestrado",
        "Converter-se em consultoria clandestina"
      )
    ],
    professorNotes:
      "Roadmap visual do campus; coordenadores das salas fazem pitch de 90 s cada.",
    media: MEDIA_INTRO
  }
};
