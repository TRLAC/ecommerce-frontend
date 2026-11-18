import type { OrderItem } from './orderItem';
import type { OrderStatus } from './orderStatus';
import type { OrderStatusLog } from './OrderStatusLog';
import type { Shipping } from './shipping';
import type { Payment } from '../../Payment/types/payment';
import type { PaymentMethod } from '../../Payment/types/paymentMethod';

// Khớp OrderResponse của BE
export interface Order {
  orderId: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: Payment[];
  shipping: Shipping | null;
  statusLogs: OrderStatusLog[];
}

// Khớp PlaceOrderRequest của BE: không gửi address thì BE dùng địa chỉ trong hồ sơ
export interface PlaceOrderRequest {
  paymentMethod: PaymentMethod;
  address?: string;
}
