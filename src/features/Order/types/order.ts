import type { OrderItem } from '../../Order/types/orderItem';
import type { OrderStatus } from '../../Order/types/orderStatus';
import type { PaymentMethod } from '../../Payment/types/paymentMethod';

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
  paymentMethod: PaymentMethod;
  items: { productId: number; quantity: number; variantId?: number }[];
}

export interface CancelOrderRequest {
  reason?: string;
}
