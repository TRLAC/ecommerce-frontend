import type { PaymentMethod } from "../../Payment/types/paymentMethod";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note?: string;
}

export interface CheckoutState {
  shippingInfo: CheckoutFormData;
  paymentMethod: PaymentMethod | null;
  step: CheckoutStep;
}

export type CheckoutStep = 'shipping' | 'payment' | 'review';
