export type CreatePaymentInput = {
  amount: number;
  description: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export type CreatePaymentResult = {
  success: boolean;
  authority: string;
  redirectUrl: string;
  providerRef?: string;
  error?: string;
};

export type VerifyPaymentInput = {
  authority: string;
  amount: number;
};

export type VerifyPaymentResult = {
  success: boolean;
  providerRef?: string;
  error?: string;
};

export interface PaymentGateway {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
  refund?(providerRef: string, amount: number): Promise<{ success: boolean; error?: string }>;
}
