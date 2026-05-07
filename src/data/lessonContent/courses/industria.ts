import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Indústria cannabis — 10 aulas (manual THCProce; formação empresarial — não substitui consultoria regulatória nem jurídico/contador externos). */
export const INDUSTRIA_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Licenciamento: arcabouço conceitual (Brasil/LATAM)",
    introduction:
      "Produtos industrializados combinam regimes sanitários, tributários e, conforme caso, obrigações de controle especial de insumos. O curso oferece mapa lexical e checklist de perguntas a um escritório especializado — não substitui estudo jurídico do seu projeto concreto.",
    body: `Brasil mantém regimes que evoluem; vizinhos latino-americanos adotam janelas diferentes de autorização fiscal e sanitária. Benchmarks norte-americanos (rastreio de lote, testes estaduais) inspiram eficiência operacional, mas transpor normas exige trabalho bilateral com advogado local.\n\nPontos técnicos: segregar autorização fabril de registro de produto específico, trânsito aduaneiro de insumo e permissões específicas de propaganda.\n\nErros comuns: confundir legalização adulta estadual nos EUA com industrialização automatizada Brasil; iniciar capex físico antes de permissões fundamentais escritas.\n\nLimitações: THCProce não concede autorização oficial — apenas formação linguística.`,
    objectives: [
      "Nomear quatro âmbitos (sanitário, fiscal, aduaneiro, publicidade) que normalmente aparecem em diligência inicial de indústria regulada.",
      "Explicar por que copiar playbook internacional literalmente aumenta risco de compliance falho.",
      "Elaborar cinco perguntas iniciais a consultoria jurídica sobre viabilidade de planta projetada fictícia."
    ],
    closingSummary:
      "Licenças são quebra-cabeça multi-peça jurídico — na sequência marca e rótulo precisam caber dentro do que já for possível registrar.",
    quiz: [
      Q("Licença adulta estadual nos EUA valida industrializar o mesmo SKU no Brasil automaticamente?", [
        "Sim, reguladores usam sempre o mesmo PDF",
        "Não — exige projeto jurídico local completo porque ordenamentos divergem",
        "Sim, se SKU for orgânico",
        "Somente após dois vídeos do YouTube"
      ], 1),
      Q("Importação de biomassa vegetal costuma enfrentar, além da alfândega,", [
        "Somente etiqueta da transportadora nas redes sociais",
        "Exigências fitossanitárias e sanitárias adicionais com documentação alinhada ao órgão competente",
        "Apenas reajuste de marca no Instagram",
        "Automatismo de isenção de imposto garantido sempre"
      ], 1),
      Q("Este módulo substitui due diligence jurídica multimillionária sempre?", [
        "Sim porque certificado fecha processo público sempre",
        "Não — aula apenas educação; grandes investimentos exigem banca externa",
        "Somente se marca for verde",
        "Somente às quintas-feiras"
      ], 1)
    ],
    media: M.theory,
    materials: ["Matriz papel quatro domínios jurídicos fictícios", "Lista perguntas due diligence consultoria"],
    references: ["Relatórios setoriais públicos LATAM sobre cannabis industrial", "Manuais de supply chain pharma adaptáveis a discussões de rastreio"],
    professorNotes:
      "Atualizar data da aula no slide e citar apenas fontes oficiais com link funcionando institucional parceiros."
  },
  {
    title: "Marca, rótulo e claims permitidos",
    introduction:
      "Marca garante distinguibilidade jurídica; rótulo traduz registros sanitários aplicáveis quando existirem. Claims terapêuticos exuberantes antes de texto regulador costumam ser vetor de fiscalização — ‘natural’ não prova segurança.",
    body: `Leituras racionais combinam marca registrável, classes corretas, textos sanitários obrigatórios, alertas populacionais, QR rastreio quando institucional, país de fabricação e importadores responsáveis conforme lei interna brasileira adaptando exercício papel.\n\nPontos técnicos: rótulo multilingue sincronizado com bula oficial publicada sempre que existirem discrepâncias gera retrabalhos caros recalls.\n\nErros comuns: promessa de cura doença específica; selo ambiental não certificado verdadeira cadeia de descarte compostagem industrial geográfico viável apenas exercício papel didático.\n\nLimitações: design final sempre interdisciplinar jurídico-regulador externo.`,
    objectives: [
      "Aplicar um checklist de leitura a um rótulo fictício deliberadamente incompleto usado apenas em sala.",
      "Separar identidade corporativa da promessa médica dirigida ao consumidor final segundo normas sanitárias e publicitárias aplicáveis.",
      "Reconhecer risco reputacional-fiscal quando afirmativas ambientais aparecem sem base documental."
    ],
    closingSummary:
      "Um rótulo coerente com o texto regulador reduz recall e litígio futuro — a seguir, física segura das embalagens e sustentabilidade verificável.",
    quiz: [
      Q('Frases de cura garantida (“cura insônia definitiva”) em embalagem de produto sanitariamente vigilado tendem a ser:', [
        "Sempre triviais porque internet normalizou o discurso",
        "Sensíveis a fiscalização sanitária e publicitária — exige enquadramento explícito aprovado e assessoria especializada aplicável ao caso real",
        "Substitutos legais de bula sempre",
        "Permitidas se o SKU for só CBD"
      ], 1),
      Q("Divergência entre texto de rótulo e bula ou ficha publicada oficialmente habitualmente sugere pedagogicamente que:", [
        "Só há impacto cosmético de layout",
        "Há risco sanitário alto e necessidade retrabalhar comunicação antes de novos lotes comerciais segundo orientação técnico‑jurídica própria",
        "Amplifica tributos automaticamente a favor da empresa sempre",
        "Elimina obrigações de rastreio de lote"
      ], 1),
      Q("Busca superficial de marca antes de protocolo registral aumenta habitualmente:", [
        "Neutralidade garantida sempre perante disputas PI",
        "Risco futuro de conflitos de marca e custos de rebranding — pré‑busca profissional costuma diminuir esse risco",
        "Possibilidades automáticas de registro internacional igual em todos países",
        "Ausência obrigatória de laudos laboratoriais"
      ], 1)
    ],
    media: M.theory,
    materials: ["Rótulos fictícios bilíngues para exercício em sala", "Checklist rápido de classes de marca aplicáveis só como referência de estudo"],
    references: ["Textos sanitários públicos aplicáveis a rotulagem", "Literatura introdutória de propriedade industrial em FMCG medicinal"],
    professorNotes:
      "Evitar usar marcas vivas ou em litígio nos exemplos; preferir marca fictícia totalmente nova."
  },
  {
    title: "Embalagem infantil-proof e sustentabilidade (noções)",
    introduction:
      "Resistência à abertura infantil e projeto de materiais com menor impacto ambiental são combinados em mercados onde agências sanitárias e defesa do consumidor colidem com metas ESG de marca. A sala discute princípios; ensaios físicos e relatórios ciclo‑de‑vida ficam com laboratório e consultoria ambiental.",
    body: `Normas internacionais sobre empacotamentos resistentes a criança (por exemplo famílias ASTM/ISO citadas em manuais públicos) inspiram exigências brasileiras sempre que houver portaria vigente — aluno deve sempre cruzar texto oficial com data. Sustentabilidade exige encadeamento regional de descarte industrial quente ou reciclagem mecânica plausível antes de selo verde em rótulo institucional fictício exercício sala.\n\nPontos técnicos: torque geometria tampa blister; registro data revisão embalagem combinando labor acreditado quando lei exigir; logística revertida depende parceiro logístico juridicamente válido região alvo.\n\nErros comuns: prometer compostagem doméstica plena sem infraestrutura real; confundir packaging bonito apenas marketing com certificação física abertura infantil.\n\nLimitações: THCProce não executa ensaio mecânico credenciado apenas teoria.`,
    objectives: [
      "Distinguir obrigação física regulada de fecho infantil de slogan de marketing decorativo.",
      "Mencionar dois elementos típicos de um relatório de ciclo de vida (LCA) usado apenas como exercício de sala sobre sustentabilidade de embalagem fictícia.",
      "Reconhecer risco fiscal reputacional afirmativas ambientais sem lastro documental terceiro auditor."
    ],
    closingSummary:
      "Segurança física do frasco antecede storytelling verde — na sequência veremos cadeia de suprimentos e indicadores de qualidade na chegada de matéria‑prima.",
    quiz: [
      Q("Comunicar embalagem apenas ‘100% compostável’ sem trilha regional descarte industrial comprovada costuma:", [
        "Neutral fiscal ambiental sempre",
        "Expor greenwashing reputacional fiscal segundo casos reais orientação jurídica ambiental externa fora curso",
        "Eliminar registro sanitário obrigatório",
        "Substituir laudo canabinóide laboratorial"
      ], 1),
      Q("Ensaios torque geometria tampa habituais embalagens infantil proof competem primariamente:", [
        "Departamento marketing redes sociais exclusivamente",
        "Engenharia de segurança de produto e laboratórios externos acreditados, quando a legislação assim exigir",
        "Equipe apenas design gráfico somente sempre",
        "Fornecedor solvente extracção apenas"
      ], 1),
      Q("Logística reversa viável apenas se:", [
        "Hashtag verde TikTok apenas",
        "Infraestrutura regional compatível com contratos e parceiros logísticos externos habilitados juridicamente",
        "Elimina obrigações fiscais automaticamente sempre",
        "Substitui estatutos societários cooperativistas"
      ], 1)
    ],
    media: M.theory,
    materials: ["Cartaz comparativo físico segurança infantil versus marketing", "Exercício de uma página: perguntas simplificadas de LCA aplicadas a caso fictício"],
    references: ["ASTM summaries públicos segurança embalagens apenas discussão", "Literatura economia circular embalagens introdutorio apenas"],
    professorNotes:
      "Preferir exemplos com marca totalmente fictícia e embalagens vazias como objeto de demonstração em sala."
  },
  {
    title: "Cadeia de suprimentos e qualidade",
    introduction:
      "Matérias‑primas canábicas exigem rastreio, critérios de aceite na portaria da fábrica e documentação alinhada a laudos quando aplicável. Esta aula sintetiza o que um microprodutor deve pedir antes de assinar um fornecedor de biomassa ou de insumo transformado fictício apenas para fins escolares.",
    body: `Mapa típico: fornecedor certificado onde exigível → especificação escrita → amostragem pré‑contrato → lote com código único → recebimento com checklist físico‑químico‑documental quando couber ao perfil institucional do exercício.\n\nPontos técnicos: COA ou equivalente institucional; armazenamento com temperatura e umidade controladas segundo plano de qualidade fictício sala; discrepâncias acionam quarentena documentada.\n\nErros comuns: aceitar lote sem rastreio porque preço é baixo; misturar lotes antes de homologação interna; treinar equipe em GMP só no papel sem simulacro de não conformidade.\n\nLimitações: THCProce não audita fornecedores reais — apenas quadro pedagógico.`,
    objectives: [
      "Listar cinco passos mínimos de qualificação de fornecedor em cenário regulado hipotético.",
      "Explicar diferença entre especificação de compra e laudo analítico de terceiro.",
      "Propor indicadores simples (prazo, taxa de não conformidade, completude documental) para painel de recebimento fictício."
    ],
    closingSummary:
      "Sem rastreio e critérios de aceite, a fábrica herda risco de lote inteiro — a seguir, como levar o produto ao mercado respeitando temperatura e cadeia logística.",
    quiz: [
      Q("Misturar dois lotes distintos antes de homologação interna costuma:", [
        "Reduzir complexidade documental",
        "Perder rastreabilidade e dificultar recall ou investigação de não conformidade",
        "Substituir necessidade de laudo",
        "Garantir homogeneidade canabinóide automática"
      ], 1),
      Q("Checklist de recebimento útil combina:", [
        "Apenas checagem visual da embalagem",
        "Conferência documental, identificação de lote, condições de transporte e amostras quando previsto no plano de qualidade",
        "Somente fotos para redes sociais",
        "Substituição automática de fiscal sanitário"
      ], 1),
      Q("Quarentena de lote em planta educacional significa principalmente:", [
        "Descarte imediato sem análise",
        "Isolamento documentado até decisão técnica conforme procedimento interno fictício",
        "Venda promocional acelerada",
        "Encerramento automático de contrato fornecedor"
      ], 1)
    ],
    media: M.theory,
    materials: ["Fluxograma A4 fornecedor→recebimento fictício", "Modelo de não conformidade de uma página"],
    references: ["Literatura introdutória de supply chain farmacêutico adaptável", "Guias públicos de boas práticas de documentação de lote"],
    professorNotes:
      "Usar números de lote inventados; nunca citar fornecedores reais em exercícios."
  },
  {
    title: "Distribuição, cold chain quando aplicável",
    introduction:
      "Produtos sensíveis a temperatura ou luz exigem desenho logístico explícito. Mesmo em exercícios de sala, alunos precisam distinguir transporte comum de cadeia fria documentada e treinada.",
    body: `Cold chain implica monitoramento (dataloggers, alertas), SOP de quebra de temperatura e parceiros com capacidade comprovada no trecho real ou hipotético do caso. Distribuição regulada adiciona lacres, documentos de trânsito e segregação de cargas conforme jurisdição aplicável ao fictício.\n\nPontos técnicos: janela térmica por SKU; tempo máximo fora da faixa; plano de contingência se veículo avariar em rota simulada.\n\nErros comuns: confiar em isopor sem registro de temperatura; misturar produto canábico com alimentos sem segregação em roteiro de risco; prometer prazo de entrega sem buffer para fiscalização em fronteira exercício.\n\nLimitações: não operamos frota real — conceitos apenas.`,
    objectives: [
      "Definir cold chain em três frases aplicáveis a distribuição hipotética.",
      "Indicar três registros mínimos que sustentam defesa em auditoria logística fictícia.",
      "Reconhecer quando transporte comum basta versus quando monitoramento contínuo é prudente."
    ],
    closingSummary:
      "Logística mal desenhada destrói qualidade de laboratório — em seguida, marketing precisa refletir o que a regulamentação e a ética permitem dizer.",
    quiz: [
      Q("Quebra de temperatura documentada sem plano de ação costuma sugerir:", [
        "Continuidade automática de comercialização",
        "Risco sanitário e necessidade de procedimento de segregação e decisão documentada",
        "Apenas desconto de marketing",
        "Substituição de rótulo apenas"
      ], 1),
      Q("Dataloggers em transporte servem principalmente para:", [
        "Substituir motorista",
        "Gerar evidência objetiva de perfil térmico ao longo do trajeto",
        "Aumentar seguidores em rede social",
        "Eliminar necessidade de seguro de carga"
      ], 1),
      Q("Segregação de cargas em roteiro regulado visa:", [
        "Otimizar peso apenas",
        "Reduzir contaminação cruzada e erros de expedição conforme matriz de risco",
        "Dispensar documentação",
        "Substituir licença de transporte"
      ], 1)
    ],
    media: M.theory,
    materials: ["Gráfico temperatura vs. tempo fictício", "Checklist quebra de frio de meia página"],
    references: ["Manuais introdutórios chain of custody alimentos/fármacos", "Normas de transporte de amostras sensíveis (visão geral)"],
    professorNotes:
      "Enfatizar que requisitos reais variam por produto e jurisdição; encaminhar dúvidas a consultoria."
  },
  {
    title: "Marketing ético e conformidade",
    introduction:
      "Campanhas agressivas podem colidir com regras sanitárias, de publicidade infantil e de plataformas digitais. A equipe de indústria precisa alinhar criativos, jurídico e compliance antes do primeiro anúncio pago.",
    body: `Princípios: não prometer efeito clínico não aprovado; evitar estímulo a uso por menores; ser transparente sobre limitações e riscos quando o enquadramento permitir comunicar benefícios; respeitar políticas de mídia paga que restringem substâncias controladas.\n\nPontos técnicos: arquivo de aprovação interna por peça; versão datada de copy aprovada; registro de influenciadores e contratos de divulgação responsável no exercício fictício.\n\nErros comuns: before/after médico sem base; depoimentos que violam privacidade; hashtags que sugerem consumo recreativo ilegal no contexto local discutido em sala.\n\nLimitações: esta aula não substitui parecer de publicidade regulada por órgão competente.`,
    objectives: [
      "Aplicar checklist ético–regulatório a três peças de marketing fictícias.",
      "Identificar três tipos de claim de alto risco em cannabis medicinal industrial.",
      "Propor fluxo interno de aprovação criativo antes de publicação."
    ],
    closingSummary:
      "Criatividade sem trilha de compliance é passivo contingente — a seguir, organizar operação diária e sistemas em microempresa.",
    quiz: [
      Q("Depoimento de paciente identificável sem consentimento formal costuma:", [
        "Ser neutro legalmente",
        "Gerar risco civil e regulatório de privacidade",
        "Substituir registro de produto",
        "Validar eficácia terapêutica"
      ], 1),
      Q("Claim de cura para doença específica em peça comercial, sem suporte regulatório, tende a:", [
        "Ser tolerada se cor for verde",
        "Atrair fiscalização sanitária e publicitária",
        "Eliminar necessidade de rótulo",
        "Aumentar seguidores sem risco"
      ], 1),
      Q("Arquivo de peças aprovadas internamente serve para:", [
        "Substituir contabilidade",
        "Auditoria interna, continuidade e defesa em eventual questionamento",
        "Evitar treinamento de equipe",
        "Cancelar necessidade de ERP"
      ], 1)
    ],
    media: M.theory,
    materials: ["Três mockups fictícios para revisão em grupo", "Modelo de ata de aprovação de campanha"],
    references: ["Códigos de ética publicitária introdutórios", "Políticas públicas de plataformas sobre substâncias restritas (resumos)"],
    professorNotes:
      "Proibir uso de imagens reais de pacientes; cenários inteiramente inventados."
  },
  {
    title: "Operação e ERP em microempresa canábica",
    introduction:
      "Planilhas crescem até quebrar rastreio. Um ERP modesto bem parametrizado costuma custar menos que retrabalho e perda de lote — desde que processos claros precedam o software.",
    body: `Escopo mínimo: cadastro de SKU, movimentação de lote, ordem de produção simplificada, estoque físico versus sistema, triggers de recompra insumo fictício sala.\n\nPontos técnicos: perfis de usuário (quem pode ajustar inventário crítico); backup; integração futura com fiscal/e‑commerce apenas como horizonte; KPIs simples (por exemplo entregas no prazo combinado — OTIF), tratados apenas como métricas de exercício em sala.\n\nErros comuns: duplicar itens por grafia inconsistente; operar dois sistemas paralelos sem conciliação mensal obrigatória; ignorar auditoria física porque ‘é pequeno’.\n\nLimitações: recomendações genéricas; escolha de fornecedor de software é decisão própria com TI e contador.`,
    objectives: [
      "Priorizar quatro módulos de ERP antes de firulas em microplanta fictícia.",
      "Descrever conciliação estoque físico–sistema mensal em cinco linhas.",
      "Listar três KPIs operacionais alcançáveis sem Big Data."
    ],
    closingSummary:
      "Dados íntegros sustentam qualidade e fiscal — próximo tema é integrar comunidade agrícola local sem comprometer conformidade.",
    quiz: [
      Q("Cadastro duplicado de mesmo insumo por grafias diferentes habitualmente causa:", [
        "Melhor redundância de segurança",
        "Erros de planejamento de compras e ruptura ou excesso artificial",
        "Eliminação de inventário físico",
        "Upgrade automático de licença"
      ], 1),
      Q("Conciliação estoque físico vs. sistema objetiva:", [
        "Somente tributos",
        "Detectar fugas documentais ou divergências reais antes de virar problema de lote comercializado",
        "Substituir laudo laboratorial",
        "Publicidade em redes"
      ], 1),
      Q("Perfis de usuário separados editar inventário crítico buscam:", [
        "Somente cosmética de RH",
        "Segregar funções para reduzir fraude erro e aumentar auditabilidade",
        "Eliminar treinamentos",
        "Evitar uso de nuvem"
      ], 1)
    ],
    media: M.theory,
    materials: ["Planilha estoque antes/depois normalização SKU fictício", "Mini diagrama de papéis e permissões"],
    references: ["Artigos populares ERP PME aplicáveis conceitualmente", "Literatura lean office introdutória"],
    professorNotes:
      "Não endossar marca de software específico; manter neutro empresarial."
  },
  {
    title: "Parceria com produtores locais (modelos)",
    introduction:
      "Indústria que compra flora local pode criar vínculos de desenvolvimento regional — ou conflitos de preço e qualidade mal contratados. Modelos formais antecipam colheita, volume e penalidades educacionais apenas em papel.",
    body: `Formatos típicos: contrato agrícola com preço teto/piso fictício; cooperação técnica com visita pré‑colheita checklist; segunda qualidade destinada remediação institucional exercício apenas.\n\nPontos técnicos: especificação de THC/CBD apenas quando lei permitir testagem e referência válida ao laboratório pactuado na narrativa sala; pagamento contra entrega documentada.\n\nErros comuns: promessa verbal de compra total da safra sem capacidade instalada; falta cláusula de rejeição documentada quando fora de especificação; ignorar inclusão socioambiental apenas discursiva.\n\nLimitações: sem assessoria agronômica individualizada neste módulo.`,
    objectives: [
      "Comparar três estruturas de parceria (spot, contrato safra, joint educacional fictício) em dois parágrafos.",
      "Definir gatilhos documentados aceitável/rejeição de lote no exercício hipotético.",
      "Reconhecer benefício reputacional quando contratos são transparentes com comunidade vizinha."
    ],
    closingSummary:
      "Contrato clarifica expectativas mútuas — em seguida, olhamos para exportação só como panorama de complexidade.",
    quiz: [
      Q("Contrato apenas verbal de compra inteira da safra costuma:", [
        "Ser ideal para auditoria",
        "Gerar alta ambiguidade judicial e qualitativa quando volumes ou preços divergem",
        "Substituir licença sanitária",
        "Eliminar necessidade especificação"
      ], 1),
      Q("Cláusulas de especificação mínima de matéria-prima servem para:", [
        "Tornar relatório instagram obrigatório",
        "Alinhar direitos de aceite técnico e evitar brigas só no final da colheita",
        "Substituir rastreio de lote",
        "Eliminar papel do laboratório"
      ], 1),
      Q("Parceria técnica com visita antes da colheita ajuda sobretudo a:", [
        "Somente foto para marketing sem critérios",
        "Antecipar desvios sanitários agrícolas e revisar cronograma de entrega esperado fictício sala",
        "Dispensar recebimento com checklist",
        "Fixar tributação internacional automaticamente"
      ], 1)
    ],
    media: M.theory,
    materials: ["Quadro comparativo três modelos parceria A3", "Rascunho de cláusula de qualidade incompleta para completar"],
    references: ["Contratos agrícolas introdutórios públicos país vizinhos apenas referência método", "Estudos desenvolvimento cadeias curtas hortícolas"],
    professorNotes:
      "Reforçar que modelos são ilustrativos; contrato real precisa escritório agrário."
  },
  {
    title: "Exportação: barreiras e documentação (visão)",
    introduction:
      "Exportar flora, insumos ou derivados atravessa barreiras fitossanitárias, sanitárias, tributárias e aduaneiras que mudam de destino para destino. A aula desenha o mapa lexical; projeto real exige banca especializada país a país.",
    body: `Barreiras comuns incluem listas de substâncias controladas no país de destino (consultar sempre o texto oficial atualizado), exigências fitossanitárias para material vegetal, certificado de origem quando aplicável e harmonização entre rótulo doméstico e exigências do importador no cenário hipotético de sala.\n\nPontos técnicos: classificação aduaneira correta (NCM ou equivalente); versões de embalagem e rótulo para exportação frequentemente diferentes das destinadas ao mercado interno; separação jurídica entre canais exportação e doméstico em qualquer simulação de governança.\n\nErros comuns: assumir reciprocidade simplista entre vizinhos da América Latina; iniciar despacho sem autorizações de expedição exigidas no país de origem quando a lei assim determinar.\n\nLimitações: esta aula não presta orientação alfandegária vinculante.`,
    objectives: [
      "Enumerar quatro âmbitos de barreira típicos em exportação canábis hipotética.",
      "Explicar como classificação aduaneira incorreta pode atrasar liberações e gerar retrabalhos e multas em cenários reais típicos.",
      "Formular perguntas iniciais a consultoria dual origem‑destino."
    ],
    closingSummary:
      "Exportação é filme de alto orçamento regulatório — fechamos o curso com carreira e competências úteis no setor regulado.",
    quiz: [
      Q("Assumir que licença local origem garante entrada automática destino habitualmente está:", [
        "Correto sempre",
        "Errado porque o país de destino pode exigir regime inteiramente diverso ao da origem",
        "Neutro",
        "Substituto apenas de marca"
      ], 1),
      Q("Documentação sanitária e fitossanitária combinadas objetivam sobretudo:", [
        "Viralização marketing",
        "Demonstrar segurança e conformidade sanitária e fitossanitária no trânsito internacional esperado pela alfândega de destino",
        "Eliminar tributos sempre",
        "Substituir controle de qualidade planta origem sempre"
      ], 1),
      Q("Nomenclatura aduaneira incorreta no shipping costuma causar:", [
        "Aceitação imediata",
        "Retenção na alfândega, multas e retrabalho de classificação e documentação",
        "Somente problema visual rótulo",
        "Licença automática destino"
      ], 1)
    ],
    media: M.theory,
    materials: ["Diagrama papel quatro âmbitos barreira exportação fictícia", "Lista de oito perguntas consultoria exportação papel"],
    references: ["Portais públicos alfândega importação/exportação apenas leituras gerais", "Relatórios setoriais canábis internacional apenas estatístico não normativo aqui"],
    professorNotes:
      "Atualização regulatória internacional rápida: pedir sempre confirmação datada escritório especializado externo ao curso."
  },
  {
    title: "Carreira e habilidades no setor regulado",
    introduction:
      "O setor canábis industrial valoriza menos o ‘influenciador’ espontâneo e mais profissionais com literacia regulamentar, dados de qualidade e comunicação sóbria entre áreas.",
    body: `Competências frequentemente valorizadas: ponte entre qualidade e produção, dados confiáveis ao longo da cadeia de suprimentos, relacionamento institucional e comunicação clara entre jurídico, operação e marketing.\n\nDesenvolvimento contínuo: acompanhar portarias e notas técnicas; participar de redes profissionais do setor; considerar formações em boas práticas da indústria de alimentos ou fármacos quando combinarem com a trajetória desejada.\n\nErros comuns em currículos e entrevistas: destacar apenas “hype” sem projetos mensuráveis; omitir períodos sensíveis de forma pouco ética ou opaca em relação ao que a lei permite contar; dominar apenas cultivo sem noções de formulação quando a vaga visa acabamento industrial.\n\nLimitações: esta aula não agenda entrevistas nem substitui serviços de recrutamento; orientações sobre vagas são genéricas.`,
    objectives: [
      "Montar roadmap de desenvolvimento profissional 12 meses fictício combinando técnico e compliance.",
      "Identificar duas lacunas típicas de candidatos a coordenação QA industrial canábis.",
      "Redigir um parágrafo de posicionamento profissional coerente com ética e com os limites legais da comunicação (exercício de sala)."
    ],
    closingSummary:
      "Este curso oferece mapa lexical e exercícios de sala para você dialogar com advogados, responsáveis sanitários e contadores — cada projeto real exige equipa externa alinhada às normas vigentes no caso concreto.",
    quiz: [
      Q("Portfolio profissional sólido no setor costuma destacar antes de hype redes:", [
        "Somente seguidores",
        "Documentação de projetos, processos, dados e treinamentos de compliance quando aplicável ao percurso",
        "Eliminações laudos externos sempre",
        "Substitui necessidade estudar lei"
      ], 1),
      Q("Especialização exclusivamente hortícola sem noções de formulação industrial pode:", [
        "Ser suficiente sempre indústria acabamento",
        "Limitar a contribuição quando o trabalho industrial exige físico‑química de formulação no produto final",
        "Eliminar tributos",
        "Substituir licença"
      ], 1),
      Q("Atualização contínua portarias e portais sanitários faz parte de:", [
        "Somente hobbies",
        "Responsabilidade profissional básica em setor intensamente regulado",
        "Marketing exclusivamente viral",
        "Substituição assembleia sócios"
      ], 1)
    ],
    media: M.theory,
    materials: ["Modelo de roadmap de 12 meses (exercício individual)", "Rúbrica para avaliar parágrafos de posicionamento no CV"],
    references: ["Mapas ocupacionais de setores regulados (consulta rápida)", "Guias introdutórios de carreira em qualidade da cadeia de suprimentos"],
    professorNotes:
      "Opcionalmente convidar profissional de RH externo com aviso claro de que não há garantia de vaga nem vínculo com a marca THCProce."
  }
];
