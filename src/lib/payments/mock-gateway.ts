import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentGateway,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "./types";

export class MockGateway implements PaymentGateway {
  readonly name = "mock";

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const authority = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return {
      success: true,
      authority,
      redirectUrl: `${base}/api/payments/callback?Authority=${authority}&Status=OK&amount=${input.amount}`,
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    if (!input.authority.startsWith("mock_")) {
      return { success: false, error: "شناسه پرداخت نامعتبر است" };
    }
    return {
      success: true,
      providerRef: `REF-${input.authority}`,
    };
  }

  async refund(): Promise<{ success: boolean }> {
    return { success: true };
  }
}
