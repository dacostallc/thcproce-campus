/**
 * Semeia o Exame Final do Cannabis 101 no banco de dados.
 * 10 perguntas cobrindo todos os módulos do curso.
 * Nota mínima: 7.0 / 10 (70%)
 *
 * Uso: node scripts/seed-cannabis101-exam.cjs
 */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const COURSE_ID = "cannabis-101";
const PASSING_SCORE = 7.0;

const questions = [
  {
    question: "Qual é o principal canabinoide responsável pelos efeitos psicoativos da cannabis?",
    options: [
      "CBD (Canabidiol)",
      "THC (Tetrahidrocanabinol)",
      "CBG (Canabigerol)",
      "CBN (Canabinoide)"
    ],
    correct: 1
  },
  {
    question: "O sistema endocanabinoide possui dois tipos principais de receptores. Quais são eles?",
    options: [
      "CB1 (sistema nervoso central) e CB2 (sistema imunológico)",
      "CB1 (fígado) e CB2 (pulmões)",
      "CB3 (cérebro) e CB4 (intestino)",
      "CB1 (músculos) e CB2 (ossos)"
    ],
    correct: 0
  },
  {
    question: "O 'efeito entourage' na cannabis se refere a:",
    options: [
      "O efeito de fumar cannabis em grupo",
      "A sinergia entre canabinoides e terpenos que potencializa os efeitos",
      "O isolamento do THC puro para uso medicinal",
      "A interação entre cannabis e álcool"
    ],
    correct: 1
  },
  {
    question: "Qual terpeno é responsável pelo aroma terroso/amadeirado da cannabis e também encontrado na pimenta preta?",
    options: [
      "Limoneno",
      "Mirceno",
      "Cariofileno",
      "Linalol"
    ],
    correct: 2
  },
  {
    question: "Em cultivo indoor, qual fotoperíodo é usado para induzir a fase de floração?",
    options: [
      "18 horas de luz / 6 horas de escuro",
      "24 horas de luz contínua",
      "12 horas de luz / 12 horas de escuro",
      "6 horas de luz / 18 horas de escuro"
    ],
    correct: 2
  },
  {
    question: "Qual é a principal diferença entre variedades Cannabis Indica e Cannabis Sativa em termos de crescimento?",
    options: [
      "Indica cresce mais alta e fina; Sativa cresce baixa e larga",
      "Indica cresce baixa e larga com folhas largas; Sativa cresce alta e fina com folhas estreitas",
      "Não há diferença visual entre as duas",
      "Indica só cresce em climas tropicais; Sativa só em climas frios"
    ],
    correct: 1
  },
  {
    question: "O CBD (Canabidiol) é considerado:",
    options: [
      "Altamente psicoativo — altera percepção e consciência",
      "Não psicoativo — não produz euforia, tem potencial terapêutico",
      "Proibido em todos os países do mundo",
      "Eficaz apenas quando combinado com álcool"
    ],
    correct: 1
  },
  {
    question: "Qual forma de consumo de cannabis tem o onset (início de efeito) mais rápido?",
    options: [
      "Comestíveis (edibles) ingeridos",
      "Cápsulas de óleo",
      "Inalação (vaporização ou combustão)",
      "Aplicação tópica na pele"
    ],
    correct: 2
  },
  {
    question: "No contexto da legislação brasileira atual (2024), o uso medicinal de cannabis:",
    options: [
      "É completamente ilegal em qualquer circunstância",
      "É permitido com prescrição médica para produtos aprovados pela Anvisa",
      "É livre sem necessidade de prescrição médica",
      "Só é permitido para uso veterinário"
    ],
    correct: 1
  },
  {
    question: "O que são tricomas na planta de cannabis?",
    options: [
      "As raízes que absorvem nutrientes do solo",
      "As glândulas de resina que produzem e armazenam canabinoides e terpenos",
      "As sementes femininas da planta",
      "Os nutrientes essenciais para o crescimento da planta"
    ],
    correct: 1
  }
];

async function main() {
  console.log("Semeando Exame Final do Cannabis 101...");

  const existing = await db.exam.findFirst({
    where: { courseId: COURSE_ID, lessonId: null },
    select: { id: true, title: true },
  });

  if (existing) {
    const updated = await db.exam.update({
      where: { id: existing.id },
      data: { questions, passingScore: PASSING_SCORE },
      select: { id: true },
    });
    console.log(`✓ Exame atualizado: ${updated.id}`);
  } else {
    const created = await db.exam.create({
      data: {
        courseId: COURSE_ID,
        lessonId: null,
        title: "Exame Final — Cannabis 101",
        questions,
        passingScore: PASSING_SCORE,
      },
      select: { id: true },
    });
    console.log(`✓ Exame criado: ${created.id}`);
  }

  console.log(`  Perguntas: ${questions.length}`);
  console.log(`  Nota mínima: ${PASSING_SCORE}/10 (${PASSING_SCORE * 10}%)`);
}

main()
  .catch(e => { console.error("ERRO:", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
