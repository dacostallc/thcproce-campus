import type { LessonStreamContent } from "../types";
import { Q, M } from "./_helpers";

/** Secagem e cura — pós-colheita, preservação de voláteis, rótulo coop (10 aulas). */
export const SECAGEM_CURA_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Por que a cura define aroma e suavidade",
    introduction:
      "Secagem retira água em taxa compatível com a integridade tricomática; cura igualiza microumidade dentro das brácteas e permite evolução organoléptica num recipiente relativamente vedado.",
    body:
      "A distinção THCProce: secagem é transporte global de vapor; cura é químico-física lenta de equalização quando o processo associativo ou individual mantém registros revisáveis. Mono e sesquiterpenos leves migram primeiro quando o gradiente térmico é agressivo ou quando vento direto fecha superficialmente a casca (case hardening) retendo centro úmido.\n\n" +
      "Pontos técnicos: nos primeiros dias o talo ainda hidráulico altera peso diário sem refletir imediatamente o gradiente médio radial bracteal; headspace inicial do jar acopla pressão parcial vapor à atividade água da flor quando burping respeita cadência documentada.\n\n" +
      "Erros comuns: tomar perfume inicial intenso como garantia tardia ignorando fugas rápidas de frações voláteis leves; encher o jar com materiais ainda muito molhados e confiar apenas no tempo cronológico, sem política associativa nem laudo microbiológico quando o destino for sensível.",
    objectives: [
      "Definir secagem frente a cura com vocabulário de massa vapor e tempo.",
      "Relacionar perda precoce de voláteis leves com choques térmicos e ventilação superficial concentrada continuada sobre brotos pendurados.",
      "Reconhecer que o texto da escola não substitui garantia microbiológica laboratorial nem deliberação formal em assembleia quando houver fluxo medicinal sensível."
    ],
    closingSummary:
      "A cura trabalha sob matéria que já ingressou estável hidricamente dentro de critério documentado — pressa térmica e luz excessiva dissipam antes o que parecia ‘cheiro forte’ na primeira semana.",
    quiz: [
      Q("Case hardening descreve:", [
        "Aumento automático de canabinoides totais",
        "Secagem superficial rápida que mascara umidade ainda alta no centro do broto",
        "Procedimento farmacêutico de limpeza de frasco",
        "Protocolo obrigatório de compostagem térmica"
      ], 1),
      Q("Flor muito úmida colocada no jar sem nova passagem pela secagem adequada tende a:", [
        "Eliminar patógenos por definição",
        "Elevar probabilidade sanitária desfavorável e exigir política técnica + laboratório parceiros",
        "Congelar tricomas estáveis",
        "Substituir análises documentais de lote por tempo sozinho"
      ], 1),
      Q("Burping inicial no jar serve principalmente para:", [
        "Substituir a escuridão da sala de secagem",
        "Trocar parte do headspace gasoso modulando CO₂ umidade inicial evitando estagnação prolongada nociva inicial",
        "Irradiação ultravioleta dirigida dentro do vidro obrigatória",
        "Acionar fotoperíodo residual da planta"
      ], 1)
    ],
    media: M.theory,
    materials: ["Fluxograma THCProce secagem → cura", "Glossário curto volátil e vapor"],
    references: ["Revisões gerais pós-colheita aromática em culturas resinosa", "Notas THCProce rastreamento associativo anonimizado"],
    professorNotes: "Traga se possível uma curva anônima térmico-UR de sala real como objeto de debates no fórum."
  },
  {
    title: "Secagem: temperatura, umidade e escuridão",
    introduction:
      "Temperatura, umidade relativa e baixa luminância formam conjunto físico inicial que determina primeira deriva gradual de vapor da matriz antes do jar.",
    body:
      "Suspenda o dossel de modo que o vento refresque o espaço todo com circulação suave — evite jato contínuo e direto sobre os brotos, pois pode acelerar superficialmente demais criando casca mais seca ao redor mantendo centro ainda úmido, favorecendo surpresas no jar.\n\n" +
      "Pontos técnicos: diário obrigatório com temperatura e UR mínima/máxima em pelo menos dois níveis verticais próximos ao dossel, alinhado a melhoria contínua cooperativa quando existir política formal.\n\n" +
      "Erros comuns: aquecedores portáteis muito próximos ao dossel sem registro criam hotspots locais que não aparecem quando o sensor fica apenas junto à porta.",
    objectives: [
      "Registrar térmicas e UR próximas ao dossel em mais de uma altura.",
      "Projetar circulação suave volumétrica sem jatos localizados prolongados contra brotos.",
      "Interpretar hotspots de aquecedores portáteis como viés nos registros quando sensores ficam apenas na porta."
    ],
    closingSummary:
      "Sala bem instrumentada narra gradientes reais; sala mal instrumentada gera relatório bonito mas falso sobre o dossel onde a matéria pendura.",
    quiz: [
      Q("Ventilador com jato direto contínuo sobre brotos por vários dias tende a:", [
        "Garantir igualação radial perfeita do interior sempre",
        "Secar primeiro a periferia e manter centro mais úmido, atrasando o equilíbrio hidráulico global",
        "Eliminar patógenos por turbulência sozinha",
        "Substituir totalmente medição UR"
      ], 1),
      Q("Medir apenas junto à porta de uma sala pequena, longe do dossel pendurado, pode:", [
        "Ser sempre representativo do dossel central",
        "Subestimar ou superestimar o microclima real das inflorescências",
        "Eliminar a necessidade de qualquer segundo sensor",
        "Substituir inteiramente a sala de secagem"
      ], 1),
      Q("Por que a THCProce recomenda baixa luminância durante a secagem inicial?", [
        "Para acelerar sempre a fotossíntese residual",
        "Para reduzir deriva fotoquímica paralela desnecessária enquanto ainda há perda rápida de massa úmida controlada",
        "Para eliminar a necessidade de vento",
        "Para eliminar rótulos em lote"
      ], 1)
    ],
    media: M.theory,
    materials: ["Planilha log térmico-UR em dois níveis", "Checklist de posicionamento de aquecedores portáteis"],
    references: ["Literatura de secagem de biomassa floral em ambiente fechado", "Notas de campo cooperativas THCProce (modelo anônimo)"],
    professorNotes: "Pedir que estudantes desenhem em uma folha a posição dos sensores relativamente ao dossel e à porta."
  },
  {
    title: "Cura em frasco: jar burping e umidade",
    introduction:
      "O frasco cria volume semi-fechado onde pressão parcial de vapor interna negocia com a atividade de água da matriz; burping é instrumento de modulação gasosa inicial, não substituto de secagem.",
    body:
      "Nos primeiros dias a frequência de abertura curta reduz acúmulo de CO₂ e permite ajuste incremental da umidade relativa interna sem estagnação prolongada inicial. Cadência deve constar do caderno de processo associativo ou individual conforme política documentada.\n\n" +
      "Pontos técnicos: rosca e anel limpos; amostras olfativas à distância para reduzir umidade exalada da respiração sobre boca frasco; higrômetro auxiliar em frasco espelho opcional didático.\n\n" +
      "Erros comuns: fechar hermeticamente sem ritmo inicial de troca; abrir excessivamente destruindo curva lenta desejada de equalização interna.",
    objectives: [
      "Definir burping como ferramenta de troca gasosa inicial controlada.",
      "Relacionar umidade de entrada do jar com probabilidade de sucesso da cura.",
      "Aplicar higiene simples de envase e manuseio."
    ],
    closingSummary:
      "Jar é instrumento de equalização lenta — ritmo errado vira estagnação ou deserto volátil.",
    quiz: [
      Q("Burping no início visa principalmente:", [
        "Substituir secagem completa",
        "Modular headspace gasoso e limitar estagnação inicial prolongada",
        "Aumentar luz UV interna",
        "Converter THCA em THC instantaneamente no vidro"
      ], 1),
      Q("Soprar diretamente dentro do frasco ao cheirar tende a:", [
        "Ser irrelevante",
        "Adicionar umidade e inóculo humano desnecessário ao headspace",
        "Eliminar terpenos",
        "Aumentar CO₂ benéfico sempre"
      ], 1),
      Q("Flor excessivamente úmida ao entrar no jar deve:", [
        "Apenas curar mais sem replanejar",
        "Retornar à fase de secagem até critério documentado antes de protocolar cura",
        "Ser congelada obrigatoriamente",
        "Ser triturada para acelerar"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo de cronograma de burping 10–14 dias", "Ficha de rótulo mínima de lote"],
    references: ["Notas de engenharia de headspace em cura doméstica cooperativa", "Boas práticas de manuseio reduzindo contaminação humano"],
    professorNotes: "Demonstrar abertura breve com distância segura e sem colocar nariz dentro do gargalo."
  },
  {
    title: "Boveda e armazenamento estável",
    introduction:
      "Reguladores bidirecionais de umidade estabilizam atividade de água em recipiente razoavelmente vedado após fase jar inicial — não corrigem entrada com umidade inadequada.",
    body:
      "Sachets de troca salina bidirecional mantêm banda declarada quando o recipiente não é aberto continuamente sem planejamento. Temperatura ambiente do armário importa: oscilações térmicas com vedação fraca geram microciclos de condensação.\n\n" +
      "Pontos técnicos: volume interno vs número de sachets conforme orientação do fabricante categoria produto; rotulagem de data início estabilização.\n\n" +
      "Erros comuns: confundir regulador com dessecante agressivo ilimitado; usar geladeira doméstica com tampa frouxa gerando ciclos úmido.",
    objectives: [
      "Explicar função bidirecional em sistema fechado.",
      "Relacionar temperatura externa com risco de microcondensação em vedação ruim.",
      "Separar lotes distintos até decisão formal de mistura."
    ],
    closingSummary:
      "Bidirecional estabiliza faixa — não transforma jar mal começado em processo seguro retroactivamente.",
    quiz: [
      Q("Regulador bidirecional em pote bem vedado tende a:", [
        "Secar agressivamente sem limite inferior",
        "Manter atividade de água próxima da faixa indicada pelo fabricante em condições estáveis",
        "Substituir análise laboratorial",
        "Eliminar necessidade de rótulo"
      ], 1),
      Q("Abrir o recipiente de armazenamento repetidamente sem planejamento tende a:", [
        "Manter equilíbrio perfeito sempre",
        "Perturbar o equilíbrio estabelecido e acelerar fadiga oxidativa relativa",
        "Eliminar voláteis instantaneamente para zero",
        "Substituir cura"
      ], 1),
      Q("Geladeira doméstica com vedação deficiente para armazenamento pode:", [
        "Ser sempre superior a armário escuro estável",
        "Gerar ciclos térmicos e condensação indesejada na parede interna do pote",
        "Eliminar microrganismos por definição",
        "Substituir laboratório"
      ], 1)
    ],
    media: M.theory,
    materials: ["Tabela volume → número aproximado de sachets", "FAQ curto para pacientes associativos"],
    references: ["Fichas técnicas de fabricantes da categoria de reguladores", "Literatura de armazenamento de compostos voláteis"],
    professorNotes: "Sem endorsement de marca: ensine a categoria e leitura crítica de claims."
  },
  {
    title: "Erros que “matam” terpenos",
    introduction:
      "Perdas voláteis são cumulativas: calor agressivo, luz desnecessária, oxigenação repetida e trituração prematura expõem superfícies e calor local mecânico.",
    body:
      "Micro-ondas, fornos domésticos improvisados e painéis radiativos muito próximos elevam temperaturas locais acima do conforto volátil de monoterpenos mais leves. Trituração fina cedo multiplica área evaporativa antes da estabilização final desejada.\n\n" +
      "Pontos técnicos: monitorar temperatura real superfície broto vs ar ambiente — divergem sob radiação direta.\n\n" +
      "Erros comuns: ‘máscaras’ aromáticas com óleos essenciais em fluxo associativo medicinal — ocultam risco microbiano e violam princípios de transparência THCProce.",
    objectives: [
      "Listar práticas térmicas e mecânicas que aceleram perdas voláteis.",
      "Diferenciar perda aromática esperada de alerta sanitário real.",
      "Rejeitar mascaramento olfativo em processos formais associativos."
    ],
    closingSummary:
      "Terpeno evaporado não retorna — economizar hora na secagem pode custar caráter aromático do lote.",
    quiz: [
      Q("Micro-ondas para ‘secar rápido’ tende a:", [
        "Preservar monoterpenos leves",
        "Aquecer localmente de modo heterogêneo prejudicando voláteis e matriz",
        "Substituir jar",
        "Esterilizar microbiologicamente com garantia"
      ], 1),
      Q("Trituração muito fina muito cedo na pós-colheita tende a:", [
        "Reduzir superfície evaporativa",
        "Aumentar área de interface ar-matriz acelerando perdas antes da estabilização desejada",
        "Eliminar oxigênio",
        "Substituir laboratório"
      ], 1),
      Q("Máscara olfativa com óleos em produto associativo medicinal formal é:", [
        "Boa prática de marketing",
        "Inaceitável sob princípios de transparência e segurança THCProce",
        "Substituto de COA",
        "Neutra legalmente sempre"
      ], 1)
    ],
    media: M.lab,
    materials: ["Cartaz ‘calor local ≠ ar ambiente’", "Checklist anti-atalhos industriais domésticos"],
    references: ["Literatura de degradação térmica de terpenos", "Código de ética comunicacional THCProce (quando publicado)"],
    professorNotes: "Conectar com o módulo de laboratório para leitura de perfis terpênicos residuais."
  },
  {
    title: "Cura prolongada e perfil sensorial",
    introduction:
      "Extensões de tempo após estabilização inicial podem harmonizar percepção de suavidade e complexidade, desde que oxigênio, temperatura e umidade permaneçam disciplinados.",
    body:
      "Cura longa sem abrir frascos demais reduz oxidação exagerada relativa; cura longa com vedação ruim ou aberturas caóticas acelera fadiga. Subamostras paralelas permitem prova progressiva sem expor toda a massa repetidamente.\n\n" +
      "Pontos técnicos: registrar data início estabilização prolongada; decisão assemblear quando destino for sensível.\n\n" +
      "Erros comuns: confundir tempo com esterilização — tempo não mata inóculo significativo sozinho.",
    objectives: [
      "Planejar subamostragem para evolução organoléptica documentada.",
      "Relacionar oxigênio e aberturas com fadiga oxidativa.",
      "Afirmar limites microbiológicos do tempo isolado."
    ],
    closingSummary:
      "Tempo afinado com vedação e registro afinam sensorial; tempo sozinho não assina garantia sanitária.",
    quiz: [
      Q("Subamostras paralelas em frascos menores ajudam a:", [
        "Aumentar volume comercial",
        "Provar evolução temporal sem abrir o lote principal continuamente",
        "Eliminar necessidade de rótulo",
        "Substituir secagem"
      ], 1),
      Q("Abrir o frasco principal diariamente por longos períodos tende a:", [
        "Reduzir sempre oxidação",
        "Aumentar exposição a oxigênio e variar umidade de forma pouco controlada",
        "Eliminar CO₂ útil sempre",
        "Substituir burping inicial"
      ], 1),
      Q("Cura prolongada substitui laudo microbiológico?", [
        "Sim, sempre",
        "Não — são dimensões diferentes (tempo organoléptico vs segurança analítica)",
        "Somente se houver aroma forte",
        "Somente se houver congelamento prévio"
      ], 1)
    ],
    media: M.theory,
    materials: ["Modelo plano mensal de prova sublote", "Formulário assemblear extensão cura"],
    references: ["Literatura sensorial de maturação em ambiente reduzido oxigênio relativo", "Políticas associativas modelo (anonimizadas)"],
    professorNotes: "Estimular degustação responsável apenas onde legal e com orientação — aqui é vocabulário técnico, não consumo."
  },
  {
    title: "Lote, rótulo e rastreio básico",
    introduction:
      "Associativismo responsável exige granularidade documental: sem código de lote registado, falhas repetem-se ciclo após ciclo e recall torna‑se impraticável.",
    body:
      "Campos THCProce sugeridos: código interno de lote; datas de arranque de secagem e de entrada estável em jar principal; nome ou turno da pessoa responsável; referência facultativa ao clone ou ciclo agrícola.\n\n" +
      "Pontos técnicos: só misturar lotes após deliberação assemblear registada para não contaminar trajetória de segurança e aprendizado estatístico.\n\n" +
      "Erros comuns: etiqueta papel que borra com humidade residual; código que vive apenas na memória dos voluntários em rotação.",
    objectives: [
      "Definir campos mínimos rastreáveis na secagem–cura.",
      "Explicar o motivo institucional de separar política deliberada antes de fusão de lotes.",
      "Escolher etiquetas físicas compatíveis com vapor e fricção dentro do jar."
    ],
    closingSummary:
      "Rótulo bem feito converte sala em instituição aprendente — granularidade permite melhoramento contínuo com falhas estudáveis em vez de anedotas perdidas.",
    quiz: [
      Q("Mesclar dois lotes diferentes no mesmo frasco deve acontecer:", [
        "Sempre informalmente segundo vontade do voluntário do dia",
        "Apenas após política deliberada institucionalmente registada quando isso faz sentido económico‑sanitário",
        "Apenas para diluir tacitamente lote sanitariamente frágil",
        "Opcional porque aroma similar induz equivalência segurança"
      ], 1),
      Q("Etiquetas com tinta solvente inadequada dentro de jar são um problema porque:", [
        "Aumentam sempre teores de THC",
        "Borram códigos e quebram cadeias de auditoria mesmo com boa floração agrícola",
        "Substituem higrômetro",
        "Neutralizam monoterpenos por definição"
      ], 1),
      Q("Código apenas na cabeça de um só voluntário é:", [
        "Ideal para reduzir burocracia",
        "Ponto único de falha institucional: rotações de equipa dissipam a memória factual",
        "Substituto imediato de laboratório oficial",
        "Garantia HIPAA automática em qualquer país"
      ], 1)
    ],
    media: M.theory,
    materials: ["Modelo físico etiqueta THCProce", "Formulário deliberado assemblear fusão lotes"],
    references: ["Resumos institucionais de rastreio hortícola associativa internacional", "Modelo THCProce anonimizado de ata sobre fusão de sublotes"],
    professorNotes:
      "Exercício: modelo de código de lote fictício e exemplo de formulário assemblear só com campos obrigatórios preenchidos."
  },
  {
    title: "Microambiente limpo e prevenção de mofos",
    introduction:
      "Carga inicial de esporos e poeiras reduz margem sanitária — laboratório confirma, mas sala suja já empurra o processo associação para zona de maior variância antes do envase estável.",
    body:
      "Rotina THCProce: remover diariamente resíduo vegetal e sacos no mesmo compartimento de brotos pendurados; entrada de ar filtrado ou minimamente controlado onde possível industrial pequeno; superfícies laváveis protocoladas sem fragrâncias industriais residuais fortes que confundam nariz de triagem.\n\n" +
      "Pontos técnicos: pressão levemente negativa relativa portas reduz arrasto poeira corredor externo; mapa de limpeza com responsável e horário — não depender de memória.\n\n" +
      "Erros comuns: lixo verde aberto na mesma sala; baldes de água estagnada sem tampa; trazer calçado de campo para dentro sem tapete ou troca.",
    objectives: [
      "Listar vetores ambientais comuns de esporos em sala de secagem.",
      "Definir rotina mínima documentada de limpeza e descarte.",
      "Relacionar higiene física com leitura olfativa confiável em triagem."
    ],
    closingSummary:
      "Limpeza não é figurino — é redução de inóculo ambiente que o jar não perdoa depois.",
    quiz: [
      Q("Lixo vegetal aberto na mesma sala dos brotos tende a:", [
        "Reduzir carga fúngica ambiente",
        "Aumentar fonte de esporos e fragmentos biológicos",
        "Substituir filtro de entrada de ar",
        "Eliminar necessidade de rótulo"
      ], 1),
      Q("Fragrância industrial forte residual após limpeza pode:", [
        "Aumentar precisão laboratorial",
        "Mascarar odores de alerta e confundir triagem organoléptica",
        "Substituir higrômetro",
        "Garantir esterilidade"
      ], 1),
      Q("Mapa de limpeza com horário e responsável serve para:", [
        "Apenas marketing institucional",
        "Auditoria operacional e continuidade quando equipas rotacionam",
        "Eliminar ventilação",
        "Substituir assembleia"
      ], 1)
    ],
    media: M.lab,
    materials: ["Checklist limpeza diária sala secagem", "Diagrama fluxo ar e lixo"],
    references: ["Guias de biossegurança hortícola em escala pequena", "Literatura de esporos oportunistas em ambientes úmidos"],
    professorNotes: "Pedir desenho do fluxo ar + ponto de lixo fora da linha de dossel."
  },
  {
    title: "Congelamento e estabilidade (visão geral)",
    introduction:
      "Congelamento altera física de membranas e cristalização de água intracelular — pode preservar matrizes processadas com intenção técnica, mas inflorescência inteira em freezer doméstico frequente traz ciclos térmicos e fratura mecânica tricomática se mal protocolada.",
    body:
      "Para hash ou extratos com roteiro laboratorial congelado intencionalmente, encaminhe alunos aos módulos Solventless e Laboratório. Flor seca estabilizada em jar não é automaticamente candidata a freezer doméstico: aberturas frequentes da porta geram microcondensação em recipiente mal vedado.\n\n" +
      "Pontos técnicos: se política associativa permitir arquivo frio documentado — recipiente alta barreira vapor, ciclo térmico mínimo, data congelamento rótulo separado arquivo estabilização ambiente.\n\n" +
      "Erros comuns: saco zipper doméstico fino ciclando geladeira porta aberta repetidamente; confundir congelamento com esterilização.",
    objectives: [
      "Diferenciar arquivo técnico documentado de improviso freezer doméstico.",
      "Explicar ciclos térmicos de geladeiras com uso familiar intenso.",
      "Encaminhar processamento intencional aos cursos especializados do campus."
    ],
    closingSummary:
      "Frio bem desenhado arquiva; frio improvisado degrade microestruturas e aromas sem substituir cura bem feita.",
    quiz: [
      Q("Ciclos térmicos repetidos ao abrir frequentemente a porta de uma geladeira doméstica tendem a:", [
        "Eliminar fadiga oxidativa de forma garantida",
        "Gerar microcondensação variável quando o recipiente está mal vedado em relação ao vapor ambiente",
        "Congelar todas as zonas da flor de modo perfeitamente uniforme",
        "Substituir inteiramente a cura bem feita"
      ], 1),
      Q("O congelamento substitui uma secagem bem conduzida?", [
        "Sim, porque o frio sempre remove vapor intercelular da mesma forma que a sala escura",
        "Não — secagem equaliza primeira taxa hidrística documentada e arquivo frio é decisão distinta quando política e embalagens o permitem",
        "Sim, apenas se o jar tiver sido aberto antes",
        "Sim para genéticas sativa apenas"
      ], 1),
      Q("Arquivo em freezer ou geladeira doméstica sem política, embalagem de barreira vapor e registo é:", [
        "Melhor prática THCProce para qualquer associação",
        "Alto risco operacional relativamente a armário estável, vedado e documentado",
        "Equivalente garantido a laudo microbiológico",
        "Obrigatório após primeira semana de jar"
      ], 1)
    ],
    media: M.theory,
    materials: ["Fluxograma arquivo frio documentado THCProce", "Comparativo freezer doméstico vs armário estável anonimizado"],
    references: ["Encaminhar módulos Extrações Solventless e Laboratório sobre matrizes aptas ao frio", "Literatura física de congelamento em biomassa floral resinosa"],
    professorNotes: "Deixar claro que projeto industrial de arquivo frio exige engenharia de processo além desta sala."
  },
  {
    title: "Protocolo THCProce de pós-colheita mínima viável",
    introduction:
      "O protocolo mínimo viável (MVP) encadeia sala de secagem instrumentada, transição ao jar com critério documentado, cura registada, rótulos de lote, limpeza operacional e — quando a política exige — amostragem laboratorial proporcional ao volume institucional.",
    body:
      "Sequência: (1) diário térmico e de UR junto ao dossel em pelo menos duas alturas; (2) critério explícito (peso de ramo, checagem sanitária, uniformidade dossel) que autoriza entrada no jar; (3) burping regressivo registado por turnos; (4) etiqueta resistente à humidade com código de lote e datas-chave; (5) saneamento rotineiro com lixo vegetal longe da linha de dossel pendurado.\n\n" +
      "Pontos técnicos: retrospectiva breve após a safra (o que correu mal, porquê e teste seguinte institucional) evita repetir o mesmo erro com equipa nova.\n\n" +
      "Erros comuns: protocolo só oral; fusão informal de lotes; saltar retrospectiva porque “desta vez deu sorte”.",
    objectives: [
      "Enumerar elementos mínimos do MVP THCProce na pós-colheita.",
      "Explicar a retrospectiva como ferramenta de melhoramento contínuo associativo.",
      "Relacionar amostragem laboratorial proporcional ao risco institucional e ao volume tratado."
    ],
    closingSummary:
      "MVP transforma pós-colheita em sistema legível anos depois, em vez de anedota aromática perdida quando rota voluntários.",
    quiz: [
      Q("Qual item integra naturalmente um MVP THCProce de pós-colheita?", [
        "Somente hashtags em redes sociais",
        "Registo térmico e de UR próximo ao dossel em pelo menos duas alturas",
        "Substituição integral da assembleia por protocolo técnico",
        "Eliminação obrigatória do laboratório parceiro"
      ], 1),
      Q("A retrospectiva pós-safra tem função:", [
        "Decorativa para redes sociais",
        "Formalizar ensinamentos evitando repetir os mesmos erros institucionalmente",
        "Substituir rótulos de lote",
        "Eliminar necessidade de limpeza"
      ], 1),
      Q("Fusão informal de dois lotes distintos no mesmo frasco no MVP THCProce é:", [
        "Prática recomendável para harmonizar aromas rapidamente",
        "Incompatível sem deliberação política institucional documentada antes da mistura",
        "Aceitável apenas com cheiro organolépticamente semelhante",
        "Aceitável apenas se o primeiro lote já estiver estável por duas semanas"
      ], 1)
    ],
    media: M.all,
    materials: ["Template PDF MVP pós-colheita THCProce", "Formulário retrospectiva safra v1 anonimizada"],
    references: ["Módulo Cooperativismo THCProce — política de lotes", "Módulo Laboratório THCProce — desenho de amostragem"],
    professorNotes:
      "Trabalho em pares opcional: desenhar o MVP desta temporada num cartaz fictício usando apenas os elementos desta lista."
  }
];
