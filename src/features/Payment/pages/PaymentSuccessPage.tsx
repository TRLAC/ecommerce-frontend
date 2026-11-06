import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useConfirmPayment } from '../hooks/useConfirmPayment';

/**
 * PaymentSuccessPage
 * Called after VNPay / MoMo redirect back with ?orderId=&transactionId=
 * Confirms payment automatically then shows success UI.
 */
export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = Number(searchParams.get('orderId'));
  const transactionId = searchParams.get('transactionId') ?? '';

  const confirmPayment = useConfirmPayment();

  useEffect(() => {
    if (orderId && transactionId) {
      confirmPayment.mutate({ orderId, transactionId, status: 'SUCCESS' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-5xl">💳</span>
        </div>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-slate-800">
        Thanh toán thành công!
      </h1>
      <p className="mb-8 text-sm text-slate-500">
        Giao dịch của bạn đã được xác nhận. Đơn hàng sẽ được xử lý ngay.
      </p>

      <div className="flex flex-col gap-3">
        {orderId ? (
          <Link
            to={`/orders/${orderId}`}
            className="flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3.5
              text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          >
            Xem đơn hàng
          </Link>
        ) : null}
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
