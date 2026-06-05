// features/Checkout/components/CheckoutSummary.tsx

import React from 'react';

interface SummaryItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Props {
  items: SummaryItem[];
  totalAmount: number;
  shippingFee?: number;
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

export const CheckoutSummary: React.FC<Props> = ({
  items,
  totalAmount,
  shippingFee = 0,
}) => {
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const isFreeShipping = totalAmount >= 500_000;
  const finalFee = isFreeShipping ? 0 : shippingFee;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-slate-800">
        Tóm tắt đơn hàng
      </h2>

      {/* Items */}
      <div className="flex flex-col divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 py-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-slate-100 flex items-center justify-center text-lg">
                  📦
                </div>
              )}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center
                rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <span className="flex-1 line-clamp-2 text-sm text-slate-700">
              {item.productName}
            </span>
            <span className="flex-shrink-0 text-sm font-semibold text-violet-600">
              {formatVND(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-3 border-t border-slate-100 pt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Sản phẩm ({totalQuantity})</span>
          <span className="text-slate-700">{formatVND(totalAmount)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Phí vận chuyển</span>
          {isFreeShipping ? (
            <span className="font-medium text-emerald-500">Miễn phí</span>
          ) : (
            <span className="text-slate-700">{formatVND(shippingFee)}</span>
          )}
        </div>

        {isFreeShipping && (
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-600">
            🎉 Miễn phí ship cho đơn từ 500.000đ
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="font-semibold text-slate-800">Tổng cộng</span>
          <span className="text-lg font-bold text-violet-600">
            {formatVND(totalAmount + finalFee)}
          </span>
        </div>
      </div>
    </div>
  );
};
