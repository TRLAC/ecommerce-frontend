import axiosInstance from '../../../shared/api/apiClient';
import type { Payment, ConfirmPaymentRequest } from '../../Payment/types/payment';
import type { PaymentMethod } from '../../Payment/types/paymentMethod';

export const paymentApi = {
  createPayment: (orderId: number, method: PaymentMethod): Promise<Payment> =>
    axiosInstance
      .post(`/api/payments/${orderId}`, null, { params: { method } })
      .then((r) => r.data),

  confirmPayment: (data: ConfirmPaymentRequest): Promise<Payment> =>
    axiosInstance.post('/api/payments/confirm', data).then((r) => r.data),
};
