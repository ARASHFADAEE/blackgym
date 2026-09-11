import type {
  CreatePaymentResult,
  PaymentGateway,
  VerifyPaymentResult,
} from "./types";

/** Placeholder adapter — wire real IDPay API when merchant credentials exist. */
export class IDPayGateway implements PaymentGateway {
  readonly name = "idpay";

  async createPayment(): Promise<CreatePaymentResult> {
    return {
      success: false,
      authority: "",
      redirectUrl: "",
      error: "درگاه آیدی‌پی هنوز پیکربندی نشده است",
    };
  }

  async verifyPayment(): Promise<VerifyPaymentResult> {
    return { success: false, error: "درگاه آیدی‌پی هنوز پیکربندی نشده است" };
  }
}
