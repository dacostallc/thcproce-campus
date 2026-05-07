import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Laboratório de análise — 10 aulas (manual THCProce; formação técnica — não substitui laudo credenciado nem habilitação de laboratório). */
export const LABORATORIO_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "COA e alfabetização em resultados de laboratório",
    introduction:
      "O certificado de análise (COA) é o documento que amarra metrologia, lote e método. Dominar cabeçalho, tabelas, notas e limites evita confundir banner de marketing com laudo rastreável.",
    body: `Um COA íntegro informa solicitante, código de lote ou amostra correlata, matriz, datas de recepção e emissão, escopo analítico contratado e identificação das pessoas ou funções autorizadas no sistema de qualidade do laboratório. Resumos gráficos omitidores de notas sobre incerteza ou condicionantes de extração merecem suspeita quando substituem PDF completo em auditoria ponta a ponta.

Pontos técnicos: distinga “não ensaiado”, “não detectado”, resultado abaixo do LOD e abaixo do LOQ; confronte unidades (% m/m, mg/g, ppm, µg/kg) antes de comparar laudos; examine se valores estão em massa úmida, seca ou corrigidos por umidade; confira menção explícita ao método (por exemplo cromatografia com detecção UV/DAD ou espectrométrica).

Erros comuns: usar screenshot de terceiro como prova do próprio estoque; extrapolar laudo de flor para extrato sem novo ensaio na matriz correta; desconsiderar validade temporal do documento frente a reestocagem ou reembalagem.

Limitações: obrigações sanitárias variam por produto e país — a aula restringe-se à leitura técnica do documento, sem opinar sobre registro.`,
    objectives: [
      "Listar blocos mínimos de um COA e a função de rastreabilidade de cada um.",
      "Interpretar LOD e LOQ sem confundir ausência analítica com ausência regulatória aplicável.",
      "Relacionar unidade e base úmida/seca à leitura econômica correta da potência declarada."
    ],
    closingSummary:
      "Um COA válido fala do lote enviado àquele tubo — próximo passo: ler canabinoides ácidos, neutros e totais com coerência estequimétrica informada.",
    quiz: [
      Q("O vínculo indispensável entre documento e produto físico no COA é:", [
        "Nome fantasia do vendedor apenas",
        "Identificação inequívoca do lote ou amostra relacionada ao material em discussão",
        "Número de curtidas nas redes do laboratório",
        "Descrição olfativa subjetiva da loja"
      ], 1),
      Q("LOD e LOQ diferem sobretudo porque:", [
        "São sinônimos em qualquer norma",
        "LOD trata de evidência de presença sensível; LOQ costuma ser o patamar mínimo onde a quantificação cumpre critérios do método validado",
        "LOD elimina calibração",
        "LOQ dispensa relatório de método"
      ], 1),
      Q("Republicar COA de concorrente ou lote antigo como se fosse atual:", [
        "Prática aceitável em comunidades fechadas",
        "Documentação fraudulenta na cadeia — proibido eticamente e possivelmente ilícito",
        "Equivalente à amostragem aleatória",
        "Critério automático ISO de excelência"
      ], 1)
    ],
    media: M.lab,
    materials: ["COA modelo anonimizado com legenda de campos", "Checklist rápido: unidades, LOD/LOQ, base úmida"],
    references: ["ISO/IEC 17025 — quadro conceitual de laboratório de ensaio", "Guias de boas práticas em documentação analítica de matrizes botânicas"],
    professorNotes:
      "Exibir PDF real censurado; se não houver, usar fictício com todos os campos críticos preenchidos."
  },
  {
    title: "Cannabinoides totais e decarboxilação nos números",
    introduction:
      "Laudos mesclam THCA, Δ⁹‑THC, somas ‘total THC’ ou ‘canabinoides totais’. Cada casa declara sua convenção — fator estequimétrico e base de relatório devem estar explícitos para comparações honestas.",
    body: `Formas ácidas predominam na biomassa bem conservada antes de forte aquecimento. Laboratórios podem quantificar ácidos e neutros como picos independentes ou apresentar coluna já convertida mediante fator público ao leitor técnico. A conversão química completa na vida real — cozinha, vaporização, combustão incompleta — não reproduz a caixa fechada do cálculo algébrico do relatório.

Pontos técnicos: verificar massa molecular e fator usados na conversão THCA → THC equivalente segundo o rodapé do laudo; comparar apenas laudos com mesma matriz e mesma base (seco, úmido); confirmar separação espectral quando isômeros comerciais (por exemplo THC isomérico) aparecem no escopo contratado.

Erros comuns: copiar multiplicadores genéricos da internet quando o método do laboratório usa outra convenção; somar todas as barras do gráfico sem checar linearidade ou recuperação para aquela banda concentracional; igualar resultado de óleo ao de flor sem novo ensaio.

Limitações: o relatório descreve o extrato ou solução analítica daquele subalíquota — não prevê biodisponibilidade em humanos.`,
    objectives: [
      "Ler THC total apenas quando definido textualmente pelo laboratório emissor.",
      "Explicar por que dois laboratórios podem discordar dentro de faixa método sem adulteração provada.",
      "Relacionar decarboxilação real de uso ao número estático da coluna cromatográfica."
    ],
    closingSummary:
      "Sem método, base úmida e convenção estequimétrica explícitos, ‘potência forte’ é slogan — seguimos para terpenos declarados versus perfil real.",
    quiz: [
      Q("Para comparar dois laudos de potência entre si, primeiro convém:", [
        "Ignorar unidades porque canabinoides são naturais",
        "Checar método, base seca ou úmida e matriz idêntica ou explicitamente relacionada por novo ensaio",
        "Escolher o PDF com cores mais vivas",
        "Usar preço médio do mercado"
      ], 1),
      Q("THC total no COA habitualmente:", [
        "É sempre medido apenas por PCR doméstica",
        "Segue convenção declarada pelo laboratório sobre soma ácido + neutro — não há padrão universal único entre todas as empresas",
        "Elimina quantificação",
        "Equivale sempre ao valor clínico prescrito"
      ], 1),
      Q("Aplicar fator de conversão tirado de vídeo online sem ler o rodapé do laudo próprio caracteriza:", [
        "Modernização metrológica",
        "Substituição do método oficial por suposição — erro metodológico grave",
        "Validação ISO automática",
        "Prova laboratorial dupla-cego"
      ], 1)
    ],
    media: M.lab,
    materials: ["Planilha exercício THCA / Δ⁹‑THC com espaço para fator do laudo fictício", "Quadro glossário THC total vs THC neutro"],
    references: ["Revisões de métodos cromatográficos para quantificação de canabinoides", "Textos técnicos sobre limites lineares de calibração em HPLC"],
    professorNotes:
      "Evitar guerra de marca entre dois laudos sem descrever coeficientes de recuperação relatados."
  },
  {
    title: "Terpenos declarados vs perfil real",
    introduction:
      "Os terpenoides são sensíveis a luz, calor e oxigênio; o papel do laboratório é registrar método de extração, pré‑concentração eventual e condições cromatográficas. O relatório espelha aquele instante — não garante perfil aromático idêntico após novo transporte ou nova abertura de embalagem.",
    body: `Perfis mono ou bidimensionais (por exemplo GC ou GC‑MS) entregam abundâncias relativas condicionadas à matriz e à extração. Voláteis leves evaporam rápido de frascos mal vedados ou de amostras expostas a calor logístico. Técnicas headspace ou microextração aparecem no método — dois laudos só são comparáveis quando compartilham família instrumental e trabalho‑up compatível.

Pontos técnicos: ler se o relatório é “semi‑quantitativo”; checar uso de estándares internos e recuperações citadas no anexo metodológico, não apenas no flyer comercial.

Erros comuns: marketing de “same terp profile” apenas por nomes de compostos ordenados igualmente quando escala diferiu; esperar mesmo cheiro físico apenas porque PDF igual.

Limitações: percepção humana multimodal extrapola o analítico — combine laudo técnico com mensagens gastronômicas prudentes.`,
    objectives: [
      "Distinguir valores semi‑quantitativos de promessas de experiência garantida ao consumidor.",
      "Identificar dois fatores logísticos que alteram o perfil volátil antes da injeção.",
      "Comparar laudos somente quando instrumento e preparo declarados forem compatíveis."
    ],
    closingSummary:
      "O perfil relatado reflete a amostra e o método naquele instante — segue leitura de contaminantes físico‑químicos dentro de quadros externos de segurança.",
    quiz: [
      Q("Comparar perfis terpênicos de dois relatórios exige, em primeiro lugar:", [
        "Ordenação alfabética dos compostos apenas",
        "Conferência de família instrumental e trabalho‑up suficientemente semelhantes",
        "Logotipo igual no PDF",
        "Mesmo número de páginas do arquivo digital"
      ], 1),
      Q("Marcador semi‑quantitativo em relatório sugere habitualmente:", [
        "Ausência absoluta de incerteza",
        "Interpretação cautelosa de abundâncias relativas com faixa metrológica comunicada pelo laboratório",
        "Registro sanitário automático nacional",
        "Dispensa de método"
      ], 1),
      Q("Lista de compostos igual em dois flyers comerciais prova mesmo aroma real:", [
        "Sim sempre",
        "Não substitui análise de escala temporal, logística de transporte e condições de embalagem",
        "Elimina LOD",
        "Equivale à espectrometria de infravermelho de produto final"
      ], 1)
    ],
    media: M.lab,
    materials: ["Cromatograma fictício de terpenos com legenda de picos", "Lista de contingências logísticas que alteram perfil volátil"],
    references: ["Literatura de GC‑MS aplicada a óleos essenciais e matrizes vegetais", "Documentos sobre validação de métodos de perfil qualitativo"],
    professorNotes:
      "Contraste sensorial rápido (nariz coberto versus amostrar headspace vedado) em demonstração apenas com material não psicoativo se política assim permitir."
  },
  {
    title: "Contaminantes: umidade, pestidas, metais (leitura)",
    introduction:
      "Úmidade, resíduos de pesticidas e metais pesados aparecem em COAs sanitários porque interferem na estabilidade microbiana inerente ou indicam exposição ambiental/industrial. A aula ensina a ler tabelas e unidades contra limites externos — sem parecer jurídico da própria escola.",
    body: `A umidade costuma aparecer como teor de água em massa, segundo método explícito no laudo — balança de estufa e titulação Karl Fischer são famílias distintas. Painéis de pesticidas combinam métodos multitarget LC‑MS/MS ou GC‑MS; metais pesados surgem em massa de elemento por massa de amostra (µg g⁻¹ ou mg kg⁻¹) com técnica atômica apropriada.

Pontos técnicos: valores “abaixo do LOD” comunicam limite instrumental daquele ensaio — não provam história de campo eternamente zerada; harmonize unidades antes de confrontar normas regionais com apoio jurídico externo. THCProce ensina leitura técnica do laudo, não submete produto a órgão algum.

Erros comuns: comparar flor a limites destinados apenas a óleos sem novo ensaio; confundir “não detectado” com ausência jurídica automática em qualquer cenário administrativo.

Limitações: o curso não classifica PASS/FAIL — a decisão regulatória cabe ao regime legal aplicável ao produto.`,
    objectives: [
      "Ler seções de umidade, pesticidas e metais com unidade, método e LOD coerentes com o relatório.",
      "Saber quando confrontar valores com lei exige jurídico e responsável técnico externos ao curso.",
      "Distinguir resultado abaixo do LOD de comprovação regulatória de ausência integral."
    ],
    closingSummary:
      "Painel de segurança é leitura cruzando método numérico e quadro jurídico externo — a seguir, triagens rápidas versus cromatografia de arbitragem.",
    quiz: [
      Q("\"Abaixo do LOD\" numa linha de pesticida significa habitualmente:", [
        "Prova jurídica automática de ausência total no campo desde sempre",
        "Limite sensitivo daquele ensaio — confrontar lei com especialistas externos quando obrigatório",
        "Substitui registro sanitário automático só pelo THCProce",
        "Elimina obrigações de novo laudo sempre"
      ], 1),
      Q("Confrontar relatório nacional com limite norte‑americano exige inicialmente:", [
        "Assumir ppm idêntico sem revisão contextual",
        "Harmonizar unidades e enquadramento jurídico próprio com apoio técnico‑jurídico do operador",
        "Usar apenas cor do gráfico comercial maior",
        "Ignorar matriz relatada"
      ], 1),
      Q("Umidade relatada alta frente ao recomendável para armazenagem sugere pedagogicamente:", [
        "Aumentar apenas preço de venda porque ‘hidratado premium’",
        "Elevado risco de alterações físicas e microbiológicas — decisões sanitárias competem ao responsável técnico segundo a lei aplicável, não ao curso THCProce isolado",
        "Eliminar fungos automaticamente na própria embalagem",
        "Ausência garantida metais apenas pelo primeiro laudo já feito anos atrás"
      ], 1)
    ],
    media: M.lab,
    materials: ["Tabela‑exercício fictícia de limites máximos (validar sempre com lei real antes do uso público)", "Folha de conversões ppm, ppb, mg/kg"],
    references: ["Normas sanitárias de resíduos aplicáveis — consulta institucional do operador econômico", "Literatura de métodos QuEChERS e espectrometria atômica aplicada a vegetais"],
    professorNotes:
      "Marcar frontalmente na lousa: ‘sala THCProce ≠ RT nem órgão regulador’."
  },
  {
    title: "Métodos rápidos vs cromatografia (visão geral)",
    introduction:
      "Testes rápidos e portáteis respondem bem a perguntas de triagem (‘há um sinal preocupante?’). Cromatografia com detecção apropriada e validação documentada permanece ferramenta de arbitragem onde o cenário pede número rastreável, matriz bem descrita e cadeia de custódia profissional — funções diferentes, não concorrentes faciais.",
    body: `Kits immunocromatográficos e leituras colorimétricas exploram tempo de resultado curto e baixo custo operacional relativo ao painel laboratorial completo. A validade declarada pelo fabricante refere-se ao conjunto reagentes, leitor e, muitas vezes, um conjunto restrito de matrizes — extrapolar flor seca molhada versus extrato gorduroso exige método específico, não improvisação didática THCProce.

Pontos técnicos: ler folheto de LOD nominal, interferentes conhecidos e modo qualitativo versus semi‑quantitativo; HPLC‑DAD/UPLC‑MS, GC‑FID e GC‑MS desempenham papéis distintos conforme polaridade, volatilidade e necessidade identificativa; confirmação por espectrometria de massas reduz risco de co‑elução quando o método prevê esse passo.

Erros comuns: tratar resultado de fita rápida como equivalente jurídico a laudo único nacional sem segunda linha confirmatória oficial; ignorar tempo de aquecimento, diluição e saturação de leitor; presumir sensibilidade idêntica entre classes de pesticidas apenas porque o slogan comercial menciona ‘multirresíduos’ genéricos.

Limitações: o laboratório escolar só simula comunicação técnica; credenciamento, manutenção de coluna e calibração real competem ao parceiro analítico contratante.`,
    objectives: [
      "Distinguir triagem rápida de método de arbitragem em contexto técnico e documental.",
      "Nomear dois fatores (matriz e validação instrumental) que explicam divergência entre kit e cromato laboratorial.",
      "Escolher o próximo passo lógico após resultado positivo duvidoso numa fita rápida — encaminhar com registro ao laboratório."
    ],
    closingSummary:
      "Rápido informa urgência cognitiva; cromato calibrado informa evidência dentro do escopo validado — a seguir: como tirar da saca algo que vale a pena injetar no tubo.",
    quiz: [
      Q("Uma linha forte num quick-test de campo antes de decisão sanitária regulada costuma:", [
        "Eliminar obrigatoriamente qualquer segunda análise",
        "Orientar comunicação inicial e, onde aplicável, encaminhar amostra com custódia mínima alinhada ao laboratório",
        "Substituir cadeia de custódia",
        "Declarar THC absoluto ±0,01%"
      ], 1),
      Q("GC‑MS diferencia-se didaticamente de HPLC‑DAD porque:", [
        "GC‑MS apenas mede pH da solução",
        "São especialidades para voláteis versus polaridades distintas, com diferentes fronteiras entre identificação e quantificação",
        "Um elimina LOD em qualquer cenário",
        "São sempre intercambiáveis sem retreino"
      ], 1),
      Q("Folheto do fabricante de kit rápido deve ser consultado porque:", [
        "Substitui calibração interna sempre",
        "Define matrizes estudadas, interferentes e modo qualitativo do ensaio comercializado",
        "Dispensa rótulo na amostra",
        "Elimina incerteza metrológica"
      ], 1)
    ],
    media: M.lab,
    materials: ["Fluxograma papel triagem → arbitragem fictício THCProce", "Tabela comparativa HPLC versus GC apenas para vocabulário aula"],
    references: ["Validação analítica em cromatografia — textos revisão método", "Documentação de kits diagnósticos rápidos fornecida pelo fabricante"],
    professorNotes:
      "Enfatizar analogia segurança rodoviária: radar escolar não substitiu perícia oficial — apenas educação de atenção."
  },
  {
    title: "Amostragem representativa em flor/processados",
    introduction:
      "O melhor cromatógrafo do mundo apenas mede os grãos na colher. Se a colher pega apenas inflorescência superficial bonita ou só pó de fundo do saco, o número mente mesmo com QC perfeito. Amostragem é metade do laudo antes do método.",
    body: `Lotes heterogêneos pedem planejamento: quantidade mínima, número de subamostras, mistura só após subdivisão e registro fotográfico de embalagens lacradas sempre que política institucional permitir. Óleos, hash e geleias sofrem segregação por fase ou microlocalização — homogeneizar aquecimento e agitação antes de pipetar diminui erro de ponta.

Pontos técnicos: calcular massa compatível com exigências do tubo receptivo do laboratório parceiro; reduzir perda por estática em materiais muito secos; rotular data, operador estudantil fictício THCProce e condição (‘flor inteira versus microtriturada apenas no laboratório parceiro’).

Erros comuns: pegar só brotos apicais grandes e descartar população pequena; misturar lotes diferentes no mesmo envelope sem log; enviar apenas material que sobrou bonito na vitrine quando o problema reportado vinha da base do saco.

Limitações: aula não especifica gramatura legal por jurisdição — confirme com jurídico comercial.`,
    objectives: [
      "Descrever estratégia de subamostras em flor aparentemente heterogênea.",
      "Relacionar homogeneização de processados líquidos a repetibilidade esperada nos resultados.",
      "Listar dois erros cotidianos de coleta estudantil que invalidam comunicação mesmo com método bom."
    ],
    closingSummary:
      "Lote bem amostrado permite discutir método; saco adulado na coleta apenas discute erro humano upstream — próximo tema: código do lote percorrendo cooperativa.",
    quiz: [
      Q("Coletar apenas as maiores inflorescências do topo tende a:", [
        "Garantir humildade técnica",
        "Sesgar média de potência e perfil relativamente ao restante do saco quando o lote não é uniforme",
        "Melhor LOD automaticamente",
        "Substituir laudo oficial"
      ], 1),
      Q("Antes de pipetar óleo viscoso para tubo deve-se:", [
        "Omitir aquecimento e agitação porque afeta cor",
        "Homogeneizar de forma repetível segundo protocolo combinado com laboratório e registrar condição na etiqueta imaginária THCProce",
        "Dispensar rótulo de data",
        "Trocar óleos de lotes distintos pelo mesmo bastão só para economizar"
      ], 1),
      Q("Registro de saco/fecho lacrado foto serve principalmente para:", [
        "Provar gosto avaliado em rede social",
        "Apoiar narração de rastreio interno até o laboratório sem substituir cadeia profissional",
        "Substituir análise",
        "Ignorar lote físico real"
      ], 1)
    ],
    media: M.lab,
    materials: ["Diagrama desenhar colher zig‑zag dentro do tote fictício THCProce", "Check‑list campo → tubo texto curto"],
    references: ["Guias ISO de amostragem de cargas sólidas — trechos conceituais", "Notas sobre subamostragem em produtos hortícolas comerciais"],
    professorNotes:
      "Se possível, demonstrar com granola colorida heterogênea — ‘flor fictícia’ sem fitoquímico real."
  },
  {
    title: "Rastreio de lotes para cooperativas (introdução)",
    introduction:
      "Cooperativa que mistura hortas diferentes sem vínculo de identificadores perde a capacidade narrativa (‘de onde veio o problema?’) e aumenta retrabalho. Rastreio mínimo combina SKU interno, lote agrícola, data aceitação na unidade central e resultado analítico agregável por consulta rápida — sem prometer TI que THCProce não hospeda.",
    body: `Uma entrada simples já melhora segurança de informação: código do produtor membros‑AB, número de campo ou estufa correlato, código de tanque de secagem e hash de foto da etiqueta física antes de mover material. Divergências de COA devem bifurcar lote (‘L2026‑042a’ versus ‘‑042b’) em vez de apagar evidência textual.

Pontos técnicos: relacionar formato CSV exportável genérico (colunas lote_lab, método, resultado_chave); limitar edição retrospectiva aos administradores definidos pela cooperativa externa THCProce; comunicar aos associados onde laudo físico ficará arquivado.

Erros comuns: renome manual de PDF sem atualizar vínculos internos da planilha; guardar relatório apenas no telefone privado sem espelhar diretório compartilhado controlado pela cooperadora; usar um único lote mestre mesmo após entrada de novo insumo porque ‘é tudo Indoor premium’ slogan.

Limitações: legislação de cooperativismo e sanitária varia federativamente — curso apenas esboço de boa prática de dados.`,
    objectives: [
      "Desenhar estrutura mínima de identificadores alinhável a campo e laboratório.",
      "Discutir por que bifurcar lote após segundo COA discrepante preserva reputação institucional.",
      "Nomear dois erros tecnológicos comuns ao versionar relatórios em diretório compartilhado."
    ],
    closingSummary:
      "Cadastro vivo evita improviso na mesa quando fiscalização ou consumidor faz pergunta numérica objetiva — agora migramos do armazém digital ao laboratório de bancada didática física.",
    quiz: [
      Q("Ao receber laudo novo que discorda forte do primeiro para mesmo saco físico, prática prudente de dados sugere:", [
        "Mesclar silenciosamente num único SKU",
        "Abrir bifurcação ou quarentena de registro até decisão institucional com responsável competente externo THCProce",
        "Apagar o PDF antigo do grupo",
        "Publicar apenas o menor valor porque é marketing"
      ], 1),
      Q("Rastreio mínimo em cooperativa deve vincular principalmente:", [
        "Nome artístico de strain unicamente sem data",
        "Identificadores de entrada ao laboratório, produtor e período físico correlato quando existir tal disciplina institucional",
        "Paleta CMYK do flyer",
        "Contagem de hashtags"
      ], 1),
      Q("Hash de foto de etiqueta serve como:", [
        "Prova física forte isolada sempre",
        "Apoio leve contra troca tardia inadvertida desde que combinado com outras políticas internas definidas pela cooperadora",
        "Substituir método analítico",
        "Licença sanitária"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo CSV colunas exemplo THCProce sem armazenar em nuvem real", "Storyboard papel cooperativa → hub → laboratório"],
    references: ["Princípio um‑pra‑um em rastreio de commodities agrícolas", "Literatura de governança de dados em redes de pequenos produtores"],
    professorNotes:
      "Alertar GDPR/LGPD se exportarem dados pessoais reais dos produtores em exercício."
  },
  {
    title: "Boas práticas mínimas de laboratório escolar",
    introduction:
      "Laboratório didático existe para treinar comportamento: etiqueta temporal, zona de entrada distinta da zona contaminada imaginária do exercício e registro mesmo quando o resultado esperado é apenas cor de papel pH fictício sensível apenas à água. Não confundimos brincadeira educativa com sala GLP nacional.",
    body: `Mínimo THCProce: usar jalecos separados apenas se política assim demandar — ao menos delineamos área fictícias ‘limpa’ versus ‘entrada’. Descarte de simulações vai para recipientes rotulados com nomes latinizados apenas exercício (álcool desnaturante corante). Onda de segurança: exaustão quando manipular solvente didático apenas demonstração técnico supervisionada segundo norma institucional.

Pontos técnicos: registre data, operador estudantil nome fictício THCProce, temperatura sala e lote pretendido mesmo em ensaio seco papel; foto do setup sem rostos reais quando não há consentimento; verificar SDS do material real que for aberto mesmo didaticamente.

Erros comuns: comer próximo solvente apenas porque ‘odor pequeno’; compartilhar pipeta contaminada figurativamente nos exercícios; misturar reagentes fora sequência apenas para TikTok rápido.

Limitações: nenhuma destilagem real de solvente THC em sala escolar é ensinada THCProce em base genérica — cenário apenas discussão papel legal externo.`,
    objectives: [
      "Listar zona mental limpa/contaminação entrada em sala didática THCProce.",
      "Construir formulário papel mínimo: data temperatura nome fictício método exercício resultado.",
      "Identificar dois riscos de cultura laxa próximos a solvente que quebrariam segurança em laboratório real."
    ],
    closingSummary:
      "Higiene comportamental transfere mesmo sem HPLC próprio na escola — abrimos paralelo com fantasias populares de ‘testinho em casa igual laboratório’.",
    quiz: [
      Q("Em laboratório didático, SDS é consultado porque:", [
        "É folha só decorativa bonita azul pastel",
        "Documenta frações de diluição, EPI esperado onde aplicável e ação emergencial inicial",
        "Substitui professor",
        "Elimina odor automaticamente"
      ], 1),
      Q("Zona entrada versus zona limpa no exercício THCProce discute sobretudo:", [
        "Cores diferentes de papel auto‑adesivo",
        "Fluxo mental de materiais contaminados versus não tocados antes do exercício oficial",
        "Obrigatoriedade de gravar vídeo para redes sociais",
        "Potência média estadual nacional"
      ], 1),
      Q("Registrar data e operador até em exercício simbólico em papel treina:", [
        "Caligrafia decorativa apenas",
        "Hábitos de rastreio e consistência de narrativa mesmo sem instrumentação cara",
        "Dispensa método analítico",
        "Licença de fabricação THCProce"
      ], 1)
    ],
    media: M.lab,
    materials: ["Planta sala fictícia com fitas cores fluxo entrada", "Lista SDS exercício papel somente texto genérico seguro neutro não fitoquímico"],
    references: ["NBR/OSHA orientações conceituais introdutórias segurança química sala aula superior", "Textos institucionais internos SDS genéricos fabricante"],
    professorNotes:
      "Se universidade já fornece EPI, verificar obrigatoriedade de treinamento ocupacional paralelo oficial."
  },
  {
    title: "Limitações de testes caseiros e mitos",
    introduction:
      "‘Testinho’ doméstico não é erro por existir — é ferramenta de curiosidade e triagem inicial com limites endurecidos pela ausência coluna cara, blanks profissionais e matrix spike. Esta aula derruba quatro mitos típicos de marketing de influência sem demonizar tecnologia modesta bem calibrada em expectativa.",
    body: `Mito um: ‘LOD doméstico igual ao de laboratório credenciado’ — em geral falso, porque volume injetável, extração e estabilidade de padrão seguem ordens de grandeza distintas. Mito dois: ‘tabela de cores da TLC serve para qualquer eluente’ — falso: trocar fase móvel altera Rf e cor de reveleção; comparar spots sem o mesmo sistema é ilusão visual. Mito três: ‘PCR portátil em casa substitui laudo de potência’ — na prática exige controles, primers e bioinformática que raramente existem no improviso doméstico. Mito quatro: ‘aplicativo de celular com dois dígitos equivale a HPLC’ — falso se linearidade, branco de matriz e calibração não foram tratados como no método laboratorial.

Pontos técnicos: ler o folheto do fabricante antes de extrapolar vídeo curto de terceiros; quando comunicar resultado doméstico, declare faixa ampla de incerteza ou caráter apenas qualitativo, conforme o protocolo usado.

Erros comuns: publicar THC com duas casas decimais a partir de fita colorida sem descrever extração; usar água da torneira onde o protocolo exige água grau analítico; repetir uma única triagem em voga sem confrontar com segunda fonte documental.

Limitações: curso THCProce não ensina síntese analítico casero regulado — apenas humildade metrológica.`,
    objectives: [
      "Enunciar três lacunas típicas (extração injeção LOD) entre casa e laboratório credenciado.",
      "Reconstruir contra‑argumento didático quando viral afirma precisão falsa maior que instrumento permite.",
      "Definir faixa comunicacional aceitável ‘casa só orienta decisão seguinte oficial’ linguagem estudantil."
    ],
    closingSummary:
      "Triagem modesta bem explicada educa; triagem arrogante vira ruído — fechamos com como escrever isso com clareza para quem não usa o vocabulário de laboratório.",
    quiz: [
      Q("Declarar dois decimais de THC apenas por strip monocromática sem especificação de extração caracteriza:", [
        "Marketing agressivamente superestimado relativamente poder demonstrável do método",
        "Demonstração soberana sempre",
        "Pass automático sanitário brasileiro",
        "Calibração cruzada interlaboratorial perfeita"
      ], 0),
      Q("TLC em casa só é comparável entre si de forma didática quando:", [
        "A marca comercial da placa for idêntica",
        "Eluente, modo de aplicação e condições de revelação forem alinhados com padrão ou referência corrida lado a lado",
        "O número de seguidores do autor for alto",
        "A cor do primeiro spot for sempre verde"
      ], 1),
      Q("Teste casa responsável comunica habitualmente ao público estudantil que:", [
        "Substitui laudo sempre",
        "Orienta pergunta extra com laboratório e margem alta de incerteza doméstica explícita",
        "Elimina necessidade método",
        "Prova campo zero toxicidade sempre"
      ], 1)
    ],
    media: M.lab,
    materials: ["Cartaz mitos TLC vs eluente", "Planilha ‘expectativa LOD casa vs labs’ apenas ordem grandeza texto"],
    references: ["Literatura crítica de vídeos curtos de química no ensino médio, quando houver revisão por pares", "Comunicados de órgãos sanitários sobre risco de mensagens enganosas — leitura para formação de cidadania, não como parecer jurídico"],
    professorNotes:
      "Convidar estudante ler comentários céticos bem fundamentados antes de repetir método viral."
  },
  {
    title: "Relatório simples para não-técnicos",
    introduction:
      "Laboratório fala LOD; no armazém se fala no ‘saco verde grande do João’. Um relatório interno THCProce simples faz ponte entre esses mundos com frases curtas: o que foi testado, qual pedaço físico corresponde ao tubo, qual número saiu e qual é o próximo passo recomendável — texto educativo, sem substituir responsável técnico nem laudo oficial.",
    body: `Estrutura mínima: (1) identificação lote físico foto ou código já usado sala upstream; (2) painel solicitado (‘umidade apenas’, ‘painel canabinoides’ etc.); (3) resultados língua cotidiana com parêntese técnico pequeno; (4) nota explícita ‘escola THCProce não é RT oficial’ ; (5) link ou caminho físico arquivo PDF laboratório parceiro com hash simples texto se combinado coop.

Pontos técnicos: destacar sempre unidade (‘% massa úmida’, ‘µg elemento por g’) em caixa destacada porque leigo confunde rápido; usar cor semântico neutro texto preto mesmo se ruim porque colorido excessivo sugere propaganda.

Erros comuns: remover incerteza do laboratório real ao resumir; prometer ‘ZERO pesticida absoluto absolutíssimo’ quando laudo apenas abaixo LOD; usar superlativo econônico (‘ultra premium garantido’) colado número analítico.

Limitações: documento sala não dispensa relatório institucional assinável por profissionais legalmente habilitados externos THCProce quando lei exigir.`,
    objectives: [
      "Montar parágrafos modelo 5 blocos relatório estudantil coop.",
      "Traduzir frase técnica abaixo LOD para público coop sem mentira nem medo paranóico.",
      "Listar dois erros comunicacionais que invalidam reputação coop mesmo com número laboratorial correto em PDF oficial."
    ],
    closingSummary:
      "Traduzir método sem distorcer unidade fecha ciclo alfabetização — de COA técnico a cooperado que faz pergunta certa na porta do laboratório parceiro.",
    quiz: [
      Q("Resumo interno coop deve sempre explicitar:", [
        "Que THCProce automaticamente garante campo seguro sempre",
        "Que escola apenas educa texto e vínculos enquanto laudo oficial permanece papel laboratório parceiro onde existir tal documento externo THCProce",
        "Que LOD é zero físico garantido sempre",
        "Que celebridade validou o método"
      ], 1),
      Q("Tradução aceitável de abaixo LOD pesticida lei para coop leigo:", [
        "Prova oficial ausência mundo inteiro século XXI",
        "Instrumento atual não evidenciou acima sensitividade declarada — decisão seguinte segundo orientação institucional e jurídico competente coop",
        'Significa campo orgânico certificado coop EUA apenas pelo strip',
        "Elimina segunda análise recomendável prudencial nunca"
      ], 1),
      Q("Box de unidades destacado beneficia leigo porque:", [
        "Aumenta word count SEO Google",
        "Reduz erro de ler ‘5’ ora como ora como mg sempre confundindo percentual massa mol",
        "Torna relatório sempre propaganda",
        "Dispensa método laboratorial oficial"
      ], 1)
    ],
    media: M.lab,
    materials: ["Modelo relatório coop 1 página português simples texto fictício", "Gabarito marcador erro propaganda vs ciência comunicação institucional"],
    references: ["Guias NIH simplificação comunicação risco quando existirem equivalências léxicas segurança", "Textos ABNT relatórios técnicos — trechos apenas inspiração rótulos seções público misto"],
    professorNotes:
      "Comparar com boletim escolar de notas: linguagem paralela costuma aumentar a assimilação."
  }
];
