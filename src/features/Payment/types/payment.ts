import type { PaymentMethod } from './paymentMethod';
import type { PaymentStatus } from './paymentStatus';

export interface Payment {
  id: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmPaymentRequest {
  orderId: number;
  transactionId: string;
  status: 'SUCCESS' | 'FAILED';
}
