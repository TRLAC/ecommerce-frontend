import React from 'react';
import type { PaymentMethod } from '../../Payment/types/paymentMethod';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from '../../Payment/types/paymentMethod';

interface Props {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const METHODS: PaymentMethod[] = ['COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'];

export const PaymentMethodSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-slate-800">
        💳 Phương thức thanh toán
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {METHODS.map((method) => {
          const isSelected = selected === method;
          return (
            <button
              key={method}
              type="button"
              onClick={() => onChange(method)}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all
                ${isSelected
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-slate-100 bg-white hover:border-violet-200 hover:bg-slate-50'
                }`}
            >
              <span className="text-2xl">{PAYMENT_METHOD_ICONS[method]}</span>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    isSelected ? 'text-violet-700' : 'text-slate-700'
                  }`}
                >
                  {PAYMENT_METHOD_LABELS[method]}
                </span>
                {method === 'COD' && (
                  <span className="text-xs text-slate-400">
                    Thanh toán khi nhận hàng
                  </span>
                )}
              </div>
              <div className="ml-auto">
                <div
                  className={`h-4 w-4 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-slate-300'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
