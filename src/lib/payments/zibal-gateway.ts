import type {
  CreatePaymentResult,
  PaymentGateway,
  VerifyPaymentResult,
} from "./types";

/** Placeholder adapter — wire real Zibal API when merchant credentials exist. */
export class ZibalGateway implements PaymentGateway {
  readonly name = "zibal";

  async createPayment(): Promise<CreatePaymentResult> {
    return {
      success: false,
      authority: "",
      redirectUrl: "",
      error: "درگاه زیبال هنوز پیکربندی نشده است",
    };
  }

  async verifyPayment(): Promise<VerifyPaymentResult> {
    return { success: false, error: "درگاه زیبال هنوز پیکربندی نشده است" };
  }
}
