import React from 'react';
import { Link } from 'react-router-dom';
import type { OrderItem as OrderItemType } from '../types/orderItem';
import { formatVND } from '@/shared/utils/format';

interface Props {
  item: OrderItemType;
}

export const OrderItem: React.FC<Props> = ({ item }) => (
  <div className="flex items-center gap-4 py-3">
    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
      {item.productImageUrl && (
        <img src={item.productImageUrl} alt={item.productName} className="h-full w-full object-cover" />
      )}
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      <Link to={`/products/${item.productId}`} className="truncate text-sm font-medium text-slate-800 hover:text-violet-600">
        {item.productName}
      </Link>
      <span className="text-xs text-slate-500">
        {formatVND(item.priceSnapshot)} × {item.quantity}
      </span>
    </div>
    <span className="text-sm font-semibold text-violet-600">{formatVND(item.subtotal)}</span>
  </div>
);
