import type { PaymentMethod } from './paymentMethod';
import type { PaymentStatus } from './paymentStatus';
import type { Refund } from '../../Refund/types/refund';

// Khớp PaymentResponse của BE
export interface Payment {
  paymentId: number;
  orderId: number;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId: string | null;
  paidAt: string | null;
  refund: Refund | null;
}

// Khớp ConfirmPaymentRequest của BE
export interface ConfirmPaymentRequest {
  orderId: number;
  transactionId: string;
  success: boolean;
}
