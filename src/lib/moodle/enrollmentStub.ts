/**
 * Reservado para quando Moodle WS estiver ativo:
 * - criar conta Moodle alinhada ao `Profile.email`;
 * - matricular no cohort/plano correspondente a `selectedPlanId`;
 * - atualizar certificados/progresso.
 *
 * Chamado de forma assíncrona após pagamento (ou fila), nunca no caminho crítico do signup.
 */
export function isMoodleEnrollmentConfigured(): boolean {
  return Boolean(process.env.MOODLE_WS_TOKEN?.trim());
}
