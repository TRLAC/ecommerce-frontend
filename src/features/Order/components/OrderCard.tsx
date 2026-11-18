import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatVND, formatDate } from '@/shared/utils/format';
import { getLatestPayment } from '../utils/orderRules';
import { PAYMENT_METHOD_LABELS } from '../../Payment/types/paymentMethod';

interface Props {
  order: Order;
}

export const OrderCard: React.FC<Props> = ({ order }) => {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  const method = getLatestPayment(order)?.method;

  return (
    <Link to={`/orders/${order.orderId}`} className="block">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400">Mã đơn hàng</p>
            <p className="text-sm font-semibold text-slate-700">#{order.orderId}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {firstItem && (
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              {firstItem.productImageUrl && (
                <img src={firstItem.productImageUrl} alt={firstItem.productName} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">{firstItem.productName}</p>
              {extraCount > 0 && <p className="text-xs text-slate-400">và {extraCount} sản phẩm khác</p>}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-400">
            <p>{formatDate(order.createdAt)}</p>
            {method && <p>{PAYMENT_METHOD_LABELS[method]}</p>}
          </div>
          <span className="text-base font-bold text-violet-600">{formatVND(order.totalAmount)}</span>
        </div>
      </div>
    </Link>
  );
};
