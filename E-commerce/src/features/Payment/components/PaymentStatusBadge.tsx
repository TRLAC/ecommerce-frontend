import React from 'react';
import type { PaymentStatus } from '../types/paymentStatus';

const STATUS_MAP: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Chờ thanh toán', color: 'text-amber-600', bg: 'bg-amber-50' },
  COMPLETED: { label: 'Đã thanh toán', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  FAILED: { label: 'Thanh toán thất bại', color: 'text-red-500', bg: 'bg-red-50' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'text-slate-500', bg: 'bg-slate-100' },
};

interface Props {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<Props> = ({ status }) => {
  const { label, color, bg } = STATUS_MAP[status] ?? {
    label: status,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color} ${bg}`}
    >
      {label}
    </span>
  );
};
