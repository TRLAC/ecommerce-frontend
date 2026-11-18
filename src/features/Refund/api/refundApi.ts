import { apiClient } from '@/shared/api/apiClient';
import type { Refund, RefundRequest } from '../types/refund';

export const refundApi = {
  // POST /api/refunds/orders/{orderId} -> 201 RefundResponse (hoàn tiền toàn phần)
  requestRefund: (orderId: number, data: RefundRequest): Promise<Refund> =>
    apiClient.post(`/refunds/orders/${orderId}`, data).then((r) => r.data),
};
