/**
 * Planos de acesso por tempo — valores editáveis aqui antes de ir à produção.
 * IDs estáveis para `Profile.selectedPlanId` e integração futura com pagamento/Moodle.
 */
export type EnrollmentPlanId =
  | "diario"
  | "mensal"
  | "semestral"
  | "anual"
  | "vitalicio";

export type EnrollmentPlan = {
  id: EnrollmentPlanId;
  name: string;
  /** Ex.: "24 h", "30 dias" — texto livre para o card */
  durationLabel: string;
  /** Preço exibido (placeholder OK) */
  priceDisplay: string;
  /** Detalhe curto de cobrança */
  billingNote?: string;
  benefits: string[];
  /** Plano em destaque na UI */
  recommended?: boolean;
};

export const ENROLLMENT_PLANS: EnrollmentPlan[] = [
  {
    id: "diario",
    name: "Diário",
    durationLabel: "24 horas",
    priceDisplay: "R$ 4,90",
    billingNote: "ideal para experimentar o campus",
    benefits: [
      "Exploração do campus no período; salas conforme calendário de liberação",
      "Mesmo ecossistema do aluno mensal",
      "Upgrade reaproveita seu progresso"
    ]
  },
  {
    id: "mensal",
    name: "Mensal",
    durationLabel: "30 dias",
    priceDisplay: "R$ 19,90",
    billingNote: "cobrança mensal",
    benefits: [
      "Rotina de estudos; novas aulas entram em calendário (pré-lançamento)",
      "Campus, trilhas liberadas e comunidade",
      "Renovação simples quando precisar"
    ]
  },
  {
    id: "semestral",
    name: "Semestral",
    durationLabel: "6 meses",
    priceDisplay: "R$ 79,90",
    billingNote: "melhor custo por mês",
    benefits: [
      "Melhor preço por mês no semestre",
      "Acompanha atualizações e eventos sazonais do campus",
      "Certificações conforme regras publicadas pela escola"
    ]
  },
  {
    id: "anual",
    name: "Anual",
    durationLabel: "12 meses",
    priceDisplay: "R$ 100,00",
    billingNote: "Melhor escolha para acompanhar o campus por 12 meses",
    benefits: [
      "Menor custo por mês no ano frente ao mensal",
      "Eventos e lives ao longo do ciclo (conforme calendário)",
      "Novidades do campus em liberação progressiva"
    ],
    recommended: true
  },
  {
    id: "vitalicio",
    name: "Vitalício",
    durationLabel: "Acesso permanente",
    priceDisplay: "R$ 297,00",
    billingNote: "Pré-lançamento fundador · acesso prolongado (ver termos)",
    benefits: [
      "Valor único para quem quer acompanhar a expansão do campus",
      "Campus e novos módulos conforme política e calendário da escola",
      "Histórico e progresso preservados na sua conta"
    ]
  }
];

export function getPlanById(id: EnrollmentPlanId): EnrollmentPlan | undefined {
  return ENROLLMENT_PLANS.find((p) => p.id === id);
}
