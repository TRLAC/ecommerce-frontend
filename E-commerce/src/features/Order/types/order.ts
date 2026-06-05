import type { OrderItem } from '../../Order/types/orderItem';
import type { OrderStatus } from '../../Order/types/orderStatus';

export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  shippingFee: number;
  note?: string;
  shippingAddress: string;
  fullName: string;
  phone: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderRequest {
  fullName: string;
  phone: string;
  shippingAddress: string;
  note?: string;
  items: { productId: number; quantity: number; variantId?: number }[];
}

export interface CancelOrderRequest {
  reason?: string;
}
