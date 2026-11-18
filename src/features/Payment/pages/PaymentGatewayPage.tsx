import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useOrder } from '../../Order/hooks/useOrder';
import { useConfirmPayment } from '../hooks/useConfirmPayment';
import { PAYMENT_METHOD_ICONS, PAYMENT_METHOD_LABELS } from '../types/paymentMethod';
import PageLoader from '@/shared/components/PageLoader';
import { formatVND } from '@/shared/utils/format';
import { toast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/utils/apiError';

/**
 * Cổng thanh toán GIẢ LẬP (BE không tích hợp cổng thật).
 * Chọn "Thanh toán thành công" / "thất bại" -> POST /api/payments/confirm { orderId, transactionId, success }.
 */
export const PaymentGatewayPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = Number(params.get('orderId'));
  const transactionId = params.get('transactionId') ?? '';

  const { data: order, isLoading } = useOrder(orderId);
  const confirm = useConfirmPayment();

  if (!orderId || !transactionId) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-sm text-slate-500">Liên kết thanh toán không hợp lệ.</p>
        <Link to="/orders" className="mt-3 inline-block text-sm font-medium text-violet-600 hover:underline">
          Về đơn hàng của tôi
        </Link>
      </div>
    );
  }

  if (isLoading) return <PageLoader fullScreen={false} />;

  const payment = order?.payments.find((p) => p.transactionId === transactionId);
  const payable = order?.status === 'PENDING' && payment?.status === 'PENDING';

  const handle = async (success: boolean) => {
    try {
      await confirm.mutateAsync({ orderId, transactionId, success });
      navigate(`/payment/${success ? 'success' : 'failed'}?orderId=${orderId}`, { replace: true });
    } catch (e) {
      toast.error(getErrorMessage(e, 'Không thể xác nhận thanh toán.'));
    }
  };

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-5 text-white">
          <p className="flex items-center gap-2 text-sm font-medium text-violet-100">
            <ShieldCheck size={18} /> Cổng thanh toán giả lập
          </p>
          <p className="mt-3 text-3xl font-bold">{formatVND(payment?.amount ?? order?.totalAmount ?? 0)}</p>
        </div>

        <div className="space-y-4 p-6">
          <dl className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
            <dt className="text-slate-400">Đơn hàng</dt>
            <dd className="font-medium text-slate-700">#{orderId}</dd>
            {payment && (
              <>
                <dt className="text-slate-400">Phương thức</dt>
                <dd className="font-medium text-slate-700">
                  {PAYMENT_METHOD_ICONS[payment.method]} {PAYMENT_METHOD_LABELS[payment.method]}
                </dd>
              </>
            )}
            <dt className="text-slate-400">Mã giao dịch</dt>
            <dd className="break-all font-mono text-xs text-slate-600">{transactionId}</dd>
          </dl>

          {payable ? (
            <>
              <button
                onClick={() => handle(true)}
                disabled={confirm.isPending}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {confirm.isPending ? 'Đang xử lý...' : '✓ Thanh toán thành công'}
              </button>
              <button
                onClick={() => handle(false)}
                disabled={confirm.isPending}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-red-200 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
              >
                ✕ Giả lập thanh toán thất bại
              </button>
              <p className="text-center text-xs text-slate-400">Môi trường demo: không phát sinh giao dịch thật.</p>
            </>
          ) : (
            <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
              Giao dịch này không còn ở trạng thái chờ thanh toán.
              <Link to={`/orders/${orderId}`} className="mt-2 block font-medium text-violet-600 hover:underline">
                Xem đơn hàng
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
