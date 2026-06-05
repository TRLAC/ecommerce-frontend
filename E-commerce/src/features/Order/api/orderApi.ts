import { apiClient } from '@/shared/api/apiClient';
import type { Order, PlaceOrderRequest, CancelOrderRequest } from '../../Order/types/order';
import type { OrderFilter } from '../../Order/types/orderFilter';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const orderApi = {
  placeOrder: (data: PlaceOrderRequest): Promise<Order> =>
    apiClient.post('/api/orders', data).then((r) => r.data),

  getOrder: (id: number): Promise<Order> =>
    apiClient.get(`/api/orders/${id}`).then((r) => r.data),

  getMyOrders: (filter: OrderFilter): Promise<PageResponse<Order>> =>
    apiClient.get('/api/orders/my', { params: filter }).then((r) => r.data),

  cancelOrder: (id: number, data: CancelOrderRequest): Promise<Order> =>
    apiClient.patch(`/api/orders/${id}/cancel`, data).then((r) => r.data),
};