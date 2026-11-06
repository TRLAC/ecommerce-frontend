import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../../Order/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';

interface Props {
  order: Order;
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

export const OrderCard: React.FC<Props> = ({ order }) => {
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;

  return (
    <Link to={`/orders/${order.id}`}>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400">Mã đơn hàng</p>
            <p className="text-sm font-semibold text-slate-700">#{order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Item preview */}
        {firstItem && (
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100">
              <img
                src={firstItem.productImage}
                alt={firstItem.productName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="line-clamp-1 text-sm font-medium text-slate-700">
                {firstItem.productName}
              </span>
              {extraCount > 0 && (
                <span className="text-xs text-slate-400">
                  +{extraCount} sản phẩm khác
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400">{formatDate(order.createdAt)}</span>
          <span className="text-sm font-bold text-violet-600">
            {formatVND(order.totalAmount)}
          </span>
        </div>
      </div>
    </Link>
  );
};
