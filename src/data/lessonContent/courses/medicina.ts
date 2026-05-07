import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Medicina canabinoide — 10 aulas (conteúdo manual THCProce; não prescreve uso clínico nem substitui médico habilitado). */
export const MEDICINA_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "ECS em pacientes: linguagem sem hype",
    introduction:
      "O sistema endocanabinoide (ECS) integra receptores, mediadores lipídicos, enzimas sintéticas/degradativas e moduladores transitórios que ajustam neurotransmissão, imunidade metabólica e resposta ao stress. Ensinar o ECS com precisão corta o excesso de slogans de marketing sem prometer efeito individual previsível só porque o mecanismo existe.",
    body: `O mapa clássico coloca CB1 com predominância relevante em sistemas nervosos centrais e CB2 mais associado a tecidos linfoides e periferia imune, mas curvas de expressão variam com idade, patologia e tratamento concomitante. Frases do tipo “este produto reposiciona seu ECS” misturam linguagem fisiológica com promessa comercial não verificável paciente a paciente.

No consultório educativo, descrevemos o ECS como rede reguladora: aumento ou diminuição de sinal depende de dosage-form, co-medicação e variabilidade enzimática hepática. THC exógeno atua em CB1 com perfil farmacológico distinto do anandamida endógena em magnitude e temporalidade; ignorar isso gera expectativas irreais.

Pontos técnicos: distinguir agonismo completo, agonismo parcial, antagonismo e modulação positiva alostérica. Limitação: muitos dados vêm de modelos pré-clínicos ou ensaios curtos; extrapolação exige cautela explícita.`,
    objectives: [
      "Definir ECS com quatro componentes (ligando, receptor, síntese/degradação, reciclagem) sem jargão promocional.",
      "Contrapor mapa CB1/CB2 clássico com ressalva de plasticidade tecidual.",
      "Declarar que evidência mecânica não substitui resultado clínico garantido em cada doente."
    ],
    closingSummary:
      "Paciente melhor informado pergunta sobre mecanismo e incerteza — não sobre ‘equilíbrio místico’. O próximo passo é traduzir esse vocabulário para calendário cooperativo com prescritor.",
    quiz: [
      Q("Frase de marketing “Este extrato equilibra sempre o ECS de qualquer paciente”:", [
        "Reflete consenso unânime de comitês científicos nacionais sobre resultado individual",
        "Confunde mecanismo biológico com garantia clínica universal incompatível com heterogeneidade observada",
        "Substitui prescrição médica",
        "Elimina necessidade de CB2"
      ], 1),
      Q("Distribuição relatada de CB1 frente a CB2 deve ser ensinada principalmente como:", [
        "Binário rígido imutável",
        "Tendências com exceções clinicamente relevantes segundo idade, droga e estado inflamatório",
        "Mapa exclusivamente cutâneo",
        "Conceito apenas vegetal"
      ], 1),
      Q("Ensino THCProce sobre ECS deve reforçar que:", [
        "Laboratórios caseiros substituem médico",
        "Alfabetização científica reduz confusão comercial e habilita perguntas melhores ao prescritor sem prescrever",
        "THC atua só fora do SNC",
        "Não existem enzimas degradativas"
      ], 1)
    ],
    media: M.all,
    materials: ["Cartaz ECS quatro blocos (versão sem promessa terapêutica)", "Lista de perguntas que pacientes podem levar ao médico após a aula"],
    references: [
      "Revisões gerais sobre fisiologia do sistema endocanabinoide em humanos",
      "Textos de comunicação clínica centrada no paciente aplicáveis a uso de canabinoides"
    ],
    professorNotes:
      "Usar exemplos hipotéticos; proibir simulação de titulação nominativa em paciente real."
  },
  {
    title: "Titulação, calendário e comunicação com prescritor",
    introduction:
      "Titulação, neste curso, significa observação gradual e documentada apoiada por prescritor legalmente habilitado — nunca definição de doses por monitores ou alunos. Forma farmacêutica e via alteram curvas de absorção e eliminação porque a farmacocinética é individual e contextual.",
    body: `A administração oral prolongada costuma atravessar metabolismo de primeira passagem com larga variabilidade entre pessoas. Perfis de início mais rápido associados a vias inalatórias existentes apenas sob prescrição e regulamentação local aparecem distintos em gráficos científicos — servem de ilustração, nunca de receita automática.

Diário com horário, queixa‑alvo, escala simples de intensidade e eventos adversos melhora a consulta seguinte sem transformar o cursista em médico. Calendários publicados em ensaios mostram ritmos institucionais que precisam ser reinterpretados frente a comorbidades e polifarmácia.

Pontos técnicos: enzimas CYP hepáticas podem alterar teoricamente concentrações de canabinoides orais em co‑uso com antifúngicos azóis, macrólidos ou anticoagulantes — relação didática até o prescritor cruzá‑la ao prontuário. Limitação: insuficiência orgânica, gravidez, lactação e transtornos psicóticos ativos exigem linha de cuidado exclusivamente clínica.`,
    objectives: [
      "Contrastar qualitativamente farmacocinética oral versus inalação sem fornecer miligramas.",
      "Desenhar esqueleto de diário demonstrativo com dados fictícios anonimizados.",
      "Explicitar que qualquer ajuste posológico é competência do profissional prescritor na jurisdição aplicável."
    ],
    closingSummary:
      "Documentação clara é ponte ética com o prescritor; números concretos ficam fora da competência educativa da escola. Segue eixo dor–sono–ansiedade com olhar meta‑analítico.",
    quiz: [
      Q("O THCProce pode prescrever titulação inicial para paciente real?", [
        "Sim, se o monitor for biomédico",
        "Não — prescrição é ato privativo de profissional legalmente habilitado",
        "Sim, desde que haja COA",
        "Sim, se for CBD"
      ], 1),
      Q("Diário hipotético educativo é útil principalmente para:", [
        "Substituir prescrição",
        "Organizar observações que o médico integrará ao prontuário clínico",
        "Calcular miligrama final em sala",
        "Evitar consulta médica"
      ], 1),
      Q("Tabelas de titulação retiradas de artigos científicos devem ser usadas na escola como:", [
        "Substituto de parecer médico",
        "Referência ilustrativa sempre sujeita a reavaliação individual pelo prescritor",
        "Checklist obrigatório para qualquer produto doméstico",
        "Prova de eficácia universal"
      ], 1)
    ],
    media: M.all,
    materials: ["Modelo de diário terapêutico fictício (uma semana)", "Quadro comparativo conceitual de vias de administração"],
    references: [
      "Revisões de farmacocinética de canabinoides por via oral e inalatória",
      "Diretrizes nacionais ou regionais de prescrição — consulta ao prescritor"
    ],
    professorNotes:
      "Trabalhar só quadro branco; proibir capturas de tela de prontuários reais."
  },
  {
    title: "Dor, sono, ansiedade: narrativas vs evidência",
    introduction:
      "Dor crônica, insônia e ansiedade concentram expectativas públicas altíssimas. A aula separa o que costuma viralizar do que revisões sistemáticas e ensaios controlados costumam mostrar quando desfechos e populações são bem delimitados.",
    body: `Para dor neuropática em subgrupos específicos, meta‑análises relatam benefícios modestos versus placebo com heterogeneidade relevante — isso não autoriza frase de efeito “resolve qualquer dor”. Insônia é multifatorial; canabinoides podem alterar latência ou continuidade do sono em alguns modelos, porém confundidores como apneia, transtorno de ritmo ou cafeína dominam quadros reais.

Ensaios iniciais com CBD em ansiedade social ou generalizada sugerem sinais biológicos interessantes com amostras pequenas e seguimentos curtos; extrapolar para promessa universal viola método científico. Marketing costuma ignorar viés de publicação e intervalos de confiança largos.

Limitação: o educador traduz medida de efeito populacional em cautela, nunca em garantia clínica individual — isso permanece com o médico que conhece comorbidades e medicamentos.`,
    objectives: [
      "Contrapor narrativas absolutistas de redes sociais com leitura probabilística de revisões.",
      "Reconhecer que média de estudo não prediz resultado em paciente isolado.",
      "Reforçar que indicação off‑label ou on‑label segue normas locais e decisão médica."
    ],
    closingSummary:
      "Evidência existe, porém vem em faixas e com ressalvas — o módulo seguinte trata interações e contraindicações em linguagem prudente.",
    quiz: [
      Q("Afirmação “CBD cura insônia em qualquer pessoa” é:", [
        "Compatível com meta‑análises unânimes",
        "Incompatível com multifatorialidade do sono e com necessidade de avaliação clínica individual",
        "Obrigatória em marketing verde",
        "Substituto de polissonografia"
      ], 1),
      Q("Meta‑análises sobre canabinoides em dor neuropática frequentemente mostram:", [
        "Efeito nulo em todos os casos",
        "Ganhos modestos com heterogeneidade — exigindo cautela na generalização",
        "Substituição automática de opioides",
        "Eliminação do placebo"
      ], 1),
      Q("Ensaios curtos iniciais com CBD em ansiedade implicam que o curso pode:", [
        "Prescrever esquema fixo",
        "Oferecer alfabetização sobre limitações amostrais e encaminhar discussão ao prescritor",
        "Garantir remissão sintomática",
        "Substituir terapia cognitivo‑comportamental"
      ], 1)
    ],
    media: M.all,
    materials: ["Tabela narrativa versus nível de evidência (ilustrativa)", "Lista de perguntas críticas para ler um abstract"],
    references: ["Revisões sistemáticas sobre canabinoides em dor neuropática", "Ensaios iniciais com CBD em ansiedade — leitura crítica"],
    professorNotes:
      "Distribuir dois resumos fictícios de estudos e pedir aos grupos que identifiquem viés óbvio."
  },
  {
    title: "Contraindicações e interações (visão educativa)",
    introduction:
      "Interações medicamentosas são domínio médico; a aula oferece alfabetização sobre mecanismos frequentemente citados na literatura para que o paciente ou o educador façam perguntas informadas — jamais decisões de suspender ou iniciar fármacos.",
    body: `Cannabinoides psicoativos orais podem, em tese, competir por vias metabólicas com medicamentos que também passam pelo fígado; a relevância clínica surge caso a caso. Benzodiazepínicos, opioides e antidepressivos somam efeitos sobre o SNC — o risco de sedação excessiva exige conversa clínica sob prescrição, não ajuste improvisado em sala.

Psicose ativa, gravidez não acompanhada, insuficiência hepática grave entram entre exemplos frequentemente citados em textos de segurança onde presença de THC importa; listas evoluem com jurisprudência e evidência e não substituem avaliação médica.

Limitação: tabelas simplificadas THCProce são pedagógicas; bula prescritiva oficial e interação individualizada prevalecem sempre.`,
    objectives: [
      "Exemplificar famílias farmacológicas comumente mencionadas em textos de farmacovigilência canabinoide.",
      "Repetir que cursista não altera posologia alheia mesmo “por boa intenção”.",
      "Reconhecer sinais absolutos de alarme que exigem urgência médica (ex.: ideação suicida súbita)."
    ],
    closingSummary:
      "O mapa de interações ajuda a perguntar bem; quem responde clinicamente é sempre o prescritor habilitado.",
    quiz: [
      Q("Um educador THCProce pode pedir que o paciente suspenda anticoagulante oral em casa?", [
        "Sim, se houve tontura leve",
        "Não — qualquer mudança pertence ao médico prescritor ou serviço autorizado",
        "Sim, se o produto é natural",
        "Sim, se o paciente assina termo informal"
      ], 1),
      Q("Combinação teorizada de canabinoides com depressores do SNC sugere principalmente:", [
        "Potencialização de sedação — alerta clínico sob orientação médica",
        "Ausência de risco",
        "Eliminação automática da ansiedade",
        "Sinergismo que dispensa dose individual"
      ], 1),
      Q("Listas pedagógicas de interações no curso:", [
        "Substituem bulas oficiais",
        "Servem apenas como gatilho de perguntas ao prescritor, nunca decisão isolada",
        "São válidas em qualquer país sem adaptação",
        "Elidam farmacogenética humana"
      ], 1)
    ],
    media: M.all,
    materials: ["Matriz ilustrativa de perguntas ao prescritor sobre polifarmácia", "Fluxograma “quando acionar urgência” (exemplo fictício)"],
    references: ["Revisões de interações medicamentosas envolvendo canabinoides", "Manuais nacionais de prescrição — verificar atualização regional"],
    professorNotes:
      "Proibir dramatizações com nomes de fármacos reais ligados a pessoas identificáveis."
  },
  {
    title: "Perfil de canabinoides + terpenos no contexto clínico",
    introduction:
      "THC, CBD, CBG, CBN e terpenóides aparecem em rótulos e certificados de análise (COA). A aula treina leitura crítica: o que significa cada parâmetro em contexto populacional sem prometer perfil sinérgico idêntico em todo ser humano.",
    body: `THC liga‑se majoritariamente ao CB1 com efeitos psicoativos dose‑dependentes observados clinicamente quando legalmente prescrito; CBD conversa com múltiplos alvos além dos canabinoides clássicos, o que explica literatura heterogênea. CBG e CBN aparecem em concentrações menores na planta e em formulações específicas — interpretar “miligramas totais declarados” exige saber se o ensaio mediu forma ácida, decarboxilada ou soma relatada.

Terpenóides modificam aroma e podem alterar farmacologia percebida por vias não completamente cartografadas — o “efeito comitiva” permanece hipótese parcialmente suportada, parcialmente marketing. Um COA laboratorial lista canabinoides totais, umidade residual, metais pesados e, às vezes, perfil terpênico; entender LOD/LOQ e data de coleta é tão importante quanto ler o número central.

Limitação: COA descreve lote específico, não resposta humana garantida — correta interpretação continua sendo tarefa interprofissional com prescritor.`,
    objectives: [
      "Decodificar campos típicos de COA relevantes ao conteúdo canabinoide e segurança química.",
      "Contrastar significado de canabinoides menores versus marketing de “blend milagroso”.",
      "Discutir terpenóides com linguagem probabilística, não com promessa única."
    ],
    closingSummary:
      "COA é fotografia analítica do lote — não retrato automático da resposta clínica; o módulo segue para populações vulneráveis.",
    quiz: [
      Q("Um COA laboratorial substitui:", [
        "Avaliação clínica",
        "Nada além da caracterização daquele lote sob condições laboratoriais definidas",
        "Registro sanitário nacional automático",
        "Receita médica"
      ], 1),
      Q("CBN costuma aparecer mais associado historicamente a:", [
        "Produção exclusiva de THC sem degradação",
        "Matéria prima envelhecida ou processos onde ácidos degradam — sempre no contexto do laudo analítico",
        "Neutralização permanente do CB2",
        "Eliminação de terpenóides voláteis"
      ], 1),
      Q("Leitura “entourage terpênico” na educação THCProce deve:", [
        "Garantir sinergismo clínico idêntico em todos",
        "Reconhecer evidência mista e necessidade de estudos controlados adicionais",
        "Eliminar CBD da discussão",
        "Substituir ensaios randomizados"
      ], 1)
    ],
    media: M.all,
    materials: ["Modelo de COA anonimizado com legenda campo a campo", "Quadro THC / CBD / CBG / CBN — funções moleculares simplificadas"],
    references: ["Guia de interpretação de laudos cannabinoides para leigos técnicos", "Artigos revisão sobre terpenóides e evidência entourage"],
    professorNotes:
      "Trazer um COA PDF real censurado (sem CNPJ) se política institucional permitir."
  },
  {
    title: "Pediatria, idosos e vulnerabilidade (cuidados)",
    introduction:
      "Crianças, idosos frágeis e pessoas com comorbidades graves concentram sensibilidade farmacológica e barreiras cognitivas. A aula é somente sobre princípios educativos — qualquer uso compasional em menor exige arcabouço legal e equipe multiprofissional fora do escopo prescritivo da escola.",
    body: `Em pediatria, relação massa corporal–encéfalo em desenvolvimento e metabolismo hepático imaturo mudam exposição relativa quando canabinoides entram — literatura específica é mais escassa e decisões ficam estritamente hospitalares ou prescritoras legalizadas. Idosos acumulam polifarmácia, fragilidade e risco de quedas quando há efeitos psicoativos somados.

Vulnerabilidade psiquiátrica severa altera razão benefício‑risco aparente nos textos orientadores; comunicação deve ser lenta, escrita quando possível e com acompanhante de confiança se permitido. Documentar consentimento informado — entendido de fato — é pilar ético, não formalidade burocrática vazia.

Limitação: o curso não delibera critérios de elegibilidade clínica; apenas reforça prudência e encaminhamento.`,
    objectives: [
      "Listar três eixos de fragilidade (farmacocinética, cognitiva, social) em idosos.",
      "Reconhecer escassez relativa de dados pediátricos robustos na literatura geral.",
      "Descrever importância de consentimento compreensível com apoio familiar quando aplicável."
    ],
    closingSummary:
      "Populações vulneráveis exigem humildade científica e equipe clínica completa — o curso reforça encaminhamento, não autonomismo medicamentoso.",
    quiz: [
      Q("Uso compasional em criança sem arcabouço médico‑legal caracteriza:", [
        "Boas práticas educativas THCProce",
        "Conduta presumivelmente ilegal ou insegura fora das vias institucionalizadas",
        "Substitutivo de neurologista",
        "Estratégia neutra porque é planta natural"
      ], 1),
      Q("Idosos usando canabinoides psicoativos merecem atenção redobrada principalmente porque:", [
        "Nunca metabolizam fármacos",
        "Podem ter maior risco de quedas ou sedação acumulada com polifarmácia",
        "Sempre apresentam hipertolerância",
        "CBD é contraindicado universalmente"
      ], 1),
      Q("Documentação ética recomendável inclui:", [
        "Consentimento apenas oral instantâneo",
        "Registro compreensível de riscos, benefícios incertos e plano de retorno médico quando houver tratamento institucional",
        "Somente foto do produto",
        "Propaganda institucional de marca"
      ], 1)
    ],
    media: M.all,
    materials: ["Checklist multidimensional de vulnerabilidade (fictício)", "Guia rápido de linguagem adaptada para terceira idade"],
    references: ["Revisões pediátricas onde existirem guideline nacionais", "Literatura sobre fragilidade e psicoativos em geriatria"],
    professorNotes:
      "Convidar trabalhador social fictício no roteiro de role‑play — mostra integração de cuidados."
  },
  {
    title: "Documentação, diário terapêutico e segurança",
    introduction:
      "Diário terapêutico estruturado é instrumento de segurança do paciente e de qualidade da informação ascendente. Mostramos campos mínimos, periodicidade sugerida educativamente e limites de privacidade — sem coletar dados sensíveis reais em sala sem consentimento formal institucional.",
    body: `Campos úteis incluem data, horário aproximado da dose administrada pelo paciente sob prescrição, escala numérica simples de sintoma‑alvo, sonolência, tontura e humor. Eventos adversos graves (síncope, palpitação sustentada, ideação suicida nova) devem acionar busca assistencial imediata — isso precisa constar em aviso explícito.

Periodicidade: diário diário nas primeiras semanas ilustrativas publicadas e depois espaçamento conforme estabilidade relatada pelo prescritor — exemplificamos padrão, não impomos regra clínica. Armazenar diário digital exige cuidado com LGPD; versão papel anônima serve como exercício.

Limitação: monitores THCProce não são terapeutas; feedback em sala deve ser formato analítico, não conduta.`,
    objectives: [
      "Montar diário papel fictício sem dados identificantes reais.",
      "Definir gatilhos documentais que obrigam busca urgência médica.",
      "Explicar requisitos básicos de privacidade e consentimento em diários digitais reais."
    ],
    closingSummary:
      "Papel bem preenchido vira infraestrutura de segurança partilhada — passamos ao arcabouço legal brasileiro educativo.",
    quiz: [
      Q("Ideações suicidas novas após iniciar tratamento relatado no diário exigem:", [
        "Aumentar sozinho a dose até “passar”",
        "Procurar imediatamente serviço de emergência ou linha oficial de crises conforme cada região",
        "Somente esperar próxima aula THCProce",
        "Registrar em rede social primeiro"
      ], 1),
      Q("Monitores do curso frente a entrada de dados clínicos reais em sala devem:", [
        "Aceitar sempre sem termo institucional",
        "Barrar uso de identificadores pessoais reais conforme política escolar aplicável",
        "Publicar tudo pseudônimo suficientemente detalhado para reidentificar",
        "Armazenar em nuvem pessoal não criptografada"
      ], 1),
      Q("Objetivo educativo principal do diário é:", [
        "Substituir prontuário eletrônico oficial",
        "Melhorar comunicação factual entre paciente e prescritor sem transformar aluno em clínico",
        "Vender suplemento",
        "Eliminar necessidade de retorno médico"
      ], 1)
    ],
    media: M.all,
    materials: ["Template LGPD‑aware de diário (exercício)", "Cartaz de sinais de alarme e contatos de emergência genéricos"],
    references: ["Boas práticas de registro clínico em uso de canabinoides", "Lei Geral de Proteção de Dados — trechos aplicáveis a educação"],
    professorNotes:
      "Revisar com jurídico institucional qualquer formulário papel que saia da sala."
  },
  {
    title: "Fronteira legal Brasil: educação e compliance",
    introduction:
      "O arcabouço brasileiro de canabinoides evolui continuamente entre importação especial, prescrições, magistratura e sanitização de formulações registráveis versus informalidade. Esta aula posiciona o THCProce como instituição de educação científica e compliance, não canal de orientação ilegal.",
    body: `Cursos reconhecidos podem instruir Ciência mesmo quando determinada forma farmacêutica só é acessível via canais institucionalizados. Discutimos diferença entre educação, advocacia política legal e autocultivo doméstico — cada qual com consequências jurídicas próprias fora da nossa instrução detalhada aqui porque variam Estado a Estado e atualização legislativa.

Compliance para monitores significa linguagem autocontida sem incitação ao desvio regulatório, sem falsificação de documentos sanitários sem receita válida onde exigível. Materiais institucionais devem sempre carregar disclaimers atualizados por jurídico interno THCProce.

Limitação: nada nesta edição substitui parecer jurídico‑regulatório atualizado antes de nova campanha pública.`,
    objectives: [
      "Reconhecer distinções entre papel educativo, prescrição e defesa política regulatoria.",
      "Identificar comportamentos públicos coordenadores que elevam risco jurídico institucional.",
      "Orientar cursistas à checagem de fontes primárias oficiais (ANVISA, CFM atualizações etc.)."
    ],
    closingSummary:
      "Ensino científico robusto só se sustenta com compliance paralelo — o bloco seguinte trabalha ética narrativa sob anonimização.",
    quiz: [
      Q("THCProce institucional deve ensinar formulário apenas acessível via importação especial sem mencionar lei aplicável?", [
        "Sim, marketing puro dispensado",
        "Não — sempre contextualizar educação com atualização oficial verificável e encaminhar verificação jurídica",
        "Somente se for CBD",
        "Somente aos finais de semana"
      ], 1),
      Q("Autocultivo doméstico discutido em sala educativa deve:", [
        "Ser incentivado sempre",
        "Ser tratado apenas com factualidade jurídica vigente institucional verificável — não incitação",
        "Substituir aula científica",
        "Eliminar menção porque é tabu"
      ], 1),
      Q("Monitores publicando supostas doses sem contexto médico legal incorrem:", [
        "Neutralidade garantida porque é apenas educação",
        "Risco institucional e possível infração sanitárias ou publicitárias conforme texto vigente — mitigação pelo jurídico",
        "Certificação automática médica",
        "Isenção universal"
      ], 1)
    ],
    media: M.all,
    materials: ["Linha temporal ilustrativa de marcos regulatorios brasileiros (verificar ano)", "Template de disclaimers institucionais atualizável"],
    references: ["Atualização ANVISA e CFM pertinentes ao tema canabinoide", "Pareceres jurídicos internos THCProce conforme atualização municipal"],
    professorNotes:
      "Agendar atualização semestral desta aula com jurídico — legislação muda rápido."
  },
  {
    title: "Casos para discussão (anonimizados, formativos)",
    introduction:
      "Discussão em caso consolida raciocínio formativo quando o material é rigorosamente anonimizado. Trabalhamos quadros sintéticos com lacunas deliberadas para que o grupo identifique perguntas faltantes ao prescritor, não para “acertar o diagnóstico secreto”.",
    body: `Cada ficha traz idade aproximada, queixas agregadas, contexto de medicações já informadas pela persona fictícia e objetivos terapêuticos declarados no texto — sem detalhes que permitam reidentificar pessoa real.

Pequenos grupos produzem checklist de perguntas adicionais (epilepsia? gravidez? intervalo QT?), listam riscos de interação em nível estritamente educativo e formulam próximos passos como “encaminhar especialista X com prescrição válida na jurisdição aplicável”, sem simular conduta clínica.

Limitação: a turma não vota “veredicto” clínico; a síntese reforça humildade e o papel do profissional habilitado.`,
    objectives: [
      "Aplicar estrutura SOAP simplificada a uma persona fictícia.",
      "Produzir lista de perguntas de segurança sem pretender uma única resposta clínica correta.",
      "Reconstruir o papel colaborativo de múltiplos profissionais de saúde."
    ],
    closingSummary:
      "Boa discussão gera perguntas melhores do que respostas apressadas; fechamos o módulo com encaminhamento ético fora do papel de prescritor.",
    quiz: [
      Q("Em sala, discussão sobre persona fictícia deve:", [
        "Incluir nome completo, CPF ou endereço para realismo",
        "Usar só agregados que não permitam reidentificar ninguém",
        "Reproduzir verbatim história de paciente real sem anonimizar",
        "Gravar áudio em grupo de mensagens instantâneas"
      ], 1),
      Q("Objetivo principal do exercício de casos neste curso é:", [
        "Diagnosticar por maioria de votos da turma",
        "Treinar perguntas de segurança e encaminhamento ao médico prescritor, sem prescritor em sala",
        "Substituir plantão ou triagem hospitalar",
        "Definir miligrama por votos dos alunos"
      ], 1),
      Q("A síntese do grupo após o debate deve evitar sobretudo:", [
        "Reflexão honesta sobre incertezas",
        "Veredicto clínico absoluto apresentado como prescrição implícita",
        "Humildade intelectual",
        "Revisão dos limites da educação THCProce"
      ], 1)
    ],
    media: M.all,
    materials: ["Pacote de três fichas anonimizadas para impressão", "Rúbrica simples de participação no debate (formativa)"],
    references: ["Literatura sobre ensino baseado em caso na graduação em saúde", "LGPD e boas práticas de anonimização de relatos"],
    professorNotes:
      "Circular na sala e interromper qualquer detalhe geográfico ou temporal que aproxime o caso de pessoa identificável."
  },
  {
    title: "Encaminhamento ético quando não somos prescritores",
    introduction:
      "Encerramos o módulo reafirmando a identidade da escola: educação científica e alfabetização em canabinoides, com fronteira clara com o ato médico ou de prescrição nas jurisdições aplicáveis.",
    body: `Sinais de alarme absolutos citados em materiais de segurança — por exemplo ideação suicida nova ou súbita, dor torácica sustentada, déficit neurológico agudo — exigem busca imediata a serviço de emergência ou linha de crise oficial da região, não “esperar a próxima aula”.

Encaminhar bem é oferecer acolhimento, clareza sobre limites do educador e um registro factual mínimo (quando institucionalmente permitido) para que o prescritor integre ao cuidado. Continuidade clínica longitudinal, ajustes posológicos e decisões de iniciar ou suspender tratamento ficam com profissionais habilitados e com o paciente em contexto legal adequado.

Limitação: monitores e alunos THCProce não mantêm longitudinalidade clínica nem substituem consultório médico.`,
    objectives: [
      "Enumerar três sinais que justificam encaminhamento urgente ao sistema de saúde.",
      "Construir um script verbal breve, empático e não prescritivo.",
      "Declarar explicitamente os limites legais e éticos do papel educativo da escola."
    ],
    closingSummary:
      "Encaminhar com compaixão, ciência e humildade fecha o ciclo do módulo: informamos e protegemos, sem cruzar a linha da prescrição.",
    quiz: [
      Q("Se, em exercício de diário fictício, surge ideação suicida nova, o educador deve:", [
        "Sugerir aumento de dose do produto para acalmar",
        "Orientar busca imediata a emergência ou linha de crise oficial, conforme a região",
        "Pedir que a pessoa aguarde só até a próxima aula THCProce",
        "Publicar o caso em rede social, mesmo com pseudônimo detalhado"
      ], 1),
      Q("Um script verbal empático alinhado ao curso inclui:", [
        "Promessa de cura se o paciente seguir o “método” da escola",
        "Reconhecimento dos limites da educação e encorajamento a procurar prescritor habilitado",
        "Substituição de psicoterapia por opinião do monitor",
        "Indicação de marca ou fornecedor específico"
      ], 1),
      Q("A continuidade clínica longitudinal pertence primariamente a:", [
        "Monitores THCProce, em horário comercial flexível",
        "Profissionais legalmente habilitados, com acordo explícito com o paciente na jurisdição aplicável",
        "Grupos de mensagens entre cursistas",
        "Laboratórios ou amigos da comunidade"
      ], 1)
    ],
    media: M.all,
    materials: ["Cartaz institucional de sinais de alarme e passos imediatos (genérico)", "Script de três frases: limites do educador + encaminhamento"],
    references: ["Literatura sobre ética de encaminhamento em crise psiquiátrica", "Códigos de ética dos conselhos profissionais da região — verificar edição vigente"],
    professorNotes:
      "Usar o encerramento para revisar política escolar de privacidade e canal interno de dúvidas jurídicas antes do próximo ciclo."
  }
];
