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
  return `Checklists imprimíveis, vídeos longos de bancada e provas com validade institucional ficam na ${officialLabel}. Neste painel priorizamos leitura densa e aplicável; quando um tema pedir vídeo ou PDF, use Materiais e siga para a sala digital THCProce.`;
}

export const CANNABIS101_LESSON_BODIES: Record<string, Cannabis101LessonBody> = {
  "c101-l01-boas-vindas": {
    introduction:
      "Bem-vindo ao Cannabis 101 repensado para uso real no mundo físico: aqui você aprende a ler informações como técnico consciente — definindo objetivos, checando fontes e separando ciência de opinião. Não é necessário histórico na área; é necessário método.",
    body: [
      "OBJETIVO DA AULA. Registrar como estudar cannabis em contexto educativo sem autoprescrição, sem jurismo improvisado e sem misturar marketing com evidência.",
      "EXPLICAÇÃO PRÁTICA. O mercado mistura produtos regulados, conteúdo informal e promessas. O método THCProce no campus é: ler objetivos da aula, percorrer o passo a passo no papel ou num bloquinho, responder ao quiz honestamente e anotar dúvidas com data para pesquisar em fonte primária (Órgão regulador, periódico indexado, serviço de saúde).",
      "PASSO A PASSO para estudar cada próxima aula.\n\n1. Reserve tempo sem multitarefa (vide tempo estimado no topo).\n\n2. Escreva três perguntas que você quer responder antes de começar.\n\n3. Marque no texto onde aparece \"onde aplicar\" (cozinha, consultório discutindo com médico, leitura de laudo).\n\n4. Ao terminar, feche com uma ação concreta: uma verificação, uma lista ou uma conversa profissional agendada — não apenas \"entendi\".\n\n5. Reforce límites: nenhuma aula substitui receituário individualizado nem autorização legal específica.",
      "EXEMPLOS REAIS. Um estudante confunde blog patrocinado com revisão sistemática; outro assume que \"natural\" ignora interação medicamentosa; um produtor licenciado precisa padronizar fichas técnicas internas. Em todos os casos o antídoto é documentar fonte, data e nível de evidência.",
      "ERROS COMUNS. Achar que velocidade de leitura equivale a domínio; copiar doses de terceiros; tratar print de rede social como norma jurídica; omitir menções de uso a profissionais por vergonha.",
      "DICAS PRÁTICAS. Mantenha glossário pessoal de siglas (COA, LOD, CB1…); use modo leitura do navegador para foco; revise o quiz uma semana depois para ver o que esqueceu.",
      "TERMOS IMPORTANTES. Fonte primária: documento original (lei publicada, regulamento, artigo científico integral). Redução de danos: estratégias para diminuir risco quando há exposição a substâncias psicoativas. Titulação clínica: ajuste gradual de dose supervisionado — tema médico, não escolar.",
      "RESUMO OPERACIONAL. Você sai desta aula com um protocolo de estudo que será repetido nas demais: objetivo claro, execução passo a passo, erros antecipados, glossário vivo e limites explícitos.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Adotar uma rotina de estudo aplicável (bloco de notas, datas, quiz de verificação).",
      "Diferenciar evidência de marketing e opinião anônima.",
      "Recitar os limites éticos e legais do Cannabis 101 antes de avançar nas trilhas técnicas."
    ],
    closingSummary:
      "Fixação rápida: escreva à mão uma promessa que você NÃO fará (por exemplo, orientar terceiros sobre dose ou cultivar sem marco legal) e uma habilidade que SIM desenvolverá (ler COA, preparar perguntas ao médico). Isso ancora o restante do curso.",
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
      "Estabeleça contrato oral de sala: perguntas são bem-vindas, autopromoção irresponsável não. Indique serviços de apoio psicológico da instituição se existirem.",
    media: MEDIA_INTRO
  },

  "c101-l02-o-que-e-cannabis": {
    introduction:
      "Cannabis sativa L. não é um slogan — é organismo vivo cujo manejo altera química da inflorescência. Nesta aula você aprende a pensar como agrônomo consciente e como consumidor informado: genética, ambiente, colheita e pós-colheita aparecem como alavancas, não como curiosidade decorativa.",
    body: [
      "OBJETIVO DA AULA. Relacionar estrutura botânica básica, ciclo reprodutivo das flores femininas e fatores de cultivo com o perfil químico observável em laboratório.",
      "EXPLICAÇÃO PRÁTICA. As glândulas tricomicas nas brácteas acumulam resina rica em canabinoides e terpenos. O momento da colheita influencia proporção de precursores ácidos versus formas neutras após decarboxilação térmica ou tempo. Substrato com boa drenagem e arquitetura radicular saudável sustenta metabolismo secundário — por isso \"substrato equilibrado\" aparece em manuais sérios de horticultura aplicável onde o cultivo é permitido.",
      "PASSO A PASSO — checklist conceitual para avaliar qualidade de informação sobre uma cultivar (sem julgar legalidade local).\n\n1. Pergunte qual é o nome botânico ou registrado e não só o apelido de Instagram.\n\n2. Exija dados de colheita: indoor/outdoor, região climática, idade da planta na coleta.\n\n3. Busque COA ou relatório equivalente com data e laboratório acreditado quando produto for comercializado legalmente.\n\n4. Compare dois lotes com mesmo nome: se química diverge muito, desconfie de padronização ou de rotulagem genérica.",
      "EXEMPLOS REAIS. Duas amostras \"Purple\" podem ter terpenos completamente diferentes por estufa versus campo; óleo com 30 mg/mL em rótulo precisa bater com método analítico declarado; semente para fibra não conversa com flor medicinal regulada.",
      "ERROS COMUNS. Trazer analogia de \"erva de casa\" sem métricas; ignorar que fotoperíodo e estresse hidrico moderado alteram expressão química; assumir cor como proxy de potência.",
      "DICAS PRÁTICAS. Desenhe em papel uma flor feminina e marque bráctea, pistilo, tricoma — mesmo esquemático melhora memória; quando assistir vídeo técnico, pause nos gráficos de tempo × temperatura da secagem.",
      "TERMOS IMPORTANTES. Cultivar: linhagem estabilizada ou seleção comercial. Fenótipo: conjunto observável resultante de genótipo + ambiente. Pós-colheita: secagem, cura, armazenamento que modificam aroma e canabinoides menores.",
      "RESUMO OPERACIONAL. Cannabis é planta mensurável: mesmos genes não garantem mesmo resultado sem registrar ambiente e processo. Isso prepara terreno para ler COA e para entender variação entre sessões de uso quando falarmos de farmacologia.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Nomear partes da flor relevantes para acúmulo de resina e explicar por que colheita importa.",
      "Relacionar substrato, saúde radicular e metabolismo secundário em nível conceitual.",
      "Questionar rótulos marketeiros usando evidência mínima (lote, método, laboratório)."
    ],
    closingSummary:
      "Escreva uma comparação em duas colunas: \"mesmo nome genético\" versus \"mesmo perfil químico garantido\" — liste o que teria de ser igual para a segunda coluna ser verdadeira (ambiente, colheita, análise).",
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
      "Se demonstração ao vivo com planta não cannabis for possível (tomateiro, manjericão), mostre tricomas microscópicos como paralelo seguro.",
    media: MEDIA_STANDARD
  },

  "c101-l03-canhamo-maconha-medicinal": {
    introduction:
      "As palavras cânhamo, maconha e cannabis medicinal travam políticas públicas porque misturam botânica, lei e estigma. Aqui você aprende a classificar produtos e trâmites como analista: lendo categorias regulatórias, não apenas manchetes.",
    body: [
      "OBJETIVO DA AULA. Separar cadeias legais típicas de baixo THC (fibra, semente, cosméticos com limites), mercados informais de flores psicoativas e programas medicinais com prescrição e rastreabilidade.",
      "EXPLICAÇÃO PRÁTICA. No Brasil, produtos canabinoides para prescrição seguem canais específicos (importação autorizada, registrados quando existirem). Associações de pacientes e decisões judiciais individuais criam camadas extras que mudam com o tempo — por isso data da sua pesquisa importa. Nos EUA, permissão estadual não apaga tensões federais em vários domínios.",
      "PASSO A PASSO para ler um rótulo ou portaria resumida.\n\n1. Identifique se o produto é alimento, cosmético, suplemento proibido na categoria local ou medicamento.\n\n2. Veja teores declarados de THC e CBD e unidade (mg por dose, % peso/peso).\n\n3. Busque selo de GMP ou farmácia autorizada quando aplicável.\n\n4. Cruze com orientação do prescritor — rótulo não substitui monitoramento clínico.",
      "EXEMPLOS REAIS. Óleo importado com registro sanitário versus frasco comprado informalmente; flor medicinal em programa canadense versus flor sem rastreio; CBD isolado embalado como cosmético sem dose.",
      "ERROS COMUNS. Achar que \"CBD de shopping\" resolve quadro psiquiátrico grave sem avaliação; confundir permissão individual com política geral; presumir que UE = Brasil.",
      "DICAS PRÁTICAS. Mantenha pasta digital com PDF da última nota técnica da Anvisa que você consultou; quando médico prescrever, peça esclarecimento sobre horários de administração e interações que você já usa (anticoagulante, anticonvulsivante).",
      "TERMOS IMPORTANTES. THC: canabinoide psicoativo predominante na maioria das flores adultas. CBD: canabinoide não psicoativo nas doses usuais discutidas clinicamente, mas com interações. Cannabis medicinal: uso dentro de arcabouço legal e clínico — não marketing de loja.",
      "RESUMO OPERACIONAL. Você distingue três mundos com critérios objetivos (rótulo, prescrição, rastreio) e sabe quando escalar para advogado ou farmacêutico.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Classificar produtos por categoria regulatória genérica usando rótulo e documentação.",
      "Explicar por que decisões jurídicas individuais não substituem consulta personalizada.",
      "Preparar perguntas objetivas ao prescritor sobre titulação e interações."
    ],
    closingSummary:
      "Monte um fluxograma pessoal em três caixas: \"Baixo THC industrial\", \"Medicinal regulado\", \"Informal sem rastreio\" — guarde uma pergunta para cada caixa que só um profissional habilitado pode responder.",
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
      "Datas nos slides. Evite nomes de pacientes reais. Reforce confidencialidade e estigma.",
    media: MEDIA_STANDARD
  },

  "c101-l04-canabinoides": {
    introduction:
      "THC, CBD, CBG e CBN não são encantamentos — são moléculas com assinatura massa-espectrométrica em COA. Você aprende a ler números como químico iniciante: porcentagem, mg/g, limites de detecção e degradção por oxidação.",
    body: [
      "OBJETIVO DA AULA. Interpretar laudos quantitativos básicos e relacionar armazenamento com perfil de canabinoides, sem extrapolar para promessa clínica.",
      "EXPLICAÇÃO PRÁTICA. COA costuma listar THCA, CBDA, THC total e CBD total estimados por soma ponderada após decarboxilação completa teórica — cada laboratório declara equação. LOD/LOQ informam confiança em valores baixos. Quando THCA alto envelhece exposto a luz e oxigênio, parte pode migrar para THC neutro e oxidar para CBN, mudando experiência subjetiva e perfil terapêutico discutido em literatura.",
      "PASSO A PASSO — leitura de COA (produto legal).\n\n1. Confirme nome do laboratório, acreditação e data.\n\n2. Veja unidade: % em massa seca versus mg por unidade de produto acabado.\n\n3. Compare THC total versus THCA isolado para entender quanto vem de precursor.\n\n4. Verifique contaminantes (pesticidas, metais, micotoxinas) se relatório incluir — segurança antes de potência.\n\n5. Registre número de lote e guarde PDF por um ano se você for paciente acompanhando titulação.",
      "EXEMPLOS REAIS. Flor com 22% THC total declarado mas micotoxina acima do permitido é reprovada independente de potência; óleo com 25 mg/dose pode variar ±10% conforme método HPLC usado; CBN elevado pode indicar estoque antigo mal armazenado.",
      "ERROS COMUNS. Comparar potências entre países sem converter unidades; ignorar umidade da amostra na flor; acreditar que \"full spectrum\" sem dados é sinônimo de laudo.",
      "DICAS PRÁTICAS. Planilhe em casa quatro colunas: lote, THC total, terpenos totais declarados, data — observação longitudinal educativa. Discussão de dose mg/kg é médica; aqui você só aprende a ler o que está impresso.",
      "TERMOS IMPORTANTES. Decarboxilação: perda de grupo carboxila térmica ou lenta convertendo ácidos em formas neutras. Titulação: ajuste gradual sob supervisão clínica. Farmacocinética: curva tempo × concentração no sangue — depende da via.",
      "RESUMO OPERACIONAL. Você lê COA como documento técnico, não como meme; associa envelhecimento inadequado a mudança química mensurável.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Explicar diferença entre THCA/CBDA e THC/CBD neutros em nível introdutório.",
      "Navegar seções típicas de COA: potência, segurança, método.",
      "Relacionar oxidação e tempo com aumento relativo de CBN descrito na literatura."
    ],
    closingSummary:
      "Baixe um COA público de exemplo (sem dados pessoais) e circule três campos: THC total, data do teste, limite de detecção para contaminantes. Se algo não estiver claro, essa é pergunta para farmacêutico ou prescritor.",
    quiz: [
      q(
        "Por que CBN frequentemente sobe em amostras antigas mal guardadas?",
        2,
        "Porque laboratórios sempre adulteram resultados",
        "Porque CBD vira automaticamente vitamina",
        "Porque THC pode oxidar-se formando mais CBN ao longo do tempo sob luz/oxigênio",
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
      "Tenha slide com COA anonimizado real. Mostre conversão de unidades sem ensinar defraudar ensaios.",
    media: MEDIA_STANDARD
  },

  "c101-l05-terpenos": {
    introduction:
      "Terpenos são hidrocarbonetos voláteis que ditam aroma e contribuem para perfil sensorial. Você aprende a preservá-los como processista: umidade relativa, temperatura de secagem e barreira ao oxigênio são controles, não moda estética.",
    body: [
      "OBJETIVO DA AULA. Correlacionar compostos voláteis com percepção, protocolos caseiros de conservação (onde permitido possuir flor seca legal) e sanidade crítica frente a claims milagrosos.",
      "EXPLICAÇÃO PRÁTICA. Mirceno remete a notas herbáceas; limoneno cítrico; pineno resinoso; linalool floral. GC-MS mede µg/g — nariz humano não é cromatógrafo. Secagem lenta em ambiente escuro com fluxo de ar suave ajuda a preservar monoterpenos mais sensíveis que evaporam acima de 30–35 °C prolongados.",
      "PASSO A PASSO — conservação doméstica responsável (produto legal).\n\n1. Mantenha recipiente opaco com vedante real, não saco plástico perfurado de padaria.\n\n2. Use pacotes/bovedas reguladoras de umidade dentro da faixa recomendada pelo prescritor ou protocolo local (tema médico-fora).\n\n3. Evite geladeira se não houver ambiente seco estável — condensação mofa.\n\n4. Abra o pote o mínimo necessário; oxigênio fragmenta terpenos.",
      "EXEMPLOS REAIS. Flor guardada em vidro âmbar mantém aroma melhor que potinho transparente em janela; concentrado exposto aquece no bolso e perde topo aromático; café guardado ao lado contamina odor por adsorção.",
      "ERROS COMUNS. Congelar sem embalar adequadamente; misturar genéticas sem etiqueta; confundir cheiro forte com potência alta.",
      "DICAS PRÁTICAS. Diário sensorial anônimo com data, aroma e contexto — útil para conversas clínicas honestas; fotografe rótulo + lote sempre.",
      "TERMOS IMPORTANTES. Evaporação: perda física de voláteis. Oxidação: alteração química. Cura: redistribuição de umidade interna após secagem inicial.",
      "RESUMO OPERACIONAL. Você trata terpenos como ingredientes frágeis de gastronomia molecular — técnica de armazenamento determina o que sobra no nariz.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Nomear três terpenos frequentes e associá-los a notas aromáticas.",
      "Descrever como calor, luz e oxigênio degradam voláteis.",
      "Rejeitar narrativa de cura baseada só no nome de um terpeno."
    ],
    closingSummary:
      "Liste quatro fatores que você controlaria num laboratório caseiro hipotético (luz, temperatura, oxigênio, umidade) e explique qual deles mais sacrificaria se morasse em lugar úmido.",
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
        "Reduzir luz e oxigênio que degradam compostos voláteis",
        "Impedir leitura do rótulo",
        "Substituir orientação médica",
        "Aumentar THC por telepatia"
      )
    ],
    professorNotes:
      "Se possível, passeiam frascos com especiarias para treinar nariz sem usar cannabis.",
    media: MEDIA_INTRO
  },

  "c101-l06-sistema-endocanabinoide": {
    introduction:
      "O sistema endocanabinoide distribui receptores e ligantes endógenos que modulam dor, humor, sono e inflamação — linguagem de feedback biológico, não de \"modo turbo\". Você aprende a traduzir isso em perguntas melhores na consulta médica.",
    body: [
      "OBJETIVO DA AULA. Descrever CB1/CB2 como interfaces de sinalização e listar sinais que devem ser comunicados ao prescritor quando canabinoides fazem parte do tratamento autorizado.",
      "EXPLICAÇÃO PRÁTICA. CB1 concentrado em SNC modula neurotransmissão; CB2 mais presente em imune associa-se a modulação inflamatória em modelos experimentais. Canabinoides exógenos perturbam esse equilíbrio — daí taquicardia, hipotensão ortostática ou sonolência interindividualmente variáveis.",
      "PASSO A PASSO — preparação para consulta.\n\n1. Liste medicamentos atuais com dose e horário.\n\n2. Anote sintomas-alvo e escalas simples (sono 0–10, dor 0–10).\n\n3. Registre episódios adversos (tontura, náusea, palpitação) com data.\n\n4. Pergunte explicitamente sobre interações com anticoagulantes, antiepilépticos, ansiolíticos.\n\n5. Não interrompa psicofármaco por conta própria ao iniciar canabinoides.",
      "EXEMPLOS REAIS. Paciente em warfarina precisa monitoramento INR reforçado; uso concomitante com clobazam altera clearance de CBD em estudos; THC pode exacerbar taquicardia ansiosa transitória.",
      "ERROS COMUNS. Chamar tudo de \"natural\" para ignorar farmacologia; confundir ECS com único receptor ON/OFF; esperar que uma aula substitua semiologia médica.",
      "DICAS PRÁTICAS. Traga artigo de revisão neutra em PDF se médico topar ler; use aplicativo de pressão arterial doméstico se recomendado.",
      "TERMOS IMPORTANTES. Homeostase: equilíbrio dinâmico. Agonismo parcial: ativação incomparável a saturar receptor totalmente. Sinergia prescrita: decisão clínica documentada.",
      "RESUMO OPERACIONAL. Você usa mapa ECS para cooperar com prescritor — não para automedicar com precisão fingida.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Definir ECS como rede moduladora com exemplos fisiológicos cotidianos.",
      "Montar checklist de informações para consulta sobre canabinoides.",
      "Relacionar variabilidade individual com necessidade de monitoramento clínico."
    ],
    closingSummary:
      "Escreva cinco linhas de um \"relato estruturado\" que você levaria ao médico após uma semana de uso autorizado: sintomas-alvo, horários, eventos adversos leves, hidratação, sono.",
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
      "Convide farmacêutico para minutos finais se política escolar permitir. Sem humor grosseiro sobre \"viajar\".",
    media: { ...MEDIA_STANDARD, needsInfographic: true }
  },

  "c101-l07-usos-e-reducao-de-danos": {
    introduction:
      "Redução de danos não é \"liberar geral\" — é engenharia de risco quando há exposição real a substâncias psicoativas. Você monta checklists operacionais para si e para orientar terceiros dentro da lei e da ética.",
    body: [
      "OBJETIVO DA AULA. Construir protocolos situacionais (casa, evento, estrada) que diminuam trauma, overdose subjectiva e consequências jurídicas sem romantizar uso.",
      "EXPLICAÇÃO PRÁTICA. Baixa dose inicial com supervisão clínica quando aplicável evita efeito ditado \"too much\". Combinação com álcool ou benzodiazepínicos aumenta sedação e queda. Operação de veículos sob THC não é aceitável onde lei proíbe ou tolerância zero existe.",
      "PASSO A PASSO — checklist público evento seguro (uso onde legal e adulto).\n\n1. Defina limite prévio por escrito.\n\n2. Tenha água isotônica e alimento não gorduroso leve para modular absorção futura se ingestível.\n\n3. Mantenha contato de pessoa sóbria.\n\n4. Saiba endereço de serviço de emergência.\n\n5. Guarde produtos em recipiente original rotulado.",
      "PASSO A PASSO — ambiente doméstico com crianças.\n\n1. Trave armário alto.\n\n2. Use embalagens à prova de criança.\n\n3. Nunca descreva produto como doce.\n\n4. Descarte restos conforme orientação local farmacêutica.",
      "EXEMPLOS REAIS. Festas com \"edibles\" sem rotulagem causam idas a PS; motorista recreativo perde CNH em países com teste saliva; mistura com antidepressivos pode alterar QT em casos raros — comunicação vale.",
      "ERROS COMUNS. Impor ritual \"para socializar\"; minimizar taquicardia como frescura; não ligar 192 quando há confusão súbita ou dor torácica.",
      "DICAS PRÁTICAS. Salve números de CVV e CAPS no telefone; ensine amigos a respiração 4-7-8 só como primeira tentativa enquanto buscam ajuda se não melhora.",
      "TERMOS IMPORTANTES. Set e setting: contexto psicológico e físico modula experiência. Overdose comportamental: angústia intensa não fatal mas urgência psiquiátrica possível.",
      "RESUMO OPERACIONAL. Você possui dois fluxogramas — adulto responsável fora de casa e guardião em casa — ambos centrados em transparência e ajuda formal.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Redigir checklist de redução de danos para dois cenários distintos.",
      "Explicar por que misturas com depressores do SNC são especialmente perigosas.",
      "Identificar sinais que exigem emergência ou linha de crise."
    ],
    closingSummary:
      "Compare seus dois checklists com colega e troque um item que cada um esqueceu — objetivo é cobertura social de risco real.",
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
      "Distribua cartão com números de emergência regionais. Zero glamourização de binge.",
    media: MEDIA_STANDARD
  },

  "c101-l08-formas-consumo": {
    introduction:
      "Via de administração redefine curva tempo × efeito e perfil de risco pulmonar ou gastrointestinal. Você aprende a escolher perguntas certas — não a improvisar labor caseiro de extratos potentes.",
    body: [
      "OBJETIVO DA AULA. Comparar inalação térmica sem combustão, combustão, ingestão oral e tópica quanto a início, duração e armadilhas clássicas.",
      "EXPLICAÇÃO PRÁTICA. Inalação atinge picos mais rápidos; primeira passagem hepática na ingestão atrasa pico e aumenta variabilidade individual por enzimas intestinais e hepáticas. Tópicos frequentemente não atingem concentrações sistêmicas altas — marketing costuma superestimar.",
      "PASSO A PASSO — ingestível recreativo onde permitido (contexto adulto orientado).\n\n1. Registre horário exato da primeira dose pequena.\n\n2. Aguarde pelo menos 120 minutos antes de considerar complemento salvo orientação contrária profissional.\n\n3. Não misture com álcool na mesma curva de aprendizado.\n\n4. Prefira ambiente calmo na primeira experiência oral.",
      "PASSO A PASSO — inalação térmica versus combustão.\n\n1. Entenda que vaporização reduz mas não zera irritantes respiratórios.\n\n2. Pacientes com DPOC ou asma devem evitar inalação sem pneumologista.\n\n3. Limpe equipamentos conforme manual para evitar biofilme.",
      "EXEMPLOS REAIS. Turista come brownie inteiro porque \"demorou\"; paciente idoso absorve diferente por medicamentos enzimáticos; adolescente replica TikTok de dab caseiro — alto risco térmico/químico.",
      "ERROS COMUNS. Converter dose oral mg diretamente para mg inalados sem conversão clínica; achar que vape descartável é \"apenas água\"; usar solventes domésticos para extrair — incêndio.",
      "DICAS PRÁTICAS. Mantenha diário com via, horário e sintoma-alvo; hidrate com água, não com álcool energético.",
      "TERMOS IMPORTANTES. Biodisponibilidade: fração que chega circulação. Primeira passagem: metabolização hepática inicial.",
      "RESUMO OPERACIONAL. Você escolhe via sabendo trade-offs — velocidade versus previsibilidade — e evita armadilhas clássicas de reforço precoce.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Contrastar curvas de início rápido versus tardio entre vias.",
      "Explicar erro de re-dose precoce em via oral.",
      "Relacionar combustão com agravo respiratório genérico."
    ],
    closingSummary:
      "Simule num papel uma linha do tempo de 0–8 h para ingestão oral versus inalação única — marque onde está o pico provável e onde usuários costumam errar tomando segunda dose.",
    quiz: [
      q(
        "Por que esperar antes de reforçar dose oral?",
        3,
        "Porque metabolismo não existe",
        "Porque oral age sempre em 30 segundos",
        "Porque THC oral não passa fígado",
        "Porque pico pode tardar horas e dose extra precipita desconforto intenso"
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
      "Proibição explícita de tutorial solvente. Mostre curvas esquemáticas sem doses numéricas irresponsáveis.",
    media: MEDIA_STANDARD
  },

  "c101-l09-legalidade-br-eua": {
    introduction:
      "Lei é texto que muda; interpretação judicial cria precedentes. Você aprende um fluxo de pesquisa jurídica amadora segura: onde clicar, como datar achados e quando pagar advogado.",
    body: [
      "OBJETIVO DA AULA. Executar protocolo de verificação multi-fonte para Brasil e EUA sem concluir equivalências falsas.",
      "EXPLICAÇÃO PRÁTICA. Brasil: consultar Planalto, Senado, Anvisa, STF conforme tema; decisões individuais não criam direito geral automático. EUA: distinguir Schedule federal DEA de leis estaduais de posse adulta; transporte interestadual permanece caixa de Pandora.",
      "PASSO A PASSO — pesquisa Brasil.\n\n1. Escreva palavra-chave em site oficial `.gov.br`.\n\n2. Compare data da matéria com data da legislação hiperlinkada.\n\n3. Baixe PDF do Diário Oficial quando possível.\n\n4. Se caso judicial, leia ementa integral — título de jornal pode omitir limitação.",
      "PASSO A PASSO — pesquisa EUA para turismo ou negócios.\n\n1. Estado de destino + \"cannabis statute\".\n\n2. Verifique limite gramas flora seca versus extrato — conversões diferem.\n\n3. Cruze com políticas aeroportuárias federais.",
      "EXEMPLOS REAIS. Importação Anvisa x mala trazida por familiar — não são o mesmo trâmite; Colorado permite posse adulta mas empresa bancária federal pode recusar conta; funcionário público sujeito a teste mesmo com receita.",
      "ERROS COMUNS. Acreditar influencer jurídico; usar tradução automática de lei sem revisão; presumir reciprocidade entre países.",
      "DICAS PRÁTICAS. Planilhe \"última verificação\" com URL + data; guarde capturas de tela com carimbo para histórico pessoal não litigioso.",
      "TERMOS IMPORTANTES. Descriminalização versus legalização regulada; jurisprudência; precedente vinculante versus não vinculante conforme instância.",
      "RESUMO OPERACIONAL. Você deixa de ser refém de headline e passa a pedir parecer fundamentado a advogado com pacote organizado.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Enumerar fontes primárias prioritárias Brasil/EUA para cannabis.",
      "Produzir ficha de pesquisa com URL datada.",
      "Reconhecer limites do autodidata jurídico."
    ],
    closingSummary:
      "Monte uma ficha modelo com três campos vazios que só um advogado preenche (interpretação caso concreto, risco trabalhista, tributário). Guarde para próxima consulta paga.",
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
      "Atualizar URLs uma vez por semestre. Convide advogado voluntário para FAQs.",
    media: { ...MEDIA_STANDARD, needsInfographic: true }
  },

  "c101-l10-seguranca-limites": {
    introduction:
      "Segurança combina pedagogy boundaries e vida real: menores, saúde mental, honestidade clínica e recusa em ensinar crime. Você formaliza limites como engenheiro de sistema — falhas previstas e mitigadas.",
    body: [
      "OBJETIVO DA AULA. Explicitar o que o Cannabis 101 faz e deixa de fazer e converter isso em hábitos domésticos e comunicacionais.",
      "EXPLICAÇÃO PRÁTICA. Curso não cura, não prescreve, não ajuda burlar lei. Faz: ensinar leitura técnica e ética. Segurança psíquica inclui reconhecer histórico de psicose ou bipolaridade como bandeira vermelha para uso não supervisionado de THC.",
      "PASSO A PASSO — casa segura.\n\n1. Inventário de todos psicoativos incluindo álcool.\n\n2. Travas físicas e digitais onde menores moram.\n\n3. Conversa franca com rede de apoio sobre objetivos terapêuticos.",
      "PASSO A PASSO — internet responsável.\n\n1. Não filmar terceiros intoxicados sem consentimento.\n\n2. Não dar tutorial solvente ou explosivo.\n\n3. Rotular opinião versus evidência ao compartilhar.",
      "EXEMPLOS REAIS. Crise de ansiedade pós uso tratada inicialmente com isolamento — pior desfecho; adolescente acha produto \"legal\" na cozinha porque pai escondeu mal; funcionário perde emprego por post irresponsável.",
      "ERROS COMUNS. Humorizar blackout; ridicularizar quem parou; usar linguagem sexualizada com minoridade ao redor.",
      "DICAS PRÁTICAS. Configure modo bem-estar no telefone; salve contato terapêutico antes da crise.",
      "TERMOS IMPORTANTES. Duty of care: dever mínimo ao próximo. Trigger: estímulo que reativa quadro psiquiátrico.",
      "RESUMO OPERACIONAL. Você sai com contrato ético explícito — menos ambiguidade, menos acidente previsível.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Listar três limites editoriais deste curso com suas razões.",
      "Planejar mitigação doméstica para convivência com menores.",
      "Identificar quando pausar consumo e buscar emergência."
    ],
    closingSummary:
      "Escreva uma política pessoal de postagem em uma frase legalmente prudente — exemplo: \"Compartilho só literatura revisada por pares ou comunicados oficiais\".",
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
      "Folha com CAPS/CVV e política de escola sobre substâncias. Sem culpar vítimas.",
    media: MEDIA_INTRO
  },

  "c101-l11-proximas-trilhas": {
    introduction:
      "O fecho do 101 direciona você para módulos onde ciência encontra oficina: substratos, IPM (manejo integrado de pragas), solventless, farmacologia clínica aprofundada. Você sai com mapa de pré-requisitos e lista de equipamentos mentais.",
    body: [
      "OBJETIVO DA AULA. Escolher próximo módulo campus com critérios de segurança jurídica, física e biossegurança já internalizados.",
      "EXPLICAÇÃO PRÁTICA. Cultivo avançado exige eletricidade segura, diário ambiental (temperatura, UR, VPD conceitual), manejo nutricional por estádio fenológico — temas da sala Indoor/Outdoor. Extrações solventless pedem limpeza tipo labor alimentício. Medicina canabinoide avançada volta a drug–drug interactions e documentação SOAP.",
      "PASSO A PASSO — decisão de carreira.\n\n1. Liste seu objetivo: pesquisa agronômica licenciada, atendimento paciente, comunicação científica.\n\n2. Mapeie lacunas de habilidade (matemática de solução nutritiva, bioestatística, ética).\n\n3. Agende uma trilha principal e uma paralela leve para não abandonar base.",
      "PASSO A PASSO — preparação física genérica.\n\n1. Reserve área ventilada para eventual trabalho com aromas fortes.\n\n2. Monte kit EPI básico mesmo antes de aulas teóricas — luvas nitrílicas, óculos, máscara PFF2 se política permitir poeiras.",
      "EXEMPLOS REAIS. Estudante vai direto para solvente hidrocarboneto sem curso de segurança — incêndio; comunicador espalha doses sem contexto — processo ético; técnico legal não atualiza portarias — multa cliente.",
      "ERROS COMUNS. Supor que 101 substitui NR aplicável; ignorar logs ambientais; plagiar protocolos clínicos.",
      "DICAS PRÁTICAS. Volte ao quiz do módulo 2 antes de iniciar cultivo; mantenha glossário vivo exportável para PDF.",
      "TERMOS IMPORTANTES. Biossegurança: conjunto de barreiras contra contaminante biológico/químico. IPM: pragas com múltiplas alavancas não só pesticida.",
      "RESUMO OPERACIONAL. Você fecha ciclo com maturidade para não transformar curiosidade em acidente previsível.",
      linkClosing("sala digital oficial THCProce")
    ].join("\n\n"),
    objectives: [
      "Selecionar trilha alinhada a objetivo declarado e listar dois pré-requisitos.",
      "Reconhecer riscos específicos de extração e cultivo sem formação complementar.",
      "Planejar revisão periódica deste 101 como âncora ética."
    ],
    closingSummary:
      "Escolha uma trilha e um livro-texto ou manual oficial que você lerá nos próximos 30 dias — anote na agenda com lembrete.",
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
      "Roadmap visual campus. Convide coordenadores das outras salas para pitch de 90 segundos cada.",
    media: MEDIA_INTRO
  }
};
