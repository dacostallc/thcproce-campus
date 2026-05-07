import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Extrações solventless — 10 aulas THCProce. */
export const EXTRACOES_SOLVENTLESS_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Princípios solventless e segurança de bancada",
    introduction:
      "Solventless, neste curso, designa rotas sem solvente organico volatil industrial obbligatorio: gelo-agua, agitacao controlada e rosin. O risco migra para choque termico, eletricidade e higiene cruzada entre lotes.",
    body:
      "A bancada institutional divide fluxo bruto (flor congelada manuseio inicial), lavagem (se aplicavel), secagem de resina, e rosin em zona final com calor. Cada etapa exige superficie inox recuperavel e registo de lote que nao dependa de memoria oral.\n\n" +
      "Pontos tecnicos: EPI termico para prensa; iluminacao local sem sombras que escondam mofo; ferramentas com ciclo de limpeza etanol entre lotes quando politica coop exigir; quadro eletrico dimensionado por profissional habilitado para potencia real da prensa.\n\n" +
      "Erros comuns: mesma tesoura entre lote suspeito e lote limpo sem etapa de higiene; confundir aula com licenca de producao; corrente improvisada em extensao domestica sob prensa quente.",
    objectives: [
      "Definir solventless fisico e riscos residuais de bancada.",
      "Desenhar zoneamento minimo inox com registo de lote.",
      "Separar conteudo educativo THCProce de obrigacoes legais locais."
    ],
    closingSummary:
      "Seguranca solventless e fisica de energia e bioseguranca documentada; o proximo passo e malha gelo e tempo.",
    quiz: [
      Q("Solventless elimina todos os riscos de bancada?", [
        "Sim, por definicao",
        "Nao — permanecem riscos termicos, eletricos e microbiologicos operacionais",
        "Solo se usar luvas descartaveis",
        "Solo se nao houver rosin"
      ], 1),
      Q("Zoneamento serve principalmente para:", [
        "Decoracao",
        "Reduzir cruzamento de resíduos e fluxos incompatíveis entre etapas",
        "Aumentar teor de terpenos",
        "Substituir COA"
      ], 1),
      Q("Extensao domestica frágil sob prensa quente e:", [
        "Boas práticas",
        "Risco de sobreaquecimento e incendio — circuito dedicado e projeto legal",
        "Neutro se a prensa for cara",
        "Substituto de inox"
      ], 1)
    ],
    media: M.lab,
    materials: ["Mapa de zonas de bancada THCProce", "Ficha EPI minimo bubble/rosin"],
    references: ["Normas locais de instalacoes eletricas", "Guias de ergonomia termica em prensagem"],
    professorNotes: "Demonstracao em video curta: limpeza de tesoura entre lotes sem narrativa comercial."
  },
  {
    title: "Ice water / bubble: telas, tempo e temperatura",
    introduction:
      "Bubble hash separa glandulas por tamanho em agua gelada com agitacao disciplinada: micronagem, tempo e temperatura sao variaveis de processo, nao 'feeling' isolado.",
    body:
      "Telas empilhadas capturam fracoes distintas; fluxo de agua e temperatura definem viscosidade de capa limite e arraste de clorofila indesejada em agitacao longa demais. Registe temperatura da agua no inicio e fim de cada batelada de lavagem.\n\n" +
      "Pontos tecnicos: agitacao mecanica documentada (rpm ou ciclos manuais standard); tempo maximo por batelada alinhado a politica de qualidade; secagem subsequente ja planejada para nao deixar massa embolorar em cambota fechada.\n\n" +
      "Erros comuns: agitar demais buscando cor verde; misturar agua de lotes distintos sem decisao assemblear; ignorar que agua quente ambiente derrete gelo e muda curva de extracao.",
    objectives: [
      "Relacionar micronagem tempo temperatura com fracao glandular esperada.",
      "Planejar protocolo repetivel por batelada com registos minimos.",
      "Antever etapa de secagem antes de iniciar lavagem."
    ],
    closingSummary:
      "Bubble bem feito e engenharia de malha-fluido-preparo de secagem; qualidade fecha na sala de secagem, nao apenas no cilindro.",
    quiz: [
      Q("Agitacao excessiva prolongada tende a:", [
        "Sempre aumentar apenas terpenos desejados",
        "Arrastar mais material vegetal fino e afetar cor e sabor do hash",
        "Eliminar microorganismos garantidamente",
        "Substituir secagem"
      ], 1),
      Q("Registar temperatura agua ao longo lavagem permite:", [
        "Apenas marketing",
        "Reproducao e diagnostico quando lote seguinte sai divergente",
        "Eliminar necessidade micronagem",
        "Substituir prensa"
      ], 1),
      Q("Micronagem menor captura:", [
        "Somente fibras grandes visiveis",
        "Fracoes mais finas de glandulas relativamente a telas maiores — com trade-offs operacionais",
        "Somente THC puro isolado sempre",
        "Sempre menor rendimento molhado"
      ], 1)
    ],
    media: M.lab,
    materials: ["Protocolo batelada bubble com campos de tempo e T agua", "Tabela empilhamento malhas sugerida"],
    references: ["Literatura popular-cientifica bubble hash", "Curso Secagem & Cura — continuidade"],
    professorNotes: "Usar demonstracao com agua colorida inocua para explicar arrasto sem plantar material real em sala se politica exigir."
  },
  {
    title: "Secagem e armazenamento do hash",
    introduction:
      "Apos lavagem solventless o hash carrega mais agua superficial que flor curada estável — secagem distribuida sobre bandeja rasa, ar suave e registo objetivo precede jar longo de estabilização.",
    body:
      "Montes grossos dentro de saco plastico vedado seguram vapor no miolo granular enquanto a casca superficial parece pronta. Duas medições UR ou registos ponderais ao longo de dias criam trajetória auditável em assembleia coop.\n\n" +
      "Pontos tecnicos: inversões superficiais leves segundo protocolo documentado para homogeneizar sem contaminar zonas diferentes da bancada; critérios numéricos locais institucionalmente aprovados autorizando passagem ao vidro vedado por politica coop.\n\n" +
      "Erros comuns: transporte tote fechado e quente em viagens longas; fundir dois códigos de lote diferentes em silêncio sem ata deliberativa formal.",
    objectives: [
      "Definir secagem bubble distinta da secagem bractea mas com mesmos principios transfere-massa.",
      "Planejar entrada jar somente quando criterio documentado coop atingido.",
      "Diagnosticar erro de nucleo umido tardio antes envase cooperative."
    ],
    closingSummary:
      "Sem trajetória térmica-hídrica estável, vidro vedado antecipado vira risco microbiano perceptivo e perda volátil posterior.",
    quiz: [
      Q("Monte espesso dentro de sacola plástica fechada dias seguidos tende a:", [
        "Secar o miolo primeiro sempre",
        "Manter bolso úmido central enquanto a superfície aparenta estar pronta",
        "Eliminar terpenos sempre",
        "Substituir política assemblear"
      ], 1),
      Q("Registar peso diário ou UR em série temporal serve para:", [
        "Substituir olfato técnico completamente",
        "Documentar curva real em vez de julgamento apenas oral 'já secou'",
        "Eliminar necessidade de etiqueta",
        "Garantir resultado clínico paciente"
      ], 1),
      Q("Critério institucional antes do jar prolongado busca:", [
        "Apenas aparência externa",
        "Alinhar segurança e rastreio coop em assembleia frente a decisão oral isolada",
        "Substituir qualquer microscópio",
        "Garantir potency fixa sem laboratório"
      ], 1)
    ],
    media: M.lab,
    materials: ["Planilha série peso-UR hash", "Modelo limiar assemblear jar longo"],
    references: ["Curso Secagem & Cura THCProce", "Textos técnicos sobre resina pós-lavagem"],
    professorNotes: "Trazer fotos macro anónimas de superfície versus miolo antes do envase."
  },
  {
    title: "Rosin: placas, sacos e curva térmica",
    introduction:
      "Rosin combina pressão mecânica filtrante e transferência térmica controlada — micronagem do saco, estado hídrico inicial e superfície de placas são parâmetros de projeto, não moda de marca.",
    body:
      "Bolsa define resistência ao fluxo e nível relativo de partícula vegetal passageira indevida; placas devem aquecer uniformemente antes de subir pressão nominal máxima por lote.\n\n" +
      "Pontos técnicos: registar tríade temperatura-alvo, tempo sob pressão e pressão nominal por etiqueta; EPI térmico; quadro elétrico dimensionado por profissional habilitado conforme norma local.\n\n" +
      "Erros comuns: pico térmico máximo logo no primeiro contacto; repetir saco sem limpeza cooperativa entre lotes; estação de prensagem sem renovação de ar suficiente.",
    objectives: [
      "Descrever tríade térmica de prensagem como registo mínimo institucional.",
      "Relacionar micronagem do saco com vazão observada e limpeza lateral indesejada.",
      "Planejar instalação elétrica com profissional habilitado em vez de improviso doméstico."
    ],
    closingSummary:
      "Rosin bem operado transforma pressão-tempo-temperatura em documento reprodutível, não em anedota de vídeo curto.",
    quiz: [
      Q("Picos térmicos brutais no instante zero tendem a:", [
        "Melhorar sempre o perfil de terpenos",
        "Criar zonas queimadas antes de estabilizar fluxo global do saco",
        "Eliminar partículas sempre",
        "Substituir micronagem"
      ], 1),
      Q("Dimensionamento elétrico da prensa deve ser feito por:", [
        "Qualquer extensão disponível",
        "Profissional legalmente habilitado conforme norma local",
        "Influencer solventless",
        "Apenas técnico voluntário sem registo"
      ], 1),
      Q("Sem registo tríade temperatura-tempo-pressão por lote:", [
        "A assembleia aprende igual com memória oral",
        "Perde-se rastreabilidade e melhoramento contínuo documentado",
        "Aumenta COA automático",
        "Elimina necessidade de EPI"
      ], 1)
    ],
    media: M.lab,
    materials: ["Planilha rosin tríade THCProce", "Esquema ciclo limpeza saco entre lotes"],
    references: ["Manuais fabricante prensas", "Normas elétricas NBR ou equivalentes regionais"],
    professorNotes: "Se demonstração ao vivo, usar lote simbólico legalmente aceite no protocolo escolar."
  },
  {
    title: "Curing do rosin e perda de umidade",
    introduction:
      "Sair da prensa não fecha o ciclo solventless técnico-amador aprovado coop: texto, cor e trabalho ao paladar mudam dias após porque umidade superficial e reorganização de massa continuam lentas sob temperatura estável.",
    body:
      "Recipiente vedado não é igual a hermeticamente sufocado para sempre — protocolo coop costuma definir rajadas breves inicialmente e depois fechamentos mais longos sempre com registro de código de lote e data de entrada no jar por assembleia quando material for coletivo.\n\n" +
      "Pontos técnicos: ambiente térmico sem oscilação térmico violenta próximo ao curing; etiqueta física paralela ao registro digital oficial; decisão objetiva antes de segunda prensagem de material já curado segundo política institucional clara sobre reprocessamento.\n\n" +
      "Erros comuns: abrir jar diariamente ‘para cheirar’ sem critério; misturar dois lotes porque visualmente parecem iguais; confundir perda perceptual de raspabilidade com perda garantida uniforme em todo parque coop.",
    objectives: [
      "Diferenciar estabilização imediata pós-prensa de cura lenta em jar protocolada.",
      "Associar curing documentado coop a rastreio jurídico interno institucional básico.",
      "Detectar comportamentos cotidianos que anulam objetivo técnico mesmo com equipamento excelente."
    ],
    closingSummary:
      "Curing transforma resultado bruto térmico-embutido em estado cooperativo auditável só se umidade tempo aberturas forem conscientes escritos.",
    quiz: [
      Q("Rajadas protocoladas logo após entrada jar servem sobretudo para:", [
        "Marketing sensorial apenas",
        "Permitir equilíbrio gasoso inicial controlado segundo roteiro coop — não só abrir quando dá vontade",
        "Substituir prensagem",
        "Eliminar micronagem sempre"
      ], 1),
      Q("Misturar silenciosamente dois lotes porque visual igual viola típica coop porque:", [
        "Sempre aumenta potency",
        "Quebra linhagem traceability deliberada assemblear",
        "Elimina microorganismos",
        "Substitui COA"
      ], 1),
      Q("Ambiente curing com grande oscilação térmico diário costuma:", [
        "Eliminar sempre terpenos desejados de forma benigna apenas",
        "Dificultar curva objetiva coop e favorecer comportamento errático perceptivo",
        "Substituir EPI sempre",
        "Garantir homogeneização microbiana"
      ], 1)
    ],
    media: M.lab,
    materials: ["Ficha entrada jar curing rosin", "Cronograma aberturas mínimas aprovável assembleia"],
    references: ["Curso Secagem & Cura THCProce — analogias", "Textos institucionais sobre rótulo código lote coop"],
    professorNotes:
      "Comparar curva objetiva coop vs ‘cheiro diário influencer’ usando quadro institucional duas colunas anônimas."
  },
  {
    title: "Piatella / cold cure: visão introdutória",
    introduction:
      "Piatella e denominações afins aparecem no ecossistema solventless como nomenclatura de formato textural distinto resultado de trajetória fria prolongada diferente apenas ‘deixar sair vapor’ intuitivo não documentado coop.",
    body:
      "Esta aula instituciona vocabulário mínimo e fronteira educativa THCProce: estudante identifica texto final buscado sem prometer método universal proprietário porque microclimas domésticos variam mesmo sob mesma marca geladeira coop.\n\n" +
      "Pontos técnicos: distinção institucional introdutória entre cold cure apenas como regime térmico alvo declarado versus mistura improvisada dois lotes; registro foto macro protocolada quando política coop permitir documentação técnico-interno sem autopromoção comercial estudantil obrigatória.\n\n" +
      "Erros comuns: rotular aleatoriamente ‘piatella’ produto apenas por marketing; iniciar trajetória fria longa antes estabilização primária básica já acordada; comparar dois formatos diferentes sem critérios sensoriais escritos mínimos.",
    objectives: [
      "Nomear dois eixos mínimos processo formato frio sem reivindicação médica institucional proibida curso.",
      "Conectar nomenclatura com registro coop interno anônimo versus rótulo comercial público externo estudante só observador.",
      "Listar erro nome genérico abusivo que invalida comunicação técnico-assemblear."
    ],
    closingSummary:
      "Vocabulário frio bem delimitado evita guerra semântico Instagram coop — próximo vínculos higiene inox institucional real.",
    quiz: [
      Q("Cold cure introdutório coop pressupõe principalmente:", [
        "Licença clínica estudante sempre",
        "Regime térmico-alvo institucionalmente declarável em protocolo coop interno repetível quando aplicável política própria",
        "Eliminação total COA sempre",
        "Substituição legal secagem flor"
      ], 1),
      Q("Uso promocional abusivo rótulos ‘piatella’ sem critérios assembleares tende a:", [
        "Aumentar rastreamento objetivo coop",
        "Esfraquecer linguagem QA interna coop e confundir aluno iniciante bem-intencionado",
        "Garantir textura garantida industrial",
        "Eliminar microorganismos"
      ], 1),
      Q("Registrar foto macro somente coop serve quando política coop permite porque:", [
        "Substituir laboratório certificado sempre",
        "Documentar evolução técnico-interno sem autoprometer curso como franquia comercial aluno obrigado",
        "Eliminar micronagem sempre",
        "Substituir EPI sempre"
      ], 1)
    ],
    media: M.lab,
    materials: ["Glossário curto formato frio THCProce institucional", "Modelo relatório trajetória fria coop anônima"],
    references: ["Textos de base solventless e nomenclatura comunitária no Brasil", "Parecer coop interno sobre registro fotográfico macro"],
    professorNotes:
      "Deixar claro institucionalmente que curso THCProce não licencia método proprietário marca terceiros."
  },
  {
    title: "Higiene inox, água e contaminação cruzada",
    introduction:
      "Solventless dispensa solvente industrial volátil da rota química paralela, mas não dispensa microbiologia sobre ferramentas e superfícies: água de lavagem reutilizada inadvertidamente continua vetor entre lotes coop.",
    body:
      "Inox raspável sem poros macro visível ainda precisa ciclo coop documentável saponificação alcóolica proporcional quando assembleia assim determinar porque biofilmes finos invisível olho leigo competem mesmo cultura coop cuidadosa.\n\n" +
      "Pontos técnicos: esgotamento água gelo segundo norma coop (descarte versus reuso sanitizado deliberado só com decisão técnico-higiênica competente); estação de lavagem de mãos distinta entre zona bruta e zona pré-envase quando o mesmo galpão abriga várias etapas.\n\n" +
      "Erros comuns: balde mesmo entre duas coop geograficamente diferentes sem ciclo sanitário intermédio formal; tesouras compartidas voluntariado improvisado assembleia urgência; secador comparteado hash flor sem ciclo coop escrito diferenciando.",
    objectives: [
      "Definir vetores microbianos típicos em solventless sem confundir com riscos de extração com solvente orgânico.",
      "Propor ciclo coop mínimo documentável entre dois lotes usando linguagem institucional assembleia não apenas doméstico isolado estudante só.",
      "Reconciliar etapas múltiplas num único galpão com zoneamento físico, mesmo modesto."
    ],
    closingSummary:
      "Higiene em solventless trata inox, água e fluxo de pessoas como vetores reais de contaminação cruzada entre lotes e assembleias.",
    quiz: [
      Q("Por que reusar água de gelo aparentemente limpa pode ser problema institucional coop:", [
        "Nunca porque gelo sempre mata microorganismos",
        "Porque dissolve arrasta material inadvertido só detectável coop monitorando política saneamento deliberate assembleia quando aplicável",
        "Somente porque cor verde sempre visível garantida",
        "Porque sempre substitui rosin sempre"
      ], 1),
      Q("Ciclo saponificação-alcóolica proporcional após alto risco coop costuma responder:", [
        "Decoração bancada marketing",
        "Reduzir probabilidade formação residual biofilm cooperativa multiuso econômicamente mesmo espaço físico só",
        "Eliminar sempre COA sempre",
        "Substituir prensagem sempre"
      ], 1),
      Q("Tesoura voluntariado improvisado compartido assembleia urgência é:", [
        "Boas práticas coop moderno sempre recomendável",
        "Típico ponto coop deliberar protocolo sanitário rápido mínimo documentável antes repetir cenário igual",
        "Irrelevante solventless apenas",
        "Substituto micronagem apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Checklist higiene inox coop galpão multiuso econômico", "Fluxograma saneamento baldágua coop assembleia deliberada"],
    references: ["Manuais básicos segurança alimentícia zona preparo comparativos coop", "Texto coop exemplo política saneamento rápido voluntariados"],
    professorNotes:
      "Trazer cenário hipotético coop duas cidade diferente mesmo equipamento segundo turno rápido — debate assembleia fictícia apenas educativa."
  },
  {
    title: "Notas de laboratório e lotes pequenos",
    introduction:
      "Numa coop, um lote artesanal pequeno exige os mesmos campos de rastreio que um lote grande: quando voluntários alternam turnos, a continuidade quebra se tudo ficar na memória oral ou em mensagens soltas.",
    body:
      "Um caderno digital mínimo — ou livro físico homologado pela assembleia — deve registrar três famílias: identificação do lote (etiqueta física igual ao arquivo); parâmetros térmicos e hídricos relevantes da rota solventless; observações de textura e cheiro como QA interno, sem promessa clínica (outro módulo trata disso).\n\n" +
      "Pontos técnicos: atualizar número de versão do protocolo quando método ou ferramentas mudarem, para que o próximo ciclo coop leia o procedimento verdadeiro, não só a máquina; COA só entra como referência paralela onde houver recurso e política, sem tornar obrigatório este curso educativo THCProce.\n\n" +
      "Erros comuns: post-it solto perdido quando muda voluntariado; foto só no telefone sem backup acordado; tratar trabalho doméstico isolado como fora de política só porque o volume parece pequeno.",
    objectives: [
      "Enumerar campos mínimos de livro laboratorial aplicáveis a lote solventless micro-cooperativo.",
      "Relacionar versionamento de protocolo com equipamento voluntário rotativo.",
      "Reconhecer memória verbal entre turnos como vetor típico de perda de rasto."
    ],
    closingSummary:
      "Lote pequeno honesto coop é como lote grande honesto coop com menor cubagem física quando o registo institui continuidade.",
    quiz: [
      Q("Versionar método na assembleia após mudar ferramentas serve principalmente para:", [
        "Substituir micronagem sempre",
        "Manter reprodutibilidade documentada: o protocolo vivo, não só a prensa ou o agitador",
        "Eliminar microorganismos",
        "Garantir potency fixa sem laboratório"
      ], 1),
      Q("Mesmo lote doméstico reduzido pode precisar de rótulo interno coop quando:", [
        "Nunca, volume pequeno isenta assembleia",
        "A política coop exige rastreio por lote independentemente do tamanho operacional",
        "Só se houver vídeo no Instagram",
        "Só se o hash for verde"
      ], 1),
      Q("Confiar só em post-it no bolso do voluntário é arriscado porque:", [
        "Sempre aumenta potency",
        "Rotatividade natural de voluntários tende a perder papel solto e com ele a continuidade operacional",
        "Elimina necessidade de EPI",
        "Substitui COA"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo caderno digital mínimo lote THCProce", "Tabela de versionamento de protocolo assemblear"],
    references: ["Textos de gestão QA em lotes artesanais", "Documentação de continuidade operacional em cooperativas"],
    professorNotes:
      "Deixar claro que o exemplar é educativo: não obriga filiação a coop real do aluno."
  },
  {
    title: "Qualidade sensorial sem overprocess",
    introduction:
      "Overprocess é quando se repete calor, pressão ou agitação além do ponto que a assembleia definiu buscando ‘efeito de vitrine’ antes de escrever critérios sensoriais mínimos.",
    body:
      "Critérios curtos e escritos — textura ao toque, cor geral, limpeza visual relativa e cheiro de referência interna — delimitam o que é refino desejado versus destruição térmica ou arrasto vegetal. Nada disso substitui promessa clínica ou rótulo de medicamento.\n\n" +
      "Pontos técnicos: cruzar mapa sensorial simples com tempo máximo por batelada de bubble já anotável no laboratório; segunda prensagem só após decisão formal interna coop com registro, não como reflexo inconsciente quando o primeiro fluxo ficou mais fraco que o esperado.\n\n" +
      "Erros comuns: agitar até cor verde porque ‘parece forte’ para marketing informal; segunda prensagem em sequência sem critério; comparar dois formatos no paladar sem anotar pelo menos dois eixos objetivos lado a lado.",
    objectives: [
      "Montar um mapa sensorial institucional mínimo de três eixos escritos cooperativamente.",
      "Descrever overprocess térmico repetido sem deliberação formal como erro operacional típico.",
      "Associar tempo longo demais na lavagem bubble a arrasto de material fino perceptível nos lotes seguintes."
    ],
    closingSummary:
      "Qualidade sensorial fecha com critérios escritos e limites térmicos delimitados pela assembleia, não com looping infinito de processo até ‘parecer forte’.",
    quiz: [
      Q("Buscar cor intensa verde com agitação bubble prolongada costuma:", [
        "Só aumentar terpenos pretendidos garantidamente",
        "Arrastar material vegetal fino e prejudicar cor e características perceptíveis da resina lavada",
        "Eliminar microrganismos com garantia laboratorial",
        "Substituir secagem sempre"
      ], 1),
      Q("Mapa sensorial de três eixos institui principalmente:", [
        "Obrigar marketing externo estudantil THCProce",
        "Um limiar educativo interno entre refino pretendido e destruição por overprocess repetido sem critérios",
        "Eliminar sempre o COA",
        "Substituir micronagem do saco sempre"
      ], 1),
      Q("Segunda prensagem seguida sem critério assemblear costuma caracterizar:", [
        "Melhor prática automática sempre",
        "Um caminho comum ao overprocess se a assembleia não deliberou limites explícitos",
        "Substituto legal de licenciamento",
        "Eliminação automática de EPI"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo mapa sensorial três eixos THCProce", "Checklist limite térmico e tempo de agitação por lote"],
    references: ["Textos de QC artesanal comparativos", "Aula bubble deste curso — arrasto e tempo"],
    professorNotes:
      "Se uma coop real achar vocabulário denso, simplificar mantendo os três eixos escritos obrigatórios do exercício."
  },
  {
    title: "Fluxo de trabalho reprodutível (produção artesanal)",
    introduction:
      "Produção artesanal cooperativa não é improviso constante: reprodutibilidade vem de encadear etapas solventless numa ordem versionada que toda assembleia pode reler quando trocam voluntários.",
    body:
      "Fluxo típico educativo THCProce (ajustar à política local): matéria-prima preparada para rota gelo — lavagem quando aplicável — secagem de hash — curing jar quando previsto — pré-prensagem rosin — pós-cura em recipiente — envase final com código de lote e rótulo interno quando a coop assim exigir.\n\n" +
      "Pontos técnicos: rever SOP pelo menos trimestralmente quando equipamento modesto coop entra e sai ao longo do ano; registrar exceções (quebra elétrica, lote experimental) como nota de rodapé no livro lab, não como apagamento da versão anterior.\n\n" +
      "Erros comuns: pular secagem por pressa de calendário; copiar tutorial de rede social sem traduzir para documento interno coop; assumir que ‘artesanal’ dispensa identificação de lote.",
    objectives: [
      "Descrever uma cadeia mínima de blocos solventless artesanal em ordem racional cooperativa.",
      "Justificar revisão trimestral de fluxo quando inventário coop é volátil e voluntários rotativos.",
      "Apontar risco microbiológico e perceptivo quando se salta secagem documentada só por urgência temporal."
    ],
    closingSummary:
      "Fluxo reprodutível cooperativo é documentação viva revisitada pela assembleia — espontaneidade contínua sem registro destrói a promessa também no artesanal THCProce.",
    quiz: [
      Q("Eliminar deliberadamente a etapa secagem do hash por pressão de prazo coop introduz especialmente:", [
        "Potency garantido maior sempre",
        "Risco combinado de instabilidade hídrica residual e comportamento perceptivo errático nos lotes seguintes",
        "Eliminação automática da micronagem",
        "Licença de produção sempre"
      ], 1),
      Q("Revisão trimestral de SOP versionado coop beneficia cenários brasileiros com equipamento coop rotativo porque:", [
        "Substitui sempre o COA",
        "Equipamento e voluntários mudam: documento estático rápido fica mais inseguro que documento atualizado institucionalmente",
        "Elimina sempre uso de EPI",
        "Garante teor fixo mg sem laboratório"
      ], 1),
      Q("Comparar fluxo apenas com vídeo curto externo sem registro coop interno tende a:", [
        "Ser modelo cooperativo ideal automático",
        "Perder rastreio e melhoria contínua que só o documento assemblear institui",
        "Substituir licença elétrica local",
        "Eliminar sempre contaminação cruzada"
      ], 1)
    ],
    media: M.lab,
    materials: ["Diagrama de blocos fluxo solventless artesanal THCProce", "Modelo revisão trimestral SOP versionado coop"],
    references: ["Textos sobre gestão de qualidade artesanal", "Aulas anteriores deste curso — sequência solventless"],
    professorNotes:
      "Workshop rápido: alunos redesenham diagrama coop fictício no quadro usando post-its, sem obrigar coop real externa."
  }
];
