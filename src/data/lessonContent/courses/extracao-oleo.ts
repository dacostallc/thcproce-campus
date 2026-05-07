import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Extração / óleo medicinal — 10 aulas THCProce (formulação educativa; não substitui prescrição nem licença regional). */
export const EXTRACAO_OLEO_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Panorama: RSO, FECO, tinturas e óleo MCT",
    introduction:
      "O curso trabalha óleos e tinturas como formulações coop com identidade de lote e leitura de COA onde existir política institucional. Antes das contas aparece léxico técnico: RSO e FECO têm uso histórico e comercial heterogêneo; tintura não é sinónimo suspensão em óleo; MCT muda apenas a física da dose volumétrica, não autoriza ignorar segurança clínico-legal.",
    body:
      "RSO refere-se habitualmente a óleos muito concentrados associados receitas históricas públicas; FECO sugere extrato filosoficamente “mais inteiro”, porém a etiqueta não substitui ficha método com solvente, trajetória térmica e código de lote deliberado pela assembleia.\n\n" +
      "Tinturas etanólicas ou glicerinadas solubilizam parcelas mais polares que suspensões em óleo. Perfis aromáticos decaem conforme barreira de permeação vidro‑vedação e atmosfera interna — o projeto de envase integra registro auditável do lote deliberado internamente.\n\n" +
      "Triglicerídeos de cadeia média (MCT) reduzem viscosidade e facilitam dosagem volumétrica repetível com equipamento calibrado no protocolo. Indicar mg/ml só mediante análise laboratorial quando a assembleia exige COA, ou mediante estimativa interna com margem de erro declarada — nunca por rótulo promocional.",
    objectives: [
      "Contrastar tinturas alcoólicas ou glicerinadas com suspensões lipídicas em MCT como projetos de matriz fisicoquímica distintos.",
      "Justificar ficha de método e lote quando rótulos externos usam FECO ou RSO de modo historicamente ambíguo.",
      "Reafirmar que o módulo é educação em formulação e documentação — sem prescrição clínica nem substituição de licenciamento sanitário regional."
    ],
    closingSummary:
      "Nomear bem a formulação coop documenta método e solvente oficial antes das contas; rótulos de internet não bastam quando o lote seguinte precisa repetir trajetória real.",
    quiz: [
      Q("Tintura alcoólica e óleo em MCT são categorias distintas principalmente porque:", [
        "O COA sempre ignora solvente porque canabinoides idênticos",
        "Polaridade do veículo e estabilidade relativa dos voláteis mudam o projeto cooperativo",
        "MCT elimina sempre toda decarboxilação necessária",
        "Tintura obrigatoriamente dispens winterização sempre"
      ], 1),
      Q('Rótulo apenas "FECO" sem método escrito habitualmente obriga a:', [
        "Ignorar rastreamento de micronagens solventless",
        "Documentar método e matriz reais porque a nomenclatura comercial oscilou historicamente no mercado",
        "Substituír sempre relatório COA por rótulo comercial apenas",
        "Garantir mg/ml fixos sem laboratório em qualquer cenário"
      ], 1),
      Q("Papel institucional do aluno neste módulo THCProce é:", [
        "Atuar como médico prescritor fora do âmbito académico definido pela escola",
        "Estudar formulação cooperativa documentada sem assumir papel clínico prescritivo",
        "Operar hexano improvisado em cozinha doméstica",
        "Emitir garantia analítica de COA sem laboratório credenciado"
      ], 1)
    ],
    media: M.lab,
    materials: ["Quadro léxico RSO FECO tinturas óleos MCT", "Modelo ficha método por lote coop fictício"],
    references: ["Textos sobre categorias de óleos de cannabis em contexto cooperativo", "Módulo Medicina THCProce — fronteira educação / conduta clínica"],
    professorNotes:
      "Disclaimer oral: o curso não autoriza extração doméstica ilegal na região do aluno; trabalhar só cenários fictícios de assembleia."
  },
  {
    title: "Decarboxilação com medição e segurança",
    introduction:
      "Decarboxilação libera formas neutras a partir dos ácidos THCA e CBDA por tempo, temperatura e estado higroscópico da matriz. Sem registo instrumentado a operação vira anedota de forno — o lote seguinte não reproduz e o COA deixa de conversar com o processo.",
    body:
      "Display interno de forno ou banho-maria mede ar ou metal da câmara, não sempre o núcleo da carga flor processada granular. Probe externo homologável em contato próximo da matriz coop três marcações horárias mínimas no protocolo modelo THCProce fecham curva térmico auditável.\n\n" +
      "Pontos térmicos: rampa rápida + patamar longo degrade canabinoides e terpenóides alvo coop patamar curto + subtemperatura deixa ácido residual documentável em laboratório comparando lote A versus lote B.\n\n" +
      "Erros típicos: confundir odor perceptivo forte com conversão uniforme até o centro do bolo; operar sem exaustão adequada à norma local quando fumos ou aerossóis surgem; misturar lotes distintos antes de medir umidade inicial.",
    objectives: [
      "Explicar por que sonda externa e registo temporal superam o display do equipamento em contexto cooperativo.",
      "Relacionar perfis térmicos com degradação química versus conversão incompleta verificável em COA.",
      "Listar requisitos mínimos de ventilação e EPI conforme política escolar e legislação regional aplicável."
    ],
    closingSummary:
      "Decarboxilação cooperativa exige curva tempo-temperatura-humidade documentada; cor ou cheiro isolados não substituem prova analítica.",
    quiz: [
      Q("Por que sonda externo próximo da matriz costuma ser preferível ao display interno do forno?", [
        "Display mede sempre o núcleo real da carga",
        "O sensor interno referencia câmara vazia ou ar, enquanto a carga real pode divergir",
        "Sonda torna obrigatório laboratório HPLC próprio sempre",
        "Display ignora sempre decarboxilação"
      ], 1),
      Q("Conversão termica incompleta costuma aparecer posteriormente como:", [
        "Aumento automático garantido apenas de terpenos",
        "Frações ácidas remanescentes detectáveis em COA quando amostra reflita o mesmo lote",
        "Ausência sempre de qualquer cannabinoide",
        "Eliminação de necessidade COA coop"
      ], 1),
      Q("Fumos durante decarboxilação labouratório educativo devem:", [
        "Dispensar sempre qualquer tubulação apenas marketing",
        "Obedecer exaustão e EPI segundo normativa local coop política escolar aplicável coop",
        "Substituir sempre registo lote",
        "Garantir prescrição clínica automática coop"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo THCProce registro três leituras temperaturahora decarb fictício coop", "Checklist coop ventilação decarb apenas educativo coop"],
    references: ["Textos físico-químicos decarboxilação canabinoides", "Normativa local coop exaustão laboratório apenas referência coop"],
    professorNotes:
      "Se política barrar aquecimento real, simular apenas curvas papel sem matéria vegetal."
  },
  {
    title: "Extração com solvente: risco e ventilação",
    introduction:
      "Etanóis e hidrocarbonetos usados em extração são inflamáveis coop exigir engenharia de exaustão, detecção coop treinadores habilitados. O módulo classifica riscos educativamente coop nunca ensina operação doméstica ilegal.",
    body:
      "Vapor acumulado abaixo limite inferior explosividade coop ignição estática pode deflagrar coop câmara mal dimensionada coop extensão elétrica improvisada coop extintor inadequado coop assembleia coop educativa coop.\n\n" +
      "Pontos legais: licenças ambientais sanitárias bombeiros variam coop extração etanol industrial coop laboratório coop credenciado coop estudante THCProce coop observador coop documentação coop risco coop apenas conceitual coop fictício coop.\n\n" +
      "Erros comuns: copiar vídeo internet sem traduzir FDS solvente local; confundir curso educativo com autorização produção caseira; negligenciar aterramento equipamentos metálicos área classificada fictícia assemblear apenas exercício coop.",
    objectives: [
      "Descrever acumulação vapor inflamável ignição estática como risco central extração solvente.",
      "Distinguir cenário laboratório licenciado regionalmente de exercício académico conceitual THCProce.",
      "Identificar importância FDS treinamento detectores gás quando cooperativa real operar — fora escopo operação aluno."
    ],
    closingSummary:
      "Solvente organiza risco físico coop vapor concentração coop ignição coop — improvisação doméstica coop paralelo licenciamento profissional coop vetada institucionalmente THCProce.",
    quiz: [
      Q("Risco central cooperativo extração solvente inflamável coop:", [
        "Sempre eliminado porque etanol cheira forte coop",
        "Acumulação vapor inflamável ignição estática coop engenharia exaustão inadequada coop coop",
        "Só aparece coop hexano coop nunca etanol coop",
        "Dispensável se janela aberta apenas marketing coop"
      ], 1),
      Q("Laboratório real extração coop solvente coop exige principalmente coop:", [
        "Influencers solventless coop apenas marketing coop Instagram coop",
        "Projeto coop exaustão explosividade conforme licença competente coop norma coop regional coop — não vídeo coop internet coop apenas coop coop",
        "Apenas rosin apenas solventless apenas sempre apenas",
        "Substituír sempre COA automaticamente apenas coop"
      ], 1),
      Q("Módulo THCProce papel aluno solvente coop apenas:", [
        "Operação doméstica improvisada coop hexano coop cozinha coop ilegal coop",
        "Educação conceitual risco coop coop sem ensinar método coop doméstico coop não coop licenciado coop fictício apenas assembleia educativa apenas",
        "Substituír licença profissionais externos coop sempre coop",
        "Emitir garantia coop potency coop sempre coop sem coop COA coop"
      ], 1)
    ],
    media: M.lab,
    materials: ["Ficha classificadores inflamabilidade VLE fictício apenas educativo coop", "Diagrama apenas cascata coop ar coop fresco apenas normativa coop apenas referência apenas"],
    references: ["Fichas coop dados coop segurança solventes apenas referência apenas", "Normas coop engenharia coop exaustão coop explosiva apenas referência coop regional apenas"],
    professorNotes:
      "Repetir coop oralmente coop demo coop vídeo coop solvente coop real coop vetada coop projeto coop legal coop apenas fictício papel coop apenas coop."
  },
  {
    title: "Padronização aproximada mg/ml e diluições",
    introduction:
      "Declarações de mg/ml em frascos formulados obrigam a escrever o método: como se chegou à massa alvo, ao volume nominal e ao intervalo de confiança quando não há relatório externo obrigatório.",
    body:
      "Diluir concentrado para banda alvo de concentração amplifica erro se massa inicial de cannabinoides for desconhecida: qualquer conta bonita só tem valor pedagógico se a assembleia registar estimativa ± faixa declarada até chegar COA de óleo quando a política cooperativa assim delibera.\n\n" +
      "Homogeneização com aquecimento suave repetível antes de segunda ou terceira diluição exige registar tempo, temperatura máxima, agitação e versão de protocolo no livro-operacional coop fictício do exercício.\n\n" +
      "Erros correntes são transportar teor de COA de flor diretamente para óleo final ignorando eficiência de extração perdas solvente clarificação térmicas; fusionar dois códigos de lote diferentes sem ata assemblear antes renumerar cálculos.",
    objectives: [
      "Montar série numérica fictícia de diluições e qualificar propagated incerteza em linguagem coop sem prometer resultado clínico.",
      "Contrastar rótulos comerciais de mg/ml 'nominal' contra mg/ml declarados mediante COA obrigatório política coop.",
      "Demonstrar porque misturar lotes silenciosamente invalida ficha interna mesmo matemática corretamente copiada planilhas."
    ],
    closingSummary:
      "mg/ml confiável combina método escrito com incerteza explícita; quando a política exige COA, o laboratório valida aquilo que a planilha não pode garantir.",
    quiz: [
      Q("Ao diluir concentrado cuja massa alvo inicial é desconhecida, típico ocorrer:", [
        "A planilha reduz sempre o erro sem precisar documentar mais nada",
        "A incerteza relativa de mg/ml cresce e deve ficar registada ou levar a novo ensaio",
        "A homogeneização deixa de ser necessária após segunda diluição",
        "O rótulo do lote deixa de importar porque o volume aumentou"
      ], 1),
      Q("O teor de cannabinoides do COA de flor bruta garante igual teor no óleo final quando:", [
        "Marketing externo garante extracção igual percentual sempre",
        "Rendimento de extração perdas solvente tratamentos térmicos alteram o balanço de massas real",
        "COA coop flor coop ignora coop sempre extracção coop",
        "Winterização aumenta proporcional sempre THC relatório flor coop"
      ], 1),
      Q("Segunda e terceira diluição no protocolo exigem que se registe especialmente:", [
        "Somente hashtags promocionais redes sociais coop",
        "Temperatura máxima tempo agitação e versão de protocolo decidida coop assembleares coop",
        "Eliminação rótulos lote sempre coop coop",
        "Prescrições clínica automática estudantes coop"
      ], 1)
    ],
    media: M.lab,
    materials: ["Planilha diluições mg/ml cenário fictício classe propagacao erro apenas educativo apenas", "Modelo declaração incerteza interna assembleares apenas fictício apenas apenas"],
    references: ["Textos introdutórios propagação de erro em diluições", "Módulo Laboratório — interpretar teor matriz flor versus processados"],
    professorNotes:
      "Trabalhar somente valores fictícios assembleares — nunca dosagens reais de pacientes."
  },
  {
    title: "Filtragem, clarificação e winterização (conceito)",
    introduction:
      "Filtração grossa ou fina separa material insolúvel; clarificação reduz dispersões que turvam óleos; winterização coop resfrio controlado coop solubilidade menor lipídes ceras coop matriz coop diluído solvente coop — coop curso coop apresenta só conceitos coop coop laboratório licenciado coop executa coop quando coop políticas assembleares aplicáveis coop externo coop apenas.",
    body:
      "Grau papel celuloses membranas escolhas dependem coop viscosidade temperatura coop matriz coop — coop vácuo excessivo coop filtro saturado coop gera coop sucção coop turbulenta coop risco coop cruzamento inadvertido coop duas coop fracções coop lote coop distintos coop apenas deliberado coop assembleares coop apenas.\n\n" +
      "Winterização documenta rampas de temperatura, tempos de permanência e decisão registada coop assembleares coop fictícias apenas exercício papel porque altera também retenção de voláteis — trade‑off organolético apenas educativo.\n\n" +
      "Aparência coop visual coop limpa coop nunca coop substitui relatório coop COA coop contaminantes químicos microbiológicos detectáveis coop laboratório externo coop aplicável coop políticas assembleares coop apenas.",
    objectives: [
      "Nomear diferença entre retenção mecânica precipitações frias winterização apenas conceitos educativos assembleares apenas fictício apenas apenas.",
      "Relacionar parâmetros coop temperatura tempo precipitações frias coop documentação coop versões protocolo apenas assembleares fictícias educativas apenas apenas.",
      "Reconhecer limitações apenas sensorial coop visual coop frente laboratório analíticos externo apenas aplicável políticas assembleares apenas apenas."
    ],
    closingSummary:
      "Clarificar visual coop roadmap coop apenas primeiro coop passo coop confiável coop relatório coop analítico coop COA coop laboratório externo coop aplicável coop políticas assembleares coop apenas apenas.",
    quiz: [
      Q("Winterização conceitual coop busca habitualmente coop:", [
        "Aumentar coop sempre potency THC apenas marketing apenas",
        "Resfriar precipitar coop lipídeo coop cera coop soluções cooperativamente reduzindo viscosidades indesejáveis apenas educativo apenas",
        "Substituír sempre coop decarb coop",
        "Eliminar coop sempre coop papel filtros papel coop sempre coop"
      ], 1),
      Q("Vácuo excessivo coop filtro saturado clog coop coop risco operacional típico coop porque coop:", [
        "Sempre aumenta rendimento extracção apenas marketing apenas apenas",
        "Sucção turbulenta coop mistura fracções coop operador coop pressiona assembleares apenas deliberadas coop apenas",
        "Elimina coop microorganismos coop sempre coop coop",
        "Substituí coop relatório coop COA coop sempre coop coop"
      ], 1),
      Q("Aparência coop visual coop límpida coop substitui totalmente coop relatório coop COA coop:", [
        "Sempre relatório coop COA coop laboratório externo aplicável políticas assembleares coop",
        "Nunca relatório coop COA coop porque só laboratório detecta coop contaminantes químicos microbiológicos apenas aplicável políticas assembleares coop apenas apenas",
        "Marketing externo obrigacao estudantes coop apenas coop apenas",
        "Prescrições clínicas automáticas sempre coop apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Fluxogramas filtragem coop clarificações coop precipitações frias apenas exercício papel fictício apenas apenas", "Tabela coop parâmetro temperatura tempo winterização apenas fictício apenas educativo apenas apenas"],
    references: ["Textos extracção coop lipidos ceras apenas referência apenas apenas", "Módulo Laboratório COA — contaminantes apenas leitura apenas apenas"],
    professorNotes:
      "Demonstração papel quadro apenas — sem vídeo coop laboratorio coop real coop solvente coop sem projeto legal coop apenas fictício papel apenas apenas."
  },
  {
    title: "Envase, rótulo e data de validade (lógica)",
    introduction:
      "A escolha de frasco, rótulo e datas fecha o circuito de auditoria do lote: material deve mitigar luz UV conforme projeto, cabeço‑air residual segue valores da assembleia e validade comunicada deve apoiar‑se em registo coop estabilidade coop não apenas slogan coop marketing coop externos coop apenas referências educativo coop.",
    body:
      "Reduzir o cabeço‑air habitualmente diminui superfície de contacto gás‑volátil e desacelera oxidações comparativamente a recipientes apenas meios vazios — o valor deve constar como limite aceitável nas atas assembleares do exercício fictício.\n\n" +
      "Data de validade combina relatórios de estabilidade quando um laboratório externo e política da assembleia o exigirem; sem ensaios, estimativa conservadora registada em ata educativa fictícia.\n\n" +
      "Evitar reuso de embalagens alimentares com resíduos químicos desconhecido omitindo código lote fabricação método coop marketing apenas externos apenas apenas.",
    objectives: [
      "Listar critérios materiais frascos coop rótulos proteção luz voláteis alvo registo assemblear fictício apenas educativo.",
      "Construir modelo rótulo interno fictício com lote método fabricação validades lógicas apenas assembleares educativas apenas apenas.",
      "Distinguir prazo só marketing externo atas assembleares coop estabilidade coop apenas fictício apenas educativo apenas apenas."
    ],
    closingSummary:
      "Rótulo consciente liga método lote validades lógicas utilizador coop rastreabilidade apenas educativo — slogans externos coop não coop substituem método deliberado coop assembleares apenas apenas.",
    quiz: [
      Q("Vidro âmbar ou cobalto reduz habitualmente:", [
        "Altera potency independentemente da luminosidade",
        "Reduz fotooxidação de voláteis sensíveis à luz UV",
        "Elimina coop microorganismos sempre coop coop",
        "Substituí coop COA sempre coop"
      ], 1),
      Q("Headspace coop ar coop elevado coop frasco coop encerrado coop tende coop:", [
        "Sempre aumentar apenas terpenos desejados sempre coop apenas marketing coop apenas",
        "Aumentar oxidação coop voláteis coop percepção coop envelhecimento coop acelerando coop relatório coop sensorial apenas comparativo apenas educativo apenas",
        "Elimina coop sempre necessidade coop rótulo coop lote coop",
        "Substituí coop sempre winterização apenas coop apenas"
      ], 1),
      Q("Validade apenas marketing slogan externo coop sem ata assemblear coop coop documentação coop estabilidades coop coop:", [
        "Modelo ideal sempre cooperativa sempre aplicável coop sempre coop",
        "Insuficiente coop frente coop boas coop práticas coop documentação coop lote método coop atas assembleares fictícias educativas apenas",
        "Elimina coop laboratório externo coop sempre coop",
        "Substituí coop sempre prescrições clínicas automaticamente apenas coop apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo coop rótulo coop interno coop fictício apenas lote coop método coop fabricação apenas educativo apenas", "Checklists materiais coop frascos vedantes resistências UV apenas referência apenas"],
    references: ["Textos estáveis coop formulações coop lipídicas apenas referências apenas apenas", "Módulo Legislação — rótulos cooperativos aplicável regional apenas referência apenas"],
    professorNotes:
      "Comparar coop rótulo coop exemplo coop mercado coop externo coop fictício apenas versus coop modelo coop coop interno apenas assembleares apenas educativo apenas apenas."
  },
  {
    title: "Documentação e responsabilidade (não prescrição)",
    introduction:
      "Cooperativa documenta método lote matéria entrada saídas responsáveis contacto emergência disclaimers apenas educativo THCProce apenas — papel prescritivo coop médicos coop coop aplicáveis coop regiões coop apenas external coop apenas aplicáveis apenas coop paralelo apenas educação apenas apenas.",
    body:
      "Livro coop operacional coop mínimos coop coop campos coop entrada coop matéria coop prima coop COA coop flor coop método coop extracção coop fictício coop apenas educativo apenas versão coop decarb coop envase coop transporte apenas exercício papel coop apenas apenas.\n\n" +
      "Conteúdo coop educativo THCProce coop coop proíbe coop textos coop sugerindo coop dosagens coop clínicas coop nominais coop pacientes coop reais coop — coop cooperativas coop reais coop obedecem coop prescrições coop médicas coop coop rótulos coop regulamentos coop sanitários apenas regional aplicável apenas referência apenas.\n\n" +
      "Erros coop coop confundir coop certificado coop cursista THCProce coop coop com coop licenciamento coop produção extracção coop regional coop coop aplicável coop licenças apenas externas apenas apenas.",
    objectives: [
      "Enumerar coop campos mínimos coop livro operacional apenas fictício apenas educativo extracção apenas assembleares apenas apenas.",
      "Explicar coop distinção coop educação formulação coop documentação coop versus coop papel coop prescritório coop médico apenas aplicável apenas regiões apenas apenas externas apenas apenas apenas.",
      "Identificar coop risco coop legal coop coop reputacional coop confundir coop certificado coop curso coop com coop licenciamento coop produção extracção apenas regional aplicável apenas externo apenas apenas."
    ],
    closingSummary:
      "Documentação coop honesta coop limita papel cursista apenas educativo formulação apenas — coop prescrever coop coop competência coop médicos coop apenas aplicável coop apenas regiões coop apenas externas coop apenas apenas.",
    quiz: [
      Q("Manual operacional apenas fictício educativo coop deve coop incluir coop principalmente coop:", [
        "Prescrições clínicas automáticas mg pacientes reais apenas marketing coop apenas",
        "Versão método lote entrada saídas responsáveis contacto disclaimers apenas educativos apenas exercício papel apenas fictício apenas",
        "Propaganda coop marketing Instagram coop obrigatória apenas coop apenas",
        "Substituír licença regional produção extracção apenas aplicável apenas externas apenas apenas"
      ], 1),
      Q("Curso THCProce coop proíbe explicitamente coop textos coop sugerindo coop:", [
        "Identificadores lote internos coop assembleares apenas educativos apenas",
        "Dosagens clínicas nominais coop pacientes reais apenas marketing coop apenas",
        "Ventilações solventes conceituais educativos apenas apenas",
        "Rótulos internos método fictício assembleares apenas educativos apenas apenas"
      ], 1),
      Q("Certificado cursista coop THCProce coop igual coop:", [
        "Sempre igual licenciamento extracção coop regional apenas aplicável apenas externas apenas apenas",
        "Comprovação formação apenas educativa — não substituí licenciamento extracção apenas regional apenas aplicável apenas externas apenas apenas",
        "Substituír sempre COA apenas laboratório externo apenas aplicável apenas assembleares apenas apenas",
        "Substituír sempre papel médicos prescritores apenas aplicável apenas apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo coop livro operacional apenas fictício apenas campos método lote apenas educativo apenas", "Checklist disclaimers apenas educação apenas apenas prescritória apenas proibido apenas apenas"],
    references: ["Módulo Medicina coop limites coop educativo coop coop", "Marcos legais regionais extracção apenas referência apenas externa apenas apenas"],
    professorNotes:
      "Role-play assembleares fictício coop corrigindo coop formulário coop aluno coop propõe texto coop prescrição coop — coop corrigido coop apenas educativo apenas apenas."
  },
  {
    title: "Interações gerais e prudência clínica (educação)",
    introduction:
      "Canabinoides são metabolizadas por enzimas do citocromo P450; interações e prudências clínicas são temas educativos aqui coop nunca substituem diagnóstico ou prescrição coop médicos regiões aplicáveis externas apenas referência educativa apenas.",
    body:
      "Titulações prudentes coop documentadas coop coop prescritoras coop apenas médicas coop apenas aplicável coop apenas regiões coop apenas externos apenas — coop coop estudante apenas cataloga apenas classes coop exemplo coop benzodiazepínicos coop anticoagulantes coop antifúngicos apenas educativo apenas referência apenas sem dosagens apenas nominais apenas pacientes reais apenas.\n\n" +
      "Papel coop assembleares fictícias educativas apenas coop coop encaminhar coop usuários coop coop profissionais coop coop saúdes coop apenas aplicável coop apenas regiões coop apenas externos apenas quando coop relatam coop sintomas coop adversos apenas hipotéticos apenas apenas educativo apenas.\n\n" +
      "Erros coop ensino coop propor coop ajustes coop miligramas coop clínicos coop nominais coop pacientes coop reais apenas marketing coop apenas rótulos externos apenas apenas.",
    objectives: [
      "Nomear famílias de fármacos citadas apenas como exemplo educativo coop sem dosagens nominativas coop pacientes coop reais coop.",
      "Descrever encaminhamento coop profissionais de saúde legalmente aplicáveis quando cenário hipotético relatório coop sintomas coop adversos coop.",
      "Reconhecer risco coop misturar educação coop coop com recomendações miligramagens clínicas nomeadas coop coop pacientes coop reais apenas marketing coop apenas rótulos externos apenas apenas."
    ],
    closingSummary:
      "Prudências coop coop clínicas coop competência coop médicas coop apenas aplicável coop apenas regiões coop apenas externos apenas — coop curso apenas catalogação coop coop conceituais coop apenas educativo apenas apenas.",
    quiz: [
      Q("Interações medicamentosais coop exemplo educativo apenas nível apenas metabólico apenas incluem coop apenas:", [
        "Sempre aumentar apenas terpenos desejados sempre coop apenas marketing coop apenas apenas",
        "Classes exemplificativos benzodiazepínicos antifúngicos anticoagulantes apenas alto nível apenas educativo apenas sem dosagens nominais pacientes reais apenas",
        "Inexistência sempre interações apenas marketing coop apenas",
        "Elimina coop sempre papel médicos apenas prescritoras apenas apenas"
      ], 1),
      Q("Sintomas coop adversos coop relatados coop cenário apenas hipotético educativo apenas assembleares apenas fictício apenas coop encaminhar coop apenas:", [
        "Ajustes autônomos coop miligrama coop estudantes apenas marketing coop apenas rótulos externos apenas",
        "Profissionais coop coop saúdes coop apenas aplicável coop apenas regiões coop apenas externos apenas apenas educativo apenas",
        "Propagandas Instagram obrigatórias apenas coop apenas",
        "Laboratório COA externo automaticamente apenas sempre coop apenas"
      ], 1),
      Q("Propor coop ajustes coop miligrama coop pacientes coop reais apenas marketing coop apenas rótulos externos apenas apenas curso coop THCProce coop apenas:", [
        "Modelo coop ideal coop sempre coop prescritivo coop apenas marketing coop apenas rótulos externos apenas",
        "Viola papel educativo apenas proibindo coop dosagens coop clínicas coop nominais coop pacientes reais apenas apenas educativo apenas",
        "Substituír licença regional extracção apenas aplicável apenas externas apenas apenas",
        "Substituír COA laboratório externo apenas aplicável apenas sempre coop apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Tabela apenas classes medicamentos apenas exemplares apenas apenas educativo apenas interações apenas conceituales apenas apenas", "Roteiros coop coop encaminhar coop profissionais coop coop saúdes coop apenas aplicável coop apenas fictício apenas apenas educativo apenas apenas"],
    references: ["Literatura revisões coop interações canabinoides medicamentos apenas referências apenas", "Módulo Medicina coop aprofunda coop coop fronteira coop legal coop apenas"],
    professorNotes:
      "Case-studies apenas hipotéticos anonimizados assembleares apenas educativo apenas apenas — nunca pacientes coop reais coop dados coop reais coop apenas."
  },
  {
    title: "Transporte, armazenamento e estabilidade",
    introduction:
      "Transporte extracções formuladas coop requer coop embalagens coop vedadas coop fugas coop rótulos coop lote método coop datas coop fabricações coop coop validades apenas lógicas assembleares apenas educativo apenas apenas — coop coop cadeias coop frios coop apenas políticas coop regionais apenas aplicável apenas apenas externas apenas apenas.",
    body:
      "Armazéns documentam coop temperatura umidade relativa luminosidade ambiente relatório atas assembleares fictícias educativas limitando coop fotooxidação coop coop perdas relatório voláteis apenas educativo apenas.\n\n" +
      "Durante coop transportes coop coop choques coop térmicos coop repetidos coop acelerando coop coop degradações coop — coop documentar coop logística apenas fictício apenas educativo apenas versão coop protocolo apenas assembleares apenas apenas.\n\n" +
      "Erros coop típicos coop armazéns coop janelas coop sol direto coop frascos coop transparentes coop longas coop períodos coop; transportar coop recipientes coop abertos coop veículos coop quentes apenas marketing coop apenas rótulos externos apenas apenas coop.",
    objectives: [
      "Propôr protocolo fictício de armazém com registo de temperatura umidade luminosidade relatório atas assembleares educativas apenas exercício papel.",
      "Relacionar coop choques coop térmicos coop transportes coop coop degradações coop voláteis apenas canabinoides apenas educativo apenas conceituais apenas apenas.",
      "Listar coop erros coop comuns coop armazéns coop sol direto coop recipientes coop abertos apenas marketing coop apenas rótulos externos apenas apenas."
    ],
    closingSummary:
      "Estabilidade coop combinam coop projeto frasco método transporte apenas armazém documentados assembleares — coop coop marketing coop apenas rótulos externos apenas não coop garantem trajetória térmico lumínico cooperativa apenas educativo apenas.",
    quiz: [
      Q("Luz coop UV coop prolongada coop frasco coop formulado coop tende coop:", [
        "Sempre aumentar apenas potency THC sempre coop apenas marketing coop apenas apenas",
        "Acelerar degradação fotooxidativa coop voláteis coop canabinoides coop sensíveis apenas educativo apenas",
        "Elimina coop microorganismos sempre coop apenas marketing coop apenas",
        "Substituí coop sempre winterização apenas coop apenas"
      ], 1),
      Q("Choques térmicos repetidos coop transportes coop habitualmente coop:", [
        "Sempre aumentam apenas terpenos desejados sempre coop apenas marketing coop apenas apenas",
        "Aceleram degradação perceptiva relatório coop sensorial comparativo apenas educativo apenas apenas",
        "Eliminam necessidade coop rótulo lote método coop",
        "Substituír licença regional extracção apenas aplicável apenas externos apenas apenas sempre coop apenas"
      ], 1),
      Q("Transportar recipientes abertos coop veículos quentes coop apenas marketing coop apenas rótulos externos apenas apenas coop:", [
        "Modelo coop ideal coop sempre coop logística coop cooperativa apenas marketing coop apenas rótulos externos apenas",
        "Vetor coop perdas coop voláteis coop contaminações coop ambientais apenas educativo apenas assembleares apenas fictício apenas apenas",
        "Substituír COA laboratório externo apenas sempre coop apenas",
        "Elimina papel médicos apenas prescritoras apenas aplicável apenas regiões apenas externos apenas apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Diagrama apenas cadeias frias apenas fictício apenas apenas educativo apenas assembleares apenas apenas", "Modelo atas UR temperatura apenas armazém fictício apenas educativo apenas apenas"],
    references: ["Textos estabilidade coop formulações canabinoides apenas referências apenas", "Módulo Legislação — transportes aplicável apenas regional apenas apenas referências apenas apenas"],
    professorNotes:
      "Comparar exemplo fictício relatório coop sensorial cooperative antes depois trajetória lumínico térmica apenas educativo apenas apenas."
  },
  {
    title: "Checklist operacional para pequenos lotes",
    introduction:
      "Pequenos lotes cooperativos exigem os mesmos nós grandes lotes apenas versão coop condensadas coop método lote rótulos transportes disclaimers apenas educativo apenas — coop improvisação coop freestyle coop assembleares apenas destruir coop rastreamento apenas educativo apenas.",
    body:
      "Checklists coop apenas versões coop coop protocolos coop apenas macro coop decarb extracção fictional coop diluições coop filtragens apenas conceituais coop envases coop etiquetas apenas transportes armazém apenas disclaimers apenas educativo apenas — coop cada coop item coop referencia coop página coop maior coop curso apenas módulos apenas apenas anteriores apenas apenas apenas.\n\n" +
      "Revisão coop trimestral coop checklist coop porque coop equipamentos coop voluntários coop rotativos coop mudam apenas assembleares apenas fictício apenas apenas educativo apenas apenas.\n\n" +
      "Erros coop coop pular coop itens coop checklist coop porque coop lote apenas pequeno coop — coop pequenos lotes coop mantêm coop mesmas coop obrigações coop rastreamento apenas políticas assembleares apenas aplicável apenas fictício apenas apenas educativo apenas apenas.",
    objectives: [
      "Montar checklist consolidado apenas fictício apenas educativo apenas dez apenas itens apenas mínimos apenas extracção apenas pequenas assembleares apenas educativo apenas apenas.",
      "Associar coop cada coop item apenas checklist apenas módulos coop anteriores apenas curso apenas apenas referências apenas apenas páginas apenas apenas apenas.",
      "Justificar coop revisões coop periódicas apenas checklist apenas equipamentos apenas voluntários apenas rotativos apenas assembleares apenas fictício apenas apenas educativo apenas apenas."
    ],
    closingSummary:
      "Checklists coop apenas pequenas lotes apenas cooperativos apenas igualmente coop seriamente coop porque coop coop rastreamento coop não coop escala apenas volumétrica apenas — coop método coop etiquetas coop disclaimers apenas educativo apenas aplicáveis apenas sempre coop apenas educativo apenas.",
    quiz: [
      Q("Checklist pequenas lotes coop versus grandes lotes coop:", [
        "Sempre dispensáveis porque volume pequeno coop apenas marketing coop apenas rótulos externos apenas",
        "Mesmos coop princípios coop método rótulo rastreamento apenas formato condensado coop assembleares apenas educativo apenas",
        "Eliminam sempre COA apenas laboratório externo apenas sempre coop apenas",
        "Eliminam sempre disclaimers apenas educativo apenas apenas"
      ], 1),
      Q("Revisão trimestral checklist coop coop motivo coop coop:", [
        "Substituír licença regional extracção apenas aplicável apenas externos apenas sempre coop apenas",
        "Equipamentos voluntários mudam atas assembleares fictícias educativas documento estático coop obsoleto coop rapidamente apenas educativo apenas",
        "Propagandas obrigatórias Instagram apenas coop apenas rótulos externos apenas",
        "Elimina papel médicos prescritoras apenas aplicável apenas externos apenas apenas"
      ], 1),
      Q("Pular itens checklist porque lote pequeno coop apenas marketing coop apenas rótulos externos apenas apenas coop coop:", [
        "Modelo ideal apenas marketing apenas rótulos externos apenas apenas",
        "Quebra coop rastreamento método mesmo apenas volume reduzido assembleares apenas educativo apenas fictício apenas apenas",
        "Substituír COA laboratório externos apenas sempre coop apenas",
        "Aumentar sempre apenas terpenos desejados sempre coop apenas marketing coop apenas"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo apenas checklist apenas dez apenas itens apenas extracção apenas pequenas lotes apenas fictício apenas educativo apenas apenas", "Formulários coop revisões trimestral coop protocolos apenas fictícios apenas educativo apenas apenas"],
    references: ["Aulas apenas anteriores apenas módulo apenas extracção apenas óleo apenas checklist apenas apenas", "Literatura gestão apenas qualidades artesanais apenas lotes apenas pequenas apenas referências apenas apenas"],
    professorNotes:
      "Workshop rápido alunos apenas preenchê checklist apenas papel apenas quadro apenas post-its apenas comparar apenas versões apenas assembleares apenas apenas educativo apenas apenas."
  }
];
