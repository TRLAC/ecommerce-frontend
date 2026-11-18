import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useOrder } from '../../Order/hooks/useOrder';
import { canPayOrder, getLatestPayment } from '../../Order/utils/orderRules';
import { usePayOrder } from '../hooks/usePayOrder';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get('orderId'));

  const { data: order } = useOrder(orderId);
  const payOrder = usePayOrder();

  const latest = order ? getLatestPayment(order) : undefined;
  const canRetry = !!order && !!latest && canPayOrder(order);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <span className="text-5xl">❌</span>
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-800">Thanh toán thất bại</h1>
      <p className="mb-8 text-sm text-slate-500">
        Giao dịch chưa hoàn tất. Đơn hàng vẫn được giữ, bạn có thể thanh toán lại hoặc huỷ đơn.
      </p>

      <div className="flex flex-col gap-3">
        {canRetry && latest && (
          <button
            onClick={() => payOrder.mutate({ orderId, method: latest.method })}
            disabled={payOrder.isPending}
            className="flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
          >
            {payOrder.isPending ? 'Đang xử lý...' : 'Thử thanh toán lại'}
          </button>
        )}
        {orderId ? (
          <Link
            to={`/orders/${orderId}`}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Xem đơn hàng
          </Link>
        ) : null}
        <Link to="/" className="text-sm text-slate-500 hover:text-violet-600">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
};
