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
    priceDisplay: "R$ 9,90",
    billingNote: "ideal para experimentar o campus",
    benefits: [
      "Acesso imediato a todo o conteúdo do período",
      "Mesmo ecossistema do aluno mensal",
      "Upgrade reaproveita seu progresso"
    ]
  },
  {
    id: "mensal",
    name: "Mensal",
    durationLabel: "30 dias",
    priceDisplay: "R$ 49,90",
    billingNote: "cobrança mensal",
    benefits: [
      "Rotina de estudos com flexibilidade",
      "Campus, aulas e comunidade",
      "Renovação simples quando precisar"
    ],
    recommended: true
  },
  {
    id: "semestral",
    name: "Semestral",
    durationLabel: "6 meses",
    priceDisplay: "R$ 249,90",
    billingNote: "melhor custo por mês",
    benefits: [
      "Compromisso médio com melhor preço",
      "Acompanha atualizações e eventos sazonais",
      "Indicado para certificações"
    ]
  },
  {
    id: "anual",
    name: "Anual",
    durationLabel: "12 meses",
    priceDisplay: "R$ 449,90",
    billingNote: "pagamento anual",
    benefits: [
      "Menor custo por mês no ano",
      "Eventos e lives ao longo do ciclo",
      "Prioridade em novidades do campus"
    ]
  },
  {
    id: "vitalicio",
    name: "Vitalício",
    durationLabel: "Acesso permanente",
    priceDisplay: "R$ 1.290,00",
    billingNote: "onde disponível na escola",
    benefits: [
      "Campus e atualizações conforme política da escola",
      "Valor único para quem quer estudar no longo prazo",
      "Histórico e progresso preservados"
    ]
  }
];

export function getPlanById(id: EnrollmentPlanId): EnrollmentPlan | undefined {
  return ENROLLMENT_PLANS.find((p) => p.id === id);
}
