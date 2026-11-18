// Khớp enum PaymentMethod của BE
export type PaymentMethod = 'COD' | 'MOMO' | 'VNPAY' | 'CREDIT_CARD' | 'BANK_TRANSFER';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: 'Thanh toán khi nhận hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
  CREDIT_CARD: 'Thẻ tín dụng / ghi nợ',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  COD: '💵',
  MOMO: '📱',
  VNPAY: '🏦',
  CREDIT_CARD: '💳',
  BANK_TRANSFER: '🏧',
};

export const PAYMENT_METHODS: PaymentMethod[] = ['COD', 'VNPAY', 'MOMO', 'CREDIT_CARD', 'BANK_TRANSFER'];
