import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Culinária cannábica — 10 aulas (conteúdo manual THCProce; educação responsável; não prescreve uso nem substitui norma sanitária ou jurídica vigente). */
export const CULINARIA_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Infusão, decarbox e porções seguras",
    introduction:
      "Matrizes lipídicas concentram canabinoides quando o processo é documentado com temperatura coerente e homogeneização antes de porcionar. Organizamos decarboxilação → infusão → uso em receita, com ressalva de latência e variabilidade típicas em ingestíveis descritas na literatura geral.",
    body: `Decarboxilação converte canabinoides ácidos em formas neutras mais lipófilas em faixas térmicas estudáveis; no forno doméstico, pontos quentes e volumes irregulares introduzem incerteza — medir com sonda é mais seguro que confiar só no termostato do aparelho.

Infusão em gordura combina tempo, calor moderado e contato superfície–lipídio. Misturar bem depois de esfriar parcialmente reduz o risco de porções bem mais concentradas que a média do lote. Queimar a gordura destrói nuances aromáticas e pode gerar compostos indesejados — fumo visível é sinal de parar ou recomeçar.

Ingestíveis costumam ser associados, em textos divulgativos, a início de efeito mais tardio e curvas mais longas do que a inalação; isso não é promessa individual nem substitui cuidado clínico onde existir.\n\nLimitação: quadro jurídico sobre posse ou oferta varia por contexto — a escola ensina método e segurança alimentar, não incentiva infração.`,
    objectives: [
      "Ordenar conceptualmente etapas: decarbox → infusão → homogeneização → porção.",
      "Explicar por que o termóstato do forno pode mentir sobre a temperatura real do material.",
      "Contrastar expectativas comuns sobre início de efeito em ingestão versus inalação sem alarmismo."
    ],
    closingSummary:
      "Um infuso bem controlado minimiza surpresas de distribuição e de timing percebido; seguimos para escolhas de matriz lipídica e noções sobre etanol de cozinha.",
    quiz: [
      Q("Antes de dividir uma matriz oleosa infusionada num exercício hipotético, o passo mais crítico é:", [
        "Avaliar só a cor superficial",
        "Homogeneizar, porque zonas mais escuras não garantem THC uniforme nem o contrário",
        "Eliminar etiquetas para simplificar",
        "Adicionar água livre ao óleo para refrescar"
      ], 1),
      Q("Sobre ingestíveis, muitos textos gerais destacam relativamente à inalação:", [
        "Ausência de metabolismo no fígado",
        "Latência e duração percebidas frequentemente diferentes",
        "Identidade com via intravenosa",
        "Impossibilidade de variabilidade entre pessoas"
      ], 1),
      Q("Usar termómetro ou sonda no processo térmico serve principalmente para:", [
        "Anular legislação alimentar",
        "Substituir suposições sobre temperatura interna versus leitura do aparelho",
        "Eliminar necessidade de registro",
        "Garantir resultado psicoativo idêntico em todos os organismos"
      ], 1)
    ],
    media: M.all,
    materials: ["Fluxograma decarboxilação e infusão (exercício)", "Ficha de lote fictício: método, datas, homogeneização sim/não"],
    references: [
      "Boas práticas de manipulação doméstica — fontes sanitárias oficiais atualizáveis",
      "Revisões gerais de farmacocinética oral de canabinoides (não prescrição)"
    ],
    professorNotes:
      "Demonstrações com óleo quente exigem EPI e regra de idade mínima da instituição."
  },
  {
    title: "Manteiga, óleos e etanol culinário (noções)",
    introduction:
      "Cada gordura comporta janelas térmicas e perfis de sabor distintos. Etanol de cozinha entra em reduções e extração aromática na esfera gastronômica — não confundir com extração solvente industrial do módulo de laboratório.",
    body: `Manteiga contém água e sólidos lácteos; clarificar reduz parte da fase aquosa e permite aquecer com menos espuma e menos risco de notas queimadas de leite. Óleos neutros sustentam frituras curtas e emulsões quando a receita pede estabilidade oxidativa razoável.

Oxidação de óleos: luz, calor e oxigênio aceleram ranço; embalagem opaca, tampa hermética e refrigeração são medidas clássicas em manuais domésticos. Etanol culinário tem polaridade diferente da gordura — receitas que reduzem vinho ou usam macerações alcoólicas curtas extraem compostos voláteis e não substituem processo industrial fechado sob licença.

Erros comuns: levar a gordura ao ponto de fumaça forte antes de integrar ingredientes; esfriar infuso quente demais em frasco fechado demais rápido; confundir álcool de cozinha com solvente técnico de laboratório.`,
    objectives: [
      "Comparar qualitativamente manteiga comum e manteiga clarificada em termos de água residual e estabilidade ao calor.",
      "Nomear três fatores que aceleram oxidação de óleos e contramedidas simples.",
      "Distinguir papel do etanol na cozinha do papel do solvente em extração regulada."
    ],
    closingSummary:
      "A matriz lipídica define sabor, ponto de fumo e conservação; a seguir, matemática de porção com exemplos fictícios e humildade metrológica.",
    quiz: [
      Q("Clarificar manteiga, em contexto educativo, tende a:", [
        "Remover todos os canabinoides",
        "Reduzir água e sólidos lácteos e facilitar trabalho com calor mais estável",
        "Substituir homogeneização",
        "Tornar a infusão impossível"
      ], 1),
      Q("Etanol de uso culinário nesta aula:", [
        "É legalmente e tecnicamente equivalente a extração industrial com solvente em laboratório licenciado",
        "Ilustra técnicas gastronômicas distintas e não substitui módulos de extração regulada",
        "Dispensa ventilação em espaço fechado",
        "Garante concentração farmacêutica documentada"
      ], 1),
      Q("Cheiro rançoso num óleo infusionado armazenado indica principalmente:", [
        "Aumento desejável de terpenos",
        "Oxidação lipídica — descarte prudente no exercício doméstico",
        "Prova de dose segura",
        "Necessidade de mais açúcar"
      ], 1)
    ],
    media: M.all,
    materials: ["Tabela manteiga / óleo neutro / clarificada", "Checklist de alertas sensoriais (queimado, ranço)"],
    references: ["Ciência de alimentos — lipídios e oxidação", "Normas de segurança em cozinha escolar"],
    professorNotes:
      "Evitar fritura aberta com turmas grandes sem extintor e captação de vapores onde exigível."
  },
  {
    title: "Dosagem por porção: matemática amigável",
    introduction:
      "Dividir totais hipotéticos por N porções iguais ensina honestidade intelectual: a média pressupõe mistura uniforme e não substitui laudo laboratorial nem orientação médica individual.",
    body: `Modelo de caderno: se um lote fictício registra um total simbólico (valor inventado para exercício escolar) e a receita gera N unidades aparentemente iguais, a média aritmética é total ÷ N. Na prática, mistura incompleta, porções irregulares ou separação de fases na geladeira quebram a suposição.

Consistência de unidades — gramas, mililitros — evita confundir medidas imperiais de vídeos externos com utensílios locais. Explicitar que se ‘assume homogeneização perfeita’ separa a folha da realidade da cozinha.

O curso não atribui miligramas individuais em sala; isso cabe a profissionais habilitados e ao enquadramento legal do aluno.\n\nIndústria e cooperativas reais usam laudos e regras de rotulagem — tema tangencial aqui.`,
    objectives: [
      "Calcular média por porção sob suposição de homogeneidade perfeita com números fictícios.",
      "Listar três razões pelas quais a cozinha real desvia da média teórica.",
      "Traduzir medidas volumétricas comuns para massa quando útil ao exercício."
    ],
    closingSummary:
      "Matemática sem homogeneização e sem laudo alimenta falsa precisão; passamos à higiene, validade e armazenamento alimentar.",
    quiz: [
      Q("Com totais fictícios de exercício e 12 unidades iguais, se total simbólico for 480 e divisão homogénea for assumida:", [
        "480 por unidade",
        "40 por unidade — apenas exercício pedagógico, não orientação individual",
        "12",
        "Zero por definição"
      ], 1),
      Q("A suposição ‘mistura perfeita’ no caderno:", [
        "É sempre verdadeira na colherada real",
        "Frequentemente falha — daí documentar método de mistura e aceitar variância",
        "Substitui análise laboratorial obrigatória na indústria",
        "Elimina etiqueta doméstica"
      ], 1),
      Q("Em sala, o papel do curso perante perguntas de dose pessoal é:", [
        "Responder com valores fixos tirados da internet",
        "Manter proporcionalidade em exemplos fictícios e limitar conselhos clínicos a profissionais habilitados",
        "Garantir biodisponibilidade igual entre pessoas",
        "Substituir importação especial"
      ], 1)
    ],
    media: M.all,
    materials: ["Planilha fictícia total ÷ N + coluna de suposições", "Tabela de conversão volume–massa para farinha (referência genérica)"],
    references: ["Rotulagem e informação ao consumidor — consulta regional", "Documentação em cozinha coletiva"],
    professorNotes:
      "Interromper normalização de ‘hero dose’ em brincadeiras de turma."
  },
  {
    title: "Higiene, validade e armazenamento alimentar",
    introduction:
      "Infusos lipídicos são alimentos: contaminação cruzada, tempo na zona de temperatura de risco e oxidação competem com qualquer narrativa de ‘produto natural seguro’.",
    body: `Separe utensílios e superfícies de proteínas cruas de preparações prontas; lave mãos entre etapas; siga regras locais de cozinha escolar para tábuas codificadas. Lipídios não esterilizam o ambiente — contaminação pós-processo com utensílio sujo permanece possível.

Resfriamento: textos de manipulação ensinam a não prolongar alimentos perigosos na faixa de temperatura que favorece multiplicação microbiana (referências oficiais variam ligeiramente na numeração, mas convergem na ideia de não deixar comida morna horas à temperatura ambiente em evento quente).

Validade doméstica honesta agrupa data, observação sensorial (ranço, textura estranha) e política de descarte familiar ou de grupo-piloto no papel da cooperativa fictícia. Frascos opacos reduzem fotooxidação; minimizar oxigênio residual no headspace ajuda dentro do possível.\n\nRotulagem detalhada é aprofundada na aula seguinte.`,
    objectives: [
      "Explicar por que infuso quente não pode esfriar indefinidamente à temperatura ambiente em serviço.",
      "Identificar sinais de alteração lipídica que justificam descarte.",
      "Propor rotina de limpeza de fim de aula para oficinas com muitos participantes."
    ],
    closingSummary:
      "Higiene estrutura confiança coletiva antes de criatividade gastronômica — avançamos para matrizes doces e salgadas.",
    quiz: [
      Q("Infuso lipídeo morno deixado longas horas sobre mesa festiva em dia quente tende a:", [
        "Aumentar apenas o aroma",
        "Aumentar risco microbiológico associado à zona de temperatura de risco típica de cursos de manipulação",
        "Eliminar obrigação de rótulo",
        "Substituir geladeira"
      ], 1),
      Q("Cheiro ou sabor francamente rançoso no óleo armazenado sugere:", [
        "Somente evidência de ‘terpenos poderosos’",
        "Oxidação lipídica — descarte prudente no exercício doméstico",
        "Prova de que o lote deve ser distribuído a estranhos",
        "Ausência total de problema de segurança"
      ], 1),
      Q("Garrafa de vidro transparente exposta ao sol forte na bancada, com infuso guardado por semanas:", [
        "É ideal por ser ‘natural’",
        "Acelera degradação oxidativa — preferir recipiente escuro ou local sem radiação direta quando possível",
        "Elimina microorganismos apenas pela luz",
        "Substitui data escrita na etiqueta"
      ], 1)
    ],
    media: M.all,
    materials: ["Cartaz zona de temperatura de risco (referência pedagógica)", "Lista de verificação fim-de-oficina: louça, óleos, lixo"],
    references: ["Manuais regionais de boas práticas de manipulação", "Literatura sobre vida útil de lipídeos oxidáveis"],
    professorNotes:
      "Articulação com apoio logístico da escola para descarte seguro de óleo estragado ou excessivo."
  },
  {
    title: "Receitas doces salgadas: matrizes base",
    introduction:
      "Brownies hipotéticos, brigadeiros, molhos salgados e massas ocupam lugares diferentes na física culinária — gordura, água, açúcar e fermento reorganizam entrega térmica e textura.",
    body: `Massas enriquecidas com manteiga infusa exigem esfriar ou temperar antes de misturar com ovos crus — senão a proteína coagula e a textura perde-se. Emulsões tipo maionese com infuso exigem equilíbrio entre gordura, água e emulsionante; a emulsão desfeita é lição esperada até dominar tecnologia em sala.

Doces concentrados alteram osmolaridade e atividade de água em relação a bolos mais úmidos — confronte materiais didáticos de confeitaria antes de igualar períodos de segurança. Preparações salgadas com queijo ou outras proteínas pedem refrigeração rigorosa após o consumo institucional.

Em eventos, planejar paralelamente uma versão sem canabinoides cumpre sensibilidades individuais, menores eventualmente presentes ou políticas explícitas da escola.\n\nMarketing em redes com ‘mega porção heroica’ deseduca — o foco aqui é matriz técnica, não desafio de tolerância.`,
    objectives: [
      "Contrastar desafios térmicos entre massa levedada e massa rica em gorda infusionada.",
      "Relacionar teor de açúcar concentrado com noções típicas de conservação da confeitaria.",
      "Planejar menu duplo hipotético com e sem incorporação imaginária para público heterogêneo."
    ],
    closingSummary:
      "A matriz dita textura e risco microbiano relativo; segue-se técnica de sabor transparente sobre ética.",
    quiz: [
      Q("Versar gordura infusionada escalda sobre ovos crus sem temperar tende a:", [
        "Garantir emulsão perfeita",
        "Coagular proteínas indesejadamente — controlar temperatura de junção",
        "Remover THC",
        "Eliminar fermento biológico"
      ], 1),
      Q("Brigadeiro denso versus bolo úmido doméstico, em pastelaria técnica genérica:", [
        "Igual período seguro sempre à temperatura ambiente",
        "Matrizes hidráticas e lipídicas distintas — extrapolar vida útil sem dados é erro comum",
        "Ambos dispensam etiqueta porque doces são conservantes absolutos",
        "Ambos proíbem refrigerar"
      ], 1),
      Q("Evento com público misto e instituição exigindo prudência:", [
        "Só há produto infusionado porque ‘é tema da aula’",
        "Pode incluir opção equivalente sem canabinoides comunicada explicitamente quando política assim o recomendar",
        "Menores podem participar infusionados desde que parental assine gosto apenas",
        "Água potável dispensável"
      ], 1)
    ],
    media: M.all,
    materials: ["Ficha de receita — colunas: ingrediente / função técnica / ponto crítico de temperatura", "Mini cardápio duplo modelo para exercício"],
    references: ["Livros de ciência aplicada à pastelaria", "Guias sobre alérgenos e comunicação prévia ao convidado"],
    professorNotes:
      "Levantar alérgenos (leite, ovo, castanhas, glúten) antes da oficina."
  },
  {
    title: "Alteração de textura e máscara de sabor",
    introduction:
      "Notas herbáceas competem com chocolate, especiarias e crocância — equilíbrio é técnica. Transparência social diferencia harmonização de sabores de ocultação imprópria a quem não consentiu conscientemente.",
    body: `Ajustar herbáceo através de gorduras redondas, café, cacau intenso, citrinos em dose moderada ou textura crocante faz parte da gastronomia. Ocultar canabinoides a quem não consente conscientemente diverge frontalmente da ética de serviço responsável tratada mais adiante.

Filtragem e decantação fazem troca declarada: remover particulado diminui abrasividade na boca e pode simplificar óleos, com possível custo em lipídio retido conforme método.

Discussões tipo ‘weed sommelier’ extrapolam evidência rápido — conserve linguagem probabilística ou refira limitações estudadas antes de criar folklore de sala.\n\nLimitação legal de oferta informal permanece tema do aluno junto seu assessoramento jurídico.`,
    objectives: [
      "Diferenciar otimização de paladar de engano deliberado sobre presença de psicoativo.",
      "Nomear pelo menos duas variáveis clássicas (gordura, acidez, sal, sacarose) sobre percepção global.",
      "Discutir filtragem contra retenção de fase oleosa apenas em termos qualitativos educativos."
    ],
    closingSummary:
      "Sabor bem construído acompanha aviso sincero ao convidado; próximo tema: etiqueta mesmo em contexto não comercial.",
    quiz: [
      Q("Servir um infuso a visitante não avisado sobre caráter psicoativo tende a ser visto como:", [
        "Aceitável se ficar bem em fotografia",
        "Antiético e potencialmente ilícito conforme contexto — o curso rejeita engano sobre consentimento informado",
        "Boas-práticas de ‘surpresa gastronômica’",
        "Substituto formal de parecer médico"
      ], 1),
      Q("Uma pitada moderada de acidez cítrica pode, em cenário ilustrativo:", [
        "Anular completamente THC lipossolúvel",
        "Reposicionar a percepção entre herbáceo, doçura e amargo do cacau",
        "Eliminar obrigações de refrigeração legal",
        "Substituir o uso moderado de sal"
      ], 1),
      Q("Filtragem refinada de um óleo infusionado pode:", [
        "Aumentar sempre potência média sem trade-off",
        "Alterar percepção de corpo oleoso e distribuição de particulados — trade-off gastronômico típico",
        "Eliminar obrigações legais de rotulagem comercial onde existirem",
        "Substituir laudo instrumental"
      ], 1)
    ],
    media: M.all,
    materials: ["Roda THCProce de aromas (uso educativo de vocabulário sensorial)", "Lista de especiarias e interação com perfil herbáceo percebido"],
    references: ["Literatura sensorial em gastronomia", "Discussões públicas sobre fortificação oculta e consentimento"],
    professorNotes:
      "Exercício curto de role-play — convidado recusa por medicação: resposta cortês do anfitrião."
  },
  {
    title: "Rotulagem doméstica e responsabilidade social",
    introduction:
      "Rotular cada frasco colabora com a segurança de quem divide geladeira: data, símbolo 18+, aviso comportamental objetivo e arrumação física separada onde houver vulneráveis são hábitos de redução de dano no âmbito doméstico.",
    body: `Campos sugeridos no exercício THCProce: nome interno, data de elaboração, local de conservação indicado (geladeira ou freezer), marcador visual 18+, linha única dizendo algo como ‘efeito pode demorar a aparecer — não aumente dose por ansiedade’, sem prometer sintoma garantido.

Lares com crianças reforçam cofres ou prateleiras altas com restrições — dados agregados de intoxicações acidentais associadas a comestíveis motivam esse desenho. Em cooperativa fictícia, minuta da etiqueta passa pela assembleia pedagógica antes de distribuição papel.

Empresa registrada obedece a rótulos oficiais atualizados; o exercício doméstico ensina proporcionalidade e transparência sem equivalência jurídica.\n\nPermissão ou proibição de posse continuam sendo questão própria de cada caso com orientação jurídica.`,
    objectives: [
      "Desenhar etiqueta papel com pelo menos cinco campos úteis de segurança e rastreio fictício.",
      "Relacionar post glamourizante sem alerta ao risco de exposição inadvertida especialmente menor.",
      "Contrapor etiqueta de uso doméstico cooperativo modelo a obrigações legais de indústria regulada onde existam."
    ],
    closingSummary:
      "Rótulo e armazém seguros reduzem acidentes; analisamos padrões de erro que levam a mal-estar intenso percebido.",
    quiz: [
      Q("Geladeira compartilhada com menores sugere especialmente:", [
        "Óleos sem identificação ‘para parecer yogurt’",
        "Armazenamento segregado, trancado se devido e rotulagem 18 + data",
        "Só usar cor infantil porque família divertida sempre",
        "Congelamento sem marcação porque gelo esconde risco visual"
      ], 1),
      Q("Publicar apenas foto apetitosa de comestível hipotético sem contexto educativo pode:", [
        "Ser sempre inofensiva se perfil é pessoal",
        "Impulsionar normalização superficial — prudência de comunicação exige contexto institucional mínimo",
        "Substituir aviso legal industrial completo apenas na imagem",
        "Eliminar responsabilidades morais do autor"
      ], 1),
      Q("Comparando etiqueta de indústria regulada ao exercício doméstico THCProce:", [
        "São sempre documentos juridicamente intercambiáveis",
        "O modelo doméstico transmite hábitos de transparência sem substituir exigências legais reais na indústria",
        "O ambiente doméstico dispensa menção a alérgenos sempre",
        "Rotulagem da indústria não dispensa fiscalização ética, mas omissão não é licita por ser ‘mercado adulto’"
      ], 1)
    ],
    media: M.all,
    materials: ["Modelo de etiqueta em folha A4 para recorte", "Infográfico educativo sobre prevenção de intoxicação acidental com comestíveis"],
    references: ["Campanhas internacionais de prevenção a intoxicação acidental relacionada a comestíveis", "Quadro sanitário brasileiro de rotulagem alimentar atualizável"],
    professorNotes:
      "Opcional: revisão de modelo em papel pelo jurídico institucional — sem parecer jurídico em sala sem profissional presente."
  },
  {
    title: "Erros comuns que causam superdosagem percebida",
    introduction:
      "Aqui ‘superdosagem percebida’ designa sobretudo mal-estar intenso relatado na literatura sobre serviços de emergência quando canabinoides ingeridos excedem a tolerância ou o ritmo esperado pelo usuário. A lista é pedagógica, não substitui triagem médica.",
    body: `Repetir porção porque ‘ainda não bateu’ antes de decorrer tempo compatível com curvas ora descritas em ingestíveis é padrão de erro comportamental tratado em material de redução de dano. Combinar com álcool etílico altera panorama clínico e critérios de urgência — o curso só educa sobre risco estrutural.

Homogeneização fraca pode gerar unidades bem mais potentes que a média do lote. Narrativas de desafio de tolerância em redes normalizam quantidades irresponsáveis; o papel THCProce é dissuadir competição machista sobre dose.

Alterações subjetivas (taquicardia percebida, ansiedade intensa, náusea) merecem ser levadas com seriedade até serviços de urgência segundo protocolo da região do aluno quando o caso pareça grave.\n\nNada aqui autoriza improviso clínico em sala.`,
    objectives: [
      "Listar quatro comportamentos que empilham risco relativamente esperado ingestíveis em textos públicos sobre redução de dano.",
      "Contrapor comunicação influencer de ‘mega dose’ ao dever institucional de prudência.",
      "Declarar quando o educador encaminha a buscar atendimento urgente hipotético sem simular diagnóstico."
    ],
    closingSummary:
      "Paciência temporal e honestidade sobre variância de lote são pedras angulares; fechamos o módulo com festas e cardápio guiado fictício.",
    quiz: [
      Q("Segunda porção logo após a primeira apenas porque o efeito ‘ainda não apareceu’ pode:", [
        "Ser sempre segura se o produto é natural",
        "Acumular doses antes da curva perceptível manifestar integralmente — padrão de erro descrito em educação sobre ingestíveis",
        "Eliminar completamente THC no fígado",
        "Confundir sede com ausência total de psicoativo — hidratar é bom, não substitui avaliação de risco comportamental"
      ], 1),
      Q("Homogeneização insuficiente no lote sugere, em termos educativos:", [
        "Distribuição simétrica garantida sempre",
        "Possibilidade real de outliers fortes dentro do mesmo grupo de porções",
        "Ausência legal de etiqueta doméstica",
        "Prova industrial automática sempre"
      ], 1),
      Q("Pessoa hipotética relata dor torácica intensa síncope confusão abrupta logo após ingestão — orientação geral sala:", [
        "Reforçar ‘dose calmante’ com produto caseiro sem equipe clínica",
        "Buscar atendimento de emergência segundo canais da região — sem papel prescritivo do monitor",
        "Aguardar exclusivamente próxima aula campus",
        "Consultar votação grupo mensagens turma apenas"
      ], 1)
    ],
    media: M.all,
    materials: ["Linha temporal ilustrativa de ingestível — alerta contra leitura pessoal como prescrição", "Lista de comportamentos evitáveis em formato pôster"],
    references: ["Revisões descritivas de atendimento a comestíveis em serviços de urgência — estatísticas agregadas", "Materiais de redução de dano orientados pelo contexto público de saúde"],
    professorNotes:
      "Evitar voyeurismo com vídeos de crise individual identificável; preferir dados agregados."
  },
  {
    title: "Festas e serviço responsável (educação)",
    introduction:
      "Anfitrião organizado comunica onde há produto infusionado fictício na narrativa pedagógica, quem pode servir e como recusar com educação. Hidratação e comida neutra ficam sempre acessíveis — harm reduction comunicacional antes de cenário glamour.",
    body: `Sinalização dupla verbal e escrita reduz erro de pegar ‘o bolinho errado’ em exercícios de planta de sala. Quem distribui deve saber responder ‘não’ a menores e a quem não leu informação mínima — treino curto institucional.

Álcool no mesmo ambiente aumenta probabilidade combinada relatada na literatura geral sobre emergência — o curso reforça prudência e encaminha regras concretas a assessoria jurídica exterior do aluno. Direção veicular pertence unicamente ao Código de Trânsito e políticas locais: nada improvisado por voto de turma.

Evento real com ingestíveis dentro de projeto escolar só após autorização expressa institucional. Em sala mantemos mapa fictício na lousa.\n\nIdade civil e lei material aplicável prevalecem sobre qualquer roteiro de role-play.`,
    objectives: [
      "Desenhar planta fictícia com zona rotulada e mesa paralela livre de canabinoides.",
      "Ensaiar falas curtas de recusa a menor e de encaminhamento a informação segura.",
      "Justificar papel da água e de lanches neutros distribuíveis durante evento modelo."
    ],
    closingSummary:
      "Serviço responsável comunica antes do primeiro aroma; o encerramento consolida tudo num mini cardápio exercício aplicando o checklist do módulo.",
    quiz: [
      Q("Distribuir sobremesa infusionada fictícia a menor em cenário papel de festa é:", [
        "Aceitável se a fatia é pequena",
        "Inadequado sempre — papel do servidor exercício é recusar e acionar política institucional",
        "Aceitável com assinatura informal de hobby culinário",
        "Aceitável se embalagem for colorida para marketing"
      ], 1),
      Q("Oferecer água e salgados sem infusão em paralelo durante evento modelo costuma aparecer como:", [
        "Detalhe supérfluo porque infusão substitui alimentação",
        "Boas-práticas de redução de dano relatadas para ambientes festivos conscientes na literatura não prescritiva",
        "Substituto obrigatório de consultório médico",
        "Motivo para proibir hidratação"
      ], 1),
      Q("Sobre dirigir depois de ingerir comestível com canabinoides, em cenário brasileiro didático:", [
        "‘Confiar no metabolismo’ dispensa lei",
        "Não dirigir até esclarecimento jurídico individualizado — papel do curso só apontar gravidade, não criar pseudoexceções",
        "Café anula sempre efeitos legais e fisiológicos",
        "A turma vota pelo WhatsApp para definir segurança de trânsito"
      ], 1)
    ],
    media: M.all,
    materials: ["Planta de sala festiva A3 com duas áreas destacadas", "Roteiro de fala para servidor modelo (PDF exercício)"],
    references: [
      "Materiais de redução de dano em espaços festivos públicos atualizados",
      "Legislação de trânsito — texto consolidado revisado pelo aluno com apoio jurídico"
    ],
    professorNotes:
      "Role-play de dois minutos: servidor recusa entrega hipotética a participante menor."
  },
  {
    title: "Mini cardápio THCProce para prática guiada",
    introduction:
      "Projeto de fechamento conecta decarbox e infusão conceituais, escolha de matriz lipídica, contas fictícias de porção, higiene, rótulos e harm reduction comunicacional — tudo apenas em papel assembleia modelo, sem promessa de produto registrável.",
    body: `Sugestão de três itens hipotéticos no relatório único de uma página: (1) granola com óleo de exercício etiquetado 18+, lote fictício e data; (2) molho salgado com versão paralela garantidamente livre de canabinoides para convidados que preferem assim; (3) sobremesa de cacau intenso usada para demonstração verbal de homogeneização em grupo.

O relatório deve citar explicitamente checkpoints dos módulos anteriores: método térmico resumido, passo de mistura homogênea, armazenamento gelado, papel do anfitrião em evento e aviso contra redes glamourizando sem contexto.

Apresentações orais curtas (~2 minutos) recebem feedback de pares com rúbrica de três critérios institucionalizáveis por THCProce.\n\nEntrega não substitui cardápio de restaurante licenciado nem registro sanitário.`,
    objectives: [
      "Compor cardápio fictício tripartido encadeando competências das dez sessões precedentes.",
      "Repassar checklist de segurança, legalidade comunicada e etiqueta modelo numa página.",
      "Expor projeto brevemente e registrar feedback construtivo entre colegas."
    ],
    closingSummary:
      "O módulo de culinária fecha com método, ciência gastronômica humilde e comunicação ética — aluno volta ao mapa com vocabulário alinhado a laboratório, legislação e demais áreas THCProce.",
    quiz: [
      Q("Um mini cardápio exercício válido deve integrar pelo menos:", [
        "Apenas cor de marca para redes sociais",
        "Temperatura resumida, homogeneização, porção fictícia, etiqueta mínima, alternativa livre de canabinoides e harm reduction comunicacional",
        "Desafio de tolerância entre colegas",
        "Substituição de registro sanitário brasileiro"
      ], 1),
      Q("O relatório institucional de encerramento pode alegar que:", [
        "O projeto escolar garante equivalência ao rótulo ANVISA de produtor industrial licenciado",
        "É exercício transparente dentro dos limites didáticos com advertências claras aos leitores",
        "Lista miligramas prescritivos nominativamente para cada aluno",
        "Representa lançamento de restaurante físico já amanhã"
      ], 1),
      Q("Checklist de encerramento do módulo inclui obrigatoriamente consciência de:", [
        "Hashtag trending sem contexto jurídico",
        "Rótulos com data/advertência, porção homogênea comunicada como suposição, opção neutra disponível e sinais de encaminhamento clínico",
        "Somente música ambiente divertida",
        "Ocultar infusão a convidados para surpresa"
      ], 1)
    ],
    media: M.all,
    materials: ["Template PDF relatório projeto final uma página", "Rúbrica de avaliação por pares (três critérios)"],
    references: ["Releitura do índice do módulo culinário no campus", "Modelo ata fictícia de assembleia gastronômica cooperativa papel"],
    professorNotes:
      "Encerramento festivo apenas simbólico; degustação com THC real exige projeto aprovado e compliance jurídico separado por escrita."
  }
];
