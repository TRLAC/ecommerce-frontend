import type { OrderStatus } from './orderStatus';

// Khớp OrderStatusLogResponse của BE
export interface OrderStatusLog {
  logId: number;
  oldStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedByName: string | null;
  changedAt: string;
}
