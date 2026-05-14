import { CANNABIS101_OUTLINE_TITLES } from "@/content/courses/cannabis-101/lessons";
import { CANNABIS101_AREA_ID } from "@/content/courses/cannabis-101/manifest";
/**
 * Outline editorial por curso — fonte canónica dos **títulos de cada aula** no campus.
 *
 * Manutenção: qualquer alteração aqui deve refletir-se em `title` da entrada correspondente
 * em `src/data/lessonContent/courses/<curso>.ts`. Manifestos (`previewLessonTitles`, HUD,
 * `lessonCount`) derivam disto via `coursePreviewLessonTitles` / `courseFirstLessonTitle`.
 *
 * Cannabis 101: árvore de módulos em `src/content/courses/cannabis-101/manifest.ts` — este array
 * re-exporta a mesma ordem via `CANNABIS101_OUTLINE_TITLES`.
 */
export const COURSE_OUTLINES: Record<string, readonly string[]> = {
  [CANNABIS101_AREA_ID]: CANNABIS101_OUTLINE_TITLES,
  "cultivo-greenhouse": [
    "Estufas: tipos, clima e decisão de projeto",
    "Luz solar, suplementação LED e fotoperíodo",
    "CO₂, ventilação e pressão na estufa",
    "Temperatura, umidade relativa e VPD prático",
    "Substrato, irrigação e fertirrigação",
    "MIP integrado em ambiente fechado",
    "Floração, manejo e suporte de copa",
    "Segurança elétrica e operação diária",
    "Registro de ciclos e melhoria contínua",
    "Colheita orientada à qualidade na estufa"
  ],
  "cultivo-outdoor": [
    "Panorama outdoor: solo, clima e calendário BR",
    "Preparo de solo, drenagem e correções",
    "Genéticas e escolha de cultivares para exterior",
    "Segurança de campo e boa vizinhança",
    "Irrigação e nutrição em grandes áreas",
    "Pragas e clima: prevenção e manejo",
    "Florescimento natural e riscos fenológicos",
    "Colheita, transporte e pós-colheita de campo",
    "Cooperativismo e escala (visão introdutória)",
    "Checklist de fechamento de ciclo outdoor"
  ],
  "cultivo-indoor": [
    "Projeto de sala: luz, ar e odor",
    "LED, PPFD e espectro sem marketing vazio",
    "Exaustão, CO₂ e distribuição de ar",
    "Nutrientes, EC/pH e diagnóstico foliar",
    "VPD, transpiração e controle fino",
    "Poda, treino e uniformização de dossel",
    "Floração 12/12: marcos e stress controlado",
    "Diário de cultivo e troubleshooting",
    "Segurança elétrica, incêndio e NR básica",
    "Fluxo de colheita indoor premium"
  ],
  "secagem-cura": [
    "Por que a cura define aroma e suavidade",
    "Secagem: temperatura, umidade e escuridão",
    "Cura em frasco: jar burping e umidade",
    "Boveda e armazenamento estável",
    "Erros que “matam” terpenos",
    "Cura prolongada e perfil sensorial",
    "Lote, rótulo e rastreio básico",
    "Microambiente limpo e prevenção de mofos",
    "Congelamento e estabilidade (visão geral)",
    "Protocolo THCProce de pós-colheita mínima viável"
  ],
  "extracoes-solventless": [
    "Princípios solventless e segurança de bancada",
    "Ice water / bubble: telas, tempo e temperatura",
    "Secagem e armazenamento do hash",
    "Rosin: placas, sacos e curva térmica",
    "Curing do rosin e perda de umidade",
    "Piatella / cold cure: visão introdutória",
    "Higiene inox, água e contaminação cruzada",
    "Notas de laboratório e lotes pequenos",
    "Qualidade sensorial sem overprocess",
    "Fluxo de trabalho reprodutível (produção artesanal)"
  ],
  "extracao-oleo": [
    "Panorama: RSO, FECO, tinturas e óleo MCT",
    "Decarboxilação com medição e segurança",
    "Extração com solvente: risco e ventilação",
    "Padronização aproximada mg/ml e diluições",
    "Filtragem, clarificação e winterização (conceito)",
    "Envase, rótulo e data de validade (lógica)",
    "Documentação e responsabilidade (não prescrição)",
    "Interações gerais e prudência clínica (educação)",
    "Transporte, armazenamento e estabilidade",
    "Checklist operacional para pequenos lotes"
  ],
  laboratorio: [
    "COA e alfabetização em resultados de laboratório",
    "Cannabinoides totais e decarboxilação nos números",
    "Terpenos declarados vs perfil real",
    "Contaminantes: umidade, pestidas, metais (leitura)",
    "Métodos rápidos vs cromatografia (visão geral)",
    "Amostragem representativa em flor/processados",
    "Rastreio de lotes para cooperativas (introdução)",
    "Boas práticas mínimas de laboratório escolar",
    "Limitações de testes caseiros e mitos",
    "Relatório simples para não-técnicos"
  ],
  medicina: [
    "ECS em pacientes: linguagem sem hype",
    "Titulação, calendário e comunicação com prescritor",
    "Dor, sono, ansiedade: narrativas vs evidência",
    "Contraindicações e interações (visão educativa)",
    "Perfil de canabinoides + terpenos no contexto clínico",
    "Pediatria, idosos e vulnerabilidade (cuidados)",
    "Documentação, diário terapêutico e segurança",
    "Fronteira legal Brasil: educação e compliance",
    "Casos para discussão (anonimizados, formativos)",
    "Encaminhamento ético quando não somos prescritores"
  ],
  culinaria: [
    "Infusão, decarbox e porções seguras",
    "Manteiga, óleos e etanol culinário (noções)",
    "Dosagem por porção: matemática amigável",
    "Higiene, validade e armazenamento alimentar",
    "Receitas doces salgadas: matrizes base",
    "Alteração de textura e máscara de sabor",
    "Rotulagem doméstica e responsabilidade social",
    "Erros comuns que causam superdosagem percebida",
    "Festas e serviço responsável (educação)",
    "Mini cardápio THCProce para prática guiada"
  ],
  genetica: [
    "Reprodução sexual e estabilidade de linhagem",
    "Feminização: ciência, riscos e transparência",
    "STS e prática segura (nível educacional)",
    "Seleção fenotípica e banco de mães",
    "Cruzamentos planejados vs populacionais",
    "Breeding de pequena escala e registro",
    "Genética introdutória aplicada ao canhamo",
    "Sementes: armazenamento, germinação e viabilidade",
    "Consistência de lote e nomenclatura",
    "Ética de marketing genético (evitar promessas vazias)"
  ],
  legislacao: [
    "Mapa regulatório BR: adulto, medicinal, autocultivo",
    "ANVISA, importação e canais legais (visão geral)",
    "Habeas corpus e estratégia defensiva (educação jurídica básica)",
    "RDC e análise de rótulo / importação",
    "Associações e governança mínima",
    "Compliance em comunicação e redes",
    "Comparativo internacional (califórnia e lições)",
    "Privacidade, dados e segurança do paciente",
    "Erros legais comuns em operadores",
    "Roteiro de dúvidas para o advogado habilitado"
  ],
  cooperativismo: [
    "Modelos de associação e propósito social",
    "Estatuto, assembleia e prestação de contas",
    "Produção associada e responsabilidade solidária",
    "Distribuição segura e rastreio",
    "Relação médico–associação–paciente (marcos)",
    "Finanças saudáveis em cooperativa pequena",
    "Mediação de conflitos e transparência",
    "Parcerias e fornecedores (governança)",
    "Escalonamento sem perder a missão",
    "Checklist cooperativismo medicinal responsável"
  ],
  "extracoes-101": [
    "Fundamentos · O que são extratos de cannabis?",
    "Fundamentos · Canabinoides e terpenos — o que preservamos",
    "Fundamentos · Vocabulário técnico: concentrado, extrato, full-spectrum",
    "Fundamentos · Segurança no laboratório doméstico",
    "Sem Solvente · Rosin: prensa manual e hidráulica",
    "Sem Solvente · Bubble hash: água, gelo e agitação",
    "Sem Solvente · Dry sift: peneiras, classificação e grading",
    "Sem Solvente · Hash artesanal: charas, malha e cura",
    "Com Solvente · Álcool: QWET, QWISO e purga",
    "Com Solvente · CO₂: conceito e equipamentos profissionais",
    "Com Solvente · Segurança: ventilação, EPI e descarte",
    "Qualidade · Leitura de COA: potência, terpenos e contaminantes",
    "Qualidade · Textura, cor e consistência dos extratos",
    "Qualidade · Armazenamento: temperatura, luz e oxidação",
    "Regulamentação · Marco legal no Brasil: uso medicinal e pesquisa",
    "Regulamentação · Ética do extratista: limites e responsabilidade",
    "Continuando a Jornada · Próximas trilhas no campus"
  ],
  industria: [
    "Licenciamento: arcabouço conceitual (Brasil/LATAM)",
    "Marca, rótulo e claims permitidos",
    "Embalagem infantil-proof e sustentabilidade (noções)",
    "Cadeia de suprimentos e qualidade",
    "Distribuição, cold chain quando aplicável",
    "Marketing ético e conformidade",
    "Operação e ERP em microempresa canábica",
    "Parceria com produtores locais (modelos)",
    "Exportação: barreiras e documentação (visão)",
    "Carreira e habilidades no setor regulado"
  ]
};

export function getOutlineForArea(areaId: string): readonly string[] | null {
  const o = COURSE_OUTLINES[areaId];
  return o ?? null;
}

export function hasFullOutline(areaId: string): boolean {
  return areaId in COURSE_OUTLINES;
}

/** Primeiros `max` títulos do outline (catálogo / painéis) — alinhado a `lessonContent` e `title` de cada aula. */
export function coursePreviewLessonTitles(areaId: string, max = 4): readonly string[] {
  const o = COURSE_OUTLINES[areaId];
  if (!o?.length) {
    throw new Error(`coursePreviewLessonTitles: sem outline para «${areaId}»`);
  }
  const n = Math.min(max, o.length);
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(o[i]!);
  return out;
}

/** Primeira aula do outline — HUD quando não há progresso dinâmico. */
export function courseFirstLessonTitle(areaId: string): string {
  const o = COURSE_OUTLINES[areaId];
  const t = o?.[0];
  if (!t) throw new Error(`courseFirstLessonTitle: sem outline para «${areaId}»`);
  return t;
}

export function courseOutlineLessonCount(areaId: string): number {
  return COURSE_OUTLINES[areaId]?.length ?? 0;
}
