import type { LessonStreamContent } from "../types";
import { M, Q } from "./_helpers";

/** Genética & sementes — 10 aulas (manual THCProce; educação técnica — não orienta infração sanitária nem substitui engenheiro agrônomo onde exigido). */
export const GENETICA_LESSONS: readonly LessonStreamContent[] = [
  {
    title: "Reprodução sexual e estabilidade de linhagem",
    introduction:
      "Reprodução sexual recombina alelos a cada geração; ‘estabilidade’ no mercado de sementes descreve variância aceitável de um conjunto de traços, não um genótipo congelado para sempre. A aula alinha vocabulário de planta, lotes comerciais e expectativas realistas de homogeneidade.",
    body: `Quando dois parentais heterozigóticos em muitos locos se cruzam, a F2 explode em combinações — por isso linhagens ‘estáveis’ costumam ser resultado de backcross, seleção intensiva e documentação de famílias. Fenótipo é genótipo × ambiente × manejo; relatório de campo honesto separa o que veio do DNA do que veio de VPD, substrato e pragas.

Pontos técnicos: distinção F1 comercial (primeira geração de dois parentais escolhidos) versus população massal; conceito de variância fenotípica intra‑lote.

Erros comuns: vender F2 solta como ‘mesma genética’ do clone de vitrine; ignorar polinização cruzada em outdoor coletivo; confundir estabilidade aromática com estabilidade agronômica.

Limitações: THCProce não fornece protocolo de produção comercial de sementes nem validação fitossanitária — apenas quadro conceitual.`,
    objectives: [
      "Explicar por que estabilidade de linhagem é distribuição de traços, não clone digital infinito.",
      "Relacionar recombinação sexual com variância observada entre irmãos de semente.",
      "Distinguir F1 comercial de população massal sem jargão marketeiro vazio."
    ],
    closingSummary:
      "Sexual gera diversidade — domar essa diversidade é ofício de registro e seleção; o próximo bloco trata feminização com lupa de risco e transparência.",
    quiz: [
      Q("Em cruzamento dialélico amplo sem seleção, a geração seguinte tende a:", [
        "Ser geneticamente idêntica ao parental de vitrine",
        "Exibir maior variância fenotípica entre indivíduos irmãos",
        "Eliminar alelos recessivos automaticamente",
        "Fixar THC somente pelo rótulo"
      ], 1),
      Q("F1 comercial, no sentido usual de catálogo, refere‑se a:", [
        "Qualquer semente multicolorida",
        "Primeira geração de cruzamento controlado entre dois parentais definidos pelo mantenedor",
        "Clone enraizado",
        "Planta autoflorescente sempre"
      ], 1),
      Q("Fenótipo depende exclusivamente do genótipo?", [
        "Sim, ambiente é decoração",
        "Não — ambiente e manejo modulam expressão; documentar condições é parte da ciência de campo",
        "Só em laboratório",
        "Só para CBD"
      ], 1)
    ],
    media: M.theory,
    materials: ["Pedigree esquemático fictício três gerações", "Tabela variância traços morfológicos exercício papel"],
    references: ["Textos de genética vegetal introdutória", "Literatura de melhoramento de populações em plantas alógamas"],
    professorNotes:
      "Usar diagramas de Punnett só como ilustração — canhamo é altamente heterozigoto na prática comercial."
  },
  {
    title: "Feminização: ciência, riscos e transparência",
    introduction:
      "Sementes feminizadas nascem de indução de flores masculinas em planta feminina via estresse químico ou genética de linhagem especializada. Comunicar o método e seus riscos (hermafroditismo residual, variabilidade) é dever ético do educador — não marketing de promessa silenciosa.",
    body: `Indutores químicos perturbam etileno e cascatas hormonais fazendo tessuto masculino aparecer em genótipo feminino; taxa de êxito, estabilidade e segurança de bancada variam enormemente conforme técnico, época foliar e variabilidade parental. Feminização genética (linhagens com predisposição) reduz uso de pulverização mas introduz outros trade‑offs documentados pela casa mantenedora.

Pontos técnicos: probabilidade residual de masculo ou hermafrodita; screening precoce em viveiro; etiquetar ‘fem’ apenas com critérios internos públicos aos compradores institucionais quando aplicável.

Erros comuns: ocultar taxa observada de intersexo em lote comercial fictício estudantil escrever; misturar pólen induzido de duas linhas sem tracking; usar linguagem pseudo‑genética ‘100% garantido século XXI’ sem dados.

Limitações: sala THCProce não ensina formulário de pulverização nem manejo agronômico legal local — apenas ciência verbal e risco conceitual.`,
    objectives: [
      "Descrever mecanismo simplificado por que planta feminina pode produzir pólen induzido.",
      "Listar dois riscos fenotípicos residuais pós‑feminização relevantes ao produtor sério.",
      "Formular comunicado transparente de incerteza sem medo ao consumidor institucional leigo."
    ],
    closingSummary:
      "Feminização é engenharia de sexo aplicada à inflorescência — detalhar ética técnica abre porta para STS em ambiente apenas educativo.",
    quiz: [
      Q("Hermafroditismo residual pós‑feminização deve ser comunicado porque:", [
        "Nunca ocorre",
        "Impacta decisões de espaçamento, inspeção e descarte sanitário na realidade agrícola",
        "Significa sempre genética de macho XY humano confundido",
        "Elimina exigência de rótulo"
      ], 1),
      Q("‘100% feminizada’ absoluto sem ressalvas em campanha comercial tende a:", [
        "Ser sempre preciso",
        "Conflitar com variância biológica observável — transparência estatística é mais honesta",
        "Substituir estatuto jurídico",
        "Provar estabilidade infinita"
      ], 1),
      Q("Feminização genética versus química distingue‑se didaticamente por:", [
        "Cor da embalagem",
        "Inserção de mecanismos via linhagem versus indução via protocolo químico — trade‑offs distintos",
        "Preço zero sempre",
        "Ausência de DNA"
      ], 1)
    ],
    media: M.theory,
    materials: ["Fluxograma decisão transparência rótulo fictício", "Mini tabela taxa intersexo exercício teórico"],
    references: ["Revisões de fisiologia floral em Cannabis", "Textos de melhoramento sobre estabilidade sexual"],
    professorNotes:
      "Reforçar que comercialização de sementes segue quadro legal local — curso não legaliza ato do aluno."
  },
  {
    title: "STS e prática segura (nível educacional)",
    introduction:
      "Solução de tiossulfato de prata (STS) é protocolo clássico citado em literatura de indução masculina em plantas femininas. A aula limita‑se a princípios de segurança química, leitura de SDS, ventilação e encaminhamento profissional — sem receita operacional passo a passo nem incentivo a manipulação ilegal.",
    body: `Prata e agentes redutores exigem EPI e descarte de efluentes conforme norma institucional e legislação ambiental local. Aplicação foliar comercial pertence a ambiente regulado; laboratório escolar deve citar apenas analogias com outros sistemas botânicos ou usar simulação escrita. Documentar lote de reagente, data de preparo (quando laboratório externo legal faria) e responsável técnico é parte da governança, não do hobby sem registro.

Pontos técnicos: dose‑resposta e janela fenológica alteram resultado; contaminação cruzada de pólen induzido exige isolamento espacial real, não só desejo.

Erros comuns: misturar em cozinha doméstica com descarte em pia; ensinar concentrações copiadas de fórum sem validação; romantizar ‘química caseira’ sem SDS.

Limitações: qualquer prática real de STS exige supervisão legal, licenças e profissionais habilitados fora do escopo THCProce genérico.`,
    objectives: [
      "Listar três linhas de SDS que estudante deve saber localizar antes de qualquer química real (hipotético).",
      "Explicar por que ambiente doméstico sem engenharia de exaustão inadequado é reprovado didaticamente.",
      "Reconhecer que protocolo foliar completo não é conteúdo reproduzível na web escolar sem marcos legais."
    ],
    closingSummary:
      "Química de indução é séria como qualquer agroquímico de bancada real — passamos da molécula ao olhar fenotípico de seleção de mães.",
    quiz: [
      Q("No ensino THCProce, manipulação prática de STS deve ocorrer:", [
        "Em qualquer cozinha residencial sem aviso",
        "Apenas sob marcos legais e supervisão profissional externa à escola — em sala, só princípios e simulação documental",
        "Sem SDS porque é ‘natural’",
        "Somente à noite"
      ], 1),
      Q("SDS é consultado principalmente para:", [
        "Decorar logotipo",
        "EPI, manuseio, emergência e descarte conforme fabricante e norma aplicável",
        "Substituir agrônomo",
        "Provar telepatia"
      ], 1),
      Q("Pólen induzido exige isolamento porque:", [
        "Cores bonitas",
        "Contamina geneticamente lotes vizinhos de propósito distinto",
        "Evita fotossíntese",
        "Substitui água"
      ], 1)
    ],
    media: M.lab,
    materials: ["Ficha simulada SDS genérica (sem marca) só leitura", "Checklist ‘não fazer em casa’ para discussão ética"],
    references: ["Normas de segurança em laboratório químico escolar", "Literatura agronômica sobre indução floral — trechos teóricos"],
    professorNotes:
      "Se campus real tiver química supervisionada, cruzar com coordenação e corpo jurídico antes de qualquer demo."
  },
  {
    title: "Seleção fenotípica e banco de mães",
    introduction:
      "Seleção fenotípica é observar com protocolo mínimo: datas, fotos de referência, cheiros descritos com vocabulário analítico (não hype), resposta a estresse leve documentada e lixo genético descartado cedo. Banco de mães é arquivo vivo de genótipos validados — não vitrine Instagram sem registro.",
    body: `Matriz de notas: vigor vegetativo, arquitetura para o sistema produtivo alvo, resistência observada a pragas corriqueiras (sem prometer resistência absoluta), estabilidade de aroma após cura simulada em exercício, e ausência de intersexo sob condições informadas. Clone ou filhote de mãe documentada herda risco se sanidade vegetal decair — por isso indexar PCR fitossanitário cabe a laboratório credenciado externo, não à opinião do monitor.

Pontos técnicos: replicação — um indivíduo excepcional pode ser outlier estatístico; repetir observação em subclones reduz pânico de marketing.

Erros comuns: escolher só ‘maior bud’ ignorando estrutura radicular e sanidade; confundir ‘mãe velha’ com estabilidade genética infinita; misturar identificadores de frasco.

Limitações: desempenho comercial legal depende de registro sanitário próprio ao negócio do aluno após formação.`,
    objectives: [
      "Montar formulário papel de campo com oito categorias fenotípicas objetivas fictícias.",
      "Discutir por que fenótipo excepcional isolado não implica linhagem já estabilizada.",
      "Planejar nomenclatura mínima não ambígua para tubos clone/mãe em exercício."
    ],
    closingSummary:
      "Mãe boa mal anotada vira rumor; mãe mediana bem documentada pode alimentar cruzamentos honestos na próxima aula sobre planejamento.",
    quiz: [
      Q("Seleção baseada apenas em uma planta fenomenal singular:", [
        "Prova sempre estabilidade de F2 inteira sem mais dados",
        "Pode ser outlier — replicação antes de propaganda comercial minimiza erro caro",
        "Elimina necessidade de sanitização",
        "Substitui backcross sempre"
      ], 1),
      Q("Banco de mães saudável exige institucionalmente:", [
        "Só TikTok horizontal",
        "Indexação sanitária, datas e segregação física quando política coop exige",
        "Ausência total de código",
        "Iluminação rosa obrigatória"
      ], 1),
      Q("Descrição fenotípica profissional evita:", [
        "Registrar ambiente junto observação fenotipo",
        "Adjetivos vazios sem referência estrutura inflorescência e folhas",
        "Notas repetidas",
        "Identificadores únicos por indivíduo"
      ], 1)
    ],
    media: M.theory,
    materials: ["Modelo formulário campo THCProce PDF fictício", "Jogo cartas outliers vs tendência média sala"],
    references: ["Textos livres de seleção massal em cultivos vegetais", "Notas epidemiológicas básicas sanidade clones"],
    professorNotes:
      "Demonstrar com dados simulados; nunca exibir coordenadas GPS reais de viveiro ilegal mesmo hipotético."
  },
  {
    title: "Cruzamentos planejados vs populacionais",
    introduction:
      "Cruzamento planejado possui objetivo explícito (fixar aroma, recuperar vigor, introgressão sanitária pretendida pelo mantenedor técnico) e dois parentais nomeados antes do ato reprodutivo. População massal permite diversidade alta porém prognosticabilidade menor — dois modelos legítimos com narrativas distintas para o aluno empreendedor.",
    body: `Backcross concentra alelos de interesse enquanto tenta limpar região indesejada após introgressão; diallel amplo explora combinações para descoberta. Explicar ‘reverse’ comercial exige tabela de quem polinizou quem — esquecimento de seta no diagrama gera caos de propriedade intelectual informal.

Pontos técnicos: endogamia depressão versus heterose; tamanho efetivo populacional mínimo para não colapsar variância.

Erros comuns: misturar pólen de três machos induzidos numa única inflorescência sem etiqueta; abrir população comercial sem plano de seleção — vira loteria sem narrativa.

Limitações: propriedade de germoplasma e MTAs competem a contratos reais; aula não redige contrato.`,
    objectives: [
      "Diagramar cruzamento planejado simples com setas parentais nomeados.",
      "Contrastar vantagens de população massal frente a programa fechado com objetivo.",
      "Mencionar endogamia depressão em duas frases técnicas corretas."
    ],
    closingSummary:
      "Planejamento genético é logística de pólen e de intenção — seguimos para notebooks de pequeno melhorador e registro replicável.",
    quiz: [
      Q("Cruzamento populacional amplamente aleatório sem seleção sistemática frequentemente:", [
        "Fixa todas traits em uma geração",
        "Gera alta variância — exige programa de seleção paralelo ou aceita dispersão fenotípica",
        "Elimina THC automaticamente",
        "Dispensa nomenclatura"
      ], 1),
      Q("Backcross típico busca sobretudo:", [
        "Apenas aumentar hashtags",
        "Recuperar fundo parental enquanto retém introgressão pontual focal",
        "Extinguir heterozigoto sempre",
        "Destruir variância"
      ], 1),
      Q("Diagrama incompleto (‘quem polinizou quem’) prejudica especialmente:", [
        "Cor do vídeo apenas",
        "Rastreio de propriedade informal e decisões seguintes de retrocruzamento ou venda genética",
        "Tipo de régua utilizada em desenho",
        "Tipo de solvente apenas"
      ], 1)
    ],
    media: M.theory,
    materials: ["Template diagrama pedigree setas coloridas papel", "Planilha trade‑off populacional versus linhagem fechada"],
    references: ["Capítulos de melhoramento vegetal sobre heterose", "Literatura de introgressão em culturas heterozigóticas"],
    professorNotes:
      "Se discutir IP de cultivar, mencionar apenas conceito — jurídico patenteável varia país."
  },
  {
    title: "Breeding de pequena escala e registro",
    introduction:
      "Pequena escala com registro mimético (‘notebook breeding’) combina foto datada, texto de objetivo, genealogia presumida e resultado de campo — mesmo sem campo real no curso — para treinar compliance mental futuro quando negócio exigir rastreamento sanitário.",
    body: `Cada ciclo registra entrada de material (fonte institucional, lote quando existir COA paralelo ornamental), objetivo fenotípico explícito, ambiente médio declarado e falhas (praga tardia descartando família inteira fictícia etc.). Replicação ano‑a‑ano vira reputação quando legalmente permissível — ausência de registro é marketing frágil sob auditoria coop.

Pontos técnicos: formato digital versionado append‑only onde cooperativa assim definir política TI; hashing simples arquivo PDF relatório coop discutido em laboratório coop.

Erros comuns: apagar registros quando resultado comercial ficou constrangedor — destrói valor de seleção retrospectiva ética boa mesmo.

Limitações: não implementamos servidor THCProce de verdade nesta apostila.`,
    objectives: [
      "Criar esqueleto de notebook com seções obrigatórias mínimas em cinco tópicos.",
      "Discutir versionamento ético contra apagar dados negativos de seleção.",
      "Associar reputação coop futura ao histórico replicável, não apenas vitrine última safra."
    ],
    closingSummary:
      "Registro pequeno hoje é big data humano legível depois — a seguir formalizamos alelos e locos em linguagem canhamo‑hemp sintética clara.",
    quiz: [
      Q("Eliminar registros só porque safra ficou geneticamente inferior:", [
        "Melhora reputação sempre",
        "Destrói aprendizado e integridade seletiva — versionar falha é melhor prática",
        "É obrigatório ISO",
        "Substitui advogado"
      ], 1),
      Q("Notebook breeding deve conter idealmente:", [
        "Apenas emoji",
        "Genealogia presumida, ambiente, objetivo, falhas e datas",
        "Só preço de venda",
        "Sem identificação lote"
      ], 1),
      Q("Hash leve de PDF coop discutido na aula serve para:", [
        "Minerar Bitcoin",
        "Detectar troca inadvertida de arquivo relatório em diretório compartilhado quando política TI coop assim combinar",
        "Substituir RT",
        "Eliminar COA"
      ], 1)
    ],
    media: M.theory,
    materials: ["Template CSV notebook genética fictício", "Exemplo commit log textual alterações genética documento"],
    references: ["Boas práticas de caderno de campo em melhoramento vegetal", "Governança de dados em pequenas cooperativas — visão geral"],
    professorNotes:
      "Conectar com aula laboratório rastreio lotes quando curso completo for percorrido."
  },
  {
    title: "Genética introdutória aplicada ao canhamo",
    introduction:
      "Canhamo fibra, grão e linhagens canabinoides compartilham biologia Mendeliana em pequenos exemplos, mas o comércio lida com centenas de locos quantitativos — a aula evita ‘gene do THC’ único e ensina herança poligênica e interação com ambiente como regra geral.",
    body: `Locos Mendelianos aparecem em discussões simplificadas (cor, morfologia foliar marcada) mas produto final comercial de interesse é predominantemente quantitativo: múltiplos genes pequenos + ambiente ⇒ distribuição. Epistasia e acoplamento importam aos breeders avançados; ao estudante médio basta firewall cognitivo contra slogan ‘allele milagroso’ solto.

Pontos técnicos: GWAS mencionados academicamente apenas como panorama — interpretação custa bioestatística; curso só nomeia.

Erros comuns: extrapolar dois genes de papel para indústria real; usar ‘dominância THC’ linguisticamente nonsense.

Limitações: conteúdo não substitui curso formal de biotecnologia agrícola.`,
    objectives: [
      "Contrapor exemplo Mendel simples com arquitetura poligênica típica de metabolitos secundários complexos.",
      "Definir interação gene × ambiente aplicada a expressão aromática relatada campo.",
      "Rejeitar rhetórica simplista ‘um gene governa potency’ mantendo cortesia científica."
    ],
    closingSummary:
      "Genética real do canhamo é estatística de muitos genes pequenos — fechamos o arco com semente como banco temporal dessa estatística.",
    quiz: [
      Q("Traço altamente poligênico costuma:", [
        "Seguir sempre 3:1 exato após um cruzamento",
        "Formar distribuição contínua influenciada por muitos locos e ambiente",
        "Ter um único alelo ‘THC master’ consensual",
        "Ignorar ambiente completamente"
      ], 1),
      Q("Afirmação ‘dominância de THC’ sem contexto loco e ambiente é:", [
        "Sempre precisa",
        "Linguisticamente vazia tecnicamente — evitar em comunicação profissional",
        "Obrigatória Anvisa",
        "Prova GWAS automática"
      ], 1),
      Q("Gene × ambiente implica educacionalmente que:", [
        "Ambiente não importa",
        "Mesmo genótipo pode expressar perfis distintos sob manejo distinto",
        "Clone muda DNA diariamente",
        "Semente não herda nada"
      ], 1)
    ],
    media: M.theory,
    materials: ["Curva gaussiana fictícia metabolito vs slogan marketing", "Cartão resposta ‘Mendel sim/não’ exercício"],
    references: ["Revisões quantitativas de arquitetura genética em Cannabis", "Textos de genética quantitativa vegetal introdutória"],
    professorNotes:
      "Se alunos avançados quiserem GWAS profundo encaminhar a curso universitário — não Twitch deepfake."
  },
  {
    title: "Sementes: armazenamento, germinação e viabilidade",
    introduction:
      "Semente é arquivo genético com relógio metabólica; temperatura oscilante, umidade alta e oxigênio residual envelhecem embrião. Ensinar RH/temperatura e teste germinativo controlado forma profissionais que não confundem ‘aparecer broto improvisado na gaveta’ com protocolo repetível.",
    body: `Armazenamento frio‑seco com barreira vapor reduz velocidade deterioração lipidica oxidativa do tecido embriônico — em sala descrever curvas Conceit RH vs expectativa vida média apenas educacionalmente. Tetrazólio ou teste germinativo em papel umedecido aparece como conceito microbiológico; porcentagens passadas em comércio exigem N amostral honesto declarado quando legal.

Pontos técnicos: dormência secundária em algumas linhas; pré‑hidrate com risco fungal se água estagnada improvisada contaminar.

Erros comuns: congelar direto bolsa úmida; misturar sementes de anos diferentes sem marcação ano safra germoplasma; acreditar 100 % germinação comercial sempre.

Limitações: importação/exportação germoplasma segue lei fitossanitária específica — curso apenas avisa.`,
    objectives: [
      "Listar pilares armazenamento frio‑seco e barreira vapor em frase técnica.",
      "Explicar por que teste germinativo exige N amostral e condição documentada.",
      "Relacionar oxidação lipídica ao envelhecimento viabilidade."
    ],
    closingSummary:
      "Semente viável é patrimônio — do patrimônio ao lote comercial coerente falta apenas disciplina de nome e desempenho agregado.",
    quiz: [
      Q("Oscilação térmica repetida em saco mal selado tende a:", [
        "Preservar DNA para sempre",
        "Acelerar deterioração embrião via ciclos umidade parcial e reação lipídica",
        "Aumentar THC da semente",
        "Eliminar fungos automaticamente"
      ], 1),
      Q("Teste germinativo citado teoricamente exige principalmente:", [
        "Apenas cor verde olho nu",
        "Condição padronizada documentada e N amostral interpretável",
        "Congelador doméstico cheio carne",
        "Luz somente vermelha"
      ], 1),
      Q("Misturar safras de semente sem marcação ano:", [
        "Melhora rastreio",
        "Prejudica suporte fenotípico e decisões seguintes campo",
        "É ISO9001 obrigatório",
        "Aumenta viabilidade"
      ], 1)
    ],
    media: M.theory,
    materials: ["Gráfico conceitual RH vs vida útil semente papel", "Protocolo papel germinação fictício dois tratamentos apenas discussão"],
    references: ["Fisiologia de sementes e armazenamento em espécies oleaginosas", "Normas fitossanitárias germoplasma — consulta institucional"],
    professorNotes:
      "Nunca trazer germinação ilegal Brasil em demo real — cenário papel apenas conforme lei local instituição."
  },
  {
    title: "Consistência de lote e nomenclatura",
    introduction:
      "Lote uniforme fenotípico suficientemente estreito para promessa comercial exige mesmo ciclo maternal documentado, menos polinização cruzada acidental e seleção tardia brutal descartando cauda da distribuição — senão nomenclatura de strain vira fantasia coletiva. Nomes estáveis exigem regra interna coop.",
    body: `Nomenclatura ideal liga genealogia presumida versão (‘v 7 pós‑backcross’) a identificadores opacos SKU interno paralelos — permite marketing bonito público mais engenharia série privada coop. Divergência de lotes lado a lado com mesmo nome strain destrói confiança; melhor dois nomes bifurcados honestamente.

Pontos técnicos: coeficiente de variação simples aroma/peso só exercício papel; comunicação apenas qualitativa se estatística faltar.

Erros comuns: renomear lote apenas porque aparece cor roxa diferente mesmo genético base verdadeira; omitir quando lote foi repropagando via semente sexual nova geração.

Limitações: registro marca strain competem escritório marca — curso só boa governança documental.`,
    objectives: [
      "Propor esquema duplo público SKU interno + nome fantasia transparente versão.",
      "Explicar por que variância alta de lote exige split honesto ou downscale promessa comercial.",
      "Calcular exercício CV fictício simples duas amostras peso inflorescência."
    ],
    closingSummary:
      "Uniformidade é estatística + processo — com processo e nomes alinhados, marketing genético finalmente pode falar sem autoengano na última aula.",
    quiz: [
      Q("Mesmo nome comercial em dois lotes com variância aromática incompatível com promessa:", [
        "Fortalece reputação sempre",
        "Exige revisão honesta nomenclatura ou gestão expectativa — senão frustração consumidor institucional",
        "É irrelevante",
        "Prova estabilidade infinita"
      ], 1),
      Q("SKU interno opaco paralelo nome público serve para:", [
        "Enganar fiscalização sempre",
        "Engenharia rastreio e versionamento genético sem poluir rótulo marketing",
        "Eliminar lote físico",
        "Substituir COA"
      ], 1),
      Q("Coeficiente variação alto em peso inflorescência intra lote comunica:", [
        "Processo colheita/seleção ainda heterogêneo — talvez reclassificar sublotes",
        "Perfeição absoluta",
        "LOD zero",
        "Ausência genética"
      ], 0)
    ],
    media: M.theory,
    materials: ["Planilha split lote fictício duas curvas gaussianas", "Quadro decisão renomear versus manter versão"],
    references: ["Gestão de qualidade lotes em horticultura comercial", "Comunicação estatística para não estatísticos"],
    professorNotes:
      "Conectar com laboratório amostragem representativa — CV fenotípico correlaciona amostragem ruim também."
  },
  {
    title: "Ética de marketing genético (evitar promessas vazias)",
    introduction:
      "Marketing genético frequentemente promete ‘estabilidade absoluta’, ‘THC infinito’ ou ‘curativo’ via nome cultivar — o educador THCProce ensina checklist de linguagem permitida versus linguagem fraudulenta conceitual, sem ser departamento jurídico mas com integridade institucional.",
    body: `Afirmações devem ligar sempre a dados observáveis (faixa média relatório campo X ambiente Y gerações Z fictício exercício). Proibido em cultura THCProce: cura médica pela genética; promessa sanitária ilegal país; garantia resultado humano só por cepa.

Pontos técnicos: disclaimers coop ‘resultados dependem ambiente/manípulo’ bem redigidos passam menos vergonha que retratação tardia influencer.

Erros comuns: comparar cepa própria a medicamento nominado só com screenshot de hospital; usar fotos de clones de terceiros sem autorização nem crédito; inflar THC futuro usando um único ponto fenotípico fotogênico.

Limitações: compliance publicitário país competem advogado — aula apenas princípio orientador.`,
    objectives: [
      "Redigir três frases marketing aceitável e uma propositalmente abusiva para exercício classe corrigir.",
      "Emparelhar dados genéticos a condições campo declaradas sempre que possível comunicação institucional.",
      "Declarar veto explícito a promessas medicina direta por cepa apenas."
    ],
    closingSummary:
      "Genética boa não precisa mentir — precisa método, registro e narrativa proporcional à evidência mostrada.",
    quiz: [
      Q("Promessa ‘Esta cepa substitui quimioterapia sempre’ caracteriza:", [
        "Compliance exemplar THCProce",
        "Abuso marketing sanitário típico censurável — proibido no ethos escola",
        "Dado GWAS válido sempre",
        "Apenas retórica liberdade expressão sempre protegida absoluta"
      ], 1),
      Q("Checklist comunicação institucional saudável inclui:", [
        "Somente hashtags",
        "Vincular comunicação a ambiente declarado, a dados observáveis e ausência de claims sanitários ilegais",
        "Ocultação lotes falhos apenas",
        "THC garantido dois dígitos sem laudo sempre"
      ], 1),
      Q("Foto clone terceiros sem permissão:", [
        "Étnica sempre aceitável se story some 24 h",
        "Problema legal e reputação — usar banco próprio coop ou licenciamento formal",
        "Substitui registro pedigree",
        "Melhora LOD"
      ], 1)
    ],
    media: M.theory,
    materials: ["Lista vermelho verde frases marketing sala", "Modelo política coop comunicação cepa página interna imaginária"],
    references: ["Códigos publicidade sanitária gerais país — texto consulta paralela institucional", "Ética comunicação ciência agrícola"],
    professorNotes:
      "Encerramento módulo: convidar estudante ler próximo curso legislacao para marcos externos promessas internas não resolve."
  }
];
