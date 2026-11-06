import { OrderStatus } from './orderStatus';

export interface OrderFilter {
  page?: number;
  size?: number;
  status?: OrderStatus;
}
