import React from 'react';
import type { RefundStatus } from '../types/refundStatus';
import { REFUND_STATUS_MAP } from '../types/refundStatus';

export const RefundStatusBadge: React.FC<{ status: RefundStatus }> = ({ status }) => {
  const { label, color, bgColor } = REFUND_STATUS_MAP[status];
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color} ${bgColor}`}>
      {label}
    </span>
  );
};
