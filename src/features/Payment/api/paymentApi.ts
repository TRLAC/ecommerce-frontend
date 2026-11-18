import axiosInstance from '../../../shared/api/apiClient';
import type { Payment, ConfirmPaymentRequest } from '../types/payment';
import type { PaymentMethod } from '../types/paymentMethod';

export const paymentApi = {
  // POST /api/payments/{orderId}?method=...  (tạo hoặc thử lại; COD bị BE từ chối)
  createPayment: (orderId: number, method: PaymentMethod): Promise<Payment> =>
    axiosInstance.post(`/payments/${orderId}`, null, { params: { method } }).then((r) => r.data),

  // POST /api/payments/confirm  { orderId, transactionId, success }
  confirmPayment: (data: ConfirmPaymentRequest): Promise<Payment> =>
    axiosInstance.post('/payments/confirm', data).then((r) => r.data),
};
