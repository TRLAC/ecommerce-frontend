import type { Payment } from '../types/payment';

/** Trang cổng thanh toán giả lập của FE. */
export const gatewayUrl = (payment: Pick<Payment, 'orderId' | 'transactionId'>): string =>
  `/payment/gateway?orderId=${payment.orderId}&transactionId=${encodeURIComponent(payment.transactionId ?? '')}`;
