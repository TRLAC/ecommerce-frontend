import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(Number(id));

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      {/* Success icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-5xl">✅</span>
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        Đặt hàng thành công!
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
      </p>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-4 w-32 rounded bg-slate-200 mx-auto mb-4" />
          <div className="h-4 w-full rounded bg-slate-100 mb-2" />
          <div className="h-4 w-3/4 rounded bg-slate-100 mx-auto" />
        </div>
      ) : order ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-left mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Mã đơn hàng</span>
            <span className="text-sm font-bold text-violet-600">#{order.id}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Địa chỉ giao hàng</span>
            <span className="text-sm font-medium text-slate-700 text-right max-w-48">
              {order.shippingAddress}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="font-semibold text-slate-800">Tổng tiền</span>
            <span className="text-lg font-bold text-violet-600">
              {formatVND(order.totalAmount)}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <Link
          to={`/orders/${id}`}
          className="flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3.5
            text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          Xem chi tiết đơn hàng
        </Link>
        <Link
          to="/"
          className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-6 py-3
            text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};
