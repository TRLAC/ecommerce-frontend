import React from 'react';
import type { OrderStatus } from '../types/orderStatus';

interface Props {
  currentStatus: OrderStatus;
  /**
   * Đơn COD: PAID là bước cuối (sau DELIVERED). Đơn online: PAID là bước 2.
   * CẦN XÁC NHẬN: OrderResponse của BE có trả phương thức thanh toán không? Nếu có thì truyền vào đây.
   */
  isCod?: boolean;
}

type Step = { label: string; icon: string };

const STEPS: Step[] = [
  { label: 'Chờ xử lý', icon: '🕐' },
  { label: 'Xác nhận / Thanh toán', icon: '✅' },
  { label: 'Đang xử lý', icon: '⚙️' },
  { label: 'Đang giao', icon: '🚚' },
  { label: 'Đã giao', icon: '📦' },
];

const stepIndex = (status: OrderStatus, isCod: boolean): number => {
  switch (status) {
    case 'PENDING':
      return 0;
    case 'CONFIRMED':
      return 1;
    case 'PAID':
      return isCod ? 4 : 1;
    case 'PROCESSING':
      return 2;
    case 'SHIPPED':
      return 3;
    case 'DELIVERED':
      return 4;
    default:
      return -1;
  }
};

export const OrderTimeline: React.FC<Props> = ({ currentStatus, isCod = false }) => {
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

  const currentIndex = stepIndex(currentStatus, isCod);
  // Đã giao xong (hoặc COD đã thu tiền) => bước cuối cũng hoàn tất
  const finished = currentStatus === 'DELIVERED' || (isCod && currentStatus === 'PAID');

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex || (finished && index === currentIndex);
        const isActive = index === currentIndex && !finished;
        const isLast = index === STEPS.length - 1;

        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-base transition-all
                  ${isDone ? 'bg-violet-500 text-white' : isActive ? 'bg-violet-100 ring-2 ring-violet-400' : 'bg-slate-100'}`}
              >
                {isDone ? '✓' : step.icon}
              </div>
              <span
                className={`mt-1 max-w-[64px] text-center text-[10px] leading-tight
                  ${isActive ? 'font-semibold text-violet-600' : isDone ? 'text-violet-400' : 'text-slate-400'}`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`mb-4 h-0.5 flex-1 transition-all ${isDone ? 'bg-violet-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
