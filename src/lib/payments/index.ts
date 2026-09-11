import { IDPayGateway } from "./idpay-gateway";
import { MockGateway } from "./mock-gateway";
import type { PaymentGateway } from "./types";
import { ZibalGateway } from "./zibal-gateway";

export function getPaymentGateway(): PaymentGateway {
  const provider = (process.env.PAYMENT_PROVIDER ?? "mock").toLowerCase();
  switch (provider) {
    case "zibal":
      return new ZibalGateway();
    case "idpay":
      return new IDPayGateway();
    default:
      return new MockGateway();
  }
}

export type { PaymentGateway, CreatePaymentInput, CreatePaymentResult, VerifyPaymentResult } from "./types";
