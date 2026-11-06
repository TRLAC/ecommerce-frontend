import React from 'react';
import type { OrderItem as OrderItemType } from '../types/orderItem';

interface Props {
  item: OrderItemType;
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

export const OrderItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100">
        <img
          src={item.productImage}
          alt={item.productName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium text-slate-800">{item.productName}</span>
        {item.variantName && (
          <span className="text-xs text-slate-400">{item.variantName}</span>
        )}
        <span className="text-xs text-slate-500">
          {formatVND(item.unitPrice)} × {item.quantity}
        </span>
      </div>
      <span className="text-sm font-semibold text-violet-600">
        {formatVND(item.totalPrice)}
      </span>
    </div>
  );
};
