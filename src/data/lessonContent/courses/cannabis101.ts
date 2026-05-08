import type { LessonStreamContent } from "../types";

/** Cannabis 101 — conteúdo editorial completo (10 aulas). */
export const CANNABIS101_LESSONS = [
  {
    title: "Cannabis 101: boas-vindas e roteiro do curso",
    introduction:
      "Esta primeira aula é só sobre o que é o Cannabis 101 dentro do campus THCProce: para quem é, como navegar, o que vem nas próximas nove sessões e onde ficam os limites legais e éticos. A parte técnica — sistema endocanabinoide, receptores e canabinoides — começa na aula seguinte, com calma e ordem.",
    body: `O Cannabis 101 é o curso-base da escola: alfabetização responsável em torno da planta, da biologia humana relevante e das narrativas que cercam uso medicinal, adulto e educação institucional. Não é consultório, não é prescrição e não substitui engenheiro agrônomo, farmacêutico ou advogado quando a decisão é operacional ou clínica.

Nas próximas aulas você vai, em sequência: entrar no ECS e nos receptores CB1/CB2; comparar THC, CBD, CBG e CBN; estudar terpenos e a hipótese de entourage com pé no chão; discutir uso medicinal sem hype; situar legalidade no Brasil; aprender a ler estudos; integrar o campus com Moodle e salas avançadas; fechar com revisão integrada e encaminhamento ético para cultivo, extração ou outras trilhas.

Aqui no painel: use o índice à esquerda para saltar entre aulas, marque “aula vista” quando terminar a leitura (ganha XP como registro formativo) e “Outras áreas” à direita troca de curso sem sair do campus. Conteúdos longos ou PDFs complementares podem continuar linkados ao Moodle — o texto principal da trilha está aqui.

Três eixos THCProce que vão repetir ao longo do curso: (1) educação científica institucional — o que fazemos neste ambiente; (2) uso medicinal apenas dentro da lei e com profissional habilitado quando couber prescrição ou conduta clínica; (3) narrativas de uso adulto onde a legislação aplicável vale, sem misturar mensagens nem públicos.`,
    objectives: [
      "Definir o papel do Cannabis 101 no campus THCProce e o que ele não substitui.",
      "Nomear, em alto nível, o tema de cada uma das dez aulas da trilha.",
      "Usar o painel de aula (índice, vista registrada, troca de área) com autonomia.",
      "Reconhecer os três eixos institucionais: educação, medicinal dentro da lei, uso adulto conforme legislação."
    ],
    closingSummary:
      "Você situou o Cannabis 101 como porta de entrada: roteiro das dez aulas, navegação no campus e limites éticos. Na próxima aula começamos o bloco técnico com o sistema endocanabinoide, as moléculas da planta e os receptores CB1/CB2.",
    quiz: [
      {
        question: "O Cannabis 101 no campus THCProce tem como função principal:",
        options: [
          "Substituir médico, agrônomo e advogado nas decisões do aluno",
          "Oferecer alfabetização científica e institucional, sem papel de consultório ou licenciamento",
          "Garantir resultado clínico a quem concluir as dez aulas",
          "Ensinar apenas cultivo indoor sem contexto legal"
        ],
        correctIndex: 1
      },
      {
        question: "Dúvidas sobre dose, prescrição ou quadro clínico individual devem ser levadas:",
        options: [
          "Somente ao chat da comunidade da escola",
          "A profissional habilitado e aos canais legais aplicáveis — não a esta aula como consultório",
          "Ao primeiro vídeo encontrado em rede social",
          "A ninguém, pois o curso cobre todos os casos"
        ],
        correctIndex: 1
      },
      {
        question: "O bloco técnico sobre sistema endocanabinoide (ECS), receptores e canabinoides da planta começa:",
        options: [
          "Nesta mesma aula, antes do roteiro",
          "Na aula seguinte, após esta introdução ao curso",
          "Somente na última aula do módulo",
          "Apenas nos cursos de cultivo, não no Cannabis 101"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Checklist: como navegar o painel de aula e registrar vista",
      "Mapa das dez aulas (uma linha por tema — imprimir ou anotar)",
      "Links institucionais THCProce / Moodle quando publicados pelo corpo docente"
    ],
    references: [
      "Comunicados e código de ética THCProce — versão vigente no portal",
      "Índice do curso em `courseOutlines` / programa da aula no próprio campus"
    ],
    professorNotes:
      "Primeira sessão zero-equação: se alguém quiser CB1 na primeira hora, direcione para a aula 2. Reforce que ‘boas-vindas’ não é conteúdo leve demais — é contrato didático com o aluno."
  },

  {
    title: "ECS, moléculas da planta e receptores CB1/CB2",
    introduction:
      "Agora começa o núcleo técnico do Cannabis 101: o sistema endocanabinoide como arcabouço, as moléculas da planta em matriz vegetal e a leitura fisiológica de CB1 e CB2 — afinidade, densidade e contexto explicam por que a mesma concentração pode gerar experiências diferentes entre pessoas, sem transformar o aluno em prescritor.",
    body: `O ECS compreende receptores (principalmente CB1 no sistema nervoso central e CB2 no imune/periférico), ligantes endógenos e enzimas de síntese e degradação. Canabinoides fitogênicos (THC, CBD, CBG, CBN…) modulam esse sistema com afinidades e eficácias diferentes — por isso “cannabis” não é substância única, e sim família química em matriz vegetal (incluindo terpenos e flavonoides).

Ao avançar neste módulo base você deve começar a ler artigos e rótulos com vocabulário estável: agonismo parcial, tolerância, vias de sinalização, “entourage” como hipótese heurística (não dogma comercial) e incertezas honestas da literatura. O campus existe para formar leitores críticos, não para substituir MIP, prescrição ou licenciamento ambiental/fitossanitário.

CB1 concentra-se em estruturas relacionadas a coordenação, memória, recompensa e nocicepção — daí a importância de não simplificar “efeito psicoativo” como mero label. CB2 associa-se a modulação imunoinflamatória periférica, com relevo crescente em pesquisa, mas com mapa ainda em evolução em humanos.

Ligantes endógenos (anandamida, 2-AG…) mostram que o ECS é homeostático: não é ‘ligaço para ficar alto’, é rede de retrocontrole. Agonistas exógenos competem e desviam essa música — por isso titulação em contexto clínico importa, e autocultivo recreational fora da lei permanece risco jurídico e de segurança, mesmo que a anatomia seja a mesma.

Para o leitor de evidências: pergunte sempre população (animal vs humano), via de administração, duração e desfecho medido. O campus treina esse check-list mental para destravar leitura de meta-análises com fervor comercial ao redor.`,
    objectives: [
      "Descrever o ECS em nível introdutório: receptores, ligantes endógenos e papel dos fitocanabinoides na matriz vegetal.",
      "Diferenciar distribuição e papel fisiológico típico de CB1 e CB2 em modelos mais aceitos.",
      "Relacionar agonismo parcial do THC a curva dose–efeito não linear.",
      "Aplicar o filtro população–via–desfecho à leitura de estudos citados em marketing."
    ],
    closingSummary:
      "O ECS e as moléculas da planta deixam de ser abstração; CB1 e CB2 viram âncoras para variabilidade de resposta e leitura de papers. Na próxima aula isolamos THC, CBD, CBG e CBN sem confundir hype com perfil clínico.",
    quiz: [
      {
        question: "Qual característica costuma associar-se ao receptor CB1 na literatura de referência?",
        options: [
          "Alta densidade em certas regiões do SNC em comparação ao tecido periférico",
          "Ausência no encéfalo dos mamíferos",
          "Exclusividade no fígado",
          "Função exclusivamente redox mitocondrial sem interface neural"
        ],
        correctIndex: 0
      },
      {
        question: "2-arachidonoylglycerol (2-AG) é citado como:",
        options: [
          "Terpeno volátil da flor",
          "Ligante endógeno do sistema endocanabinoide",
          "Receptor periférico alternativo ao CB2",
          "Metabolito inerte da clorofila"
        ],
        correctIndex: 1
      },
      {
        question: "Por que ‘mesma dose’ não garante o mesmo efeito entre indivíduos?",
        options: [
          "Por erro de rótulo apenas",
          "Por fatores farmacocinéticos, densidade de receptor, tolerância e contexto — entre outros",
          "Porque CB2 não existe em humanos",
          "Porque o ECS não varia entre pessoas"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Ficha: glossário ECS + canabinoides (PDF Moodle quando publicado)",
      "Diagrama sinapse ECS e quadro comparativo CB1/CB2 (impresso)",
      "Planilha-guia de leitura crítica de abstract",
      "Lista de mecanismos citados em artigos populares vs artigos primários"
    ],
    references: [
      "Zou & Kumar — cannabinoid receptors and ECS (revisões gerais, via biblioteca Moodle)",
      "Literatura de revisão sobre CB1/CB2 e ligantes (acesso via Moodle)",
      "Guias de leitura crítica CONSORT / SYRCLE (quando aplicável a RCTs citados)"
    ],
    professorNotes:
      "Evite linguagem que pareça indicar dose individualizada. Ilustre com exemplos de estudo, não com pseudo-receituário."
  },

  {
    title: "THC, CBD, CBG, CBN: perfis e contexto clínico",
    introduction:
      "Cada canabinóide tem perfil receptor, metabolismo e história de evidência distintos. A meta desta aula é desmontar folhetos que igualam ‘full spectrum’ a resultado uniforme.",
    body: `Δ9-THC é agonista parcial clássico no CB1 — responsável pela maior parte da psicomodulação perceptível em doses comuns de produtos ricos em THC. CBD tem farmacologia mais plural: modula ion channels e exibe interações alostéricas complexas, sem o mesmo perfil psicoativo do THC em doses terapeuticamente estudadas em muitos ensaios — ainda assim, não é ‘inerte’ farmacologicamente.

CBG aparece cada vez mais como objeto de pesquisa em modelos pré-clínicos; CBN frequentemente associado a material oxidado/idade do extrato — interpretação comercial exige COA, não cor da flor. Sempre que possível, separe narrativa de marketing de resultado em humanos com desfecho clínico registrado.

No ensino THCProce, ‘contexto clínico’ significa: indicamos o estado da evidência e os limites legais; não realizamos triagem de paciente, não interpretamos exame particular nem ajustamos dose individual neste ambiente.`,
    objectives: [
      "Contrastar mecanismos gerais de THC vs CBD sem reducionismo binário.",
      "Posicionar CBG e CBN como moléculas com curva de evidência própria.",
      "Ligar análises publicitárias a necessidade de COA e desfechos clínicos verificáveis."
    ],
    closingSummary:
      "THC, CBD, CBG e CBN ganharam mapa conceitual e limites de evidência. Próximo passo: matriz terpênica e leitura responsável do ‘entourage’.",
    quiz: [
      {
        question: "Sobre o THC em relação ao CB1, qual descrição didática é mais aceita?",
        options: [
          "Antagonista inverso irreversível",
          "Agonista parcial com curva dose–efeito sensível à densidade de receptor",
          "Antagonista puro sem efeito em dose alguma",
          "Ligante apenas de CB2 encefálico"
        ],
        correctIndex: 1
      },
      {
        question: "Qual afirmação reflete melhor o ceticismo produtivo THCProce em relação ao marketing de produtos?",
        options: [
          "O preço alto confirma pureza absoluta",
          "Rótulos devem ser confrontados com COA e estudos em humanos quando se alega indicação",
          "CBD não interage com outros fármacos",
          "Full spectrum elimina necessidade de controle de qualidade"
        ],
        correctIndex: 1
      },
      {
        question: "CBN é mais comumente discutido no contexto de:",
        options: [
          "Fotossíntese primária da plântula",
          "Material envelhecido/oxidado e presença relativa ligada a processamento",
          "Síntese exclusiva via micélio fúngico",
          "Ausência em qualquer extrato vegetal"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Tabela de canabinoides — afinidades resumidas (Moodle)",
      "Modelo de COA anônimo para exercício de leitura",
      "Flashcards de nomenclatura IUPAC vs nomes comerciais (referência)"
    ],
    references: [
      "Monografias de canabinoides em compêndios farmacológicos indicados pelo corpo docente",
      "Estudos clínicos por indicação — lista curada (sem indução terapêutica no texto-base)"
    ],
    professorNotes:
      "Se alunos trouxerem medicamentos em uso, oriente busca a farmacêutico/médico — liste classe de interação, não ‘cotas’ de produto CBD."
  },

  {
    title: "Terpenos, matriz da planta e “entourage” responsável",
    introduction:
      "Terpenos definem aroma, modulam experiência sensorial e podem ter farmacologia própria. Esta aula evita mistificar sinergias e ensina a ler composição química em contexto.",
    body: `Mirceno, limoneno, pineno, cariofileno… são hidrocarbonetos voláteis com vias metabólicas distintas na planta e perfis de evaporação diferentes no processamento. Por isso a mesma genética pode ‘cheirar’ distinto após cura e armazenamento.

A ‘matriz da planta’ inclui canabinoides ácidos, neutros, terpenos, flavonoides e lipídeos — o extrato é um sistema complexo. A hipótese de entourage postula modulação conjunta; o marketplace frequentemente extrapola essa hipótese. Em sala, distinguimos evidência direta em humanos de extrapolação a partir de modelos celulares.

Discussões sensoriais são pedagógicas: aprendemos a descrever notas sem transformar gosto individual em promessa terapêutica. Em processos industriais, reintrodução de terpenos exige rastreio de lote e segurança ocupa­cional (VOC, temperatura).`,
    objectives: [
      "Listar terpenos comuns e associar pelo menos um descritor aromático a cada família citada.",
      "Explicar a hipótese de entourage com limites e evidência mista.",
      "Relacionar cura e armazenamento à preservação de terpenos voláteis."
    ],
    closingSummary:
      "Terpenos saem do lugar de ‘cheiro bonito’ para parâmetro técnico de processo e de leitura crítica de claims. A seguir: uso medicinal, evidência e honestidade sobre incerteza.",
    quiz: [
      {
        question: "Por que terpenos são relevantes na pós-colheita?",
        options: [
          "Porque aumentam o peso seco comercial sem alterar aroma",
          "Porque são voláteis e sensíveis a temperatura, tempo e oxidação",
          "Porque convertem THC em CBD automaticamente",
          "Porque não existem na flor, só no solo"
        ],
        correctIndex: 1
      },
      {
        question: "A hipótese de entourage implica:",
        options: [
          "Que terpenos sempre aumentam eficácia sem dados",
          "Que componentes da matriz vegetal podem modular efeitos — com grau de evidência variável por contexto",
          "Que isolado sintético é sempre inferior",
          "Que não há interação fármaco–canabinoide"
        ],
        correctIndex: 1
      },
      {
        question: "Cariofileno é citado com frequência por:",
        options: [
          "Ser exclusivamente um aminoácido",
          "Ser sesquiterpeno que também interage com sistema cannabinoide periférico em modelos",
          "Ser responsável pela fotossíntese primária",
          "Ser insolúvel e por isso irrelevante na vaporização"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Wheel de terpenos (cartaz)",
      "Protocolo de degustação sensorial segura (sem consumo irregular)",
      "Ficha de observação de notas voláteis em diferentes curvas de cura"
    ],
    references: [
      "Revisões sobre terpenoides em Cannabis sativa",
      "Normas de segurança em laboratório de análise voláteis"
    ],
    professorNotes:
      "Se houver demonstração ao vivo, cumpra legislação e biossegurança; em dúvida, mantenha só discus­são teórica."
  },

  {
    title: "Uso medicinal: evidências, incertezas e limites",
    introduction:
      "Medicina baseada em evidência exige gradiente de confiança — desta aula o aluno sai com linguagem para dizer ‘o que sabemos’, ‘o que não sabemos’ e ‘o que é propaganda’.",
    body: `A literatura clínica sobre canabinoides cresceu, mas ainda carrega heterogeneidade de produto, via, população e desfecho. Ensaios com extratos ricos em THC diferem de isolado de CBD; óleo oral não replica inalação para farmacocinética.

Categorias com mais estudos randomizados controlados em algumas indicações ainda não autorizam extrapolação pancêntrica — cada julgamento regulatório (Anvisa, FDA, etc.) observa população, dose e rota específicas. Como escola, THCProce desloca ao profissional habilitado a escolha individual terapêutica dentro da norma.

Riscos existem: efeitos psítmicos do THC, interações medicamentosas do CBD com enzimas de citocromo, efeitos adversos gastrointestinais — a discussão honesta fortalece segurança do paciente e reduz estigma inverte (achar que ‘natural’ quer dizer seguro em qualquer dose).`,
    objectives: [
      "Formular frases de incerteza responsável sobre uma indicação citada na mídia.",
      "Diferenciar uso com respaldo em RCT de narrativa baseada somente em relato.",
      "Listar classes de risco (THC psicoativo, interações CBD) para encaminhamento clínico."
    ],
    closingSummary:
      "Evidência vira vocabulário graduado; incerteza deixa de ser fraqueza e passa a ser método. Próximo: consentimento, legalidade e fronteira entre educação e prática clínica.",
    quiz: [
      {
        question: "Qual pergunta é central numa leitura crítica de RCT sobre canabinoides?",
        options: [
          "Qual influencer recomendou",
          "Qual produto, dose, população, desfecho primário e viés de descontinuação",
          "Se o título tem a palavra natural",
          "A cor do rótulo do grupo placebo"
        ],
        correctIndex: 1
      },
      {
        question: "Sobre interações, o CBD é frequentemente discutido por afetar metabolismo via:",
        options: [
          "CYP450 / enzimas citocromo em doses clinicamente relevantes em alguns casos",
          "Inibir definitivamente todos os fármacos em qualquer micrograma",
          "Não interagir jamais com outros fármacos",
          "Ativar somente receptores de insulina"
        ],
        correctIndex: 0
      },
      {
        question: "Afirmar que “planta inteira é sempre mais segura que isolado” é:",
        options: [
          "Sempre verdade em qualquer dosagem",
          "Uma generalização que pode falhar — segurança depende de dose, contaminantes e contexto",
          "Regra bioquímica comprovada universalmente",
          "Avaliação regulatória aceita sem estudos"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: false,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Ficha CONSORT simplificada",
      "Lista de interações frequentemente citadas em alertas de bula (referência, não automedicação)"
    ],
    references: [
      "Diretrizes clínicas nacionais e internacionais indicadas no Moodle",
      "Revisões sistemáticas por indicação (lista dinâmica)"
    ],
    professorNotes:
      "Em painel de dúvidas, repetir: não prescrevemos; encaminhamos. Registre menções de automedicação como alerta de risco, não como julgamento moral."
  },

  {
    title: "Legalidade, consentimento e fronteira educação / saúde",
    introduction:
      "O mesmo conteúdo científico muda de enquadramento legal conforme canal (escola, clínica, indústria). Precisamos vocabulário para não confundir informação com conduta clínica.",
    body: `No Brasil, cenários mudam — acompanhe portal oficial e assessoria jurídica para operações reais. No âmbito educacional THCProce: não coletamos dados clínicos sensíveis como se fôssemos prontuário; não fornecemos receita nem ‘microdosagens para dor X’.

Consentimento informado em pesquisa ou telemedicina segue normas específicas; aula gravada de caráter geral não substitui relação médico–paciente. A comunicação responsável evita claims terapêuticos em canais de marketing não-regulados.

Fronteira saúde/educação: podemos ensinar biologia e farmacologia; quem diag­nostica, indica e monitora clínica é profissional legalmente habilitado. Essa distinção protege o aluno, a escola e o paciente eventual.`,
    objectives: [
      "Definir em uma frase o limite entre educação THCProce e conduta clínica.",
      "Relacionar marketing de influência a risco regulatório de claims indevidos.",
      "Reconhecer necessidade de fontes primárias legais antes de decisões operacionais reais."
    ],
    closingSummary:
      "Legalidade e ética viram filtro cotidiano: o que ensinamos, o que não ensinamos e por quê. Próxima: métodos e leitura de estudos sem cair em viés de confirmação.",
    quiz: [
      {
        question: "No contexto THCProce (educação), qual prática é inadequada?",
        options: [
          "Ensinar farmacologia geral com referências",
          "Prescrever ou ajustar dose individual no chat do campus como se fosse consultório",
          "Encaminhar dúvida clínica a profissional habilitado",
          "Citar limites de evidência de um estudo"
        ],
        correctIndex: 1
      },
      {
        question: "Claims terapêuticos em anúncios de produtos costumam:",
        options: [
          "Estar isentos de regulação sanitária",
          "Exigir lastro regulatório e linguagem permitida pela vigilância competente",
          "Substituir necessidade de registro se a cor do rótulo for verde",
          "Ser válidos se o produto for importado informalmente"
        ],
        correctIndex: 1
      },
      {
        question: "Consentimento informado robusto requer, entre outros:",
        options: [
          "Apenas aceitar termos sem leitura",
          "Compreensão de riscos/benefícios, voluntariedade e capacidade decisória",
          "Somente assinatura de testemunha sem participação do participante",
          "Sigilo zero de dados em qualquer pesquisa sem exceção legal"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: false,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Fluxograma: dúvida clínica → profissional habilitado",
      "Modelo de mensagem ética para redes (sem promessa terapêutica)"
    ],
    references: [
      "Textos legais oficiais — links atualizados THCProce",
      "Guias de compliance em comunicação digital para setor canábico"
    ],
    professorNotes:
      "Atualize exemplos quando a lei mudar — nunca use aula como ‘ atualização jurídica personalizada’."
  },

  {
    title: "Como ler estudos: viés, amostra, generalização",
    introduction:
      "Estatística e desenho experimental não são ornamento: são o que separa política pública de thread viral.",
    body: `Ao ler um artigo, percorra: pergunta de pesquisa; desenho (observacional vs RCT); tamanho de amostra; desfecho primário pré-especificado; análise por intenção de tratar; perda de follow-up; conflito de interesse e financiamento.

Viés de publicação inclina literatura visível para resultados ‘positivos’. Viés de confirmação inclina o leitor — combata com pré-registro de hipóteses quando for pesquisador, e com leitura de revisões sistemáticas quando for consumidor.

Generalizar estudo em célula ou mouse para humano exige passos explícitos — friccionar essa ponte é dever de um curso sério. No campus, você treina o hábito de perguntar: ‘para qual população isso foi demonstrado?’ antes de aplicar narrativa.`,
    objectives: [
      "Enumerar cinco verificações rápidas ao abrir um paper de intervenção.",
      "Definir viés de publicação e seu efeito na visão geral da evidência.",
      "Explicar por que extrapolação animal–humano exige cautela explícita."
    ],
    closingSummary:
      "Leitura crítica vira ferramenta de defesa contra hype — também contra cinismo que despreza toda ciência. Próximo: rotas de aprendizado no Moodle e na escola.",
    quiz: [
      {
        question: "Intenção de tratar (ITT) em RCT visa:",
        options: [
          "Analisar apenas quem aderiu perfeitamente, ignorando desistentes",
          "Manter aleatorização ao analisar resultados, reduzindo viés de adesão",
          "Eliminar placebo",
          "Dobrar o N amostral artificialmente"
        ],
        correctIndex: 1
      },
      {
        question: "Viés de publicação refere-se a:",
        options: [
          "Erro tipográfico em abstracts",
          "Tendência de estudos com certos resultados serem mais publicados/visíveis",
          "Uso exclusivo de voluntários saudáveis",
          "Ausência de grupo controle"
        ],
        correctIndex: 1
      },
      {
        question: "Extrapolar achado pré-clínico diretamente para protocolo humano sem:",
        options: [
          "É sempre aceitável em redes sociais",
          "Requer validação em modelos apropriados — não é automático",
          "É proibido por definição",
          "Substitui ensaios clínicos automaticamente se n>10"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: false,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Checklist CASP / Newcastle (versões simplificadas) para estudos clínicos",
      "Planilha de leitura de artigo (1 página)"
    ],
    references: [
      "Users’ guides to the medical literature (JAMA series — acesso institucional)",
      "Livros-texto de epidemiologia clínica indicados no Moodle"
    ],
    professorNotes:
      "Traga 1 paper atual para workshop — prefira controvérsia moderada a paper perfeito."
  },

  {
    title: "Roteiros da escola e integração com Moodle",
    introduction:
      "Organização do estudo determina retenção. Esta aula explica como o campus, o Moodle e o calendário THCProce se articulam sem sobrepor papéis.",
    body: `Moodle hospeda entregas formais, fóruns moderados, provas quando existirem e biblioteca dinâmica. O campus imersivo ancora motivação espacial (mapa, progressão, gamificação leve) — mas não substitui avaliação acadêmica quando ela existir no curso credenciado.

Fluxo sugerido: ler texto-base THCProce → realizar quiz/reflexão → trazer dúvida estruturada ao fórum → cruzar com aulas avançadas na trilha escolhida (cultivo, extração, medicina regulada etc.). Registre tempo de estudo e use notas locais só como complemento, não como único repositório de evidências clínicas.

Integrações futuras (SSO, progresso sincronizado) podem evoluir — o desenho modular deste conteúdo permite trocar blocos sem reescrever os outros.`,
    objectives: [
      "Esboçar fluxo de estudo pessoal integrando campus + Moodle.",
      "Listar o que deve ir a fórum moderado vs o que é nota privada.",
      "Reconhecer gamificação como engajamento, não como certificação por si só."
    ],
    closingSummary:
      "O aluno deixa de navegar ao acaso e passa a usar mapa, calendário e fórum como sistema. Em seguida, revisão integrada e checklist corporativo.",
    quiz: [
      {
        question: "O fórum do curso deve priorizar:",
        options: [
          "Dados clínicos identificáveis de terceiros",
          "Dúvidas estruturadas, referências e respeito à moderação",
          "Compra/venda de insumos entre alunos",
          "Diagnóstico formal entre colegas"
        ],
        correctIndex: 1
      },
      {
        question: "Progressão no campus (XP) é melhor entendida como:",
        options: [
          "Substituto legal de crédito acadêmico sempre",
          "Metadado de engajamento que pode acompanhar, mas não substitui, regras de certificação do curso",
          "Garantia de empregabilidade",
          "Prova de capacidade prescritiva"
        ],
        correctIndex: 1
      },
      {
        question: "Notas locais no painel da aula servem para:",
        options: [
          "Armazenar prontuário de paciente",
          "Anotações pessoais de estudo — sem dados sensíveis de terceiros",
          "Substituir Moodle entrega de trabalho",
          "Publicação pública automática"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Capturas de tela oficiais do Moodle (atualizadas)",
      "Template Semanal de Estudo (PDF)"
    ],
    references: [
      "Manuais Moodle THCProce versionados",
      "Política de dados / privacidade da escola"
    ],
    professorNotes:
      "Sempre que SSO mudar, atualizar estáticos — evitar prints desatualizados nas slides."
  },

  {
    title: "Revisão integrada e checklist de boas práticas",
    introduction:
      "Revisão não é repetir definições — é integrar ECS, moléculas, terpenos, evidência e legalidade num panorama acionável.",
    body: `Percorra mentalmente: ECS → canabinoides → matriz terpênica → gradiente de evidência clínica → limites legais/educação; feche com leitura crítica de estudo. Use checklists físicos ou PDF para transformar estudo passivo em protocolo ativo de leitura.

Boas práticas de comunicação incluem não prometer cura, não minimizar riscos psíquicos do THC, não rotular CBD como ‘sem efeito colateral possível’. Boas práticas de consumo informado (onde legal) incluem titulação paulatina, ambiente seguro e ausência de condução sob psicoativação — mensagens de redução de dano sem moralismo inútil.

Se você for produtor (áreas técnicas do campus), traga para a revisão também noções de laboratório, ventilação e rastreabilidade — ponte já visível para cultivo, extração e indústria.`,
    objectives: [
      "Executar checklist completo THCProce em 10 minutos (simulação mental).",
      "Produzir mini-resumo de três linhas do módulo para um colega leigo.",
      "Listar três erros comuns de comunicação pública sobre canabinoides."
    ],
    closingSummary:
      "O módulo ganha fechamento operacional: estudar deixou de ser colecionar fatos e passou a ser aplicar filtros. Última aula: transição para o restante do campus.",
    quiz: [
      {
        question: "Checklist de leitura é útil porque:",
        options: [
          "Elimina necessidade de estatística",
          "Padroniza pontos de atenção e reduz viés de leitura rápida",
          "Garante que todo paper seja verdadeiro",
          "Substitui revisão por pares"
        ],
        correctIndex: 1
      },
      {
        question: "Mensagem de redução de dano coerente com THCProce:",
        options: [
          "‘Não existe risco psíquico com THC’",
          "Informar riscos e contextos sem romantização nem terrorismo",
          "Incentivar uso em menores para aprendizado",
          "Ignorar interações medicamentosas"
        ],
        correctIndex: 1
      },
      {
        question: "Integração significa:",
        options: [
          "Juntar buzzwords sem estrutura",
          "Conectar pilares do curso num fluxo explicativo coerente",
          "Substituir legislação local por senso comum",
          "Eliminar necessidade de atualização futura"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: false,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Checklist 1 página — revisão integrada",
      "Matriz de autoavaliação (0–5 por pilar)"
    ],
    references: [
      "Sínteses internas THCProce (quando publicadas)",
      "FAQs atualizados do site institucional"
    ],
    professorNotes:
      "Promova peer review entre alunos: cada um apresenta 3 min checklist ao par."
  },

  {
    title: "Encerramento do módulo base e ponte para o campus",
    introduction:
      "Aqui amarramos o Cannabis 101 ao ecossistema de salas: cultivo, pós-colheita, solventless, óleo, laboratório, medicina, cozinha, genética, legislação, cooperativismo e indústria — cada qual com ética e profundidade distintas.",
    body: `O mapa do campus não é ‘menu de hobbies’: é arquitetura de competências. Quem domina fundamento (ECS, canabinoides, terpenos, evidência) entra nas salas técnicas sem transformar técnica em achismo. O produtor aprende a falar com químico; o comunicador aprende a falar com regulador; o ativista aprende a falar com advogado sem confundir desejo político com parecer jurídico.

Próximos passos sugeridos: (1) escolher trilha principal alinhada à sua função; (2) cruzar com legislação local antes de qualquer experimentação prática; (3) manter diário de estudo e marcar aulas como vistas para consolidar progresso no campus; (4) retornar ao Cannabis 101 quando surgirem novos dados — ciência muda.

A equipe THCProce atualizará este conteúdo modularmente: substituações de parágrafos podem ocorrer sem reordenar o arc do curso — exatamente para preservar seu investimento de tempo.`,
    objectives: [
      "Montar plano pessoal de três salas do campus para os próximos 60 dias.",
      "Explicar a outra pessoa como o ECS fundamenta escolhas nas salas técnicas.",
      "Comprometer-se com protocolo de atualização: rever fontes a cada novo ciclo legislativo relevante."
    ],
    closingSummary:
      "Cannabis 101 cumpre seu papel de eixo comum: você está apto a navegar o campus com mapa molecular, ético e epistemológico. Boas aulas nas salas especializadas — sempre com método e responsabilidade.",
    quiz: [
      {
        question: "Ao avançar para cultivo ou extração, o aluno deve lembrar:",
        options: [
          "Que Cannabis 101 substitui NR e licenças",
          "Que normas técnicas e leis locais prevalecem sobre o entusiasmo do estudo",
          "Que laboratório doméstico de solventes é ponto extra na grade",
          "Que não precisa documentar processos"
        ],
        correctIndex: 1
      },
      {
        question: "Revisitar o Cannabis 101 quando:",
        options: [
          "Nunca — conteúdo é estático",
          "Houver atualização científica, legal ou organizacional relevante",
          "Somente se reprovar em outra sala",
          "Somente após 10 anos"
        ],
        correctIndex: 1
      },
      {
        question: "A ‘ponte para o campus’ significa:",
        options: [
          "Trocar educação por entretenimento",
          "Usar este módulo como base para aprendizado especializado interconectado",
          "Evitar outras salas para sempre",
          "Eliminar necessidade de Moodle"
        ],
        correctIndex: 1
      }
    ],
    media: {
      needsVideo: true,
      needsImage: true,
      needsInfographic: true,
      needsSupportMaterial: true
    },
    materials: [
      "Mapa visual das 14 áreas com prerequisitos sugeridos",
      "Planner de estudo trimestral THCProce"
    ],
    references: [
      "Índice de aulas atualizado `courseOutlines.ts` e salas relacionadas",
      "Comunicados institucionais de novas trilhas"
    ],
    professorNotes:
      "Feche com convite ao código de ética THCProce; abra espaço para pesquisa de satisfação formativa."
  }
] as const satisfies readonly LessonStreamContent[];
