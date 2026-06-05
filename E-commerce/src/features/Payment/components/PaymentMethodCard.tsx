import React from 'react';
import type { PaymentMethod } from '../types/paymentMethod';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from '../types/paymentMethod';

interface Props {
  method: PaymentMethod;
}

export const PaymentMethodCard: React.FC<Props> = ({ method }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-2xl">{PAYMENT_METHOD_ICONS[method]}</span>
      <span className="text-sm font-medium text-slate-700">
        {PAYMENT_METHOD_LABELS[method]}
      </span>
    </div>
  );
};
