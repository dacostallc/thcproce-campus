import type { LessonStreamContent } from "../types";
import { Q, M } from "./_helpers";

/** Cultivo indoor — luz artificial, ambiente fechado, segurança (10 aulas). */
export const CULTIVO_INDOOR_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Projeto de sala: luz, ar e odor",
    introduction:
      "Sala indoor é sistema térmico-hidráulico-luminoso integrado; erro de projeto elétrico ou exaustão subdimensionada compromete ciclo inteiro antes da primeira irrigação.",
    body:
      "Planeje carga elétrica total (iluminação, clima, bombas) com folga para partida de compressores e dimensionamento de disjuntores cabeados por profissional habilitado. Odor: carbono ativado e pressão negativa controlada reduzem vazamento para áreas comuns; exaustão direcionada evita bolsa de ar estagnada no dossel.\n\n" +
      "Pontos técnicos: layout linear de fluxo ar (entrada filtrada → dossel → exaustão); distância mínima luminária–copas conforme fabricante; registro de circuitos em diagrama unifilar para manutenção.\n\n" +
      "Erros comuns: multiplicar potência em extensão doméstica sem dimensionamento; ignorar vazamento de duto flexível solto; misturar umidificador industrial sem drenagem de condensado.",
    objectives: [
      "Esboçar fluxo de ar e pressão negativa básica em sala fechada.",
      "Relacionar carga elétrica com segurança e manutenção documentada.",
      "Listar estratégias de mitigação de odor compatíveis com vizinhança e norma local."
    ],
    closingSummary:
      "Projeto indoor começa no quadro elétrico e no desenho do ar, não no vaso decorativo.",
    quiz: [
      Q("Pressão negativa modesta na sala tende a:", [
        "Empurrar odor para dentro do dossel",
        "Reduzir escape de odores para fora da sala quando o duto está vedado",
        "Eliminar necessidade de exaustão",
        "Substituir filtro de carvão sem manutenção"
      ], 1),
      Q("Extensões domésticas empilhadas para alimentar LED potente são:", [
        "Prática aceitável se o cabo for grosso",
        "Risco de sobrecarga e incêndio — exige projeto de circuito dedicado",
        "Obrigatórias em todo indoor",
        "Equivalente a quadro trifásico industrial"
      ], 1),
      Q("Condensado de umidificador sem rota de drenagem pode:", [
        "Aumentar apenas o PPFD",
        "Gerar poças, fungos ambientais e falha de equipamento",
        "Substituir irrigação",
        "Melhorar segurança elétrica"
      ], 1)
    ],
    media: M.theory,
    materials: ["Planilha carga elétrica indoor THCProce", "Esquema unifilar em branco"],
    references: ["NBR e normas locais de instalações elétricas", "Fabricantes de LED — manuais de distância e cobertura"],
    professorNotes: "Reforce que instalação elétrica deve ser feita por profissional legalmente habilitado."
  },
  {
    title: "LED, PPFD e espectro sem marketing vazio",
    introduction:
      "PPFD medido no dossel traduz fótons úteis; marketing de ‘watt’ na tomada não substitui mapa de uniformidade nem histórico de envelhecimento do diodo.",
    body:
      "Use medidor de quantum (calibrado) em grade ao nível das copas: desenhe mapa de hot spots e sombras. Espectro influencia morfologia (razão de aspecto, alongamento) e, em combinação com genética, o perfil de metabolitos secundários — mas ensaios rigorosos exigem controle de VPD e nutrição.\n\n" +
      "Pontos técnicos: curva de diminuição de eficiência luminosa com temperatura de painel; limpeza de óptica; fotoperíodo 18/6 vegetativo e 12/12 flora com timer certificado.\n\n" +
      "Erros comuns: PPFD excessivo sem elevação de CO₂ e VPD coerente, gerando fotoinibição e pontas queimadas; confundir espectro ‘full spectrum’ com prova de superioridade química da flor.",
    objectives: [
      "Medir e interpretar PPFD em malha representativa do dossel.",
      "Relacionar espectro, morfologia e necessidade de ajuste de VPD.",
      "Desmontar argumentos comerciais baseados só em potência elétrica nominal."
    ],
    closingSummary:
      "Luz indoor é engenharia de fótons no espaço-tempo do dossel — medição manda, slogan de caixa obedece.",
    quiz: [
      Q("PPFD refere-se a:", [
        "Potência elétrica na tomada",
        "Densidade de fluxo fotossintético de fótons na superfície",
        "Concentração de CO₂ apenas",
        "Condutividade da solução nutritiva"
      ], 1),
      Q("Hot spots sem ajuste de altura ou regulagem podem causar:", [
        "Uniformidade perfeita",
        "Fotodano em regiões superiores do dossel",
        "Eliminação de necessidade de vento",
        "Substrato sempre seco"
      ], 1),
      Q("Timer de fotoperíodo deve ser:", [
        "Qualquer relógio de cozinha sem bateria",
        "Confiável, com reserva ou alarme de falha documentado",
        "Substituído por luz natural",
        "Ignorado na flora"
      ], 1)
    ],
    media: M.lab,
    materials: ["Grade de medição PPFD (PDF)", "Log de mapa lumínico por semana"],
    references: ["Literatura hortícola LED — PPFD e morfologia", "Manuais do medidor quantum utilizado"],
    professorNotes: "Se a turma não tiver medidor, simule com dados de fabricante e discuta limitações."
  },
  {
    title: "Exaustão, CO₂ e distribuição de ar",
    introduction:
      "CO₂ suplementar só compensa quando luz, VPD e nutrição acompanham; exaustão insuficiente acumula calor latente e estresse oxidativo foliar.",
    body:
      "Dimensione exaustão pela troca de volume da sala por minuto desejada, considerando restrição de dutos e curvas. CO₂: fonte segura, sensor calibrado, janela de ventilação que evita acúmulo perigoso fora da sala. Mistura de ar no dossel evita microcamadas quentes úmidas.\n\n" +
      "Pontos técnicos: curva ventilador in-line — ruído vs vazão; selagem de light leaks que competem com fotoperíodo; retorno de ar filtrado em circuito fechado quando aplicável.\n\n" +
      "Erros comuns: injetar CO₂ sem fechar vazamentos — desperdício e risco; exaustão que puxa ar não filtrado de sótão empoeirado.",
    objectives: [
      "Dimensionar exaustão com noções de CFM e perda de carga em dutos.",
      "Integrar CO₂ com segurança e sensores, sem mitos de ‘mais é sempre melhor’.",
      "Garantir mistura de ar no dossel com ventiladores circulatórios adequados."
    ],
    closingSummary:
      "Ar em movimento é o elo entre luz, transpiração e metabolismo — projeto fraco aqui destrói LED caro.",
    quiz: [
      Q("CO₂ suplementar sem PPFD e VPD adequados tende a:", [
        "Dobrar rendimento automaticamente",
        "Ter ganho marginal ou nulo, com custo e risco operacional",
        "Eliminar pragas",
        "Substituir exaustão"
      ], 1),
      Q("Curvas apertadas em duto rígido reduzem:", [
        "Sempre o ruído",
        "Vazão efetiva — exige ventilador ou diâmetro maiores",
        "Necessidade de filtro",
        "Fotoperíodo"
      ], 1),
      Q("Vazamento de luz na flora pode:", [
        "Ser ignorado se o LED for caro",
        "Interferir no fotoperíodo e na consistência fenológica",
        "Aumentar CO₂",
        "Substituir timer"
      ], 1)
    ],
    media: M.theory,
    materials: ["Calculadora CFM simplificada", "Checklist selagem de sala"],
    references: ["Guias de ventilação hortícola indoor", "Manuais de segurança para CO₂ em ambiente fechado"],
    professorNotes: "Alerte para normas locais de trabalho se houver funcionários na sala."
  },
  {
    title: "Nutrientes, EC/pH e diagnóstico foliar",
    introduction:
      "Condutividade e pH são proxies de disponibilidade iônica; interpretação exige calibragem de medidor, temperatura da solução e histórico de irrigação.",
    body:
      "Calibre medidores semanalmente em uso intensivo. Ajuste pH após misturar todos os componentes A/B e aditivos. Diagnóstico foliar integra posição da folha afetada, velocidade de progressão e ambiente (VPD) — carencia e toxidade se confundem sob transpiração baixa.\n\n" +
      "Pontos técnicos: rampas de EC por fase; flush planejado versus ‘limpeza’ supersticiosa; sintomas móveis vs imóveis no floema.\n\n" +
      "Erros comuns: corrigir pH com excesso de ácido/base fraca gerando drift salino; confundir mancha de respingo nutritivo com patógeno.",
    objectives: [
      "Operar EC/pH com protocolo de calibragem e registro.",
      "Diferenciar sintomas móveis e imóveis em abordagem conservadora.",
      "Evitar sobreinterpretação de folha isolada sem contexto ambiental."
    ],
    closingSummary:
      "Nutrição indoor é registro + consistência; folha fala, mas o medidor e o VPD traduzem o sotaque.",
    quiz: [
      Q("Sintomas em folhas mais velhas primeiro sugerem, com frequência:", [
        "Sempre patógeno novo",
        "Elementos móveis (ex.: N, P, K, Mg em certos padrões) — sujeito a confirmação",
        "Sempre praga traça",
        "Excesso exclusivo de luz"
      ], 1),
      Q("Medidor sem calibragem frequente tende a:", [
        "Ser mais preciso com o tempo",
        "Gerar decisões erradas de correção de pH/EC",
        "Eliminar necessidade de log",
        "Substituir laboratório foliar"
      ], 1),
      Q("Respingo de solução nutritiva na folha pode imitar:", [
        "Sempre vírus",
        "Lesão química localizada — distinguir de doença com histórico de aplicação",
        "Sempre deficiência de ferro",
        "Enraizamento"
      ], 1)
    ],
    media: M.lab,
    materials: ["Tabela EC alvo por fase (guia)", "Ficha de calibragem de medidores"],
    references: ["Literatura de nutrição mineral em cultivo protegido", "Cartazes de deficiências — uso com ressalvas"],
    professorNotes: "Enfatize que diagnóstico remoto de folha sem foto padronizada é frágil."
  },
  {
    title: "VPD, transpiração e controle fino",
    introduction:
      "VPD (déficit de pressão de vapor) conecta temperatura, umidade e taxa transpiratória; fora da faixa operacional, nutrientes ‘certos’ não entram e patógenos facilitados por filme de água ganham espaço.",
    body:
      "Monitore temperatura de folha (inferida ou medida) e UR para estimar VPD. Ajuste climatização, nebulização controlada ou desumidificação conforme fase: vegetativo tolera faixa mais ampla; flora com flores densas exige banda mais disciplinada para reduzir risco de botrytis.\n\n" +
      "Pontos técnicos: gradiente vertical de temperatura em LED top-light; efeito de vento de folha na camada limite; noite com UR alta exige desumidificação ou fluxo de ar mínimo responsável.\n\n" +
      "Erros comuns: ‘subir VPD’ agressivamente sem rampa, dessecando meristemas; ignorar microclima interno do dossel medindo só um ponto na parede.",
    objectives: [
      "Calcular ou estimar VPD e relacionar com transpiração.",
      "Ajustar faixas por fase fenológica com foco sanitário na flora.",
      "Reconhecer gradiente vertical em salas com LED próximo ao dossel."
    ],
    closingSummary:
      "VPD é o termostato invisível da entrada de cálcio e do risco fúngico — medir na parede não basta se o dossel mente.",
    quiz: [
      Q("VPD muito baixo (ar quase saturado) no dossel tende a:", [
        "Aumentar transpiração descontroladamente",
        "Reduzir transpiração e favorecer filmes de água e certos fungos",
        "Eliminar necessidade de vento",
        "Aumentar CO₂ infinitamente"
      ], 1),
      Q("Medir UR apenas junto ao termostato da parede pode:", [
        "Representar sempre o dossel central",
        "Subestimar ou superestimar o microclima foliar central",
        "Substituir medidor de CO₂",
        "Eliminar pragas"
      ], 1),
      Q("Flor densa sob UR noturna elevada pede:", [
        "Somente mais luz",
        "Estratégia combinada de ar, desumidificação ou banda térmica noturna consciente",
        "Eliminação da exaustão",
        "Aspersão foliar intensa"
      ], 1)
    ],
    media: M.lab,
    materials: ["Tabela faixas VPD por fase (referência)", "Log noturno de UR"],
    references: ["Literatura de VPD em cultivo medicinal protegido", "Guias IPM indoor"],
    professorNotes: "Conecte com a aula de pragas indoor do curso greenhouse quando fizer sentido cruzamento."
  },
  {
    title: "Poda, treino e uniformização de dossel",
    introduction:
      "Treinamentos mecânicos reorganizam arquitetura luminosa sem aumentar magically o PPFD — reduzem sombra interna e melhoram uniformidade.",
    body:
      "Low stress training (LST) distribui pontos de crescimento sob luz mais homogênea; podas de estrutura exigem janelas de ciclo sanitárias (ferramenta limpa, ambiente menos úmido). SCROG exige gestão da malha antes do fechamento do dossel.\n\n" +
      "Pontos técnicos: tempo de recuperação vs dias restantes até meta de colheita; feridas abertas em alta UR noturna elevam risco.\n\n" +
      "Erros comuns: defoliação agressiva tarde demais na flora reduzindo reservas; treino sem vento adequado, aumentando microbolsões úmidos.",
    objectives: [
      "Escolher entre LST, poda de manutenção e SCROG conforme genética e cronograma.",
      "Aplicar higiene de corte e timing para reduzir porta de entrada patogênica.",
      "Relacionar treino com mapa PPFD e vento de folha."
    ],
    closingSummary:
      "Treino é geometria do dossel sob luz fixa — sem vento e sem mapa de luz, vira estética inútil.",
    quiz: [
      Q("Poda gerando muitas feridas abertas com UR noturna alta pode:", [
        "Sempre aumentar rendimento",
        "Elevar risco de patógenos oportunistas",
        "Eliminar necessidade de desumidificação",
        "Substituir ventilação"
      ], 1),
      Q("SCROG eficaz exige:", [
        "Instalar a malha após o dossel fechado",
        "Planejar inserção precoce e gestão contínua dos brotos",
        "Apenas poda apical única",
        "Desligar exaustão"
      ], 1),
      Q("LST tem como objetivo principal:", [
        "Aumentar CO₂",
        "Redistribuir pontos vegetativos sob luz mais uniforme",
        "Substituir fertirrigação",
        "Eliminar necessidade de LED"
      ], 1)
    ],
    media: { needsVideo: true, needsImage: true, needsInfographic: true, needsSupportMaterial: true },
    materials: ["Diagrama LST vs SCROG", "Checklist higiene de tesoura"],
    references: ["Literatura de arquitetura de dossel em cultivo indoor", "Vídeos técnicos sem promessa de yield"],
    professorNotes: "Mostre fotos boas vs ruins de fechamento de dossel."
  },
  {
    title: "Floração 12/12: marcos e stress controlado",
    introduction:
      "Transição 12/12 inicia reprogramação de carbono para organos reprodutivos; estresses simultâneos (luz, calor, nutrição) somam e podem induzir instabilidade sexual ou aborto floral.",
    body:
      "Marcos semanais: alongamento inicial, pegamento floral, expansão bráctea engrossada, resinificação tardia. Luz: evitar intrusion de espectros fora da janela 12 h; revisar timers. Stress de seca controlada não é universalmente segura — coop medicinal pode priorizar segurança microbiana a ‘forças estéticas’.\n\n" +
      "Pontos técnicos: redução gradual de NP relativo conforme programa coerente; monitor de transpiração de bandeja opcional mas útil para leitura de consumo hidrico.\n\n" +
      "Erros comuns: alterar drasticamente direção de vento criando zonas ocultas úmidas; interrupções de escuro durante 12 h de sombra.",
    objectives: [
      "Descrever marcos fenológicos indoor em formato de conferência técnica.",
      "Gerir estresse combinado sob ética coop medicinal.",
      "Proteger integridade das 12 h de escuro."
    ],
    closingSummary:
      "Floração é orquestração temporal: luz, VPD e nutrição precisam conversar ou o dossel entra em conflito com ele mesmo.",
    quiz: [
      Q("Breve intrusion de luz no período escuro pode:", [
        "Ser sempre inócua",
        "Interferir com a fotoperiodicidade dependendo da duração, intensidade e genética",
        "Eliminar THC",
        "Substituir CO₂"
      ], 1),
      Q("Múltiplos estresses fortes na flora tendem a:", [
        "Ser sempre cumulativos negativamente para estabilidade floral",
        "Somar riscos — exige priorização e registro",
        "Reduzir sempre pragas",
        "Aumentar sempre terpenos sem medição"
      ], 1),
      Q("Monitor de peso de bandeja ajuda a:", [
        "Medir THC",
        "Inferir consumo hídrico e frequência de irrigação",
        "Substituir medidor de CO₂",
        "Eliminar VPD"
      ], 1)
    ],
    media: M.theory,
    materials: ["Cronograma marcos flora (modelo)", "Planilha de incidentes de luz"],
    references: ["Literatura de morfologia floral em Cannabis", "Notas de IPM na flora"],
    professorNotes: "Discuta variabilidade genética na resposta a stress — sem dogma de ‘dark period 1 min ok’."
  },
  {
    title: "Diário de cultivo e troubleshooting",
    introduction:
      "Diário estruturado transforma cultivo em processo auditável: reduz dependência de memória e acelera aprendizado entre ciclos.",
    body:
      "Registre diariamente: PPFD médio efetivo, EC/pH alimentação e runoff opcional, temperatura/UR mínimos e máximos, incidentes elétricos, podas/pulverizações, observações de pragas por zona do dossel. Fotos padronizadas (mesmo ângulo, mesma marca temporal) aumentam poder de retrospectiva.\n\n" +
      "Pontos técnicos: tag de causa raiz (5 porquês leve); separar sintoma ambiental vs nutricional vs patológico antes de intervenção combinada.\n\n" +
      "Erros comuns: registrar só ‘dia X reguei’; mudar três variáveis no mesmo dia dificultando inferência causal.",
    objectives: [
      "Implementar modelo mínimo de diário THCProce em planilha ou caderno de campo indoor.",
      "Aplicar protocolo conservador antes de stacking de correções.",
      "Valorizar fotografia serial para troubleshooting remoto supervisão."
    ],
    closingSummary:
      "Cultivo indoor sem log é arte sem metadados — difícil ensinar, impossível escalar cooperativamente.",
    quiz: [
      Q("Alterar luz, EC e VPD no mesmo dia após um sintoma tende a:", [
        "Facilitar diagnóstico causal",
        "Confundir a inferência sobre a causa real",
        "Substituir laboratório",
        "Eliminar necessidade de sensor"
      ], 1),
      Q("Runoff periódico documentado ajuda a:", [
        "Medir THC",
        "Monitorar acúmulo salino e deriva de pH no substrato",
        "Substituir irrigação",
        "Eliminar folha fan"
      ], 1),
      Q("Foto padronizada no troubleshooting serve para:", [
        "Apenas redes sociais",
        "Comparar evolução temporal com menos viés de ângulo e iluminação",
        "Substituir microscópio",
        "Eliminar VPD"
      ], 1)
    ],
    media: M.theory,
    materials: ["Template diário indoor THCProce", "Guia de fotografia de folha para suporte"],
    references: ["Lean em agricultura protegida — registros operacionais", "Fórum supervisionado Moodle"],
    professorNotes: "Proponha peer review do diário no fórum (anonimizado) como atividade opcional."
  },
  {
    title: "Segurança elétrica, incêndio e NR básica",
    introduction:
      "Indoor densifica potência por metro quadrado; incêndio elétrico é risco real estatística — prevenção passa por instalação correta, inspeção térmica e procedimentos claros.",
    body:
      "Quadros com DR quando aplicável, aterramento conforme projeto, aquecedores estáveis ou afastamento de combustíveis — nunca estender lona reflétiva sobre aquecedores portáveis. Planeje extintor adequado classe e caminho duplo de saída se houver ocupação trabalhista.\n\n" +
      "Pontos técnicos: conectores waggo vs emenda improvisada torcida isolada só com fita; fusíveis inadequados sob medidor de laboratório clandestino — proibidos.\n\n" +
      "Erros comuns: ‘gambi’ permanente subdimensionado aquecimento de nutrientes; filtros carvão obstruídos aumentando trabalho compressor quente próximo materiais térmicos sensíveis sem distância mínima.",
    objectives: [
      "Identificar hotspots de incêndio elétrico típicos indoor.",
      "Listar elementos de projeto que exigem profissional legalmente habilitado.",
      "Relacionar normas trabalhistas básicas com presença de colaboradores em sala tecnificada."
    ],
    closingSummary:
      "O melhor colheita some se o breakthrough elétrico vir com fumaça — segurança não é módulo opcional.",
    quiz: [
      Q("Emendas elétricas improvisadas permanentes são:", [
        "Aceitáveis se funcionarem",
        "Risco elevado de sobreaquecimento e incêndio",
        "Obrigatórias",
        "Substituto de DR"
      ], 1),
      Q("Aterramento adequado serve para:", [
        "Aumentar PPFD",
        "Segurança de pessoas e equipamentos em falha",
        "Eliminar filtro de carvão",
        "Substituir exaustão"
      ], 1),
      Q("Trabalhadores frequentes na sala exigem:", [
        "Nenhuma medida adicional",
        "Atenção a rotas de fuga, EPI e normas aplicáveis — orientação jurídica externa",
        "Somente luvas de jardinagem",
        "Eliminação de LED"
      ], 1)
    ],
    media: M.theory,
    materials: ["Checklist inspeção elétrica visual mensal", "Cartaz de número de emergência local"],
    references: ["Corpo de Bombeiros — orientações locais", "NR relevantes quando couber empresa"],
    professorNotes: "Não ministre projeto elétrico; encaminhe a engenharia/elétrica habilitados."
  },
  {
    title: "Fluxo de colheita indoor premium",
    introduction:
      "Colheita indoor lucra quando integra decisão fenológica, higiene sequential de talo-flor, primeiro ambiente seco gradual e handshake com sala de cura THCProce.",
    body:
      "Defina janela por amostragem de tricomas e avaliação sanitária. Corte com ferramental limpo, idealmente sequenciando plantas aparentemente sadias antes de zonas suspeitas. Remoção de folhas deve seguir protocolo da cooperativa: equilibrar tempo de secagem inicial com risco de feridas e microclima.\n\n" +
      "Pontos técnicos: primeira 48–72 h pós-colheita crítico para preservação volátil; temperatura sala secagem e umidade inicial documentadas sala secagem curso dedicado.\n\n" +
      "Erros comuns: ‘molhar’ flush final sem controle microbiano; misturar planta com botrytis visível com lote limpo.",
    objectives: [
      "Fechar protocolo de colheita indoor alinhado à continuidade pós-colheita campus.",
      "Aplicar higiene de sequência de corte e quarentena visual.",
      "Evitar práticas de flush que aumentem risco microbiano sem ganho comprovado."
    ],
    closingSummary:
      "Indoor termina na transição limpa para secagem — o curso Secagem & Cura é o fecho natural deste arco.",
    quiz: [
      Q("Misturar material com infecção visível ao lote limpo é:", [
        "Diluição aceitável",
        "Contaminação rastreável de lote inteiro — inaceitável em processo responsável",
        "Obrigatório em indoor",
        "Substituto de laboratório"
      ], 1),
      Q("Primeiras horas pós-corte influenciam principalmente:", [
        "Cor do vaso",
        "Perfil volátil e risco microbiano inicial",
        "Registro de CO₂",
        "PPFD da flora seguinte"
      ], 1),
      Q("Sequência de corte planta doente por último visa:", [
        "Aumentar teoria Instagram",
        "Reduzir transmissão mecânica de inóculo entre dosséis adjacentes na mesma sessão",
        "Eliminar VPD",
        "Substituir cura em frasco"
      ], 1)
    ],
    media: M.all,
    materials: ["Fluxograma indoor → sala secagem THCProce", "Ficha decisão última irrigação vs risco sanitário"],
    references: ["Curso Secagem & Cura — mesmo campus", "Literatura pós-colheita volátil humidade"],
    professorNotes: "Encaminhar alunos imediatamente ao módulo de secagem para fechar sensório."
  }
];
