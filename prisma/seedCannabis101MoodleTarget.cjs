/**
 * Inspeção + seed mínimo para alvo Moodle sync (Cannabis 101).
 * Seguro: só cria se a base CMS estiver vazia; ou completa módulo/aula sob course slug cannabis-101.
 *
 *   node prisma/seedCannabis101MoodleTarget.cjs
 */
const fs = require("fs");
const path = require("path");
try {
  const envPath = path.join(__dirname, "..", ".env");
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const key = t.slice(0, eq).trim();
    if (process.env[key] !== undefined) continue;
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
} catch {
  /* .env opcional se já estiver no ambiente */
}

const { PrismaClient, PublishStatus } = require("@prisma/client");
const prisma = new PrismaClient();

async function listPublishedChains() {
  const courses = await prisma.course.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });
  return courses;
}

async function findTargetLesson() {
  return prisma.lesson.findFirst({
    where: {
      slug: "c101-l01-boas-vindas",
      status: PublishStatus.PUBLISHED,
      module: {
        slug: "fundamentos",
        status: PublishStatus.PUBLISHED,
        course: { slug: "cannabis-101", status: PublishStatus.PUBLISHED },
      },
    },
    include: { module: { include: { course: true } } },
  });
}

async function main() {
  const [cc, mc, lc] = await Promise.all([
    prisma.course.count(),
    prisma.module.count(),
    prisma.lesson.count(),
  ]);

  console.log("--- Diagnóstico CMS ---");
  console.log("Course.count:", cc);
  console.log(" Module.count:", mc);
  console.log(" Lesson.count:", lc);

  const chains = await listPublishedChains();
  if (chains.length) {
    console.log("\nSlugs existentes (curso → módulo → aula | status):");
    for (const c of chains) {
      for (const m of c.modules) {
        for (const l of m.lessons) {
          console.log(
            `  ${c.slug} [${c.status}] / ${m.slug} [${m.status}] / ${l.slug} [${l.status}]`,
          );
        }
      }
    }
  } else {
    console.log("\n(Nenhum curso na tabela Course.)");
  }

  const existingTarget = await findTargetLesson();
  if (existingTarget) {
    console.log("\n✓ Cadeia alvo já existe e está PUBLISHED:", existingTarget.id);
    return;
  }

  const emptyCms = cc === 0 && mc === 0 && lc === 0;

  if (emptyCms) {
    console.log("\n→ Base CMS vazia: criar Course + Module + Lesson mínimos (PUBLISHED).");
    const course = await prisma.course.create({
      data: {
        slug: "cannabis-101",
        title: "Cannabis 101",
        description: "Trilha introdutória — alvo sync Moodle (seed mínimo).",
        status: PublishStatus.PUBLISHED,
        sortOrder: 0,
      },
    });
    const mod = await prisma.module.create({
      data: {
        courseId: course.id,
        slug: "fundamentos",
        title: "Fundamentos",
        status: PublishStatus.PUBLISHED,
        sortOrder: 0,
      },
    });
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        slug: "c101-l01-boas-vindas",
        title: "Abertura: cenário real + checklist para redes (THC/CBD) + glossário vivo",
        status: PublishStatus.PUBLISHED,
        sortOrder: 0,
      },
    });
    console.log("✓ Criado: course", course.id, "module", mod.id, "lesson", lesson.id);
    return;
  }

  const courseRow = await prisma.course.findUnique({ where: { slug: "cannabis-101" } });
  if (!courseRow) {
    console.log(
      "\n⚠ Existem outros cursos mas não há slug `cannabis-101`. Não criamos curso duplicado.",
    );
    console.log(
      "  Ajuste CAMPUS_DB_LESSONS para apontar para um triple publicado da lista acima.",
    );
    process.exitCode = 2;
    return;
  }

  console.log("\n→ Curso `cannabis-101` existe; garantir módulo `fundamentos` + aula alvo PUBLISHED.");
  const mod = await prisma.module.upsert({
    where: { courseId_slug: { courseId: courseRow.id, slug: "fundamentos" } },
    create: {
      courseId: courseRow.id,
      slug: "fundamentos",
      title: "Fundamentos",
      status: PublishStatus.PUBLISHED,
      sortOrder: 0,
    },
    update: { status: PublishStatus.PUBLISHED },
  });

  await prisma.lesson.upsert({
    where: { moduleId_slug: { moduleId: mod.id, slug: "c101-l01-boas-vindas" } },
    create: {
      moduleId: mod.id,
      slug: "c101-l01-boas-vindas",
      title: "Abertura: cenário real + checklist para redes (THC/CBD) + glossário vivo",
      status: PublishStatus.PUBLISHED,
      sortOrder: 0,
    },
    update: { status: PublishStatus.PUBLISHED },
  });

  if (courseRow.status !== PublishStatus.PUBLISHED) {
    await prisma.course.update({
      where: { id: courseRow.id },
      data: { status: PublishStatus.PUBLISHED },
    });
    console.log("✓ Curso cannabis-101 atualizado para PUBLISHED.");
  }

  console.log("✓ Module + Lesson upsert OK.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
