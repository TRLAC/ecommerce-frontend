import React from 'react';
import type { OrderStatus } from '../types/orderStatus';
import { ORDER_STATUS_MAP } from '../constants/orderStatusMap';

interface Props {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<Props> = ({ status }) => {
  const { label, color, bgColor } = ORDER_STATUS_MAP[status] ?? {
    label: status,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
        ${color} ${bgColor}`}
    >
      {label}
    </span>
  );
};
