import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Cooperativismo medicinal — 10 aulas (manual THCProce; formação societária e governança — não substitui advogado, contador nem orientação sanitária de órgão competente). */
export const COOPERATIVISMO_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Modelos de associação e propósito social",
    introduction:
      "Associar-se para cultivar ou fornecer insumos com finalidade medicinal exige claridade sobre forma jurídica, missão declarada e limites da autonomia dos membros. A aula compara objetivos só para estudo dirigido ao diálogo com escritório jurídico.",
    body: `Em linhas gerais, cooperativas, associações sem fins lucrativos e outros arranjos comunitários coexistem legislativamente com requisitos diferentes de assembleia, distribuição de excedentes e accountability. Qualquer denominador comum válido deve escrever no estatuto: finalidade compatível com a lei vigente na jurisdição, transparência de cadastro societário quando permitido e vedação à captação de sócios mediante promessa médica miraculosa.

Pontos técnicos delimitação pedagógica: objeto social explícito; geografia pretendida das atividades apenas hipotética em exercício papel; código de ética associativo mínimo; separação conceptual entre coop de capital e coop democrática apenas referência econômica introdutória.

Erros comuns: repetir nomenclatura de ‘cooperativa medicinal’ vindas de outros países sem traduzir previsões legais locais absolutas; iniciar tesouraria antes de papel societário; prometer quotas de THC fixas para novos sócios.

Limitações: não escolhemos por si a forma ideal — apenas mapa lexical para consultoria.`,
    objectives: [
      "Distinguir finalidade econômica com distribuição de excedentes de arranjo associativo predominantemente não lucrativo em discussão panorâmica.",
      "Declarar por escrito objeto social fictício compatível apenas com cenário brasileiro genérico de estudo sala.",
      "Listar quatro perguntas iniciais a advogado sobre forma societária aplicável."
    ],
    closingSummary:
      "Propósito social mal redigido antecipa conflito — o estatuto e a assembleia são o passo seguinte para dar corpo às regras internas.",
    quiz: [
      Q("Copiar literalmente estatuto de cooperativa de outro país sem revisão local costuma:", [
        "Simplificar registro automaticamente",
        "Gerar incompatibilidades legais e risco societário elevado",
        "Substituir necessidade de contador",
        "Garantir licença sanitária"
      ], 1),
      Q("Objeto social precisa principalmente:", [
        "Ser genérico como ‘atividades diversas’ sem limites",
        "Descrever atividades permitidas e coerentes com ordenamento aplicável ao caso",
        "Substituir prescrição médica",
        "Eliminar assembleia"
      ], 1),
      Q("Promessa de retorno financeiro fixo a novos associados sem lastro estatutário tende a:", [
        "Ser neutra",
        "Conflitar com princípios cooperativistas e exposição jurídica",
        "Eliminar tributação sempre",
        "Substituir nota fiscal sempre"
      ], 1)
    ],
    media: M.theory,
    materials: ["Quadro papel três tipos associação hipotética fictícia", "Lista perguntas advogado societário genérica"],
    references: ["Textos introdutórios economia solidária genéricos", "Literatura compara LATAM apenas inspiração metodológica"],
    professorNotes:
      "Reforçar que exemplos são fictícios; nunca exibir dados reais de cooperativas identificáveis sem autorização por escrito."
  },
  {
    title: "Estatuto, assembleia e prestação de contas",
    introduction:
      "Estatuto fixa mandatos, quóruns e competências da assembleia. Prestação de contas regular mantém legitimidade quando dinheiro e insumos circulam entre pessoas com doenças sensíveis.",
    body: `Capítulos usuais: objeto, sede, filiação e desligamento, assembleia geral, diretoria, fiscalização interna, tesouraria, exercício social, dissolução educacional fictícia. Calendário assemblear com antecedência documentada reduz alegação de surpresa processual interna.

Pontos técnicos: ata com presença rastreável quando lei permitir meio eletrônico certo; deliberações sobre orçamento e limites de endividamento; registro de conflito de interesse antes de votação sensível exercício papel.

Erros comuns: votar contrato milionário só por mensagem grupo sem quorum; tesoureiro sem contrapartidas de segunda assinatura; não publicar relatório sintético anual mesmo quando estatuto exige apenas exercício simulacro.

Limitações: minutas modelo aqui apenas esqueletos pedagogia — revisão obrigatório profissional habilitado.`,
    objectives: [
      "Esboçar três trechos obrigatórios de ata de assembleia fictícia respeitando quórum simulado.",
      "Explicar função de conselho fiscal ou equivalente em cooperativa pequena hipotética.",
      "Propor calendário anual mínimo assembleia + prestação contas em painel A4."
    ],
    closingSummary:
      "Transparência assemblear sustenta confiança — produção associada exige amarrar responsabilidade solidária escrita.",
    quiz: [
      Q("Ata sem quorum documentado habitualmente enfraquece:", [
        "Somente etiqueta arquivo",
        "Validade deliberativa eventual litígio interno apenas exercício simulado papel",
        "Necessidade de laudo flor",
        "Uso apenas marketing externo sempre"
      ], 1),
      Q("Relatório sintético de caixa destinado aos associados costuma ajudar a:", [
        "Substituir imposto sempre",
        "Manter auditoria moral interna baseline transparência",
        "Eliminar assembleia seguinte sempre",
        "Substituir receita sempre"
      ], 1),
      Q("Votação eletrônica sem trilhas de segurança e autenticação adequadas segundo lei aplicável pode:", [
        "Ser sempre igual presencial",
        "Gerar questionamentos de legitimidade que advogado precisa endereçar caso a caso",
        "Eliminar estatuto",
        "Substituir registro cartorial sempre"
      ], 1)
    ],
    media: M.theory,
    materials: ["Modelo ata incompleta aluno deve fechar apenas fictício papel", "Checklist quorum deliberativo exercício papel"],
    references: ["Manuais de governança associativa introdutórios apenas", "Literatura accountability pequenas organizações apenas"],
    professorNotes:
      "Se possível projetar exemplo redigível em quadro antes de distribuir modelo incompleto."
  },
  {
    title: "Produção associada e responsabilidade solidária",
    introduction:
      "Quando várias pessoas compartilham espaço, energia, insumos ou equipamento, riscos sanitários e civis passam a ser coletivos. A solidariedade cooperativista não elimina deveres documentais.",
    body: `Mapa de risco: contaminação cruzada lotes; responsabilidade por produto final rotulado coletivamente; acidente de trabalho informal em área agrícola hipotética; descarte incorreto resíduos orgânicos químicos fictício exercício.

Pontos técnicos: SOP mínima cultivo compartilhado exercício sala; logbook compartilhado data hora evento; cláusula solidariedade limitada versus ilimitada apenas referência advogado necessária.

Erros comuns: misturar genéticas sem rastreio porque ‘somos amigos’; ignorar EPI documentado; contratar serviço terceiro sem contrato escrito.

Limitações: sem engenheiro agrônomo individual aqui — apenas alerta governança.`,
    objectives: [
      "Definir responsabilidade solidária em três frases aplicáveis cenário cultivo compartilhado fictício.",
      "Listar cinco riscos operacionais que documentação mitiga mas não zera.",
      "Propor cláusula exercício papel delimitando limites solidariedade orientação advogado externo."
    ],
    closingSummary:
      "Produção associada exige registro de quem fez o quê — na sequência, tratar da cadeia segura até o associado final com rastreio.",
    quiz: [
      Q("Responsabilidade solidária entre associados costuma implicar:", [
        "Que um membro nunca responde por ato de outro",
        "Que consequências de desvios podem recair coletivamente segundo estatuto e lei",
        "Dispensa total seguro sempre",
        "Elimina laudo laboratorial sempre"
      ], 1),
      Q("Logbook compartilhado de eventos de cultivo serve principalmente para:", [
        "Substituir receita",
        "Rastreabilidade operacional e apoio a investigação de não conformidade interna",
        "Publicidade Instagram obrigatória",
        "Substituir contrato fornecedor insumo"
      ], 1),
      Q("Misturar lotes sem identificação documentada tende a:", [
        "Simplificar compliance",
        "Perder capacidade recall explicar origem problema",
        "Eliminar necessidade assembleia",
        "Aumentar segurança automática"
      ], 1)
    ],
    media: M.theory,
    materials: ["Matriz risco x mitigação A3 fictícia coop", "Modelo logbook meia página campos mínimos"],
    references: ["Boas práticas documentação traceability agrícola introdutório", "Textos responsabilidade civil grupos pequenos apenas generalista"],
    professorNotes:
      "Evitar dramatizar acidentes reais; manter tom preventivo e encaminhar dúvidas jurídicas."
  },
  {
    title: "Distribuição segura e rastreio",
    introduction:
      "Levar produto ou insumo entre associados sem rastreio é convite à suspeita regulatória e à disputa interna. Mesmo cenários autorizados hipotéticos pedem cadeia documental mínima.",
    body: `Elementos típicos: código lote associação interna apenas exercício papel; etiqueta institucional treinamento sem marca comercial vivas sem licença; termo de entrega com identificação destinatário fictício protegendo privacidade máxima legal exercício; armazenamento temperatura quando produto exigir cold chain narrativa sala.

Pontos técnicos: segregação transporte terceiro habilitado quando lei exigir exercício; lacre fictício treino; registro motorista rota sem dados pessoais sensíveis reais.

Erros comuns: entregar volume sem registro porque ‘todos confiam’; compartilhar print conversa privada paciente em grupo; misturar caixas domésticas com rótulo doméstico não padronizado.

Limitações: curso não valida licença transporte real — apenas princípios.`,
    objectives: [
      "Montar fluxo documental A→B associado fictício com três marcos mínimos.",
      "Reconhecer tension privacy versus rastreio em transporte medicinal.",
      "Enumerar quando cold chain pedagogicamente obrigatório narrativa SKU hipotética."
    ],
    closingSummary:
      "Distribuição sem papel vira folklore — o triângulo médico‑associação‑paciente exige próximos marcos claros.",
    quiz: [
      Q("Ausência código lote interno apenas exercício papel costuma prejudicar:", [
        "Apenas cor da embalagem",
        "Recall explicativo e treinamento associação interna",
        "Imposto IPTU residencial",
        "Registro cartório imóvel"
      ], 1),
      Q("Compartilhar dados clínicos identificáveis associados WhatsApp aberto costuma:", [
        "Ser boa prática privacidade",
        "Violar princípios mínimos privacidade exercício discussão LGPD introdutória",
        "Substituir prescrição",
        "Eliminar assembleia"
      ], 1),
      Q("Transporte terceiro hipotético regulado exige principalmente:", [
        "Hashtag marketing",
        "Verificar com advogado requisitos licença seguro rastreio aplicáveis narrativa",
        "Eliminar nota interna associativa",
        "Substituir estatuto sempre"
      ], 1)
    ],
    media: M.theory,
    materials: ["Fluxograma entrega associado fictício sem dados reais", "Checklist privacidade transporte exercício papel"],
    references: ["Guias chain custody amostras introdutórios adaptáveis", "Resumos LGPD comunicação grupos pequenos apenas generalista"],
    professorNotes:
      "Proibir uso de nomes reais pacientes; inventar personagens com iniciais apenas."
  },
  {
    title: "Relação médico–associação–paciente (marcos)",
    introduction:
      "Cooperativa não substitui prescrição nem conduta médica. Marcos claros evitam que associados confundam assembleia com consultório ou marketing clínico.",
    body: `Papéis: médico responsável documentação clínica individual fora âmbito estatuto coop salvo função específica eventual exercício hipotético; associação fornece insumo ou serviço logístico não diagnóstico; paciente ou associado final respeita plano terapêutico e reporta eventos adversos canal formal saúde pública quando aplicável narrativa discussão.

Pontos técnicos: termo educativo separando conselho associativo de aconselhamento clínico proibido leigos exercício; canal denúncia conflito interesse médico fornecedor fictício; registro de patrocínio educação continuada médica transparente exercício papel.

Erros comuns: treinamento interno com linguagem ‘dosagem cura’ sem contexto clínico; pagamento médico por volume associado encaminhado — red flag ético discussão; assembleia votar esquema terapêutico coletivo.

Limitações: não interpretamos CFM/CRM locais linha a linha — encaminhar consulta ética médica formal fora curso.`,
    objectives: [
      "Redigir parágrafo fictício delimitando que assembleia não prescreve.",
      "Listar três conflitos éticos típicos remuneração médico fornecimento.",
      "Propor fluxo associado relata efeito adverso sem expor terceiros ilegalmente exercício papel."
    ],
    closingSummary:
      "Fronteira ética preserva paciente e médico — finanças saudáveis sustentam a missão sem misturar papéis.",
    quiz: [
      Q("Assembleia votar protocolo clínico detalhado para todos associados costuma ser:", [
        "Substituto legal prescrição",
        "Inadequado — decisões clínicas são individuais entre médico e paciente segundo quadro legal",
        "Melhor prática sempre",
        "Elimina CRM sempre"
      ], 1),
      Q("Associado leigo orientar ajuste posologia coletivo em chat interno tende a:", [
        "Ser exercício assistencial válido",
        "Conflitar com limites legais de exercício profissionais da saúde",
        "Substituir estatuto",
        "Eliminar necessidade receita"
      ], 1),
      Q("Transparência patrocínio educação médica visa reduzir:", [
        "Imposto sempre",
        "Conflitos de interesse e viés terapêutico induzido",
        "Necessidade assembleia",
        "Uso laudo laboratorial"
      ], 1)
    ],
    media: M.theory,
    materials: ["Diagrama triângulo três papéis cartolina", "Estudo caso conflito interesse fictício duas páginas"],
    references: ["Códigos ética medicina introdutórios leitura geral", "Literatura governança saúde comunidade apenas inspiração"],
    professorNotes:
      "Usar en-dash Unicode no título conforme outline institucional; checar renderização slides."
  },
  {
    title: "Finanças saudáveis em cooperativa pequena",
    introduction:
      "Caixa confuso destrói cooperativa antes de qualquer ação fiscal externa. Pequena escala exige disciplina: orçamento, conciliação bancária e separação patrimonial mínima orientada por contador.",
    body: `Instrumentos: planilha fluxo caixa semanal exercício; centros de custo simplificados cultivo processamento administração fictício; política empréstimo interno associados apenas discussão jurídica necessária; provisão manutenção equipamento.

Pontos técnicos: duas assinaturas bancárias acima limiar assembleia delibera exercício; conciliação cartão pix caixa físico narrativa; inventário insumos trimestral fictício.

Erros comuns: misturar conta pessoal líder com conta coop; ausência nota compra insumo; distribuir excedente antes fechar balanço exercício simulado.

Limitações: não elaboramos SPED nem declarações — contador obrigatório projeto real.`,
    objectives: [
      "Montar orçamento trimestral fictício três linhas receita cinco despesas.",
      "Explicar por que conciliação bancária mensal reduz fraude erro.",
      "Definir política assembleia aprovação compra acima limiar valor hipotético."
    ],
    closingSummary:
      "Finanças claras evitam desconfiança — conflitos inevitáveis pedem mediação transparente em seguida.",
    quiz: [
      Q("Misturar conta bancária pessoal do presidente com receitas da cooperativa costuma:", [
        "Simplificar auditoria",
        "Dificultar accountability e gerar risco societário fiscal",
        "Eliminar imposto sempre",
        "Substituir assembleia sempre"
      ], 1),
      Q("Orçamento aprovado assembleia serve para:", [
        "Substituir estatuto",
        "Guiar gastos e delimitar necessidade nova deliberação para extrapolações",
        "Eliminar conciliação bancária",
        "Substituir laudo laboratorial"
      ], 1),
      Q("Provisão manutenção equipamento busca:", [
        "Financiar marketing viral obrigatório",
        "Evitar parada súbita produção por falta caixa corretivo",
        "Substituir seguro sempre",
        "Eliminar registro receita"
      ], 1)
    ],
    media: M.theory,
    materials: ["Planilha fluxo caixa modelo vazio aluno preenche fictício", "Mini política duas assinaturas incompleta completar"],
    references: ["Introdução contabilidade terceiro setor genérica", "Artigos gestão caixa pequenas organizações apenas"],
    professorNotes:
      "Convidar contador convidado opcional segmento 15 minutos disclaimers não vinculante consultoria individual."
  },
  {
    title: "Mediação de conflitos e transparência",
    introduction:
      "Cooperativa pequena vive de confiança interpessoal — e de procedimentos para quando a confiança falha. Mediação estruturada reduz judicialização e abandono de membros.",
    body: `Etapas típicas educativas: conversa direta registrada resumo; mediação interna com facilitador neutro treinamento exercício; escalonamento conselho ética interno fictício; última instância arbitragem ou jurisdição conforme estatuto apenas menção advogado.

Pontos técnicos: prazo resposta acusação interna; direito contraditório mínimo; confidencialidade procedimento vs transparência assembleia sumário decisões agregadas sem expor saúde associado.

Erros comuns: expulsar membro por mensagem única grupo sem processo; permitir assédio para ‘não quebrar clima’; omitir ata conflito resolvido gerando repetição.

Limitações: mediador profissional externo aqui não substituído por role-play breve.`,
    objectives: [
      "Escrever procedimento conflito cinco passos linguagem acessível fictício estatuto anexo.",
      "Diferenciar mediação de punição disciplinar assemblear.",
      "Listar três sinais alerta toxicidade liderança pequena organização."
    ],
    closingSummary:
      "Conflitos bem conduzidos fortalecem missão — parcerias externas exigem governança equivalente com fornecedores.",
    quiz: [
      Q("Expulsão sumária sem contraditório documentado costuma:", [
        "Ser ideal cooperativismo",
        "Gerar risco jurídico interno e má fé percebida",
        "Eliminar necessidade estatuto",
        "Substituir receita médica"
      ], 1),
      Q("Mediação interna busca primariamente:", [
        "Humilhar parte acusada",
        "Restaurar diálogo com acordo escrito minimamente justo",
        "Substituir CRM médico",
        "Eliminar privacidade sempre"
      ], 1),
      Q("Transparência sobre decisões agregadas sem expor dado clínico sensível equilibra:", [
        "Somente marketing externo",
        "Accountability assembleia e privacidade associado",
        "Eliminação assembleia",
        "Substituição laudo laboratorial"
      ], 1)
    ],
    media: M.theory,
    materials: ["Roteiro role-play mediação 20 minutos duas partes fictícias", "Checklist toxicidade liderança discussão guiada"],
    references: ["Introdução mediação comunitária literatura geral", "Textos gestão conflitos ONGs pequenas apenas"],
    professorNotes:
      "Definir regras anti-injúria antes role-play; interromper se emocional real emergir."
  },
  {
    title: "Parcerias e fornecedores (governança)",
    introduction:
      "Cooperativa compra solo, energia, embalagem, serviços contábeis e laboratoriais. Cada contrato é risco reputacional e sanitário se due diligence falhar.",
    body: `Checklist fornecedor fictício: documentação regular básica exercício; visita quando possível só local demonstração escolar sem propriedade real; cláusula qualidade com amostragem entrada; SLA prazo comunicação falha crítica.

Pontos técnicos: segunda fonte estratégica insumo crítico narrativa concorrência coop; cláusula sustentabilidade verificável apenas exercício papel; compliance anticorrupção mini política coop micro.

Erros comuns: aceitar apenas indicação ‘de amigo’; contrato inglês ilegível associados PT-BR só; omitir SLA laboratório prazo resultado.

Limitações: auditoria campo real fornecedor não faz parte curso.`,
    objectives: [
      "Montar checklist cinco perguntas fornecedor antes assinar página única fictícia.",
      "Explicar benefício segunda fonte insumo estratégico.",
      "Reconhecer risco anticorrupção mesmo microescala certas compras públicas apenas discussão marginal."
    ],
    closingSummary:
      "Governança de fornecedor protege todos associados — escalonar sem perder missão será o tema de encerramento de ciclo intermediário.",
    quiz: [
      Q("Aceitar único laboratório sem SLA escrito habitualmente aumenta:", [
        "Auditabilidade perfeita",
        "Risco atrasos laudo lotes travados apenas exercício papel",
        "Neutralidade tributária garantida sempre",
        "Substituição estatuto automática sempre"
      ], 1),
      Q("Visita prévia espaço produtivo quando possível educacional permite:", [
        "Substituir contrato sempre",
        "Verificar compatibilidade básica processos segurança documentação visual exercício papel",
        "Eliminar assembleia seguinte sempre",
        "Substituir receita sempre"
      ], 1),
      Q("Segunda fonte insumo estratégico coop busca sobretudo:", [
        "Aumentar burocracia sem motivo",
        "Resiliência se fornecedor primário falhar preço ou qualidade",
        "Eliminar tesouraria",
        "Substituir prescrição"
      ], 1)
    ],
    media: M.theory,
    materials: ["Template SLA laboratório frases incompletas aluno fecha fictício", "Matriz decisão dois fornecedores papel"],
    references: ["Guias procurement pequenas organizações introdutórios apenas", "Textos anticorrupção microempresa apenas panorama"],
    professorNotes:
      "Nunca pressionar usar nome laboratório real concorrentes; cenários marca neutra THCProce interna apenas."
  },
  {
    title: "Escalonamento sem perder a missão",
    introduction:
      "Crescer associações com finalidade medicinal traz especialização, hierarquia e pressão de mercado. A missão precisa guiar decisões sobre produtos, geografias e tecnologias — especialmente em exercícios de planejamento em sala.",
    body: `Sinais saudáveis de expansão (no cenário fictício): metas de número de associados proporcionais à capacidade física de cultivo ou processamento; investimento paralelo em governança e formação de dirigentes proporcional ao aumento do volume operado.

Pontos técnicos: folha‑de‑roteiro com três cenários de crescimento; revisitar periodicamente em assembleia o texto da missão (sugestão pedagógica); comitê ou grupo de trabalho sobre inclusão para reduzir o risco de exclusão de grupos marginalizados quando o ritmo de expansão acelera.

Erros comuns: aceitar novo sócio sem onboarding à cultura da cooperativa; aumentar apenas o marketing sem reforço proporcional da documentação de qualidade; copiar a agressividade de startups de alto risco pouco compatível com o modelo associativo cooperativo típico.

Limitações: o planejamento estratégico aprofundado é assunto para consultoria externa ao âmbito deste manual THCProce.`,
    objectives: [
      "Descrever dois indicadores alinhados à missão frente a métricas de vaidade em marketing.",
      "Propor checklist de onboarding de novo associado em uma página fictícia.",
      "Debater o compromisso entre abrir um novo polo geograficário e preservar rede de apoio à comunidade atual."
    ],
    closingSummary:
      "Crescimento desalinhado corrói coop — checklist final consolida práticas responsáveis antes de projeto real.",
    quiz: [
      Q("Contagem de seguidores em redes, isolada da governança e da segurança jurídica da cooperativa, costuma:", [
        "Demonstrar coop saudável financeiro sempre",
        "Ocultar risco de reputação quando novos sócios entram sem integração clara aos deveres e limites legais",
        "Substituir conciliação bancária sempre",
        "Eliminar necessidade médico coop"
      ], 1),
      Q("Revisitar declaração missão anos pares sugere apenas pedagógico:", [
        "Eliminar assembleia sempre",
        "Detetar desvios das decisões em relação aos valores e finalidades escritos originalmente — exercício reflexivo em sala",
        "Substituir laudo sempre",
        "Neutralizar tributos sempre"
      ], 1),
      Q("Onboarding estruturado novo associado reduz principalmente:", [
        "Necessidade estatuto",
        "Reduzir expectativas ilegais ou antiéticas já na primeira semana de vínculo",
        "Necessidade contador sempre",
        "Substituir atualização obrigatória do estatuto após apenas uma semana de vínculo",
      ], 1)
    ],
    media: M.theory,
    materials: ["Canvas missão objetivos KPIs papel flipchart apenas exercício sala", "Modelo onboarding bullet lista incompleta"],
    references: ["Literatura scaling social enterprise introdutória apenas", "Textos valores organizacionais apenas inspiração"],
    professorNotes:
      "Discussão sobre valores pode ser sensível; convém um mediador neutro para evitar deriva político‑partidária excessiva em sala.",
  },
  {
    title: "Checklist cooperativismo medicinal responsável",
    introduction:
      "Última aula: síntese em formato de checklist, para rever antes de lançar um projeto real com apoio de advogado, contabilidade e equipe sanitária.",
    body: `Eixos a rever em sala — exemplificativos: documentação societária (estatuto, assembleia e atas); segurança e rastreio no campo com POPs escritas simplificadas e registros de lote quando o exercício assim prescrever; tesouraria com conciliação mensal acompanhada por profissional de contabilidade; linha ética entre atividades administrativas da associação e conduta clinicamente decisória dos médicos quando forem sócios; comunicações conforme a LGPD e canais definidos quando existir relatório sobre evento passível de integrar prontuário.

Revisões transversais: documentar antes de assembleias sensíveis os conflitos de interesse relevantes; elaborar apenas em papel um plano hipotético caso um lote seja suspenso ou recolhido; num projeto real, perguntar a corretora ou corretor de seguros que tipos de cobertura são prudentes segundo a jurisdição — apenas panorama de alto nível, sem prescrever apólices.

Erros graves que o checklist quer evitar: projeto informal sem base estatutária; comunicações públicas com narrativa de cura garantida; tesouraria que não oferece contas suficientemente claras aos associados (cenário papel para discussão).

Este checklist não certifica conformidade legal real; sintetiza apenas a formação.`,
    objectives: [
      "Preencher em sala modelo de checklist de cerca de trinta ítens (sem dados identificáveis de terceiros).",
      "Escolher três lacunas a tratar primeiro com consultoria profissional no mundo real.",
      "Aceitar compromisso ético: dados pessoais ou clínicos usados apenas em fictícios de sala não são repostos nas redes nem em grupos externos sem autorização específica",
    ],
    closingSummary:
      "Guarde esta lista e revise‑a pelo menos uma vez por trimestre em qualquer piloto em papel — cooperação responsável exige sempre leis atualizadas e especialistas externos alinhados ao projeto concreto.",
    quiz: [
      Q("O checklist deste manual substitui due diligence jurídica ou fiscal de projeto de grande investimento?", [
        "Sim, porque faz parte da formação THCProce",
        "Não — é mapa de estudo para orientar perguntas a profissionais habilitados no mundo real",
        "Sim se a assembleia for unânime",
        "Somente quando a cooperativa usar marca verde"
      ], 1),
      Q("Rever o checklist internamente ao fim de cada trimestre procura sobretudo:", [
        "Substituir mensalmente o contabilista obrigatoriamente",
        "Detectar mais cedo novos riscos de governança ou conformidade antes de ganharem proporção maior",
        "Eliminar dever de proteção da privacidade dos associados",
        "Eliminar obrigatoriedade de laudos laboratoriais sempre"
      ], 1),
      Q("Comunicar evento adverso potencialmente ligado ao uso de produto deve, em primeiro lugar, seguir:", [
        "Discussão num grupo público de mensagens instantâneas",
        "Orientação médica e canal definido pela equipe de saúde segundo normas aplicáveis — em sala apenas simulacro",
        "Votação imediata em assembleia para decidir causa",
        "Campanha de marketing institucional aberta sobre o caso"
      ], 1)
    ],
    media: M.theory,
    materials: ["Folha A4 modelo checklist trinta lacunas pré‑impressão checkbox caneta papel exercício sala", "Auto‑avaliação final de cinco perguntas de fecho"],
    references: [
      "Confronto tema a tema com o outline `cooperativismo` definido em `src/data/courseOutlines.ts`",
      "Materiais de encaminhamento a advogado e contabilista mantidos pelo próprio estudante ou pela instituição conveniada"
    ],
    professorNotes:
      "Preferir trabalho offline com caneta papel para o checklist final; fechar em tom sóbrio reforçando que a formação não confere autorização legal nem sanitária."
  }
];
