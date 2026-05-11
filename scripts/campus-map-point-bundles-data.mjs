import { decksBySlug } from "./campus-map-point-decks.mjs";

/** Dados editoriais dos pacotes — importados pelo sync. pt-BR, tom mentor. */

function lesson(parts) {
  const {
    title,
    deck,
    introTitle = "História de quem cultiva",
    intro,
    practiceTitle = "Na prática, assim que a coisa anda",
    expl,
    observeTitle = "Olhar de cultivador",
    observe,
    tools,
    stepsTitle = "Passo a passo sem heroísmo",
    steps,
    mistakesTitle = "Erros que eu já vi na roça",
    mistakes,
    philTitle = "Filosofia de quem colhe com calma",
    phil,
    missionTitle = "Sua missão aqui",
    missionProse,
    conclusionTitle = "Fechando com os pés no chão",
    conclusion
  } = parts;
  const toolsBlock =
    tools && tools.trim().length
      ? `## Ferramentas e insumos\n\n${tools}\n`
      : `## Ferramentas e insumos\n\nCaneta, caderno de campo e — se você estiver num cultivo autorizado — um kit mínimo de observação já bastam pra começar sério.\n`;
  const deckBlock =
    deck && deck.trim().length
      ? `${deck.trim()}\n\n`
      : "";
  return `# ${title}

> **Aviso:** Material educativo THCProce Campus. Não substitui acompanhamento médico nem assessoria jurídica. Em cultivo e pesquisa, respeite leis e licenças aplicáveis à sua situação.

${deckBlock}## ${introTitle}

${intro}

## ${practiceTitle}

${expl}

## ${observeTitle}

${observe}

${toolsBlock}## ${stepsTitle}

${steps}

## ${mistakesTitle}

${mistakes}

## ${philTitle}

${phil}

## ${missionTitle}

${missionProse}

---

**Antes de sair deste ponto**, fecha o ciclo no quiz aqui em baixo — não é prova escolar, é treino de decisão com os pés na sua realidade.

## ${conclusionTitle}

${conclusion}
`;
}

function q2(id1, id2, spec) {
  return {
    questions: [
      {
        id: id1,
        question: spec.q1,
        options: spec.o1,
        correctIndex: spec.c1
      },
      {
        id: id2,
        question: spec.q2,
        options: spec.o2,
        correctIndex: spec.c2
      }
    ]
  };
}

export const bundlesBySlug = {
  "campus-live-cinema": {
    overviewBody: lesson({
      deck: decksBySlug["campus-live-cinema"],
      title: "Cinema & transmissões ao vivo no campus",
      intro:
        "Aqui o mapa vira auditório. O que importa não é só assistir — é captar método: como o mentor organiza hipóteses, demonstra leitura de planta e recorta risco sem drama.",
      expl:
        "Trata cada live como aula com **duas colunas** no caderno: (1) fatos observáveis no vídeo e (2) decisões que dependem do seu contexto legal e técnico. Não misture as colunas.",
      observe:
        "Anota timestamps quando aparecer gráfico, esquema de luz ou checklist — isso vira índice para rever antes de agir na bancada.",
      tools: "Auscultadores decentes, tecla de pausa, bloco de notas digital ou papel.",
      steps:
        "1) Lê a programação do dia e define um objetivo único para a sessão.\n2) Durante a live, registra **pergunta → resposta resumida**.\n3) No fim, escreve uma linha: “O que muda na minha rotina esta semana?”\n4) Compartilha dúvidas objetivas no mural — sem dados pessoais sensíveis.",
      mistakes:
        "Vir refém da chat a acelerar dúvidas; pedir diagnóstico médico no chat; confundir demonstração educativa com autorização para replicar em qualquer jurisdição.",
      phil:
        "Cultivador maduro aprende em público com elegância: ouve, testa devagar, documenta.",
      missionProse:
        "Faça sua parte: escolha uma live da semana, cumpra os três passos de notas e traga uma pergunta que mostre leitura prévia.",
      conclusion:
        "O cinema do campus é treino de olhar — leva o hábito de notas para o seu grow, onde a câmara já não grava."
    }),
    mission: {
      title: "Assistir com método",
      description: "Transformar transmissão em protocolo pessoal de estudo.",
      checklist: [
        "Anotar 3 timestamps técnicos úteis",
        "Escrever 1 objetivo antes da sessão",
        "Formular 1 pergunta objetiva para o mural"
      ]
    },
    quiz: q2("live-q1", "live-q2", {
      q1: "Qual hábito melhora mais a sua retenção numa live técnica?",
      o1: [
        "Anotar fatos observáveis separados de decisões pessoais",
        "Só gravar e rever depois sem notas",
        "Copiar o chat na íntegra",
        "Multitasking com redes sociais"
      ],
      c1: 0,
      q2: "O que evitar ao formular dúvida pós-live?",
      o2: [
        "Pedir que alguém remoto resolva saúde legal ou médica pessoal",
        "Descrever equipamento e condição ambiental com clareza",
        "Referir aula e minuto do vídeo",
        "Usar linguagem respeitosa e objetiva"
      ],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-plateia-coerente",
        name: "Plateia coerente",
        description: "Quem estuda live como técnico, não como telenovela."
      }
    },
    ambience: {
      lines: [
        "Luz do projetor a dançar no teto virtual.",
        "Pichel de água ao lado do caderno — cultivo também é hidratação.",
        "Chat acelerado, mas você respira fundo."
      ]
    },
    metadata: {
      theme: "Evento & foco",
      tags: ["live", "notas", "etiqueta"],
      difficulty: "Iniciante",
      category: "Eventos",
      areaType: "campus-service"
    }
  },

  "cannabis-e-proibida": {
    overviewBody: lesson({
      deck: decksBySlug["cannabis-e-proibida"],
      title: "Cannabis: slogans legais versus leitura responsável",
      intro:
        "Ouvir “é proibida” sem contexto gera duas armadilhas: pânico inútil ou falso sentimento de impunidade. No campus trabalhamos **texto, data e âmbito** — não meme.",
      expl:
        "Lei brasileira muda por diploma, decisão judicial e poder público local. Educar é saber pedir fonte primária: artigo, lei, portaria ou parecer oficial — nunca só captura de tela de grupo.",
      observe:
        "Quando ler notícia, identifica **ato**, **sujeito** (pessoa jurídica/física) e **fato típico** descrito. Sem esses três, a frase “é proibido” quase sempre é incompleta.",
      tools: "Link para plano THCProce com aviso legal; pasta de PDFs oficiais (se tiveres assessoria); caderno de perguntas para advogado.",
      steps:
        "1) Separa cultivo medicinal autorizado, pesquisa, importação industrial e uso adulto — são trilhos diferentes.\n2) Anota data do diploma que citou.\n3) Escreve uma dúvida objetiva para profissional habilitado.\n4) Volta ao campus por **método agronômico** — legislação acompanha, não substitui cultivo limpo.",
      mistakes:
        "Comparar automaticamente EUA/Uruguai/Canadá ao seu município; tratar curso online como licença; aconselhar terceiros como se fosse jurista.",
      phil:
        "Humildade jurídica protege o cultivador: estudas para saber quando calar e quando contratar especialista.",
      missionProse:
        "Organiza um cartão com 3 perguntas inteligentes que farias a um advogado — sem pedir solução gratuita de caso concreto no chat aberto.",
      conclusion:
        "Crescimento bom nasce de compliance consciente: aprende, documenta, delega o que custódia exige."
    }),
    mission: {
      title: "Mapa legal mínimo",
      description: "Trocar slogan por pergunta bem feita.",
      checklist: [
        "Listar 2 fontes primárias que queres ler",
        "Anotar 1 hipótese errada que já não repetirás",
        "Escrever 1 pergunta para especialista"
      ]
    },
    quiz: q2("leg-q1", "leg-q2", {
      q1: "Qual atitude educa melhor sobre legalidade?",
      o1: [
        "Pedir diploma completo e data antes de agir",
        "Repetir frase viral de grupo",
        "Assumir que ‘natural’ implica permissão",
        "Ignorar diferença entre jurisdições"
      ],
      c1: 0,
      q2: "O conteúdo do campus substitui assessoria jurídica?",
      o2: ["Não — é educativo; casos concretos vão a profissional", "Sim, se confiares no mentor", "Só às terças", "Sim depois de 3 aulas"],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-leitor-de-fonte",
        name: "Leitor de fonte",
        description: "Para quem prefere diploma a rumor."
      }
    },
    ambience: {
      lines: [
        "Barulho baixo de página a virar — leitura fria.",
        "Café a arrefecer enquanto escreves perguntas.",
        "Mapa do Brasil pequeno no canto do ecrã."
      ]
    },
    metadata: {
      theme: "Legislação & método",
      tags: ["BR", "fontes", "duvidas"],
      difficulty: "Todos os níveis",
      category: "Legislação",
      areaType: "topic-hotspot"
    }
  },

  "como-combate-acaros": {
    overviewBody: lesson({
      deck: decksBySlug["como-combate-acaros"],
      title: "Combate a ácaros com método IPM",
      intro:
        "Ácaro quase sempre avisa: pontilhado foliar, teias finas, velocidade em clones stressados. Aqui não há “spray mágico” — há **sequência**: inspeção, ambiente, intervento mínimo eficaz.",
      expl:
        "Ácaros prosperam em folhas quentes e secas; transpiração baixa e VPD alto são convites. Aumenta umidade foliar com segurança (sem molhar flores maduras) e melhora ventilação laminar.",
      observe:
        "Lupa 60× no verso da folha média — ovos e exúvias contam a história antes das manchas grandes.",
      tools: "Lupa, folha testemunha, aspirador para folhas caídas, EPI se usar produto registrado ao seu contexto.",
      steps:
        "1) Registra % de folhas afetadas por zona da copa.\n2) Ajusta microclima (sem soprar poeira para flores).\n3) Remove material focado.\n4) Só então escalona tratamento autorizado — anota lote e ventanas meteorológicas.",
      mistakes:
        "Repetir mesmo modo de ação até resistência; pulverizar com vento forte; ignorar vetores (roupa, ferramentas).",
      phil:
        "Cultivador que olha primeiro economiza spray — e respeita quem respira perto da horta.",
      missionProse:
        "Faz uma ronda com lupa e anota 4 fotos mentais: verso foliar, broto jovem, entroncamento, base do vaso.",
      conclusion:
        "Quem conhece o micro-habitat do ácaro deixa de brigar com sintoma e passa a cortar reprodução."
    }),
    mission: {
      title: "Diagnóstico antes do frasco",
      description: "Confirmar ácaro e âmbito antes de qualquer spray.",
      checklist: [
        "Inspecionar verso foliar com lupa",
        "Anotar clima local da copa",
        "Executar higiene de ferramentas"
      ]
    },
    quiz: q2("ac-q1", "ac-q2", {
      q1: "Primeira alavanca cultural contra ácaro em vegetativo?",
      o1: [
        "Melhorar perfil de humidade/ventilação sem stressing demais a planta",
        "Aumentar temperatura ao máximo",
        "Regar folhas de noite fechada sem vento",
        "Cortar toda a copa de imediato"
      ],
      c1: 0,
      q2: "Quando escalar para produto?",
      o2: [
        "Depois de confirmar praga, medir extensão e ler rótulo/contexto legal",
        "No primeiro pixel amarelo sem confirmar",
        "Só se o vizinho recomendar",
        "Antes de olhar à lupa"
      ],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-inspecao-laminar",
        name: "Inspeção laminar",
        description: "Lupa antes do gatilho — SOP de cultivador adulto."
      }
    },
    ambience: {
      lines: [
        "Cheiro leve de clorofila esmagada na lupa.",
        "Ventoinha a cortar canto da sala.",
        "Folha a tremer com ar seco demais."
      ]
    },
    metadata: {
      theme: "IPM · sanidade",
      tags: ["acaro", "VPD", "lupa"],
      difficulty: "Intermediário",
      category: "Pragas",
      areaType: "practice-hotspot"
    }
  },

  "como-combate-spiders": {
    overviewBody: lesson({
      deck: decksBySlug["como-combate-spiders"],
      title: "Teia, aranha e confusão com outros danos",
      intro:
        "Nem toda teia é praga agrícola — algumas aranhas são predadoras. O cultivador distingue **estrutura de teia**, local e presas antes de matar aliado.",
      expl:
        "Aranhas orbitais de canto capturam mosquitos; ácaros deixam pontilhado e micro-teiasem folhas. Mancha seca de nutriente não anda.",
      observe:
        "Segue o fio: teia entre galhos altos ou colada a folhas novas? Há excrementos escuros de trips versus ácaro?",
      tools: "Lupa, lanterna oblíqua, pincel seco para mover teia de teste.",
      steps:
        "1) Classifica aranha vs sintoma foliar.\n2) Se for predadora útil, realoca ou tolera zona de serviço.\n3) Se for infestação mista com ácaro/trips, trata o inseto-alvo com plano IPM.\n4) Registra foto ou esboço — compare 48 h.",
      mistakes:
        "Spray largo espectro ‘por precaução’ que aniquila predadores; confundir teia de ácaro com teia de aranha de canto.",
      phil:
        "Biodiversidade útil paga a renda ecológica — aprende quem mora na sua copa.",
      missionProse:
        "Escolhe 3 plantas e desenha mapa teias + sintomas antes de qualquer intervenção.",
      conclusion:
        "Matrices claras: predador, parasita, carencial. Cada um pede ritmo diferente."
    }),
    mission: {
      title: "Mapa de teias",
      description: "Diferenciar habitat antes de agir.",
      checklist: [
        "Identificar 2 tipos de estrutura de teia",
        "Registrar presença de presas ou ácaro associado",
        "Decidir tolerância para predadores"
      ]
    },
    quiz: q2("sp-q1", "sp-q2", {
      q1: "Sinal mais útil para separar ácaro de aranha predadora?",
      o1: [
        "Lupa no verso foliar mostra pontilhado e mobilidade vs teia orbital isolada",
        "Cor da parede da tenda",
        "Número de vasos no chão",
        "Cor do fertilizante"
      ],
      c1: 0,
      q2: "Atitude defensável frente a aranha predadora em canto seco?",
      o2: [
        "Preservar se não houver danos foliares associados",
        "Spray diário só por estética",
        "Aumentar humidade a 99% fixo",
        "Fechar tenda para sempre"
      ],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-arquiteto-de-biomas",
        name: "Arquiteto de biomas",
        description: "Sabe quem caça trips e quem come folha."
      }
    },
    ambience: {
      lines: ["Cantoneira com teia geometricamente perfeita.", "Luz oblíqua a revelar pó.", "Mão a tremer com medo de errar."]
    },
    metadata: {
      theme: "Ecologia da copa",
      tags: ["aranha", "teia", "IPM"],
      difficulty: "Intermediário",
      category: "Pragas",
      areaType: "practice-hotspot"
    }
  },

  "como-fazer-um-cha": {
    overviewBody: lesson({
      deck: decksBySlug["como-fazer-um-cha"],
      title: "Chá de compostagem / extrato aerado com critério",
      intro:
        "Chás e compost teas prometem microbiota — o risco é **anaerobiose** e propagar patógeno se a receita for vaga. Aqui tratas o chá como cultura, não magia.",
      expl:
        "Chá aerado (bubbler) mantém dissolvido oxigénio; sem ar, perfis de bactérias mudam e cheiro fica acre. Usa água limpa, tempo curto e temperaturas estáveis.",
      observe:
        "Cheiro doce-terroso ok; cheiro de ovo podre aborta aplicação. Mede pH final e diluição antes de foliar.",
      tools: "Balde food-grade, bomba de ar, saco poroso, termómetro simples, pH.",
      steps:
        "1) Monta receita pequena (litro piloto).\n2) Aerar 12–24 h conforme receita — nunca “até parecer bom” sem cheiro.\n3) Filtra e dilui para rega na zona radicular primeiro.\n4) Testa foliar só em clone/spiller se compreenderes risco de mancha.",
      mistakes:
        "Guardar chá fechado dias; misturar mel com fertil.mineral sem compatibility test; foliar sob luz forte.",
      phil:
        "Microbiota exige oxigénio e honestidade — como raiz.",
      missionProse:
        "Escreve protocolo de 6 linhas com tempos, cheiros e abort criteria.",
      conclusion:
        "Chá bom cheira a processo controlado; chá ruim cheira a atalho."
    }),
    mission: {
      title: "Protocolo de bolha",
      description: "Documentar chá aerado seguro.",
      checklist: ["Definir volume piloto", "Monitorizar cheiro e temperatura", "Definir diluição e alvo radicular"]
    },
    quiz: q2("cha-q1", "cha-q2", {
      q1: "Sinal de abortar lote de chá?",
      o1: [
        "Cheiro anaeróbico forte ou espuma estranha persistente",
        "Bolhas visíveis normais",
        "Temperatura igual à ambiente",
        "Cor turva leve após compost o primeiro minuto"
      ],
      c1: 0,
      q2: "Primeira aplicação mais segura em iniciante?",
      o2: ["Diluída à zona radicular com planta saudável de teste", "Foliar concentrado em flor", "Injeção direta no caule", "Sem diluição nunca"],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-cha-oxigenado",
        name: "Chá oxigenado",
        description: "Entende bolha como metabolismo microbiano."
      }
    },
    ambience: {
      lines: ["Borbulha ritmada a marcar tempo.", "Odor de terra após chuva — meta.", "Relógio de cozinha a cortar romanticismo."]
    },
    metadata: {
      theme: "Solos vivos",
      tags: ["compost-tea", "aeração"],
      difficulty: "Intermediário",
      category: "Nutrição orgânica",
      areaType: "practice-hotspot"
    }
  },

  "como-usar-melaco-de-cana": {
    overviewBody: lesson({
      deck: decksBySlug["como-usar-melaco-de-cana"],
      title: "Melaço de cana: carboidrato para microbiota — com teto",
      intro:
        "Melaço alimenta bolacha microbiana no solo vivo e às vezes entra em soluções orgânicas — mas **carbohidrato sem disciplina** vira festa de biofilme e oscilação de pH.",
      expl:
        "Em flora tardia, pequenas doses diluídas podem sustentar relações micorrízicas — desde que EC final e higiene estejam controlados. Nada de garrafadas em hidro mal oxigenada.",
      observe:
        "Após doses altas vê-se espuma, odor fermentado ou queda brusca de oxigénio dissolvido em DWC.",
      tools: "Melaço sem enxofre industrial agressivo (ler rótulo), balança de cozinha, EC/pH.",
      steps:
        "1) Começa com ppm baixo em solo ou rega drenada.\n2) Intervaliza dias — planta responde lento.\n3) Para hidro, só se souberes O2 e limpeza de linhas.\n4) Para em sinais de slime ou EC instável.",
      mistakes:
        "Melaço com suplementos químicos incompatíveis sem teste; uso foliar pegajoso atrativo a pó; dose em flora sem monitor de transpiração.",
      phil:
        "Doçura na rega pede mesma sobriedade que doçura na dieta.",
      missionProse:
        "Calcula dose para 10 L de rega com alvo de incremento mínimo — anota EC antes/depois.",
      conclusion:
        "Melaço é ferramenta de solo vivo; em sistema inerte exige engenharia, não esperança."
    }),
    mission: {
      title: "Doce com teto",
      description: "Dose microbiana sem saturar sistema.",
      checklist: ["Ler rótulo e pureza", "Registrar EC base", "Definir intervalo de pausa"]
    },
    quiz: q2("mel-q1", "mel-q2", {
      q1: "Uso mais alinhado a solo vivo bem drenado?",
      o1: [
        "Diluir melaço em regas espaçadas monitorando EC e resposta foliar",
        "Vertido puro no prato dia sim dia sim",
        "Somente em folhas ao meio-dia",
        "Sempre que a planta ‘parece triste’ sem medir"
      ],
      c1: 0,
      q2: "Em hidroponia de baixo oxigénio, melaço sem plano tende a…",
      o2: [
        "Promover biofilme e instabilidade",
        "Substituir silício",
        "Eliminar necessidade de limpeza",
        "Fixar pH magicamente"
      ],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-carbo-disciplinado",
        name: "Carbo disciplinado",
        description: "Carboneia a microbiota sem enterrar o sistema."
      }
    },
    ambience: {
      lines: ["Doçura a colar ao dedo — lembrete da dose.", "Cheiro a marmelo escuro na cozinha.", "Balança a piscar números pequenos."]
    },
    metadata: {
      theme: "Carbono & microbiota",
      tags: ["melaço", "EC", "solo-vivo"],
      difficulty: "Intermediário",
      category: "Nutrição",
      areaType: "practice-hotspot"
    }
  },

  "curso-aplicacoes-terapeuticas": {
    overviewBody: lesson({
      deck: decksBySlug["curso-aplicacoes-terapeuticas"],
      title: "Aplicações terapêuticas: evidência, titulação e limites",
      intro:
        "O campus fala de canabinoides como **rede biológica educativa** — não como receita implícita. Respeito ao paciente e ao prescritor vem primeiro.",
      expl:
        "Evidência muda com indicação, via de administração e população. O seu papel como estudante é saber formular **pergunta clínica** — não ajustar dose por chat.",
      observe:
        "Bons materiais citam ensaios, número de participantes e desfechos — não só headline.",
      tools: "PubMed / Sumários oficiais (quando acessíveis), caderno de perguntas para consulta médica.",
      steps:
        "1) Separa educação geral de aconselhamento individual.\n2) Lista dúvidas para profissional sem pedir ‘qual strain cura X’.\n3) Registra medicamentos concomitantes que só médico integra.\n4) Volta ao campus para botânica — não para pseudo-consultório.",
      mistakes:
        "Automedicação guiada por meme; confundir CBD isolado com extrato full na mesma dose; prometer cura.",
      phil:
        "Redução de danos inclui humildade frente ao corpo alheio.",
      missionProse:
        "Escreve 5 linhas: ‘O que pergunto ao médico depois desta aula’ — sem nomear terceiros.",
      conclusion:
        "Cultivador informado encaminha — não substitui ciência clínica."
    }),
    mission: {
      title: "Bússola clínica",
      description: "Educar sem invadir consultório.",
      checklist: [
        "Listar 3 perguntas para prescritor",
        "Anotar 1 mito que deixaste de repetir",
        "Rever fonte primária sugerida"
      ]
    },
    quiz: q2("med-q1", "med-q2", {
      q1: "Conduta ética ao falar de doses?",
      o1: [
        "Encaminhar a profissional habilitado sem prescrever por mensagem",
        "Converter mg por ‘feeling’",
        "Copiar folhetos de loja como verdade absoluta",
        "Pedir strain por sintoma a estranhos"
      ],
      c1: 0,
      q2: "Canábis medicinal no campus é…",
      o2: [
        "Tema educativo com limites claros — não telemedicina improvisada",
        "Substituto de exame físico",
        "Autorização de cultivo pessoal automática",
        "Lista de diagnósticos fechados"
      ],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-fronteira-clinica",
        name: "Fronteira clínica",
        description: "Sabe onde a educação para e a consulta começa."
      }
    },
    ambience: {
      lines: ["Sala silenciosa, monitor com gráficos discretos.", "Guardanapo com anotações ilegíveis — ideias boas.", "Relógio da consulta que não está aqui."]
    },
    metadata: {
      theme: "Medicina & ética",
      tags: ["evidencia", "ECS", "encaminhamento"],
      difficulty: "Todos os níveis",
      category: "Medicina canabinoide",
      areaType: "curso-modulo"
    }
  },

  "curso-culinaria-cannabica": {
    overviewBody: lesson({
      deck: decksBySlug["curso-culinaria-cannabica"],
      title: "Culinária cannábica: decarboxilar, repartir e não assustar o corpo",
      intro:
        "Comível exige **precisão térmica + ética**: você cozinha para si em contexto legal e com honestidade de porção — ninguém merece surpresa de intensidade.",
      expl:
        "Decarboxilação transforma ácidos em formas ativas — tempo/temperatura têm janela; depois lipídios carregam melhor que água pura.",
      observe:
        "Efeito varia com metabolismo e vacuidade gástrica — por isso ‘pedaço pequeno e esperar’ vence heroísmo.",
      tools: "Termómetro de forno confiável, manteiga ghee/clarificada, etiquetas, timer, luvas.",
      steps:
        "1) Calcula batch teórico com notas — anota peso de matéria-prima.\n2) Decarb monitorizado.\n3) Infunde em gordura com heat baixo estável.\n4) Divide porções homogéneas e rotula concentracao aproximada + data.\n5) Guarda longe de menores — sempre.",
      mistakes:
        "Queimar decarb; misturar álcool forte sem ventilação; servir terceiros sem consentimento informado.",
      phil:
        "Cozinhar com cannabis é hospitalidade responsável — dose modesta, conversa clara.",
      missionProse:
        "Redige rótulo modelo para o seu frigorífico com data, batch e ‘começar com 1/4’. ",
      conclusion:
        "Sabor e segurança compartilham o mesmo ingrediente: método."
    }),
    mission: {
      title: "Batch etiquetado",
      description: "Infusão com rastreabilidade doméstica.",
      checklist: ["Registrar temperaturas", "Porcionar antes de servir", "Rotular data e concentração aproximada"]
    },
    quiz: q2("cul-q1", "cul-q2", {
      q1: "Porque decarboxilar antes de infundir na gordura?",
      o1: [
        "Ativar formas neutras para lipídios carregarem melhor na ingestão",
        "Só para cor verde",
        "Para remover todo THC",
        "Para tornar impossível dosar"
      ],
      c1: 0,
      q2: "Regra de ouro ao oferecer comível?",
      o2: [
        "Consentimento, contexto legal e microdose inicial com espera",
        "Surpresa engraçada",
        "Maior brownie do mundo",
        "Misturar com álcool sem avisar"
      ],
      c2: 0
    }),
    rewards: {
      badge: {
        id: "selo-cozinha-criteriosa",
        name: "Cozinha criteriosa",
        description: "Mede, decarboxila e etiqueta — sem drama."
      }
    },
    ambience: {
      lines: ["Cheiro a manteiga a subir devagar.", "Timer a despertar antes do impulso.", "Caneta na tampa do tupperware."]
    },
    metadata: {
      theme: "Edibles & segurança",
      tags: ["decarb", "porcoes", "rotulagem"],
      difficulty: "Intermediário",
      category: "Gastronomia",
      areaType: "curso-modulo"
    }
  },

  "curso-cultivo-101": {
    overviewBody: lesson({
      deck: decksBySlug["curso-cultivo-101"],
      title: "Cannabis 101: vocabulário estável para não te perderes no resto do campus",
      intro:
        "Antes de falar em PAR ou VPD, precisas de mapa mental: **planta**, **lei em alto nível**, **corpo como modelo educativo** — sem autopromessa terapêutica.",
      expl:
        "Cannabis sativa L. entrega fibras, sementes, canabinoides e conversa cultural. No curso 101 separamos bancada de laboratório de entusiasmo de internet.",
      observe:
        "Quando alguém diz ‘strain cura’, traduz para ‘genética muda metabolitos — pergunta é qual contexto legal e técnico’.",
      tools: "Caderno, glossário do campus, link para leis-normas.",
      steps:
        "1) Escreve 10 termos novos com definição sua.\n2) Relaciona cada trilha avançada (indoor/outdoor/medicina) ao seu objetivo declarado.\n3) Marca uma dúvida para jurista e outra para médico — nem toda dúvida é de grow.\n4) Volta aos módulos na ordem dos professores.",
      mistakes:
        "Mixar evidência clínica com cultivo clandestino romantizado; copiar legislação de outro país sem ler BR.",
      phil:
        "Humildade técnica é o seu fertilizante moral — rega cedo.",
      missionProse:
        "Completa o triângulo: uma página botânica, uma página de compliance em tópicos e uma página de próximos passos.",
      conclusion:
        "Sais do 101 com bússola — o resto do campus são coordenadas."
    }),
    mission: {
      title: "Mapa mental 101",
      description: "Fechar lacunas de vocabulário antes de kits caros.",
      checklist: ["10 termos definidos", "2 encaminhamentos profissionais escritos", "Ordem de leitura anotada"]
    },
    quiz: q2("101-q1", "101-q2", {
      q1: "ECS no campus aparece principalmente como…",
      o1: [
        "Modelo educativo de rede reguladora — não auto-diagnóstico",
        "Lista de strains prescritas",
        "Garantia de efeito",
        "Substituto de receptores inventados"
      ],
      c1: 0,
      q2: "Próximo passo saudável depois do 101?",
      o2: [
        "Escolher trilha técnica e manter registro simples",
        "Comprar todo equipamento do marketplace num dia",
        "Ignorar legalidade",
        "Publicar tutorial sem contexto"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-bussola-101", name: "Bússola 101", description: "Vocabulário parado antes do dimmer." } },
    ambience: { lines: ["Página de glossário a ranger.", "Seta a apontar para indoor no mapa.", "Caneta a riscar 'ECS' sublinhado."] },
    metadata: { theme: "Fundamentos", tags: ["botanica", "ECS"], difficulty: "Iniciante", category: "Fundamentos", areaType: "curso-modulo" }
  },

  "curso-cultivo-greenhouse": {
    overviewBody: lesson({
      deck: decksBySlug["curso-cultivo-greenhouse"],
      title: "Estufa: meio termo entre sol e controle",
      intro:
        "Estufa boa **amortece** radiação e vento, mas não apaga erros de desenho: ventilação cruzada e sombreamento móvel são ouro.",
      expl:
        "Película difusiva espalha fótons — folhas profundas recebem fotossíntese útil. Sobe temperatura rápido; cofre hídrico e térmico exigem leitura diária.",
      observe:
        "Pontos quentes formam-se junto à cumeeira sem exaustor; sombra de estrutura move-se — segue com termohigrógrafo.",
      tools: "Termohigrógrafo de data-logger, sombrite móvel, rolhas de ventilação.",
      steps:
        "1) Mapeia microclimas por turno.\n2) Ajusta aberturas antes do pico solar.\n3) Planeia lavagem de coberta sem aumentar risco fito.\n4) Integra irrigação com peso de vaso/ tensiometro se possível.",
      mistakes:
        "Estufa hermética sem renovação de ar; difusor sujo por meses; ignorar condensação noturna em flora.",
      phil:
        "Meio ambiente protegido pede humildade — natureza ainda manda, só abrandaste o soco.",
      missionProse:
        "Desenha seta de ventos dominantes e entradas/saídas de ar na planta da estufa.",
      conclusion:
        "Estufa é instrumento óptico e térmico — trata como tal."
    }),
    mission: { title: "Fluxo de ar na casa de vidro", description: "Desenhar ventilação antes de comprar ventoinha extra.", checklist: ["2 leituras de T/UR por dia", "Checklist de sombra móvel", "Plano de limpeza de coberta"] },
    quiz: q2("gh-q1", "gh-q2", {
      q1: "Função típica de película difusiva?",
      o1: [
        "Espalhar luz para tecidos internos da copa",
        "Apagar UV completamente sempre",
        "Substituir rega",
        "Eliminar pragas"
      ],
      c1: 0,
      q2: "Condensação noturna excessiva sugere…",
      o2: [
        "Rever troca de ar ao entardecer e pontos frios",
        "Mais água nas folhas à noite",
        "Fechar tudo para ‘segurar orvalho’",
        "Subir nutriente à força"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-difusor-racional", name: "Difusor racional", description: "Luz espalhada, cabeça fresca." } },
    ambience: { lines: ["Plástico a estalar com vento norte.", "Gotículas a deslizar no vidro numa tarde quente.", "Cheiro de tomateiro vizinho a entrar pela fresta."] },
    metadata: { theme: "Ambiente protegido", tags: ["estufa", "difusao"], difficulty: "Intermediário", category: "Greenhouse", areaType: "curso-modulo" }
  },

  "curso-cultivo-indoor": {
    overviewBody: lesson({
      deck: decksBySlug["curso-cultivo-indoor"],
      title: "Indoor: fitossistema miniaturizado e você é o clima",
      intro:
        "Sem céu real, **PPFD, DLI, VPD e CO₂** tornam-se linguagem de sobrevivência — mas o primeiro skill é olhar folha como sensor.",
      expl:
        "LED moderno dá espectro; planta responde com morfologia. Começas por pendente certo, depois vento foliar gentil, só então nutriente agressivo.",
      observe:
        "Pontas de folha ‘sog’ indicam stress hídrico ou luminoso dependendo da textura; caule fino demais = falta de vento ou excesso de stretch.",
      tools: "Medidor PAR básico, termohigrómetro, oscilador, extractores dimensionados.",
      steps:
        "1) Mede PPFD em dossel e sombra interna.\n2) Ajusta altura do painel em passos pequenos.\n3) Calibra rega ao peso ou substrato.\n4) Só calibra EC depois de transpiração saudável.",
      mistakes:
        "Luz colada demais; VPD extremo; silêncio absoluto sem troca de ar; foliar sob LEDs fortes.",
      phil:
        "Indoor é orquestra — cada botão afina outro instrumento.",
      missionProse:
        "Faz mapa PPFD simplificado (3 pontos) e anota data.",
      conclusion:
        "Domínio indoor é domínio de leitura — números são treino, folha é prova."
    }),
    mission: { title: "Grade PAR mínima", description: "Medir luz onde a planta realmente vive.", checklist: ["3 pontos medidos", "VPD anotado ao meio-dia", "Correção de altura registrada"] },
    quiz: q2("in-q1", "in-q2", {
      q1: "Antes de subir EC, o que validar?",
      o1: [
        "Transpiração foliar saudável e sem burn lumínico",
        "Cor dos cabos elétricos",
        "Marca do vaso",
        "Número de seguidores no Instagram"
      ],
      c1: 0,
      q2: "Ventilador foliar adequado…",
      o2: [
        "Mexe a copa sem flagelar brotos como chicote",
        "Zero vento para ‘não stressar’",
        "Soprador industrial fixo na flor",
        "Só no solo"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-arquiteto-par", name: "Arquiteto de PAR", description: "Mede antes de martelar nutriente." } },
    ambience: { lines: ["Zumbido baixo de driver.", "Folha a tremer suave.", "Display a piscar RH% um ponto de cada vez."] },
    metadata: { theme: "Clima fechado", tags: ["PPFD", "VPD"], difficulty: "Intermediário", category: "Indoor", areaType: "curso-modulo" }
  },

  "curso-cultivo-outdoor": {
    overviewBody: lesson({
      deck: decksBySlug["curso-cultivo-outdoor"],
      title: "Outdoor: sol, solo vivo e calendário honesto",
      intro:
        "Ar livre poupa luz elétrica mas **não poupa observação**: clima de mesorregião manda no seu cronograma.",
      expl:
        "Raiz explora horizonte enorme — desde que oxigénio e vida microbiana existam. Solo compactado castiga mais que falta de fertilizante.",
      observe:
        "Orvalho prolongado + flora densa = risco de botrytis; vento natural e poda de ar podem ser higiene.",
      tools: "Pá, composto maduro, mulch, estacas, caderno de chuva.",
      steps:
        "1) Faz perfil de solo simples (drenagem, cheiro, cor).\n2) Planeia exposição solar real vs sombra de muro.\n3) Antecipa geada e encharcamento local.\n4) Rega profunda e poucos ciclos melhor que borrifo diário raso.",
      mistakes:
        "Copiar datas de hemisfério errado; ignorar microbacia de quintal; fertilizar solo encharcado.",
      phil:
        "Outdoor ensina paciência geopolítica do clima — uma chuva muda o seu plano.",
      missionProse:
        "Desenha croqui de sol/sombra às 9h, 13h e 17h na estação corrente.",
      conclusion:
        "Boa exterior começa em humildade meteorológica."
    }),
    mission: { title: "Croqui de sombra real", description: "Mapear luz antes de cavar.", checklist: ["3 horários desenhados", "Nota de drenagem", "Risco de geada anotado"] },
    quiz: q2("out-q1", "out-q2", {
      q1: "Prioridade em solo pesado antes de fertilizar?",
      o1: [
        "Drenagem, aeração e vida microbiana",
        "Triplicar PK sintético",
        "Rega matinal em folhas velhas",
        "Cobrir tudo com plástico preto sem furos"
      ],
      c1: 0,
      q2: "Botrytis costuma correlacionar com…",
      o2: [
        "Folhas molhadas + flora densa + pouco vento",
        "Excesso de vento seco",
        "Solo carente de K imediato",
        "LED muito perto"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-calendario-local", name: "Calendário local", description: "Plantas seguem o seu céu, não o de outro país." } },
    ambience: { lines: ["Vento com cheiro a terra molhada.", "Grama a roçar no tecido da perna.", "Nuvem a prometer chuva às quatro."] },
    metadata: { theme: "Sol aberto", tags: ["clima", "solo"], difficulty: "Iniciante", category: "Outdoor", areaType: "curso-modulo" }
  },

  "curso-extracao-de-oleo": {
    overviewBody: lesson({
      deck: decksBySlug["curso-extracao-de-oleo"],
      title: "Óleo: higiene, solventes e fronteira legal",
      intro:
        "Extração doméstica com solventes voláteis é cenário de **incêndio e toxicidade** — no campus estudamos princípios para contextos autorizados e laboratorio, não receita underground.",
      expl:
        "Polaridade do solvente escolhe o que entra no extrato. Pós-processamento remove co-extraídos indesejados — ou não.",
      observe:
        "Cor escura nem sempre é ‘impureza malvada’ — pode ser clorofila co-extraída; contexto e método importam.",
      tools: "Em contexto legal: EPI de laboratório, laboratório ventilado, registros de lote.",
      steps:
        "1) Confirma enquadramento legal.\n2) Desenha fluxograma material→extrato.\n3) Planeia destilação/recuperação se aplicável.\n4) Rotulagem honesta de concentracao aproximada somente.",
      mistakes:
        "Abrir processo fechado em cozinha; confundir RSO caseiro com farmacêutico; ignorar UMIDADE e faíscas.",
      phil:
        "Extrato é química com ética — se não tens laboratório, não fantasiar ser laboratório.",
      missionProse:
        "Lista 5 riscos físicos-químicos e como laboratório real os mitiga.",
      conclusion:
        "Estuda solvente só depois de estudar ventilação e lei."
    }),
    mission: { title: "Matriz de risco", description: "Nomear perigos antes de fantasiar yield.", checklist: ["5 riscos", "2 mitigações", "1 consulta legal se aplicável"] },
    quiz: q2("oil-q1", "oil-q2", {
      q1: "Atitude defendável em área residencial sem licenças?",
      o1: [
        "Não improvisar laboratório de solvente — estudo só teórico ou encaminhamento profissional",
        "Etanol aberto no fogão",
        "Butano dentro de casa com janela entreaberta",
        "Usar frigideira antiaderente como ‘reactor’"
      ],
      c1: 0,
      q2: "Cor verde no óleo bruto frequentemente sugere…",
      o2: [
        "Co-extração polar — refino ou mudança de método",
        "Pureza absoluta",
        "Ausência de canabinoides",
        "Água zero problema"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-laboratorio-humilde", name: "Laboratório humilde", description: "Segurança antes do 'yield' de story." } },
    ambience: { lines: ["Campana de exaustão — barulho aborrecido, vida útil.", "Vidro frio à mão englovada.", "Rótulo em branco à espera de honestidade."] },
    metadata: { theme: "Extratos", tags: ["solvente", "seguranca"], difficulty: "Avançado", category: "Laboratório", areaType: "curso-modulo" }
  },

  "curso-germinacao-clones": {
    overviewBody: lesson({
      deck: decksBySlug["curso-germinacao-clones"],
      title: "Germinação e clones: unifomidade começa no propágulo",
      intro:
        "Raiz nova é **negócio húmido e limpo** — nem encharcar nem secar. Umidade relativa alta e oxigénio no meio fazem milagre modesto.",
      expl:
        "Semente: água oxigenada temporariamente, substrato arejado, 22–26 °C típico. Corte: superfície limpa, gel plain, VPD suave.",
      observe:
        "Branco cremoso vs castanho translúcido na radícula; corte com 'malária' viral começa homogênico depois diverge.",
      tools: "Bandeja com cúpula, manta calor opcional, scalp íris, álcool 70%, cubos retenção equilibrada.",
      steps:
        "1) Hidrata semente sem hipoxia prolongada.\n2) Enterra só até o necessário para âncora.\n3) Para clones, mantém folhas mínimas e ambiente úmido não saturado.\n4) Transplanta quando raiz tem estrutura, não apenas ponto branco.",
      mistakes:
        "Solo denso como tijolo; névoa eterna sem renovar ar; clone em flor para mãe nova sem plano.",
      phil:
        "Propagador paciente deixa de perder genética cara em detalhes baratos.",
      missionProse:
        "Registra humidity dome + temperatura a cada manhã por 5 dias (tabela simples).",
      conclusion:
        "Vigor inicial é dívida paga com disciplina ambiental."
    }),
    mission: { title: "Diário da cúpula", description: "Números curtos vencem ansiedade.", checklist: ["Tabela 5 dias", "Foto esboço de raiz IDEAL", "Lista EPI limpeza"] },
    quiz: q2("ger-q1", "ger-q2", {
      q1: "Erro clássico em germinação?",
      o1: [
        "Substrato sem ar ou temperatura oscilante extrema",
        "Etiquetar data",
        "Usar água filtrada leve",
        "Dar escuridão inicial moderada"
      ],
      c1: 0,
      q2: "Clone pede principalmente…",
      o2: [
        "UR alta com folgas de vento para não anaerobiose foliar",
        "Solo seco",
        "Flora imediata",
        "Zero luz"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-filigrana-radicular", name: "Filigrana radicular", description: "Raiz nova merece silêncio técnico." } },
    ambience: { lines: ["Gotículas no interior da cúpula.", "Plasticrinkle suave ao levantar.", "Relógio de laboratório a contar horas."] },
    metadata: { theme: "Propagação", tags: ["semente", "clone"], difficulty: "Intermediário", category: "Viveiro", areaType: "curso-modulo" }
  },

  "curso-hashmaker": {
    overviewBody: lesson({
      deck: decksBySlug["curso-hashmaker"],
      title: "Hashmaker solventless: água gelada, tempo e trim de qualidade",
      intro:
        "Hash de água gelada é **classificação por tamanho** — entrada suja destrói saída nobre.",
      expl:
        "Tricoma maduro solta com agitação proporcion; calor da mão e do ambiente dissolve resina. Ciclos curtos preservam cabeças maiores.",
      observe:
        "Cor da espuma e presença de clorofila indicam agressividade; cheiro terpeno vs vegetal.",
      tools: "Sacos graduados limpos, água com gelo real, escorredores, microplanos limpos.",
      steps:
        "1) Pré-molhar material adequado.\n2) Agitação em ondas — cronometrar.\n3) Secagem lenta clara de bolhas.\n4) Documenta lavagens como lote.",
      mistakes:
        "Material verde molhado demais batido como liquidificador; secagem quente e fechada.",
      phil:
        "Solventless premia paciência — tempo é parte da peneira.",
      missionProse:
        "Escreve protocolo de 2 min / 5 min / 7 min com observação esperada de cor.",
      conclusion:
        "Quem lava bem começa com trim e termina com gramática de tamanho."
    }),
    mission: { title: "Cronómetro de malaxar", description: "Lotes repetíveis.", checklist: ["3 tempos definidos", "Critério de cor", "Secagem esboçada"] },
    quiz: q2("hash-q1", "hash-q2", {
      q1: "Principal inimigo de qualidade em wash?",
      o1: [
        "Material vegetal excessivo esmagado com agitação brutal",
        "Gelo limpo",
        "Sacos etiquetados",
        "Cronómetro funcional"
      ],
      c1: 0,
      q2: "Secagem ideal tende a…",
      o2: [
        "Fria, escura e com ar suave — sem forçar carburar terpeno",
        "Forno 80 °C fechado",
        "Sol directo em telha",
        "Toalha húmida em saco plástico"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-lavadouro-cirurgico", name: "Lavadouro cirúrgico", description: "Água, tempo e mãos conscientes." } },
    ambience: { lines: ["Estalos de gelo na água preta.", "Espuma branca a subir devagar.", "Mesa branca com pelo de resina a brilhar."] },
    metadata: { theme: "Solventless", tags: ["bubble", "lavagem"], difficulty: "Avançado", category: "Extrações", areaType: "curso-modulo" }
  },

  "curso-nutrientes": {
    overviewBody: lesson({
      deck: decksBySlug["curso-nutrientes"],
      title: "Nutrientes: EC, pH e a ordem correta dos problemas",
      intro:
        "Sintoma foliar grita — mas **água, luz e raiz** falam antes do fertilizante. Sem transpiração saudável, EC vira salmoura.",
      expl:
        "EC sobe quando transpiração cai ou evaporação de água no reservatório sobe. pH deriva por atividade radicular e temperatura.",
      observe:
        "Burn de borda vs burn de gotas foliares; clareamento venoso de mobilidade vs bloqueio.",
      tools: "Pen EC/pH calibrados, termómetro solução, jeringas de precisão, diário.",
      steps:
        "1) Confirma irrigação adequada.\n2) Mede drenagem ou runoff se usar.\n3) Sobe dose em degraus <10%.\n4) Lavagem só com estratégia (identificar excesso antes).",
      mistakes:
        "Perseguir deficiência sem medir entrada; misturar A/B fora de ordem do rótulo; micro num reservatório quente sem oxigénio.",
      phil:
        "Nutrir é escutar raiz — folha só traduz atrasado.",
      missionProse:
        "Cria tabela semanal EC_in / EC_out / pH_in / pH_out por 2 semanas.",
      conclusion:
        "Cartographer de números vence cultista de garrafas."
    }),
    mission: { title: "Log de solução", description: "Transformar palpite em série temporal.", checklist: ["4 variáveis por rega", "Notas de clima", "Alerta se drift >0.5"] },
    quiz: q2("nut-q1", "nut-q2", {
      q1: "Antes de subir fertilizante, verificar…",
      o1: [
        "Transpiração e drenagem radicular saudáveis",
        "Cor do t-shirt",
        "Apenas cor da resina",
        "Somente horóscopo"
      ],
      c1: 0,
      q2: "Drift de pH em dwc pode vir de…",
      o2: [
        "Atividade radicular + temperatura da solução",
        "Cor do LED",
        "Dia da semana",
        "Nome da strain"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-ec-paciente", name: "EC paciente", description: "Escala degraus, não penhascos." } },
    ambience: { lines: ["Gotas de solução a secar no pen.", "Reservatório a borbulhar devagar.", "Papel com sequência A+B rabiscada."] },
    metadata: { theme: "Nutrição mineral", tags: ["EC", "pH"], difficulty: "Intermediário", category: "Nutrição", areaType: "curso-modulo" }
  },

  "curso-podas-e-clones": {
    overviewBody: lesson({
      deck: decksBySlug["curso-podas-e-clones"],
      title: "Podas: ferida limpa, timing e objetivo claro",
      intro:
        "Cada corte é **dívida de cicatrização**. Poda sem luz e sanidade adequadas vira convite a patógeno.",
      expl:
        "Apical libera laterais; desfolha seletiva melhora luz interna se VPD e fungicida cultural (vento) existirem.",
      observe:
        "Latex/resina em corte fresco deve fechar; se húmido perpetuo na ferida, rever humidade.",
      tools: "Tesoura afiada, álcool 70%, luvas, câmara com VPD estável pós-corte.",
      steps:
        "1) Define objetivo — estrutura vs luminosity.\n2) Desinfeta ferramenta entre plantas.\n3) Corta com ângulo limpo, sem esmagar.\n4) Evita banhos foliares imediatos em ferida fresca.",
      mistakes:
        "Poda agressiva antes de raiz estabilizar; tesoura cega que esmaga; desfolha em flora tardia sem motivo.",
      phil:
        "Poda é edição — cortas o que não serve à história da planta.",
      missionProse:
        "Desenha antes/depois esquemático da copa no caderno.",
      conclusion:
        "Ferida fechada e broto novo alinhado — sinal de mão treinada."
    }),
    mission: { title: "Plano de edição", description: "Espelhar objetivo antes da tesoura.", checklist: ["Esboço da copa", "Checklist desinfeção", "Janela de recuperação anotada"] },
    quiz: q2("pod-q1", "pod-q2", {
      q1: "Entre cortes em plantas diferentes?",
      o1: [
        "Limpar lâmina com álcool para não vetorizar patógeno",
        "Soprar a tesoura",
        "Meramente secar no calção",
        "Nada"
      ],
      c1: 0,
      q2: "Desfolha tardia sem vento foliar tende a…",
      o2: [
        "Elevar risco de moluscos fúngicos",
        "Aumentar sempre rendimento",
        "Substituir treino HST",
        "Eliminar necessidade de luz"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-editor-de-copa", name: "Editor de copa", description: "Corta com intenção, não por impulso." } },
    ambience: { lines: ["Estalos secos de ramo pequeno.", "Álcool a evaporar na lâmina.", "Sombra fresca após o corte."] },
    metadata: { theme: "Morfologia", tags: ["poda", "higiene"], difficulty: "Intermediário", category: "Treino vegetal", areaType: "curso-modulo" }
  },

  "curso-pragas-e-doencas": {
    overviewBody: lesson({
      deck: decksBySlug["curso-pragas-e-doencas"],
      title: "Pragas e doenças: identificar, escalonar, documentar",
      intro:
        "**Metade dos desastres é nome errado** no inimigo. Mosca branca não é trips; oídio não é cal defensivo mal explicado.",
      expl:
        "IPM: cultura → monitorização → mecânico → biológico compatível → química last resort conforme contexto legal.",
      observe:
        "Lupa no verso; fitas amarelas só indicam, não resolvem; esporos fúngicos pedem T/RU e histórico de molha.",
      tools: "Lupa, fitas, caderno de incidência, EPI de pulverização.",
      steps:
        "1) Registra sintoma + local + estadio.\n2) Confirma vetor / animal / fungo.\n3) Ajusta ambiente antes de frasco.\n4) Rotaciona modos de ação quando aplicável.",
      mistakes:
        "Spray misto caótico; ignorar resistência; tratar solo encharcado só do alto.",
      phil:
        "Vencedor trata diagnóstico como planta — observação longa, ação curta.",
      missionProse:
        "Faz ficha de campo: praga, % estimado, medida cultural tentada.",
      conclusion:
        "Dicionário vazio de causa dá armário cheio de frascos inúteis."
    }),
    mission: { title: "Ficha de campo", description: "Um evento, um nome.", checklist: ["ID preliminar", "Medida cultural", "Linha temporal"] },
    quiz: q2("pr-q1", "pr-q2", {
      q1: "Primeiro passo IPM?",
      o1: [
        "Monitorização e identificação correta",
        "Spray largo espectro imediato",
        "Cortar energia das luzes por dias",
        "Pedir strain nova"
      ],
      c1: 0,
      q2: "T/RU alto com folhas molhadas prolongadas favorece…",
      o2: [
        "Doenças fúngicas foliares",
        "Terpenos mais grandes",
        "Raiz mais seca",
        "Eliminação de trips"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-diagnostico-frio", name: "Diagnóstico frio", description: "Nomeia antes de gastar solução." } },
    ambience: { lines: ["Lupa ringlight a revelar ovos.", "Fita amarela com pó de asas.", "Cheiro leve de folha mastigada."] },
    metadata: { theme: "Sanidade", tags: ["IPM", "fungo", "inseto"], difficulty: "Intermediário", category: "Proteção fitossanitária", areaType: "curso-modulo" }
  },

  "curso-preparacao-do-solo": {
    overviewBody: lesson({
      deck: decksBySlug["curso-preparacao-do-solo"],
      title: "Solo vivo: carbono, oxigénio e comida dos que comem nutriente",
      intro:
        "Raiz respira; **solo sem poros é caixão**. Composto maduro, não esterco quente fresco sem compostagem.",
      expl:
        "Relação areia/argila/tilo modula drenagem e CEC aparente; microbiota liberta nutriente lentamente.",
      observe:
        "Cheiro de enxofre podre ou álcool = anaerobiose; minhocas e cor chocolate são bons sinais em outdoor orgânico.",
      tools: "Cavadeira, carrinho, composto, biochar fino opcional, análise simples se disponível.",
      steps:
        "1) Abre cova/perfil maior que vaso padrão.\n2) Mistura horizontes sem formar lente impermeável.\n3) Integra materiais de diferentes idades de decomposição.\n4) Rega de assentamento sem lamacentar tudo.",
      mistakes:
        "Solo importado contaminado; camada espessa de areia sobre argila sem misturar; fertil mineral pesado antes de vida.",
      phil:
        "Solo é ecossistema — tratas quem come o que a sua planta come.",
      missionProse:
        "Perfura pequeno perfil e descreve três horizontes com cor e cheiro.",
      conclusion:
        "Investir em solo é amortizar stress vegetativo inteiro."
    }),
    mission: { title: "Perfil descrito", description: "Olho no horizonte, não na saco de adubo.", checklist: ["Descrição 3 camadas", "Plano de composto", "Teste de drenagem buraco"] },
    quiz: q2("soil-q1", "soil-q2", {
      q1: "Lente d'água típica?",
      o1: [
        "Textura com interface impermeável sem mistura",
        "Drenagem excelente natural",
        "Solo 100% perlita",
        "Só falta de luz"
      ],
      c1: 0,
      q2: "Cheiro acre de anaerobiose indica…",
      o2: [
        "Falta de oxigénio no meio — rever aeração",
        "Plantas de certeza felizes",
        "Falta de magnésio",
        "Excesso de vento"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-horizonte-abierto", name: "Horizonte aberto", description: "Cava, cheira, mistura — respeita o solo." } },
    ambience: { lines: ["Enxofre bom — não, espera, cheiro de terra limpa.", "Pá a bater pedra oculta.", "Galhos a arranhar braço — outdoor real."] },
    metadata: { theme: "Edafologia leiga", tags: ["composto", "drenagem"], difficulty: "Iniciante", category: "Outdoor", areaType: "curso-modulo" }
  },

  "curso-sementes-feminizadas": {
    overviewBody: lesson({
      deck: decksBySlug["curso-sementes-feminizadas"],
      title: "Sementes feminizadas: uniformidade relativa e registro de fenótipo",
      intro:
        "Feminizado reduz machos, **não apaga variância**. Dois fenótipos num pack é normal — genética gosta de explorar.",
      expl:
        "Estresse indutor mal aplicado ou linhagem instável altera taxas; bancos sérios documentam lotes.",
      observe:
        "Nós masculinos precoces vs hermafroditismo de stress são histórias diferentes; lupa no pré-flora.",
      tools: "Etiquetas, app de notas, lupa, espaço de quarentena leve entre genéticas.",
      steps:
        "1) Germina com método limpo.\n2) Marca indivíduos A/B se divergirem arquitetura.\n3) Registra odores precoces com cuidado (subjetivo mas útil).\n4) Seleciona mantenedor só com critério claro.",
      mistakes:
        "Assumir pack = clone; misturar runts sem observar razão do atraso; ignorar stress luminoso em deteção sexual.",
      phil:
        "Feminilidade prometida no rótulo ainda pede olhar de criador.",
      missionProse:
        "Cria grelha simples comparando dois indivíduos da mesma linha (altura folha 3 vs 5).",
      conclusion:
        "Semente feminizada é aposta com método — não dado."
    }),
    mission: { title: "Grelha fenotípica", description: "Dois irmãos, duas colunas.", checklist: ["3 traços medidos", "Nota de cheiro", "Risco de herma anotado"] },
    quiz: q2("seed-q1", "seed-q2", {
      q1: "Variância fenotípica num mesmo pack…",
      o1: [
        "É esperada — documenta em vez de panicar",
        "Prova que o banco mentiu sempre",
        "Impede cultivo",
        "Só acontece outdoor"
      ],
      c1: 0,
      q2: "Hermafroditismo por stress light leak diferencia-se de macho genético por…",
      o2: [
        "Contexto de condição ambiental + padrão temporal — requer observação longitudinal",
        "Cor das sapatilhas do grower",
        "Única aula possível",
        "Nada, são iguais sempre"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-genetica-viva", name: "Genética viva", description: "Dois fenótipos, um caderno." } },
    ambience: { lines: ["Sacos de papel dentro de caixa fria.", "Etiqueta com nome + data + banco.", "Primeira folha verdadeira a abrir em V."] },
    metadata: { theme: "Genética", tags: ["feminizada", "fenotipo"], difficulty: "Avançado", category: "Sementes", areaType: "curso-modulo" }
  },

  "curso-transicao-floracao": {
    overviewBody: lesson({
      deck: decksBySlug["curso-transicao-floracao"],
      title: "Transição para flora: trecho de elasticidade e stretch",
      intro:
        "Mudar fotoperíodo ou receber sol mais curto reorganiza hormonas — **stretch** pode duplicar altura aparente em genéticas nervosas.",
      expl:
        "Primeiras semanas definem distância floral-internodal; luz mal distribuída deixa ‘laranjas catedral’ sem luz útil.",
      observe:
        "Nós alongando rápido + folhas clareando = pedido de luz ou estabilidade.",
      tools: "Metro, treliça ajustável, relógio de timer impecável.",
      steps:
        "1) Calcula altura final provável (histórico strain ou observação prévia).\n2) Aumenta ventilação para sustentar brotos densos futuros.\n3) Ajusta distância luminosa sem queimar pistilos jovens.\n4) Corta excesso de nitrogénio se sintoma claro.",
      mistakes:
        "Flip com deficiências grandes abertas; flip sem espaço vertical real; Umidade alta na primeira semana floral.",
      phil:
        "Transição é dança — lidera com luz e espaço, não com pânico.",
      missionProse:
        "Desenha altura dossel antes/depois + stretch esperado em percentagem.",
      conclusion:
        "Boa flora nasce de vegetativo honesto e flip preparado."
    }),
    mission: { title: "Orçamento vertical", description: "Saber onde o telhado morre.", checklist: ["Altura pré-flip", "% stretch estimado", "Plano treliça"] },
    quiz: q2("fl-q1", "fl-q2", {
      q1: "Stretch depende fortemente de…",
      o1: [
        "Genética + distribuição de luz + nitrogénio residual",
        "Só cor do vaso",
        "Marca do ventilador",
        "Dia da semana apenas"
      ],
      c1: 0,
      q2: "Erro ao entrar em flora com carencência grave?",
      o2: [
        "Amplificar sintoma e perder rendimento floral inicial",
        "Resolver magicamente ao mudar relógio",
        "Substituir treino",
        "Aumentar sempre PK sem olhar"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-flip-calmo", name: "Flip calmo", description: "Stretch previsto é stretch gerido." } },
    ambience: { lines: ["Timer a estalar no escuro.", "Metal da treliça frio à mão.", "Cheiro verde a mudar para flores — promessa."] },
    metadata: { theme: "Fotoperíodo", tags: ["stretch", "flip"], difficulty: "Intermediário", category: "Floracao", areaType: "curso-modulo" }
  },

  "curso-vegetativo": {
    overviewBody: lesson({
      deck: decksBySlug["curso-vegetativo"],
      title: "Vegetativo: folha como painel solar e raiz como fundação",
      intro:
        "Expansão foliar honesta exige **área radical proporcional** — copa gigante em vaso pequeno é conta em atraso.",
      expl:
        "Dias longos (indoor) mantêm proliferação; vento modela caule; poda direciona energia.",
      observe:
        "Folhas finas longas = stretch buscando luz; folhas em leque curto = luz mais próxima ou genética compacta.",
      tools: "Escada de vasos, observador de peso, oscillating fan.",
      steps:
        "1) Escolhe meta de altura para o seu espaço final.\n2) Transplanta em degraus claros.\n3) Mantém VPD amigável à fotossíntese.\n4) Ajusta nutrição ao tamanho real da raiz, não à expectativa do ego.",
      mistakes:
        "Vegetativo infinito sem plano de flora; esquecer treino mecânico do caule; esconder praga em copa densa.",
      phil:
        "Vegetativo é investimento — mas investimento sem estratégia de colheita é hobby caro.",
      missionProse:
        "Define data-alvo de flip e trabalha de trás para a frente com checklist.",
      conclusion:
        "Folha grande com haste firme — sinal de clima ganho."
    }),
    mission: { title: "Plano até ao flip", description: "Data na parede, não na cabeça.", checklist: ["Data flip alvo", "Checklist trasplante", "Espaço vertical medido"] },
    quiz: q2("veg-q1", "veg-q2", {
      q1: "Stretch excessivo frequentemente liga-se a…",
      o1: [
        "Luz insuficiente ou mal distribuída para a copa",
        "Excesso de silício sempre",
        "Rega noturna só",
        "Cor azul 100% irrelevante"
      ],
      c1: 0,
      q2: "Relação copa/substrato desequilibrada tende a…",
      o2: [
        "Stress hidrico e nutricional cíclico",
        "Flor mais cedo automaticamente",
        "Eliminar pragas",
        "Aumentar só terpenos sem esforço"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-broto-estrategico", name: "Broto estratégico", description: "Vegeta com data de flora na retina." } },
    ambience: { lines: ["Folhas a bater suave umas nas outras.", "Zumbido de vento baixo.", "Marcador indelevel na parede da tenda."] },
    metadata: { theme: "Crescimento", tags: ["stretch", "VASO"], difficulty: "Iniciante", category: "Vegetativo", areaType: "curso-modulo" }
  },

  "deixa-seu-recado": {
    overviewBody: lesson({
      deck: decksBySlug["deixa-seu-recado"],
      title: "Mural: feedback que ajuda monitores a ajudar-te",
      intro:
        "Recado bom é **curto, específico e seguro** — sem dados pessoais sensíveis que não queiras num quadro escolar.",
      expl:
        "Moderadores filtram spam; sua mensagem útil vira backlog de melhoria do campus.",
      observe:
        "Referenciar aula, minuto e dispositivo ajuda reproduzir bug de player — opinião vaga vira ruído.",
      tools: "Texto simples, prints quando pedido, tom cordial.",
      steps:
        "1) Define intenção: erro? sugestão? agradecimento?\n2) Cola contexto mínimo reprodutível.\n3) Evita dados de saúde pessoal em público.\n4) Agradece quando fecharem o seu ticket socialmente.",
      mistakes:
        "Nomear terceiros; compartilhar localização precisa; flood duplicado.",
      phil:
        "Comunidade forte escreve como equipe — não como audiência passageira.",
      missionProse:
        "Redige uma mensagem modelo de bug de vídeo em 4 linhas.",
      conclusion:
        "Mural educado eleva a qualidade das lives para todos."
    }),
    mission: { title: "Ticket simpático", description: "Praticar comunicação que o mod adora.", checklist: ["4 linhas modelo", "Sem PII", "Link ou aula citada"] },
    quiz: q2("mur-q1", "mur-q2", {
      q1: "O que NÃO colar no mural aberto?",
      o1: [
        "CPF, endereço ou dados clínicos detalhados de terceiros",
        "Versão do browser",
        "Minuto do bug",
        "Descrição cordial"
      ],
      c1: 0,
      q2: "Feedback acionável inclui…",
      o2: [
        "Passos mínimos para reproduzir",
        "Só insulto genérico",
        "Caps lock infinito",
        "Nada sobre o sintoma"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-voz-respeitosa", name: "Voz respeitosa", description: "Fala com o campus, não sobre o campus." } },
    ambience: { lines: ["Teclas a bater devagar — frase a pesar.", "Café ao lado do ecrã de chat.", "Moderador a mover sticky digital."] },
    metadata: { theme: "Comunidade", tags: ["feedback", "moderacao"], difficulty: "Iniciante", category: "Comunidade", areaType: "campus-service" }
  },

  "leis-normas": {
    overviewBody: lesson({
      deck: decksBySlug["leis-normas"],
      title: "Leis & normas: mapa mental de compliance para cultivador",
      intro:
        "Norma boa descreve **quem, onde, como** — slogan de rede social descreve ansiedade.",
      expl:
        "No Brasil o panorama é dinâmico: distingue uso medicinal institucional, pesquisa, cultivo personal em discussão legislativa e mitos.",
      observe:
        "Data do diploma importa tanto quanto o título; cita sempre versão e link.",
      tools: "Fontes oficiais salvas offline, contato de OA (Ordem dos Advogados) se projetos grandes.",
      steps:
        "1) Lista atividades que fazes ou planeias.\n2) Para cada uma, identifica norma aplicável ou lacuna informada por profissional.\n3) Separa educação THCProce de parecer jurídico.\n4) Agenda revisão semestral de PDFs baixados.",
      mistakes:
        "Agir por print de 2019; achar que curso = licença; aconselhar amigo como advogado sem ser.",
      phil:
        "Lei é solo duro — raiz real procura advogado, não thread.",
      missionProse:
        "Monta árvore simples: Educação → Pesquisa → Medicinal clínico → outros ramos (rótulos seus).",
      conclusion:
        "Crescimento sustentável conversa com o cartório — não só com o fertilizante."
    }),
    mission: { title: "Árvore de compliance", description: "Visualizar ramos do que te interessa.", checklist: ["3 ramos", "Datas de PDF", "1 consulta profissional se preciso"] },
    quiz: q2("lei-q1", "lei-q2", {
      q1: "Uso do curso face à lei?",
      o1: [
        "Material educativo — decisões ligais ficam com profissional habilitado",
        "Substitui CNPJ",
        "Autoriza qualquer plantio",
        "Elimina fiscalização"
      ],
      c1: 0,
      q2: "Porque revisar PDFs semestralmente?",
      o2: [
        "Normas mudam — datas e números de artigo importam",
        "PDFs mudam de cor sozinhos",
        "Só para ocupar tempo",
        "Legislação nunca muda"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-bussola-normativa", name: "Bússola normativa", description: "Diploma no disco, humildade na cabeça." } },
    ambience: { lines: ["Papel timbrado imaginário.", "Data destacada a marcador amarelo.", "Silêncio de quem leu a letra miúda."] },
    metadata: { theme: "Jurídico", tags: ["BR", "compliance"], difficulty: "Todos os níveis", category: "Legislação", areaType: "topic-hotspot" }
  },

  "programacao-do-dia": {
    overviewBody: lesson({
      deck: decksBySlug["programacao-do-dia"],
      title: "Programação do dia: ritmo do campus e respeito ao relógio",
      intro:
        "Agenda sincroniza mentores e alunos — chegar **mentalmente preparado** vale mais que aparecer em cima da hora sem contexto.",
      expl:
        "Fuso horário Brasil costuma ser âncora; replays nem sempre são imediatos — anota.",
      observe:
        "Eventos longos precisam de pausa hidratação; workshops práticos pedem materiais listados antes.",
      tools: "Calendário com alerta, caderno de objetivos, link oficial fixado.",
      steps:
        "1) Lê descrição completa do evento.\n2) Define saída esperada (‘o que terei aprendido?’).\n3) Testa áudio/vídeo 10 min antes.\n4) Silencia notificações paralelas.",
      mistakes:
        "Pedir resumo privado do que foi dito em público sem assistir; flood no chat técnico.",
      phil:
        "Pontualidade é cortesia técnica — protege quem produz conteúdo.",
      missionProse:
        "Marca próxima live e escreve objetivo de uma linha na agenda.",
      conclusion:
        "Calendário alinhado = menos ansiedade, mais aprendizagem."
    }),
    mission: { title: "Objetivo na agenda", description: "Agendar com intenção.", checklist: ["Evento escolhido", "Lembrete 24h", "Teste A/V"] },
    quiz: q2("prog-q1", "prog-q2", {
      q1: "Boa prática antes da live?",
      o1: [
        "Ler descrição e preparar pergunta específica",
        "Entrar sem saber do que se trata",
        "Abrir 10 tabs barulhentas",
        "Só aparecer no final"
      ],
      c1: 0,
      q2: "Porque verificar fuso BR?",
      o2: [
        "Evento campus costuma ancorar em horário nacional",
        "Fuso é mito",
        "Todas lives são UTC intencionalmente errado",
        "Relógio não importa"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-calendario-alinhado", name: "Calendário alinhado", description: "Chega preparado, sai com notas." } },
    ambience: { lines: ["Notificação suave a soar.", "Copo de água ao lado do auscultador.", "Contagem regressiva na UI."] },
    metadata: { theme: "Eventos", tags: ["agenda", "pontualidade"], difficulty: "Iniciante", category: "Eventos", areaType: "campus-service" }
  },

  "qual-tamanho-do-vaso": {
    overviewBody: lesson({
      deck: decksBySlug["qual-tamanho-do-vaso"],
      title: "Vaso: volume como oxigénio intermitente para raiz",
      intro:
        "Raiz adora **molhar-se e secar em ritmo** — vaso imenso demais cedo mantém anaerobiose periférica; minúsculo cronicamente esmaga exploração.",
      expl:
        "Escala ~2× volume até dossel estabilizar; substrato fibroso com dreno real, não ‘cero decorativo’.",
      observe:
        "Enrolamento periférico massivo = atraso; peso do vaso seco vs molhado ensina mais que calendário fixo.",
      tools: "Malha ou rochas dreno, vaso final dimensionado ao espaço luminoso disponível.",
      steps:
        "1) Calcula altura dossel alvo + stretch.\n2) Escolhe vaso que permita swing hídrico saudável.\n3) Transplanta com mínimo perturbar raiz saudável.\n4) Ajusta rega ao novo volume.",
      mistakes:
        "Solo fino sem ar; vaso grande + rega diária leve = anaerobiose; transplante na flora sem necessidade.",
      phil:
        "Vaso certo dá folga psicológica — menos ‘salvei’ com rega inútil.",
      missionProse:
        "Pesa vaso seco e molhado após transplante — anota delta.",
      conclusion:
        "Oxigênio na zona radicular aparece no humor das folhas."
    }),
    mission: { title: "Delta de peso", description: "Sentir água que resta.", checklist: ["Peso seco", "Peso pós-rega", "Nota de intervalo"] },
    quiz: q2("vas-q1", "vas-q2", {
      q1: "Vaso excessivo cedo costuma…",
      o1: [
        "Manter anel periférico encharcado sem oxigénio",
        "Aumentar sempre rendimento imediato",
        "Eliminar necessidade de treliça",
        "Substituir luz"
      ],
      c1: 0,
      q2: "Guia prático de rega indoor fiel?",
      o2: [
        "Peso do vaso ou sensação consistente do substrato",
        "Calendário fixo ignorando planta",
        "Sempre 500 ml porque sim",
        "Só cor das folhas ignorando raiz"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-volume-razoavel", name: "Volume razoável", description: "Raiz respira, copa agradece." } },
    ambience: { lines: ["Barro a bater no fundo do vaso novo.", "Mão a sentir peso — antiga balança de cozinha.", "Água a correr pelo dreno — som satisfatório."] },
    metadata: { theme: "Substrato", tags: ["vaso", "rega"], difficulty: "Iniciante", category: "Indoor", areaType: "practice-hotspot" }
  },

  "quando-adubar-foliar": {
    overviewBody: lesson({
      deck: decksBySlug["quando-adubar-foliar"],
      title: "Adubação foliar: janela de estómatos, não show de brilho",
      intro:
        "Folha absorve — **mal**. Usa foliar para correções leves ou kick micronutriente quando ambiente colabora.",
      expl:
        "Luz forte + gotas = lupa natural que queima; T/RU extremo altera fechamento estomático.",
      observe:
        "Resíduo branco = excesso ou incompatibility; manchas em borda após spray = osmose.",
      tools: "Pulverizador dedicado, pH da solução, EPI, água limpa.",
      steps:
        "1) Escolhe janela de luz baixa ou apagada conforme produto.\n2) Testa 1 planta.\n3) Pulveriza cobertura uniforme sem runoff gotejante longo.\n4) Ventila para secar sem film aquático eterno.",
      mistakes:
        "Calda concentrada ‘porque foliar é fraco’; mix com óleos sem compatibilidade; spray flores pegajosas.",
      phil:
        "Foliar é refinamento — quem não mede rega radical não merece medir spray.",
      missionProse:
        "Documenta horário, T/RU, EC da calda e resultado 48h.",
      conclusion:
        "Gotas certas no tempo certo; resto é estrago ou desperdício."
    }),
    mission: { title: "Folha testemunha", description: "Validar calda em n=1.", checklist: ["Planta teste", "Registo ambiental", "Leitura 48h"] },
    quiz: q2("fol-q1", "fol-q2", {
      q1: "Porque evitar spray forte sob LED quente?",
      o1: [
        "Gotas funcionam como lentes — aumentam burn local",
        "LED não aquece nunca",
        "Folhas adoram 45 °C com sal",
        "Não importa o estado das folhas",
      ],
      c1: 0,
      q2: "Primeiro passo antes de pulverizar lote inteiro?",
      o2: [
        "Teste em área limitada monitorizada",
        "Ir direto ao canopo inteiro sem teste",
        "Dobrar dose recomendada",
        "Ignorar pH"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-nevoa-calibrada", name: "Névoa calibrada", description: "Spray com horário, não com coragem." } },
    ambience: { lines: ["Cheiro ligeiro de calda fresca.", "Motor de pulverizador a falhar — lembrete de manutenção.", "Folha a secar em ondas de vento."] },
    metadata: { theme: "Nutrição foliar", tags: ["spray", "estomatos"], difficulty: "Intermediário", category: "Nutrição", areaType: "practice-hotspot" }
  },

  "quando-adubar-solo": {
    overviewBody: lesson({
      deck: decksBySlug["quando-adubar-solo"],
      title: "Adubar solo vivo: ritmo microbiano, não calendário supersticioso",
      intro:
        "Solo orgânico liberta nutriente quando vida — e umidade — permitem. **Regas muito risadinhas** nunca ativam a mesa completa.",
      expl:
        "Camada de cobertura modula temperatura e evaporação; minhocas e fungos são logística oculta.",
      observe:
        "Solo sempre encharcado mata aerobes; cheiro mau = parar entradas.",
      tools: "Regador de chuva, mulch, garfo largo leve, compost 'acabado'.",
      steps:
        "1) Sentir umidade a meia profundidade.\n2) Aplicar chá/composto diluído ou topdress fino conforme método.\n3) Cobrir com mulch fino se sol direto.\n4) Esperar resposta foliar antes da segunda pancada.",
      mistakes:
        "Espichar nutriente em solo frio inerte; misturar cal virgem sem saber pH alvo; regas que não penetrão.",
      phil:
        "Alimentas o solo, o solo alimenta a planta — telefone sem fio ecológico.",
      missionProse:
        "Escreve ritual de verificação: dedo, cheiro, cor, decisão.",
      conclusion:
        "Timing bom cheira a terra e a juízo."
    }),
    mission: { title: "Check solo antes do saco", description: "Não adubar à cega.", checklist: ["Umidade testada", "Cheiro ok", "Temperatura solo notada"] },
    quiz: q2("solo-q1", "solo-q2", {
      q1: "Antes de fertilizar solo vivo saturado?",
      o1: [
        "Esperar aeração/drenagem — senão anaerobiose",
        "Dobrar dose para 'empurrar'",
        "Colocar mais mulch molhado sem ar",
        "Tapar completamente drenos"
      ],
      c1: 0,
      q2: "Mulch bem usado…",
      o2: [
        "Modula temperatura e perda de água",
        "Substitui completamente rega profunda",
        "Elimina necessidade de observação",
        "Mata microbiota sempre"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-topdress-consciente", name: "Topdress consciente", description: "Solo feliz, liberação calma." } },
    ambience: { lines: ["Cheiro terroso ao levantar a cobertura.", "Rega tipo chuva a escurecer o mulch.", "Minhoca a escapar — sinal de vida."] },
    metadata: { theme: "Solo orgânico", tags: ["mulch", "microbia"], difficulty: "Iniciante", category: "Outdoor", areaType: "practice-hotspot" }
  },

  "quando-plantar-outdoor": {
    overviewBody: lesson({
      deck: decksBySlug["quando-plantar-outdoor"],
      title: "Quando plantar outdoor: geada, encharcamento e comprimento do dia",
      intro:
        "Calendário viral **não substitui** estação local. Duas semanas de média estável valem mais que meme.",
      expl:
        "Semente tolera menos stress de frio que clone endurecido parcialmente; solo encharcado primaveril mata raiz à fome de oxigénio.",
      observe:
        "Brotação precoce com risco tardio de geada pede proteção móvel, não autopiedade.",
      tools: "App meteorológico com histórico, túnel frio leve opcional, bandeja de endurecimento.",
      steps:
        "1) Confirma última data probable de geada local.\n2) Observa peso chuvoso do solo.\n3) Planeja endurecimento greenhouse/indoor → exterior.\n4) Alinha fotoperíodo natural com genética (photoperiod vs autoflower mental note).",
      mistakes:
        "Plantar dia após chuva torrencial; ignorar sombra de árvore que cresce; misturar calendário USA.",
      phil:
        "Outdoor é sinfonia com clima — antecipas ou pagas nota aguda.",
      missionProse:
        "Tabela: data provável plantio + risco geada + plano B túnel.",
      conclusion:
        "Sem pressa superficial — plantio certo poupa drama estival."
    }),
    mission: { title: "Janela meteorológica", description: "Dados locais na mesa.", checklist: ["Data geada ref", "Estado solo chuva", "Plano B térmico"] },
    quiz: q2("plant-q1", "plant-q2", {
      q1: "Grande erro primaveril?",
      o1: [
        "Plantar com solo encharcado e frio que sufoca raiz",
        "Consultar histórico pluviométrico",
        "Endurecer clones gradualmente",
        "Observar brotação local"
      ],
      c1: 0,
      q2: "Por que olhar geada local e não meme global?",
      o2: [
        "Microclimas alteram semanas críticas",
        "Geada é igual em todos os morros",
        "Latitude é irrelevante",
        "Solo não importa"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-semeador-paciente", name: "Semeador paciente", description: "Espera o solo e o céu alinharem." } },
    ambience: { lines: ["Barulho de chuva na folha de zinco.", "Sacos de endurecimento a bater com vento.", "Terra pegajosa — warning suave."] },
    metadata: { theme: "Calendário", tags: ["geada", "chuva"], difficulty: "Iniciante", category: "Outdoor", areaType: "practice-hotspot" }
  },

  "quando-pulverizar-preventivo": {
    overviewBody: lesson({
      deck: decksBySlug["quando-pulverizar-preventivo"],
      title: "Preventivo: calendário com olhos, não religião de frascos",
      intro:
        "Spray preventivo **sem observação** gasta dinheiro e seleciona resistência. Meteorologia manda: vento, chuva iminente, temperatura.",
      expl:
        "Alternâncias de modo de ação quando produto e lei permitem; respeito a polinizadores e corpo humano com EPI.",
      observe:
        "Flor atrai abelhas vizinhas — timing importa; deriva mata história.",
      tools: "EPI, pulverizador calibrado, diário de aplicação, estação meteorológica local.",
      steps:
        "1) Confirma praga-alvo ou doença-alvo realística.\n2) Escolhe janela sem vento forte ou chuva <24h se rótulo exigir.\n3) Pulveriza cobertura, não charco.\n4) Registra produto, dose, estado fenológico.",
      mistakes:
        "Tank mix sem ordem segura; mesma molécula sempre; pulverizar flora aberta ignorando vizinhanca.",
      phil:
        "Preventivo ético pensa na linha da propriedade ao lado.",
      missionProse:
        "Cria matriz semanal: condição climática mínima → sim/não.",
      conclusion:
        "Calendário inteligente olha para o céu — não só para o armário."
    }),
    mission: { title: "Go / No-go meteorológico", description: "Abortar quando deriva é inevitável.", checklist: ["Vento medido", "Chuva prevista", "EPI separado"] },
    quiz: q2("pulv-q1", "pulv-q2", {
      q1: "Antes do frasco, revisar…",
      o1: [
        "Identificação + clima mínimo + contexto legal",
        "Só cor do frasco",
        "Modo de ação ignorado",
        "Nada"
      ],
      c1: 0,
      q2: "Motivo forte para abortar pulverização?",
      o2: [
        "Chuva iminente ou vento forte",
        "Folhas secas",
        "Céu azul claro",
        "Horário manhã"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-calendario-etico", name: "Calendário ético", description: "Pulveriza com vento e lei na cabeça." } },
    ambience: { lines: ["Cheiro residual de EPI limpo.", "Folhetos de rótulo já dobrados.", "Linha do horizonte com nuvens espessas — decisão."] },
    metadata: { theme: "Sanidade", tags: ["preventivo", "deriva"], difficulty: "Intermediário", category: "Proteção fitossanitária", areaType: "practice-hotspot" }
  },

  "souvenirs": {
    overviewBody: lesson({
      deck: decksBySlug["souvenirs"],
      title: "Souvenirs: lembrança física do compromisso com o método",
      intro:
        "**Merch** bom lembra-te de estudar — copo, caderno ou pin servem de âncora visual para hábitos (notas, higiene, legalidade).",
      expl:
        "Objeto tátil ancora rotina: quando vês o emblema THCProce, lembras checklist de observação antes de agir.",
      observe:
        "Brindes de evento deveriam carregar data ou edição — tornam-se marcos temporais do seu percurso.",
      tools: "Caderno oficial se houver, etiquetas, arquivo de autocolantes de evento.",
      steps:
        "1) Escolhe um souvenir útil, não só decorativo.\n2) Associa objeto a hábito (ex.: abrir caderno antes de fertilizar).\n3) Não confundir consumismo com aprendizagem — compra menos, usa mais.\n4) Compartilha foto ética sem revelar local ilegal.",
      mistakes:
        "Colecionar sem praticar; exibir símbolos em contexto sensível que prejudique segurança pessoal.",
      phil:
        "Cultivador minimalista investe em ferramenta e conhecimento — merch é acréscimo consciente.",
      missionProse:
        "Define um hábit técnico associado ao souvenir que compraste ou ganhaste.",
      conclusion:
        "Memória física boa lembra processo — não ego."
    }),
    mission: { title: "Âncora de hábito", description: "Objeto → ritual seguro.", checklist: ["Objeto escolhido", "Hábito escrito", "Foto ética opcional"] },
    quiz: q2("souv-q1", "souv-q2", {
      q1: "Uso saudável de merch educativo?",
      o1: [
        "Lembrar checklist técnico antes de mexer na planta",
        "Provar status sem estudar",
        "Mostrar local ilegal online",
        "Substituir licenças"
      ],
      c1: 0,
      q2: "Brinde útil > decorativo porque…",
      o2: [
        "Integra-se na sua rotina de campo ou estudo",
        "Ocupa só estante",
        "Sempre mais caro",
        "Substitui advogado"
      ],
      c2: 0
    }),
    rewards: { badge: { id: "selo-memoria-util", name: "Memória útil", description: "Brinde que vira hábito, não pó." } },
    ambience: { lines: ["Caixa cartão com impressão fresca.", "Autocolante que não cola direito — filosófico.", "Caderno a bater no joelho a sair do evento."] },
    metadata: { theme: "Campus life", tags: ["merch", "habito"], difficulty: "Iniciante", category: "Comunidade", areaType: "campus-service" }
  }
};
