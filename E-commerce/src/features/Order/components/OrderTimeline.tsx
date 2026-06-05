import React from 'react';
import type { OrderStatus } from '../types/orderStatus';

interface Props {
  currentStatus: OrderStatus;
}

const TIMELINE_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'PENDING', label: 'Chờ xác nhận', icon: '🕐' },
  { status: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅' },
  { status: 'PROCESSING', label: 'Đang xử lý', icon: '⚙️' },
  { status: 'SHIPPING', label: 'Đang giao', icon: '🚚' },
  { status: 'DELIVERED', label: 'Đã giao', icon: '📦' },
];

const STATUS_ORDER: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'DELIVERED',
];

export const OrderTimeline: React.FC<Props> = ({ currentStatus }) => {
  if (currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3">
        <span className="text-xl">❌</span>
        <span className="text-sm font-medium text-red-600">
          {currentStatus === 'CANCELLED' ? 'Đơn hàng đã bị huỷ' : 'Đơn hàng đã được hoàn tiền'}
        </span>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0">
      {TIMELINE_STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === TIMELINE_STEPS.length - 1;

        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-base transition-all
                  ${isDone ? 'bg-violet-500' : isActive ? 'bg-violet-100 ring-2 ring-violet-400' : 'bg-slate-100'}`}
              >
                {isDone ? '✓' : step.icon}
              </div>
              <span
                className={`mt-1 text-center text-[10px] leading-tight
                  ${isActive ? 'font-semibold text-violet-600' : isDone ? 'text-violet-400' : 'text-slate-400'}`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mb-4 h-0.5 flex-1 transition-all ${
                  isDone ? 'bg-violet-400' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
