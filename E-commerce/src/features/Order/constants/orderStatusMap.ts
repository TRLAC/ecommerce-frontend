import type { OrderStatus } from '../types/orderStatus';

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  PROCESSING: {
    label: 'Đang xử lý',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  DELIVERED: {
    label: 'Đã giao hàng',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  CANCELLED: {
    label: 'Đã huỷ',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  REFUNDED: {
    label: 'Đã hoàn tiền',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
  },
};
