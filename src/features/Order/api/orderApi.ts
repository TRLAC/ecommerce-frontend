import { apiClient } from '@/shared/api/apiClient';
import { normalizePage } from '@/shared/utils/page';
import type { PageResponse, RawPage } from '@/shared/types/page';
import type { Order, PlaceOrderRequest } from '../types/order';
import type { OrderQuery } from '../types/orderFilter';

export const orderApi = {
  // POST /api/orders -> 201 OrderResponse (BE tạo đơn từ giỏ hàng và làm trống giỏ)
  placeOrder: (data: PlaceOrderRequest): Promise<Order> =>
    apiClient.post('/orders', data).then((r) => r.data),

  getOrder: (id: number): Promise<Order> =>
    apiClient.get(`/orders/${id}`).then((r) => r.data),

  // GET /api/orders?page&size&sort
  getMyOrders: (query: OrderQuery = {}): Promise<PageResponse<Order>> =>
    apiClient
      .get<RawPage<Order>>('/orders', { params: query })
      .then((r) => normalizePage(r.data)),

  // PATCH /api/orders/{id}/cancel (không có body)
  cancelOrder: (id: number): Promise<Order> =>
    apiClient.patch(`/orders/${id}/cancel`).then((r) => r.data),
};
