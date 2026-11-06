export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: 'Thanh toán khi nhận hàng',
  VNPAY: 'VNPay',
  MOMO: 'Ví MoMo',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  COD: '💵',
  VNPAY: '🏦',
  MOMO: '📱',
  BANK_TRANSFER: '🏧',
};
