import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Cultivo Greenhouse — 10 aulas (conteúdo editorial THCProce). */
export const CULTIVO_GREENHOUSE_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Estufas: tipos, clima e decisão de projeto",
    introduction:
      "Greenhouse não é ‘indoor barato’: é sistema semi-protegido onde radi­ação solar e engenharia climática dividem protagonismo. Definir telha, altura livre e orientação geográfica é escolha de engenheiro de cultivo, não só de agrônomo de livro.",
    body: `Estufas podem ser túnel simples, multipainel com ventilação lateral/ superior, ou com paredes rígidas e coluna central. Cada arquétipo altera custo de capex, perda de calor noturna e comportamento em vento. Em regiões tropicais/subtropicais, sombreamento e ventilação forçada frequentemente superam “aquecimento” como problema primeiro—excesso de radiação e estagnação de ar é comum.

A decisão de projeto cruza: microclima local (séries históricas), recursos hídricos, custo de energia elétrica e matriz de risco fitossanitário (entrada de pragas por aberturas). Documente premissas: vph alvo diurno/noturno, umidade absoluta máxima aceitável, PPFD alvo no dossel. Sem premissas escritas, discussão de equipamento vira disputa de marcas.

THCProce reforça compliance: licenciamento ambiental e elétrico variam—esta aula é educativa, não substitui ART de projeto civil.`,
    objectives: [
      "Comparar três famílias de estufa em relação a ventilação, custo e estabilidade climática.",
      "Listar variáveis de microclima que devem constar num relatório de premissas de projeto.",
      "Reconhecer que greenhouse exige integração solar + engenharia, não apenas ‘cobrir a planta’."
    ],
    closingSummary:
      "Tipo de estufa e premissas climáticas passam a ser critérios explícitos de decisão. Próximo: luz natural vs LED e fotoperíodo.",
    quiz: [
      Q("Em latitudes tropicais, qual desafio costuma dominar em estufa mal ventilada?", [
        "Sempre falta de luz",
        "Acúmulo de calor e umidade com ventilação insuficiente",
        "Geada em qualquer estação",
        "Ausência total de CO₂"
      ], 1),
      Q("Documento de premissas serve para:", [
        "Bloquear adaptações em campo",
        "Alinhar engenharia clima, cultivo e investimento em um quadro de referência",
        "Substituir licenciamento",
        "Eliminar necessidade de sensores"
      ], 1),
      Q("Estufa multipainel costuma priorizar:", [
        "Sempre opacidade total",
        "Controle fino de ventilação e maior resistência a vento em comparação a túnel básico — com custo diferente",
        "Eliminar uso de energia",
        "Evitar qualquer abertura lateral"
      ], 1)
    ],
    media: M.all,
    materials: ["Planilha de premissas climáticas", "Checklist de ventos predominantes e sombreamento"],
    references: [
      "Literatura de engenharia agrícola — estufas e microclima",
      "Normas locais de construção e elétrica (consulta técnica regional)"
    ],
    professorNotes:
      "Traga exemplo real de falha de ventilação de aluno—anônimo—para tornar a aula situada."
  },
  {
    title: "Luz solar, suplementação LED e fotoperíodo",
    introduction:
      "Fotossíntese é energia; produção de biomassa é integração de PPFD, espectro e fotoperíodo. Em estufa, luz solar oscila com sazonalidade — LEDs supletivos estabilizam dossel e prolongam janelas úteis.",
    body: `O sol entrega espectro completo variando com altitude de massa de ar e ângulo zenital. Estufas com diffusers ou sombreamento percentual alteram sharpness de sombra. Para cannabis de ciclo anual, fotoperíodo curto vegetativo vs indução floração 12/12 (em indoor; outdoor natural segue estacionalidade) precisa ser ensinado sem misturar regimes.

Escolha de LED suplementar: micro­molos alvo, uniformidade no dossel (mapa de PPFD), dissipação térmica e proteção IP frente à irrigação. ‘Watts’ da etiqueta não são proxy de fotossíntese útil — eficácia µmol/J e distribuição fotorreal importam.

Protocolo educativo: medição periódica com quantum sensor em grade; registro de DLI diário; comparação entre bandas de manhã e tarde. Evite promessas de ‘espectro mágico’ sem dados no seu dossel.`,
    objectives: [
      "Definir PPFD, DLI e fotoperíodo no contexto de cultivo protegido.",
      "Planejar grade simples de medição de luz com sensor quantum.",
      "Contrastar suplementação de enchimento vs suplementação focalizada em zonas deficitárias."
    ],
    closingSummary:
      "Luz deixa de ser ‘potência nomi­nal’ e vira plano de uniformidade + fotoperíodo. CO₂ e ventilação em seguida.",
    quiz: [
      Q("DLI representa:", [
        "Apenas consumo elétrico em kWh",
        "A fotossinteticamente ativa acumulada por área em um dia",
        "Umidade absoluta",
        "Concentração de CO₂ exalada pela planta isoladamente"
      ], 1),
      Q("Uniformidade de PPFD importa porque:", [
        "Elimina variabilidade genética",
        "Reduz zonas de estiramento fraco ou fotossíntese subótima no dossel",
        "Substitui irrigação",
        "Impede fotoperíodo"
      ], 1),
      Q("LED de suplementação exige atenção a:", [
        "Dissipação térmica, IP e mapa real de PPFD, não só potência anunciada",
        "Cor do driver apenas",
        "Número de fios da estufa",
        "Diâmetro do caule médio"
      ], 0)
    ],
    media: M.all,
    materials: ["Mapa de PPFD em grade (template)", "Calculadora DLI simplificada"],
    references: ["Literatura hortícola LED / HPS comparativa", "Manuais de sensores quantum"],
    professorNotes:
      "Evite medir uma vez só: série temporal mínima de uma semana por estação."
  },
  {
    title: "CO₂, ventilação e pressão na estufa",
    introduction:
      "CO₂ suplementar só faz sentido com luz adequada, distribuição de ar e segurança ocupacional. Ventilação troca calor e umidade; pressão leve positiva reduz entrada de insetos em algumas arquiteturas — com trade-offs.",
    body: `Tímidos 400–800 ppm fora; elevar CO₂ na copa pode aumentar assimilação se luz e temperatura foliar não forem limitantes. Monitore CO2 com sensor calibrado, não ‘chute’ visual. Ventilação deve homogeneizar bolhas quentes e CO2 estático.

Exaustão/insuflamento: cálculo de ACH desejado, posição das entradas para evitar zonas mortas, uso de ventiladores de circulação longitudinal. Pressão: estufas muito pressurizadas sem alívio aumentam esforço estrutural; negativas demais puxam poeira e esporos.

Segurança: aquecedores de CO2 combustão geram riscos de gases; cilindros exigem fixação e treinamento. THCProce condena improviso em espaço confinado sem engenharia.`,
    objectives: [
      "Explicar pré-requisitos fotossintéticos antes de suplementar CO₂.",
      "Listar medidas seguras de monitorização e fontes de CO₂.",
      "Relacionar ventilação com homogeneidade de CO₂ e controle de UR."
    ],
    closingSummary:
      "CO₂ vira ferramenta condicional a luz e ar — não amuleto. Temperatura, UR e VPD a seguir.",
    quiz: [
      Q("CO₂ suplementar sem luz adequada tende a:", [
        "Sempre duplicar rendimento",
        "Oferecer retorno marginal baixo ou nenhum — luz costuma ser o colo limitante antes",
        "Substituir ventilação",
        "Eliminar pragas"
      ], 1),
      Q("Sensor de CO₂ deve ser:", [
        "Dispensável se hiver confiança visual",
        "Calibrado e posicionado para refletir a copa, não só um canto morto",
        "Somente no solo",
        "Usado uma vez ao ano sem verificação"
      ], 1),
      Q("Ventiladores de circulação servem principalmente para:", [
        "Substituir exaustão em qualquer estufa",
        "Homogeneizar microclima e reduzir estratificação de temperatura e gás",
        "Eliminar irrigação",
        "Gerar CO₂"
      ], 1)
    ],
    media: { ...M.all, needsInfographic: true },
    materials: ["Folha de segurança para cilindros CO₂", "Esboço de fluxo de ar (plant layout)"],
    references: ["Manuais de ventilação agrícola", "OSHA / normas locais gases e compressed gas"],
    professorNotes:
      "Se demonstração, use apenas CO₂ seguro legal e espaço ventilado — sem gerador improvisado em sala fechada."
  },
  {
    title: "Temperatura, umidade relativa e VPD prático",
    introduction:
      "Vapor pressure deficit (VPD) integra temperatura e umidade numa variável que fala com transpiração. Em estufa, VPD alto demais estressa; baixo demais favorece patógenos foliares.",
    body: `Transpiração move nutrientes e resfria a folha; fechamento estomático ocorre sob estresse hídrico ou CO2/ luz desbalanceados. Tabelas VPD guiam faixas alvo por fase fenológica, mas o terreno importa: genética, vento local na folha e saúde radicular alteram conforto real.

Sensores devem estar protegidos de radiação direta e próximos do dossel produtivo. Evite confundir sensor único no poste com campo real — gradiente vertical é real.

Ações práticas: nebulização/fog em picos VPD (com microbiologia em mente), exaustão em picos térmicos, ajuste de irrigação com base em substrato e não só em ar — solo encharcado + ar ‘ok’ continua anoxia radicular.`,
    objectives: [
      "Calcular mentalmente a direção de mudança de VPD quando UR sobe à temperatura fixa.",
      "Posicionar sensores para reduzir erro de medida na copa.",
      "Relacionar VPD a riscos fisiológicos específicos em faixa alta vs baixa."
    ],
    closingSummary:
      "VPD transforma ‘temperatura boa’ e ‘umidade boa’ num único dígito acionável. Substrato e fertirrigação a seguir.",
    quiz: [
      Q("VPD aumenta quando, mantendo temperatura:", [
        "UR aumenta fortemente",
        "UR cai",
        "CO₂ cai sempre",
        "PPFD cai sempre"
      ], 1),
      Q("Zona morta de sensor típico no chão pode:", [
        "Representar copa com fidelidade absoluta",
        "Subestimar transpiração da massa foliar elevada",
        "Eliminar necessidade de irrigação",
        "Medir solo automaticamente"
      ], 1),
      Q("Excesso prolongado de UR foliar favorece:", [
        "Sempre secagem rápida",
        "Ambientes propícios a oomycetes/botrytis se persistir com outras condições adequadas",
        "Fotoinibição instantânea",
        "Ausência de nutrientes"
      ], 1)
    ],
    media: M.all,
    materials: ["Tabela VPD por fase (THCProce)", "Protetores de radiação para sondas"],
    references: ["Literatura hortícola VPD", "Guias de controle ambiental em estufa"],
    professorNotes:
      "Mostre plot UR×T de aluno com correção de posição de sensor — aprendizado visceral."
  },
  {
    title: "Substrato, irrigação e fertirrigação",
    introduction:
      "Raiz não ‘bebe fertilizante’ — consome solução no poro de ar. Substrato define retenção, oxigenação e tolerância a erro humano de irrigação.",
    body: `Blends com turfa, fibra de coco, perlita, vermiculita (uso criterioso) e correções de drenagem compõem um sistema físico — escolha depende de qualidade da água, frequência de fertirrigação e estratégia de salinização.

EC e pH alvo são faixas, não pontos únicos: cultivo orgânico vs mineral, clima de estufa e transpiração diurna alteram curva. Diagnóstico foliar é triagem, não mapa absoluto de nutriente único — NPK pode mascarar bloqueio físico.

Run-to-waste vs recircula em estufa: recirc exige monitoramento de acúmulo salino e higiene de reservatório. Água de reuso exige legislação local. Registro de drenado é KPI da mesa de cultivo maduro.`,
    objectives: [
      "Diferenciar retenção hídrica vs oxigenação de substrato com exemplos de material.",
      "Definir papel de EC/pH no tempo com exemplos de deriva salina.",
      "Argumentar prós e contras de recirculação de nutrientes em estufa."
    ],
    closingSummary:
      "Substrato + irrigação saem da receita viral e viram física de poros + regime de sal. MIP integrado em seguida.",
    quiz: [
      Q("Por que perlita frequentemente entra em blends?", [
        "Fornecer NPK primário",
        "Aerar e ajustar drenagem/retencção hídrica relativa",
        "Elevar umidade absoluta foliar sozinha",
        "Substituir luz"
      ], 1),
      Q("EC excessiva persistente pode:", [
        "Sempre aumentar rendimento",
        "Causar acúmulo iônico e estresse osmótico radicular/foliar se transpiração não ‘limpar’",
        "Eliminar oxigênio do ar da estufa",
        "Substituir medição de pH"
      ], 1),
      Q("Recirculação exige:", [
        "Nenhum monitoramento adicional",
        "Higiene de tanque, checagem de drift salino e estratégia de descarte parcial",
        "Sempre run-to-drain diário obrigatório universalmente",
        "Eliminação de sensores"
      ], 1)
    ],
    media: M.all,
    materials: ["Diário de irrigação (campo)", "Guia de correção salina por condutividade drenado"],
    references: ["Manuais coco/turfa", "Literatura fertirrigação recirculada"],
    professorNotes:
      "Conectar com aula secagem — sal acumula na planta e no substrato de forma acoplada."
  },
  {
    title: "MIP integrado em ambiente fechado",
    introduction:
      "Pragas entram com pessoas, ventilação e material vegetal. Em estufa, tolerância zero relativa a certos vetores exige protocolo, não só produto.",
    body: `Monitoramento com armadilhas, inspeção sub‑copo e registro temporal transforma achados em tendência. Ação curativa sem diagnóstico vira resistência e contaminação cruzada.

Hierarquia MIP: cultura (resistente / tempo de entrada), barreiras físicas, predadores e biológicos compatíveis com clima, químicos de menor impacto por último e rotacionalmente. Calendário de aplicação integra REV e janela de colheita.

Segurança do aplicador: EPI, ventilação na mixagem, lavagem de tanques — THCProce alinha com boas práticas de proteção ambiental regional.`,
    objectives: [
      "Construir matriz simples pragas × sinais × primeira suspeita diagnóstica.",
      "Explicar por que combinação indiscriminada de modos de ação agrava resistência.",
      "Listar barreira física mínima em estufa para novos lotes."
    ],
    closingSummary:
      "MIP vira sistema de dados e decisão — não lista Instagram. Floração e manejo de copa em seguida.",
    quiz: [
      Q("Primeiro passo ético ao ver sintoma foliar é:", [
        "Aplicar calendário inteiro de químicos",
        "Isolar hipótese com inspeção + histórico + amostra se necessário",
        "Colher tudo imediatamente",
        "Publicar foto sem contexto"
      ], 1),
      Q("Resistência surge principalmente por:", [
        "Uso exclusivamente biológico sempre",
        "Pressão de seleção repetida com mesma estratégia sem rotação/refúgio",
        "Medir VPD",
        "Ventilar estufa"
      ], 1),
      Q("Barreira física pode incluir:", [
        "Fonte de música alta",
        "Tela/Insect net qualificada em entradas e cultura dupla de segurança quando aplicável",
        "Apenas cor verde na estufa",
        "Uso exclusivo de CO₂"
      ], 1)
    ],
    media: M.all,
    materials: ["Planilha de scouting semanal", "Tabela de modos de ação (referência agronômica)"],
    references: ["Guias MIP hortícola regional", "Listas de biológicos compatíveis com cultivo protegido"],
    professorNotes:
      "Integrar disciplina cooperativismo quando falar escala e rastreio de lotes contaminados."
  },
  {
    title: "Floração, manejo e suporte de copa",
    introduction:
      "Em estufa, gênero e estratégia produtiva determinam ritmo de floração. Suporte de copa não é estética — reduz sombreamento interno e perdas mecânicas.",
    body: `Carga fotossintética e distribuição de assimalas mudam com a fase. Manejo de folhas baixas é decisão de microclima + sanidade + translocação — não existe receita única por strain.

Suportes devem distribuir peso sem ferir floema; treliças e clips exigem higiene e treinamento de equipe. Registro fenológico (semana floral) alimenta decisão de nutrientes e risco de botrytis relativo ao acúmulo de matéria morta úmida.

Evite narrativa de 'stress bom' sem limite claro — estresse excessivo reduz fotossíntese com ganhos ilusórios de 'cor'.`,
    objectives: [
      "Planejar suporte físico coerente com arquitetura de planta e vento em estufa.",
      "Relacionar poda/lollipop a umidade foliar e circulação de ar em fileira.",
      "Definir marcos fenológicos mínimos para auditoria interna."
    ],
    closingSummary:
      "Floração ganha cronograma e engenharia de dossel. Próximo: elétrica segura e operação diária.",
    quiz: [
      Q("Sombreamento interno excessivo costuma:", [
        "Aumentar DLI na base",
        "Reduzir qualidade de brotos inferiores e favorecer microclimas úmidos",
        "Eliminar VPD",
        "Aumentar CO₂ de forma segura"
      ], 1),
      Q("Registro fenológico ajuda a:", [
        "Aumentar seguidores em redes",
        "Alinhar nutrição, risco sanitário e decisão de colheita",
        "Substituir licença",
        "Determinar genética por cor da flor"
      ], 1),
      Q("Suporte físico mal dimensionado pode:", [
        "Ferir tecidos vasculares e criar pontos de patógeno se houver fricção úmida",
        "Eliminar necessidade de ventilação",
        "Aumentar PPFD sozinho",
        "Remover risco de botrytis automaticamente"
      ], 0)
    ],
    media: M.all,
    materials: ["Cronograma fenológico semanal", "Ficha de suporte e carga de broto"],
    references: ["Literatura condução de copa em horticultura protegida"],
    professorNotes: "Demonstrar clips e gola sanitizada se mostrar equipamento em sala."
  },
  {
    title: "Segurança elétrica e operação diária",
    introduction:
      "Estufa é usina parcialmente molhada: drives LED, ventiladores, bombas e sensores compartilham painel com ambiente úmido. Falha elétrica mata mais projeto que praga.",
    body:
      "Dimensionamento de circuitos, DR, aterramento e proteção IP são não negociáveis. Postos móveis de extensão no perímetro não substituem projeto. Água + poeira + vapor exigem caixas adequadas e rotina de inspeção.\n\n" +
      "Operação diária documentada reduz variabilidade: checklist manhã/tarde (VPD, irrigação, alertas de sensor), registro de anomalia com hora — vira histórico forense quando lote estraga.\n\n" +
      "Equipe treinada em bloqueio/etiquetagem para manutenção; produtos agrícolas armazenados segundo BPA mínimo. THCProce não ensina burlar fiscalização — ensina operação profissional.",
    objectives: [
      "Listar itens mínimos de checklist elétrico preventivo em estufa.",
      "Definir protocolo curto de resposta a alarme climático persistente.",
      "Relacionar registro operacional à rastreabilidade de lote."
    ],
    closingSummary:
      "Energia e água deixam de ser pano de fundo e viram risco gerido diariamente. Registro de ciclos vem a seguir.",
    quiz: [
      Q("Umidade + equipamento elétrico mal protegido elevam risco de:", [
        "Sempre maior fotossíntese",
        "Arqueamento, curto e choque — exigem IP/terragem corretos",
        "Eliminação de VPD",
        "Destilação de terpenos"
      ], 1),
      Q("DR residual em quadro serve para:", [
        "Decorar",
        "Proteção diferencial a fugas — requisito típico em instalações residenciais/comerciais conforme norma local",
        "Medir CO₂",
        "Aquecer nutrientes"
      ], 1),
      Q("Checklist operacional deve:", [
        "Ser mental apenas",
        "Ter versão escrita/digital com horário e responsável em times multiplanta",
        "Substituir sensores",
        "Eliminar treinamento de equipe"
      ], 1)
    ],
    media: M.all,
    materials: ["Checklist elétrico semanal", "Modelo de livro de ocorrências"],
    references: ["NR-10 referência (Brasil) / normas locais equivalentes"],
    professorNotes: "Se possível, visita virtual a quadro bem montado vs improvisado."
  },
  {
    title: "Registro de ciclos e melhoria contínua",
    introduction:
      "Sem dados, ‘melhor safra’ é sorte. Com séries temporais de clima, irrigação e pragas, decisões migrão de opinião para tendência.",
    body: `Campos mínimos por ciclo: genética, tamanho de vaso/substrato, DLI média, incidentes climáticos, EC/pH médios por semana, custo energético estimado, pragas detectadas e ação. Visualização simples (gráfico) já ensina.

Melhoria contínua PDCA enxuto: planejar meta de VPD por fase, fazer, checar dado real vs meta, agir ajustando ventilação/nutriente. Benchmarking interno > comparação ruidosa com internet.

Privacidade: dados operacionais sensíveis da empresa ficam sob política interna — em trabalhos de aluno, anonimize lotes comerciais.`,
    objectives: [
      "Propor modelo mínimo de planilha de ciclo replicável.",
      "Identificar KPI primários para greenhouse vs outdoor.",
      "Explicar melhoria contínua sem virar burocracia morta."
    ],
    closingSummary:
      "Dados conectam esta estufa à próxima safra — intuicao vira hipótese testável. Colheita orientada à qualidade fecha o curso.",
    quiz: [
      Q("Registro serve principalmente para:", [
        "Substituir olhar experiente",
        "Permitir comparação temporal e causalidade aproximada em condições controladas",
        "Eliminar sensores",
        "Publicar segredos comerciais obrigatoriamente"
      ], 1),
      Q("Benchmarking interno compara:", [
        "Sempre seu cultivo com influencer estrangeiro sem contexto",
        "Lotes e ciclos seus sob mesmas premissas — evita ruído externo",
        "Apenas preço de nutriente",
        "Cor da flor apenas"
      ], 1),
      Q("Melhoria contínua exige:", [
        "Nunca mudar protocolo",
        "Ciclo planejar–executar–medir–ajustar com responsável nomeado",
        "Apenas mais fertilizante",
        "Eliminar matemática"
      ], 1)
    ],
    media: { ...M.theory, needsImage: true },
    materials: ["Template CSV ciclo THCProce", "Guia de visualização simples (planilhas)"],
    references: ["Literatura lean em agricultura protegida"],
    professorNotes: "Peça entrega de uma linha de planilha anonimizada como exercício."
  },
  {
    title: "Colheita orientada à qualidade na estufa",
    introduction:
      "Janela de colheita integra tricomas, aroma, umidade de broto e risco sanitário — não cor de cabelo de pistilo isolada.",
    body: `Use observação sistêmica: matéria seca alvo por processo de secagem/cura disponível; risco de botrytis com tempo úmido adicional; necessidade de sequência de salas limpas. Corte em etapas pode reduzir perdas se microclima final for heterogêneo.

Transporte pós-corte: cestos arejados, tempo máximo em campo quente, higiene de tesouras. Documente lote, data, operador — ponte direta com pós-colheita e laboratório se existir.

Declínio fotossintético final não autoriza colher ‘verde’ sem critério científico — equilíbrio com prazo comercial é decisão documentada, não achismo de grupo.`,
    objectives: [
      "Definir checklist pré-colheita (sanidade, umidade, calendário).",
      "Planejar corte sequencial vs total com base em uniformidade real.",
      "Relacionar decisão de colheita à capacidade de secagem/cura disponível."
    ],
    closingSummary:
      "A estufa entrega matéria-prima — qualidade final fecha na curva pós-colheita (outra sala do campus). Este curso amarra decisão de colheita a dado e processo.",
    quiz: [
      Q("Colher apenas por cor de pistilo, ignorando tricoma e sanidade, é:", [
        "Protocolo gold standard",
        "Estratégia frágil — aumenta variabilidade organoléptica e química",
        "Obrigatório em greenhouse",
        "Substituto de COA"
      ], 1),
      Q("Transporte lento e quente pós-corte pode:", [
        "Melhorar terpenos sempre",
        "Acelerar degradação e risco microbiológico se empacotamento úmido persistir",
        "Eliminar necessidade de secagem",
        "Substituir congelamento"
      ], 1),
      Q("Documentar lote na colheita ajuda:", [
        "Apenas marketing",
        "Rastreio e aprendizado de ciclo — base cooperativa/industrial futura",
        "Eliminar etiqueta",
        "Evitar cura"
      ], 1)
    ],
    media: M.all,
    materials: ["Ficha de decisão de colheita", "Protocolo de higiene de ferramentas"],
    references: ["Módulo Secagem & Cura do campus — continuidade pedagógica"],
    professorNotes: "Visite virtual sala de secagem para fechar narrativa transversal."
  }
];
