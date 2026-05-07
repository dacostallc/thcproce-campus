import type { LessonStreamContent } from "../types";
import { Q, M } from "./_helpers";

/** Cultivo outdoor — BR, solo, clima, escala campo (10 aulas). */
export const CULTIVO_OUTDOOR_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Panorama outdoor: solo, clima e calendário BR",
    introduction:
      "Outdoor brasileiro combina fotoperíodo natural, episódios de chuva extrema, calor UV elevado em certas bacias e variações de solo de Cerrado a várzea. Esta aula amarra agronomia básica a decisões de ciclo civil e sanitárias antes de gastar tempo com genética errada.",
    body:
      "A didática THCProce trata cannabis outdoor como cultivo agrícola com risco agregado jurídico até que a localidade autorize uso ou cultivo. O calendário de plantio norte–sul do Brasil diverge pelo dia crítico fotoperiódico: genéticas dependem mais de fotossensibilidade do que de ‘espírito hippie’. Mapeie altitude, média térmica, janelas de chuva previstas (histórico e alertas INMET) e acesso irrigação antes de cavar sulco.\n\n" +
      "Pontos técnicos: adensamento de dossel aumenta bolsa úmida pós-florescimento prolongado sob chuva; ventos constantes são amigos do microclima; solo com drenagem lenta obriga terraço ou canteiro sobre drenoplástico mesmo em ‘solo bom’.\n\n" +
      "Erros comuns: plantio na semana anterior a frente fria sem aclimatação; ignorar ciclo lunar como curiosidade e ignorar mapa fenológico real; extrapolar resultado de influencer em latitude diferente.",
    objectives: [
      "Relacionar latitude BR, fenologia e decisão provisória de janelas de campo.",
      "Listar dados mínimos de terreno antes de projeto (solo, irrigação, vento sombra).",
      "Expor risco jurídico local sem misturar com conselhos de quebra de lei."
    ],
    closingSummary:
      "Você deixa de pensar outdoor como hobby de saco e passa a enxergar lote agrícola com calendário, solo e lei no mesmo quadro THCProce.",
    quiz: [
      Q("No Brasil, o primeiro filtro fenológico em outdoor fenodependente costuma ser:", ["Cor da estaca", "Fotoperídio e iniciador de flora em relação à latitude/região", "Marca da muda", "Só tipo de mulch"], 1),
      Q("Bolsa úmida no dossel denso próximo à estação chuvosa favorece:", ["Secagem rápida", "Ponto crítico patogênico (fungo/bactéria) se higiene falhar", "Sempre maior THC", "Eliminação de pragas"], 1),
      Q("Antes do plantio outdoor, THCProce exige registrar:", ["Apenas cultivar TikTok", "Solo/clima/agua/regulacao local conscientemente", "Nada", "Somente hashtags"], 1)
    ],
    media: M.theory,
    materials: ["Planilha janelas outdoor BR (campus)", "Histórico chuva INMET print por safra"],
    references: ["INMET séries climáticas", "Embrapa solos regional — folhas de campo"],
    professorNotes: "Ressalve que texto de sala não autoriza autocultivo; canalize dúvida penal ao advogado."
  },
  {
    title: "Preparo de solo, drenagem e correções",
    introduction:
      "Solo bem preparado amortiza temporada ruim de chuva ou seca moderada; mal preparado viraliza problema em primeira semana molhada.",
    body:
      "Inicie sempre análise químico-físico amostragem diagonal do talhão. pH água mais pH solo definem uptake de micronutriente; texto de sala não substitui labor agronômico credenciado. Drenagem: teste infiltrômetro improvisado (tubo cilíndrico 15 cm água) mostra onde argila retém saturando raiz anaerobi.\n\n" +
      "Pontos técnicos: calagem/dolomitagem seguir laudo não achismo mato; matéria orgânica estável (composto maduro > esterco fresco) diminui dispersão microbiológica oportunista próximo tronco lesionado por poda tardia molhada.\n\n" +
      "Erros comuns: adicionar areia lavada pouca sobre argila criando tijolo inadvertido; regar até encharcar sem medição só para ‘ver verde rápido’; misturar resíduo doméstico não compostado próximo ciclo sanitário coop.",
    objectives: [
      "Planejar correção com base laudo físico-químico, não apenas cor visual.",
      "Explicar drenagem de fundo versus superfície e risco anaerobiose radial.",
      "Listar entrada orgânica segura versus risco sanitário coop."
    ],
    closingSummary:
      "Campo bem drenado e corrigido reduz dor de cabeça em flor — investimento amortizado já na primeira temporada crítica.",
    quiz: [
      Q("Por que camada superficial de argila sob areia pode piorar drenagem?", ["Não pode", "Impermeabiliza zona radicular local", "Neutraliza THC", "Atrai apenas pulgão"], 1),
      Q("Orgânica inadequada próximo ciclo coop pode gerar:", ["Sempre aumento THC", "Risco sanitário e variabilidade de condutividade térmica", "Substitui laudo solo", "Nada"], 1),
      Q("Base corretiva pH deve vir de:", ["Adivinha TikTok", "Laudo técnico", "Somente água de poço sem teste", "Cor do pé de casa"], 1)
    ],
    media: M.theory,
    materials: ["Checklist pré-plantio outdoor", "Tabela segurança uso estercagem"],
    references: ["Raij et al. — solo nutrição Brasil", "Guia campo Embrapa composto estável"],
    professorNotes: "Se aluno coop, sugerir reunião com agrônomo parceiro — divisão papel associacional."
  },
  {
    title: "Genéticas e escolha de cultivares para exterior",
    introduction:
      "Exterior brasileiro pune foto-períodos errados com hermafroditismo tardio sob estresse combinado molhatura + foto instável marginal.",
    body:
      "Selecionar cultivares com histórico publicado próximo latitude OU ensaios internos coop documentados reduz dispersão fenotípica de colheita. Indica rápido outdoor tropical úmido exige dossel transpirável; sativa alta sem suporte rasga sob vento forte se copa alta sem tutor.\n\n" +
      "Pontos técnicos: variabilidade de tempo flora real vs datasheet vendedor; estabilização genética de pequenos breeders influencia masculino espontâneo; guardar código lote clone/seed.\n\n" +
      "Erros comuns: comprar apenas por THC no rótulo de banco estrangeiro ignorando umidade flora local; repetir erro de mold season após temporada sem trocar arquitetura genético-estrutura.",
    objectives: [
      "Cruzar clima-região com arquitetura genética (altura ciclo flora).",
      "Documentar rastreabilidade fenótipo lote coop.",
      "Explicar interação foto + molhatura no estresse hermafrodita."
    ],
    closingSummary:
      "Genética não é marca Instagram; é relação dossel-flora-microclima em solo real.",
    quiz: [
      Q("Hermafrodita tardio combinando molhatura + foto marginal sugere revisar:", ["Apenas marca LED indoor", "Arquitetura genético-climática não só pragas pontuais", "Sempre troca substrato apenas", "Nada"], 1),
      Q("Documentação de lote serve principalmente:", ["Stories", "Uniformidade coop rastrear decisão ciclo seguinte", "Esconder origem", "Ignorar laboratório"], 1),
      Q("Altitude + latitude alta seca pode tolerar foto:", ["Igual sempre", "Cultivar com ciclo foto adaptado relatado próximo latitude", "Qualquer foto random", "Não há relação"], 1)
    ],
    media: { needsVideo: true, needsImage: true, needsInfographic: true, needsSupportMaterial: true },
    materials: ["Ficha campo genótipo coop", "Tabela fenologia interna exemplo"],
    references: ["Literatura breeding outdoor úmido", "Notas técnicas bancos semente transparentes"],
    professorNotes: "Desincentive promessa comercial THC máximo ao ar livre sem COA ciclo próprio."
  },
  {
    title: "Segurança de campo e boa vizinhança",
    introduction:
      "Campo vivo não é bunker; é perímetro conscientizado, comunicação com vizinança institucional (quando legal) e prevenção de roubo sanitário coop.",
    body:
      "Segurança inclui cercas físicas proporcionais, iluminação que não gere denúncia luz nuisance, registros entrada-saída pessoas e tratamentos fito. Vizinhança: odor percebido aumenta onde vento sopra para zona urbana periurbana mesmo que plantio remoto campo.\n\n" +
      "Pontos técnicos: câmeras com política dados LGPD; treinamento EPI pulverização reduz intoxicação trabalhador; rota evacuação se incêndio pastagem vizinha vento forte.\n\n" +
      "Erros comuns: armamento improvisado ilegal combinado uso cultural; atrito verbal redes em vez mediador jurídico; ausência registro pulverização coop auditável.",
    objectives: [
      "Elaborar estratégias perimetrais proporcionais e registro coop.",
      "Enquadrar privacidade e LGPD vs vigilância exagerada ilegal.",
      "Listar comunicação institucional mínima com vizinhar legal."
    ],
    closingSummary:
      "Campo seguro fecha triângulo legal–social–biossegurança; violência improvisada sai do playbook THCProce coop.",
    quiz: [
      Q("Registro pulverização coop serve para:", ["Apenas briga interna", "Auditoria e defesa coop responsável sanitária trabalhadores", "Nada obrig", "Stories"], 1),
      Q("LGPD aplicável a vigilância envolve:", ["Nada campo", "Proporção finalidade tratamento dados", "Sempre filmar público ilegal sempre", "Só TikTok"], 1),
      Q("Odores outdoor periurbanos exigem:", ["Ignorar vento dominante completamente", "Planejar microclima + diálogo proporcional lei local", "Apenas musica alta", "Nada planeja"], 1)
    ],
    media: M.theory,
    materials: ["Modelo atas segurança campo", "Checklist pulverização registros"],
    references: ["LGPD textos públicos sintéticos campo", "NR aplicáveis coop operação pulverização quando couber"],
    professorNotes: "Não ministre segurança armada ilegalmente; cite advogado defensor criminal."
  },
  {
    title: "Irrigação e nutrição em grandes áreas",
    introduction:
      "Área maior que mil metros quadrado exige vazões, filtros sedimentos biofilme e programa fertirrigação com condutividade gradual senão burnout salino superfície raiz zona.",
    body:
      "Irrigar por aspersão noturno aumenta período molhatura foliar risco fungal pós flora; pivô microaspersão gota próximo solo reduz esse risco maior que aspersão foliar gratuita molhatura longa folha. Nutrição: quebra programa em pré-flora flora sem salto Conductivity.\n\n" +
      "Pontos técnicos: sensores volumétricos solo relativos campo — calibrar texto solo local; runoff medido periodicamente revela drift sal não visual.\n\n" +
      "Erros comuns: overdose N final flora aumentando biomass foliar já tarde temporada úmida; ignorar SAR água poço alto sódio deixando sintoma Mg secundário confundindo carencia Mg real.",
    objectives: [
      "Comparar aspersão vs gota próximo dossel sanitário fungal.",
      "Planejar ramps EC por fase ciclo coop escala média campo.",
      "Interpretar SAR básico leitura laudo água bruta tratada campo."
    ],
    closingSummary:
      "Nutri campo como cultura com água cara e salinização invisível; outdoor não perdoa salto hormonal nutricional tardio ignorante.",
    quiz: [
      Q("Aspersão noturno prolongado pós flora tende:", ["Eliminar fungal sempre", "Aumentar período molhatura foliar risco sanitário dossel denso úmido", "Sempre aumentar potency", "Nada mudar"], 1),
      Q("Salt buildup sem runoff monitorização pode mascarar como:", ["Falha elétrica", "Carência secundária de Mg versus excesso de outros íons interferindo na assimilação", "Semente ruim apenas", "Só narrativa de stress positivo sem dado"], 1),
      Q("Ramp EC deve:", ["Saltar alto dia flora imediato sem plano gradual", "Evoluir gradual fase coop documentada", 'Só "feel"', "Aleatório TikTok"], 1)
    ],
    media: M.theory,
    materials: ["Planilha vazões aspersão/gotej campo", "Tabela SAR interpretação rápida"],
    references: ["FAO irrigação gotej agrícola", "Literatura fertirrigação Cannabis outdoor peer quando disponível regional"],
    professorNotes: "Se poço coop sem laudo tratamento microbiológico, bloqueio horta consumo humano paralelo erro comum coop."
  },
  {
    title: "Pragas e clima: prevenção e manejo",
    introduction:
      "Manejo Integrado Produção campo integra monitoramento thresholds ação econômica com biológico primeiro tier químico last resort coop documentado aceitável lei fito.",
    body:
      "Clima brasileiro traz ciclo rápido artrópodos sugadores e fungos filamentosos; predador estabelecido cedo reduz outbreak explosivos pós chuva saturante. Registrar mapa campo hotspot pragas permite pulso localizado menos químico superficial.\n\n" +
      "Pontos técnicos: calibração bico pulverização GOTAS tamanho apropriado folha cerosa; tempo de carencia coop — zero tolerância se destino coop medicinal humano alto risco ingestão pulverização recente mesmo ‘natural’ equivocado lavanda oleo alta dose.\n\n" +
      "Erros comuns: misturar 5 produtos mesmo tanque causando antagonismo físico eficacia zero pulverização cara; pulverizar alto vento dispersão lei ambiental coop.",
    objectives: [
      "Montar ciclo scouting thresholds documentado campo.",
      "Explicar calibração bico + vento pulverização coop compliance.",
      "Relacionar carencia coop medicinal humano pulverização mesmo rotulado natural erro."
    ],
    closingSummary:
      "MIP outdoor é mapa de vigilância e ação proporcional no eixo jurídico-sanitário — não basta substituir frascos sem diagnóstico de campo.",
    quiz: [
      Q("Pulverização alta vento é:", ["Boa coop sempre", "Risco dispersão lei + baixa eficácia dossel inconsistente deposit", "Neutral", "Somente aumenta potency"], 1),
      Q("Scouting threshold serve para:", ["Decorar apenas", "Pulsar recurso apenas quando econômicamente sanitariamente razoável", "Pulvar sempre semana", 'Ignorar "mapa hotspots"'],
        1
      ),
      Q("Oleo botanical toxico alta dose residual pode:", ["Substituir coa coop", 'Falhar coop tolerância sanitária humana igual "químico"', "Eliminar sempre documentação coop", 'Só aumentar THC'], 1)
    ],
    media: M.lab,
    materials: ["Mapa hotspots pragas exemplo", "Ficha pulverização coop carencia modelo"],
    references: ["MAPA receituário agrícola quando lei aplicável coop produção paralela horta", "MIP Cannabis literatura institucional seriada THCProce"],
    professorNotes: "Se produtor não técnico agrotóxico autorizado coop, papel nutricional + biológicos primeiro — advogado fito coop."
  },
  {
    title: "Florescimento natural e riscos fenológicos",
    introduction:
      "Flora exterior segue foto + temperatura noturna; queda abrupta térmica chuva combinada aumenta stall metabolismo resin sem necessariamente amadurecer tricomas coerentes lote inteiro campo.",
    body:
      "Unificar colheita lote monocultura exterior perde qualidade média porque microclimas internos dossel retardam últimos terços plantas centrais. Amostrar tricomas múltiplos pontos planta dossel basal superior orientação solar coop.\n\n" +
      "Pontos técnicos: estresse UV finais moderado aumenta teor secundários em modelos hortícolas — extrapolar sempre com medição coop laboratório; geada improvável norte interior sul — monitor.\n\n" +
      "Erros comuns: cronometrar apenas dia calendário comercial ignorando dossel retardado centro; aplicar ripeners fito nocivos coop medicinal humano destinado alto risco ingestão mesmo ‘clearex’ fantasioso TikTok campo.",
    objectives: [
      "Amostrar tricomas múltiplos pontos dossel coop uniformidade média campo.",
      "Relacionar queda térmica + chuva com stall metabolismo resina vs maturidade perceptual.",
      "Identificar ripeners coop medicinal humano alto risco sem fito regist."
    ],
    closingSummary:
      "Florescimento campo é nuvem de maturidades — padronização exige decisão dados + sensório documentado coop.",
    quiz: [
      Q("Lote monocult exterior colheita unificada apenas calendário comercial pode:", ["Garantir lote médio sempre perfeito", "Perder centro dossel retardado média qualidade", 'Eliminar variabilidade', "Gerar coop lab zero variância sempre"], 1),
      Q("Ripener fito nocivo coop medicinal porque:", ["Sempre aumenta THC sem risco ingestão pulverização residue", 'Risco sanitário ingestion humano coop sem equivalência pharma agrotoxic clearance', 'Sempre legal', 'Só TikTok forbid'], 1),
      Q("Amostragem tricomas deve incluir:", ["Só topo planta alta sol apenas", 'Basal + superior + diferentes orientações sol microclimas dossel coop', 'Semente packet label', 'Apenas cor pistilo apenas'], 1)
    ],
    media: M.theory,
    materials: ["Roteiro amostragem tricomas campo", "Diagrama dossel zonas coop"],
    references: ["Literatura tricomas maturidade outdoor", "Notas post-harvest sala secagem relacionadas"],
    professorNotes: "Ponte sala secagem coop — primeira semana pós campo define terpen overlay."
  },
  {
    title: "Colheita, transporte e pós-colheita de campo",
    introduction:
      "Colheita campo é momento mais vulnerável coop à queda rápida terpen microbial cross contaminação mochila transporte campo quente úmido fechando.",
    body:
      "Equipar sala sombra próxima colheita com ventilação laminar simples na porta — não é sala operacional farmacêutica, mas reduz entrada de poeira e esporos fúngicos quando o vento forte bate no campo aberto e no material recém-cortado pendurado improvisadamente.\n\n" +
      "Pontos técnicos: higiene tesouras etanol ciclo coop; registros lote colheita hora inicial hora sala sombra entrada; tempo máximo tote quente antes chegada sala processamento.\n\n" +
      "Erros comuns: empilhar tote fechadas sol quente vapor preso aumento botrytis transporte rápido; misturar lote sanitário problema com bom lote ‘para diluir problema’ coop.",
    objectives: [
      "Planejar corredor sombra próximo campo mínimo viável coop.",
      "Documentar tesouras higiene lote entrada horários transporte coop.",
      "Proibir estratégia contaminada diluída lote coop compliance."
    ],
    closingSummary:
      "Flor premium nasce campo mas morre primeira hora pós talo — sane transporte coop ou perde sala secagem investimento ciclo inteiro campo.",
    quiz: [
      Q("Tot fechadas sol forte pós corta tendem:", ["Aumentar apenas aroma", 'Acelerar aquecimento micro umidade fungal risk alto', 'Eliminar fungo sempre', 'Nada coop'], 1),
      Q("Mesclar lote com problema sanitário a um lote bom na cooperativa é:", [
        "Boas práticas de diluição aceitáveis",
        "Violação de rastreamento que espalha o problema em escala",
        "Obrigatório em toda colheita",
        "Neutro para a qualidade"
      ], 1),
      Q("Etanol nas tesouras entre plantas no ciclo reduz principalmente:", [
        "Somente custo operacional",
        "Provável transmissão mecânica de patógenos entre plantas",
        "Requisito de laboratório GLP",
        "Necessidade de cura em frasco"
      ], 1)
    ],
    media: M.all,
    materials: ["Fluxograma campo sombra coop", "Ficha tote transporte coop"],
    references: ["Sala secagem campus — continuidade", "Boas práticas pós-colheita agrícola organic"],
    professorNotes: "Encaminhe aluno curso secagem imediatamente após — narrativa transversal THCProce."
  },
  {
    title: "Cooperativismo e escala (visão introdutória)",
    introduction:
      "Outdoor escala coop demanda governança clara produção associada rastreio lote responsabilidade solidária civil jurídica — produtor que entra sem estatuto sofre colapso operacional safra boa ruim.",
    body:
      "Modelo cooperativo medicinal humano BR evolui legislação — texto educacional não substitui estatuto advogado cooperativista saúde pública. Operacional: turnos colheita transporte documentados; caixa transparente insumos; laboratório parceiro amostragem rotacional lote.\n\n" +
      "Pontos técnicos: rateio insumo proporcional área real plantada medida coop GPS polígonos internos coop se legal; escrow pagamento coop associados reduz atrito temporada.\n\n" +
      "Erros comuns: misturar tesourário pessoa física coop sem conta bancaria jurídica associacao formal; distribuir produtos sem etiqueta sanitária mínimo cooperado identificação lote rastreável.\n\n" +
      "Escalar sem processo aumenta probabilidade problema jurídico sanitário combinado coop — curso cooperativismo completa governança letra legislações.",
    objectives: [
      "Listar elementos mínimos governança produção coop outdoor escala média conscientizando lei BR mutável sala.",
      "Descrever rastreabilidade interna polígonos rateio coop.",
      "Apontar risco tesourário informal coop associacional."
    ],
    closingSummary:
      "Outdoor escala coop exige lei + mapa campo + tesouraria clara antes de aumentar hectares associados fantasioso.",
    quiz: [
      Q("Tesourário informal sem CNPJ associação formal adequada tende:", ['Aumentar só aroma', 'Risco civil criminal confusão patrimonial coop', 'Eliminar coop legal sempre', 'Nada'], 1),
      Q("Rastreabilidade na cooperativa com destino medicinal humano exige:", [
        "Apenas redes sociais como registro",
        "Identificação de lote coerente com documentação associacional",
        "Nunca há requisito documental",
        "Somente marketing de cultivar"
      ], 1),
      Q("Rateio insumo coop deve relacionar:", ['Apenas amizade apenas', 'Área mediada coop real contribuição coop', 'Loteria temporada', 'Nada coop'], 1)
    ],
    media: M.theory,
    materials: ["Intro mapa coop outdoor vs curso Cooperativismo", "FAQ jurídica encaminhar advogado"],
    references: ["Lei cooperativismo BR textos leitura introdutória", "RDC Anvisa intro leitura paciente produto importado"],
    professorNotes: "Esta aula é ponte; curso Cooperativismo e Legislação fecham matriz."
  },
  {
    title: "Checklist de fechamento de ciclo outdoor",
    introduction:
      "Encerrar ciclo documentado reduz repetir erro biológico financeiro jurídico próxima safra coop — retroalimentação lean agrícola medicinal responsável THCProce.",
    body:
      "Checklist: solo corrigido laudo comparado safra anterior; genética performance nota campo; pragas mapa season; colheita transporte incidentes; laboratório COA lote amostra representativa; financeiro insumo real por grama produzida coop meta lean.\n\n" +
      "Pontos técnicos: armazenar dados climáticos chave semana flora; fotos dossel problema sanitário datadas GPS cooperado treinamento futuro.\n\n" +
      "Erros comuns: destruir dados ‘vergonha’ safra ruim impedindo aprendizado coop; prometer safra próxima dobrada sem corrigir solo drenagem raiz primeira causa.",
    objectives: [
      "Montar retrospectiva lean safra outdoor coop mínima viável documentada.",
      "Integrar COA representativo lote decisão próximo plantio genético.",
      "Evitar destruição dados falha aprendizado associacional."
    ],
    closingSummary:
      "Ciclo outdoor fecha com papel: solo, clima, genética, pragas, pós-colheita, laboratório, financeiro — próxima safra começa no arquivo desta.",
    quiz: [
      Q("Retrospectiva lean coop inclui:", ['Apenas selfie colheita', 'Dados solo clima pragas financeiro operacional comparativos safra', 'Nada', 'Só THC marketing'], 1),
      Q("Destruir dados safra ruim coop:", ['Boa motivação time', 'Impede aprendizado associacional repete erro raiz', 'Obrigatório', 'Só TikTok'], 1),
      Q("COA representativo lote deve orientar:", ['Apenas preço final venda ilegal', 'Seleção genética processo próximo ciclo coop legal documentado', 'Ignorar genética', 'Nada'], 1)
    ],
    media: M.theory,
    materials: ["Template retrospectiva safra outdoor THCProce", "Planilha custo grama lean coop"],
    references: ["Lean agricultura protegida adapt outdoor", "Documentação COA leitura laboratório curso"],
    professorNotes: "Congratule aprendizado falha documentada — cultura segurança psicológica coop melhora safra seguinte."
  }
];
