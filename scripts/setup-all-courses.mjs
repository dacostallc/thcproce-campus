/**
 * Configura todos os cursos no padrão Cannabis 101:
 * - Cria manifest.ts para cursos novos
 * - Corrige lessonCount nos course.json
 * - Gera coursesRegistry-patch.ts com todos os registros
 *
 * Uso: node scripts/setup-all-courses.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const COURSES_DIR = path.join(ROOT, "src", "content", "courses");

// Metadados de cada curso para o manifest
const COURSE_META = {
  "cultivo-indoor": {
    displayName: "Cultivo Indoor",
    hud: "Fase Vegetativa · Como controlar luz e clima",
    color: "purple",
    mapPosition: { x: 72, y: 16 },
    category: "Cultivo",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "Fotoperíodo, LED, clima e técnicas de poda em ambiente fechado",
    description: "O cultivo indoor com controle total de luz, clima e nutrição. Da fase vegetativa à colheita, dominando técnicas como LST, SCROG, defoliação e o manejo de VPD para maximizar produtividade.",
  },
  "cultivo-floracao": {
    displayName: "Transição e Floração",
    hud: "Floração · Da transição à colheita perfeita",
    color: "amber",
    mapPosition: { x: 60, y: 20 },
    category: "Cultivo",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "Da transição ao pico de maturação — fotoperíodo 12/12 e leitura de tricomas",
    description: "A fase mais crítica do cultivo: como induzir e conduzir a floração, interpretar tricomas, identificar o ponto ideal de colheita e maximizar a produção de resina.",
  },
  "extraction": {
    displayName: "Extração de Óleo",
    hud: "Óleos · RSO, FECO e tinturas medicinais",
    color: "canna",
    mapPosition: { x: 82, y: 22 },
    category: "Extrações",
    level: "Avançado",
    professor: "Equipa THCProce",
    short: "RSO, FECO, tinturas alcoólicas e cálculo de dosagem medicinal",
    description: "Extração com solvente para fins medicinais: decarboxilação, RSO e FECO passo a passo, winterização, filtragem, cálculo de mg/ml por porção e armazenamento seguro.",
  },
  "hash-maker": {
    displayName: "Hash Maker",
    hud: "Hash · Do charas ao full-melt premium",
    color: "amber",
    mapPosition: { x: 30, y: 60 },
    category: "Extrações",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "Técnicas de extração sem solventes — do charas artesanal ao full-melt premium",
    description: "A arte e a ciência do hash: história, tricomas, dry sift, bubble hash, charas e avaliação de qualidade full-melt. Produção sem solventes com técnica e responsabilidade.",
  },
  "nutricao-cannabis": {
    displayName: "Nutrição da Cannabis",
    hud: "Nutrição · pH, EC e macronutrientes",
    color: "canna",
    mapPosition: { x: 35, y: 35 },
    category: "Cultivo",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "pH, EC, macro e micronutrientes — como alimentar a planta com precisão",
    description: "O uso eficiente de nutrientes na cannabis: NPK e macronutrientes secundários, pH e EC como ferramentas de diagnóstico, deficiências e toxicidades, nutrição orgânica vs mineral.",
  },
  "cultivo-solo": {
    displayName: "Preparo de Solo",
    hud: "Solo · Composição, pH e microbioma",
    color: "canna",
    mapPosition: { x: 50, y: 30 },
    category: "Cultivo",
    level: "Iniciante",
    professor: "Equipa THCProce",
    short: "Como preparar solo orgânico e mineral para cultivo de alta performance",
    description: "Fundamentos do solo para cannabis: composição física e química, pH ideal, microbioma do solo, emendas orgânicas, compostagem e preparo de substratos de alta drenagem.",
  },
  "medicine": {
    displayName: "Medicina Canabinoide",
    hud: "Medicina · Protocolos e posologia",
    color: "cyan",
    mapPosition: { x: 87, y: 26 },
    category: "Saúde",
    level: "Todos os níveis",
    professor: "Equipa THCProce",
    short: "Aplicações terapêuticas, protocolos por condição e titulação responsável",
    description: "Cannabis medicinal com base científica: sistema endocanabinoide aprofundado, protocolos por condição (dor, ansiedade, epilepsia, oncologia), titulação 'start low go slow' e interações medicamentosas.",
  },
  "culinary": {
    displayName: "Culinária com Cannabis",
    hud: "Culinária · Edibles, dosagem e segurança",
    color: "amber",
    mapPosition: { x: 53, y: 48 },
    category: "Gastronomia",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "Decarboxilação, infusões, cálculo de dosagem e receitas seguras",
    description: "Da decarboxilação à dosagem por porção: manteiga canábica, óleos infundidos, receitas doces e salgadas, bebidas, onset delay em edibles e armazenamento seguro longe de crianças.",
  },
  "genetica": {
    displayName: "Genética & Sementes",
    hud: "Genética · Seleção, cruzamentos e bancos",
    color: "canna",
    mapPosition: { x: 41, y: 50 },
    category: "Pesquisa",
    level: "Avançado",
    professor: "Equipa THCProce",
    short: "Sementes feminizadas, cruzamentos e seleção de mães com técnica e precisão",
    description: "Genética aplicada à cannabis: herança mendeliana, seleção de fenótipos, polinização controlada, produção de sementes feminizadas com STS, cruzamentos F1/F2, retrocruzamentos e estabilização de linhagens.",
  },
  "extracoes-solventless": {
    displayName: "Extrações Solventless",
    hud: "Solventless · Bubble Hash, Rosin e Piatella",
    color: "amber",
    mapPosition: { x: 24, y: 46 },
    category: "Extrações",
    level: "Avançado",
    professor: "Equipa THCProce",
    short: "Bubble Hash, Rosin e Piatella — qualidade premium sem solvente",
    description: "Extrações artesanais de alto nível: bubble hash em 6 telas, rosin prensado a frio, piatella curada, avaliação star system e armazenamento de concentrados.",
  },
  "cultivo-greenhouse": {
    displayName: "Cultivo Greenhouse",
    hud: "Estufa · Sol + controle climático",
    color: "canna",
    mapPosition: { x: 10, y: 32 },
    category: "Cultivo",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "O melhor do indoor e outdoor combinados — produção em estufa controlada",
    description: "Cultivo em estufa: estruturas, coberturas, ventilação, controle de fotoperíodo com blackout, suplementação de luz e produção escalonada com custo reduzido vs indoor puro.",
  },
  "cultivo-outdoor": {
    displayName: "Cultivo Outdoor",
    hud: "Outdoor · Sol, solo e clima tropical",
    color: "canna",
    mapPosition: { x: 46, y: 18 },
    category: "Cultivo",
    level: "Iniciante",
    professor: "Equipa THCProce",
    short: "Cultivo a céu aberto no Brasil — do preparo do solo à colheita",
    description: "Cannabis a céu aberto no clima tropical brasileiro: análise de solo, genéticas adequadas, calendário de plantio por região, irrigação, manejo orgânico e proteção contra pragas e clima.",
  },
  "secagem-cura": {
    displayName: "Secagem & Cura",
    hud: "Secagem · Terpenos preservados, aroma garantido",
    color: "amber",
    mapPosition: { x: 93, y: 44 },
    category: "Pós-colheita",
    level: "Intermediário",
    professor: "Equipa THCProce",
    short: "Onde o aroma e a potência se preservam — técnica e paciência",
    description: "A diferença entre uma flor mediana e uma premium está na secagem e cura. Ambiente ideal, wet trim vs dry trim, cura em vidro, Boveda 62% e armazenamento de longo prazo.",
  },
  "legislacao": {
    displayName: "Legislação Cannabis",
    hud: "Legislação · RDC 660, habeas corpus e direitos",
    color: "rose",
    mapPosition: { x: 16, y: 84 },
    category: "Direito",
    level: "Todos os níveis",
    professor: "Equipa THCProce",
    short: "RDC 660, habeas corpus, importação e direitos de pacientes",
    description: "Legislação cannabis no Brasil: RDC 660 e RDC 327 da ANVISA, habeas corpus preventivo e decisões do STF, importação de produtos, associações medicinais e direitos de pacientes.",
  },
  "cooperativismo": {
    displayName: "Cooperativismo",
    hud: "Cooperativismo · Como montar sua associação",
    color: "purple",
    mapPosition: { x: 54, y: 64 },
    category: "Negócio",
    level: "Avançado",
    professor: "Equipa THCProce",
    short: "Como montar e gerir uma associação medicinal com segurança jurídica",
    description: "Cooperativismo e associações: estatuto social, governança democrática, habeas corpus coletivo, modelos de produção e distribuição, finanças sem fins lucrativos e compliance.",
  },
  "industria": {
    displayName: "Indústria Cannabis",
    hud: "Indústria · Mercado, carreiras e negócios",
    color: "rose",
    mapPosition: { x: 79, y: 74 },
    category: "Negócio",
    level: "Avançado",
    professor: "Equipa THCProce",
    short: "Mercado global, branding, cadeia de suprimentos e carreiras",
    description: "Indústria da cannabis: mercado global e brasileiro, segmentos de produtos, cadeia de suprimentos, branding responsável, boas práticas de fabricação (BPF/GMP) e carreiras em demanda.",
  },
};

function getCourseJson(courseId) {
  const p = path.join(COURSES_DIR, courseId, "course.json");
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}

function countMdFiles(courseId) {
  const dir = path.join(COURSES_DIR, courseId);
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.endsWith(".md") && !f.startsWith("_")).length;
}

// Cria ou atualiza manifest.ts para cada curso
function writeManifest(courseId, meta, lessonCount) {
  const manifestPath = path.join(COURSES_DIR, courseId, "manifest.ts");
  // Não sobrescreve se o manifests mais elaborado já existe (ex: cannabis-101)
  if (fs.existsSync(manifestPath)) {
    const existing = fs.readFileSync(manifestPath, "utf8");
    if (existing.includes("CANNABIS101") || existing.includes("cannabis101")) return "skipped";
  }

  const varName = courseId.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, m => m.toUpperCase()) + "_MANIFEST";

  const content = `import type { CourseManifest } from "@/content/courses/types";

export const ${varName}: CourseManifest = {
  areaId: "${courseId}",
  displayName: "${meta.displayName}",
  hud: {
    nextLessonFallbackLabel: "${meta.hud}",
  },
  previewLessonTitles: [],
  stats: {
    lessonCount: ${lessonCount},
    hoursLabel: "≈${Math.round(lessonCount * 0.4 * 10) / 10}h leitura guiada",
  },
  marketing: {
    short: "${meta.short}",
    category: "${meta.category}",
    level: "${meta.level}",
    color: "${meta.color}",
    mapPosition: { x: ${meta.mapPosition.x}, y: ${meta.mapPosition.y} },
    description: "${meta.description}",
    highlights: [],
    professor: "${meta.professor}",
  },
};
`;
  fs.writeFileSync(manifestPath, content);
  return "written";
}

// Corrige lessonCount no course.json se undefined
function fixCourseJson(courseId) {
  const p = path.join(COURSES_DIR, courseId, "course.json");
  if (!fs.existsSync(p)) return;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  if (j.lessonCount !== undefined && j.lessons) return;
  
  const mds = fs.readdirSync(path.join(COURSES_DIR, courseId))
    .filter(f => f.endsWith(".md") && !f.startsWith("_"))
    .map(f => f.replace(".md", ""));
  
  j.lessonCount = mds.length;
  if (!j.lessons) j.lessons = mds;
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

async function main() {
  console.log("🔧 Configurando todos os cursos no padrão Cannabis 101...\n");

  const results = [];

  for (const [courseId, meta] of Object.entries(COURSE_META)) {
    fixCourseJson(courseId);
    const json = getCourseJson(courseId);
    const mdCount = countMdFiles(courseId);
    const lessonCount = json?.lessonCount ?? mdCount;

    const manifestStatus = writeManifest(courseId, meta, lessonCount);
    results.push({ courseId, lessonCount, manifestStatus });
    console.log(`${manifestStatus === "written" ? "✅" : "⏩"} ${courseId}: ${lessonCount} aulas (manifest: ${manifestStatus})`);
  }

  // Gera o patch para coursesRegistry.ts
  const registryPatchLines = [
    "",
    "// ── Cursos importados do Moodle — layout Blueprint completo ──────────────────",
  ];

  for (const { courseId, manifestStatus } of results) {
    if (courseId === "cannabis-101") continue; // já registrado
    const varName = courseId.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, m => m.toUpperCase()) + "_MANIFEST";
    const importPath = `./${courseId}/manifest`;
    
    registryPatchLines.push(`// import { ${varName} } from "${importPath}";`);
    registryPatchLines.push(`// registerCourse({ manifest: ${varName}, usesCinematicLayout: true });`);
  }

  const patchPath = path.join(ROOT, "scripts", "registry-patch.txt");
  fs.writeFileSync(patchPath, registryPatchLines.join("\n"));
  console.log(`\n📄 Patch de registry gerado em ${patchPath}`);

  console.log(`\n✅ Total: ${results.length} cursos configurados`);
  console.log(`   Manifestos criados: ${results.filter(r => r.manifestStatus === "written").length}`);
  console.log(`   Já existiam: ${results.filter(r => r.manifestStatus === "skipped").length}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
