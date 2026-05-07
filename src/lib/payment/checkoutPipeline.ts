/**
 * Extensão futura: checkout (PIX, cartão, Stripe, Mercado Pago, PagSeguro).
 * Fluxo previsto após `enrollment.register` bem-sucedido:
 * 1) criar/obter `Profile` com `accessStatus = pendente`;
 * 2) iniciar sessão de pagamento no provider escolhido;
 * 3) webhook confirma pagamento → `accessStatus = ativo` e `endsAt` em `Subscription`;
 * 4) `vitalicio` → `accessStatus = vitalicio` sem `endsAt`.
 *
 * Não importar SDKs aqui ainda — mantém bundle e deploy estáveis.
 */
export type CheckoutProviderId =
  | "pix"
  | "card"
  | "stripe"
  | "mercadopago"
  | "pagseguro"
  | "lodger";

export type CheckoutDraft = {
  profileId: string;
  email: string;
  planId: string;
  provider: CheckoutProviderId;
  /** Metadados opacos para retomar o checkout depois */
  metadata?: Record<string, string>;
};
