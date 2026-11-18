import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrderTimeline } from '../components/OrderTimeline';
import { OrderItem } from '../components/OrderItem';
import { CancelOrderDialog } from '../components/CancelOrderDialog';
import { PaymentStatusBadge } from '../../Payment/components/PaymentStatusBadge';
import { PAYMENT_METHOD_LABELS } from '../../Payment/types/paymentMethod';
import { usePayOrder } from '../../Payment/hooks/usePayOrder';
import { RefundStatusBadge } from '../../Refund/components/RefundStatusBadge';
import { RequestRefundDialog } from '../../Refund/components/RequestRefundDialog';
import { useRequestRefund } from '../../Refund/hooks/useRequestRefund';
import { SHIPPING_STATUS_MAP } from '../types/shippingStatus';
import { ORDER_STATUS_MAP } from '../constants/orderStatusMap';
import {
  canCancelOrder,
  canPayOrder,
  canRequestRefund,
  getLatestPayment,
  getOrderRefund,
  isCodOrder,
} from '../utils/orderRules';
import { formatVND, formatDateTime } from '@/shared/utils/format';

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <h2 className="mb-3 text-sm font-semibold text-slate-700">{title}</h2>
    {children}
  </section>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <>
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-700">{children}</span>
  </>
);

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  const { data: order, isLoading } = useOrder(Number(id));
  const cancelOrder = useCancelOrder();
  const payOrder = usePayOrder();
  const requestRefund = useRequestRefund();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse px-4 py-8">
        <div className="mb-6 h-6 w-48 rounded bg-slate-200" />
        <div className="h-48 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="mb-3 text-5xl">🔍</span>
        <p className="text-base font-medium text-slate-700">Không tìm thấy đơn hàng</p>
        <button onClick={() => navigate('/orders')} className="mt-4 text-sm text-violet-600 underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const latestPayment = getLatestPayment(order);
  const refund = getOrderRefund(order);
  const cod = isCodOrder(order);

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(order.orderId);
      setShowCancel(false);
    } catch {
      // toast lỗi đã hiện trong hook; giữ dialog mở để thử lại
    }
  };

  const handleRefund = async (reason: string) => {
    try {
      await requestRefund.mutateAsync({ orderId: order.orderId, data: { reason } });
      setShowRefund(false);
    } catch {
      // toast lỗi đã hiện trong hook
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-2 text-sm text-slate-400">
        <Link to="/orders" className="hover:text-violet-500">Đơn hàng của tôi</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-600">#{order.orderId}</span>
      </nav>

      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800">Chi tiết đơn #{order.orderId}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      {canPayOrder(order) && latestPayment && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-800">
            Đơn hàng chưa được thanh toán qua <b>{PAYMENT_METHOD_LABELS[latestPayment.method]}</b>.
          </p>
          <button
            onClick={() => payOrder.mutate({ orderId: order.orderId, method: latestPayment.method })}
            disabled={payOrder.isPending}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
          >
            {payOrder.isPending ? 'Đang xử lý...' : 'Thanh toán ngay'}
          </button>
        </div>
      )}

      <Card title="Trạng thái đơn hàng">
        <OrderTimeline currentStatus={order.status} isCod={cod} />
      </Card>

      {order.shipping && (
        <Card title="📦 Giao hàng">
          <div className="grid grid-cols-[110px_1fr] gap-y-2 text-sm sm:grid-cols-[140px_1fr]">
            <Row label="Người nhận">{order.userFullName}</Row>
            <Row label="Địa chỉ">{order.shipping.address}</Row>
            <Row label="Trạng thái">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${SHIPPING_STATUS_MAP[order.shipping.shippingStatus].color} ${SHIPPING_STATUS_MAP[order.shipping.shippingStatus].bgColor}`}>
                {SHIPPING_STATUS_MAP[order.shipping.shippingStatus].label}
              </span>
            </Row>
            {order.shipping.trackingCode && <Row label="Mã vận đơn">{order.shipping.trackingCode}</Row>}
            <Row label="Ngày đặt">{formatDateTime(order.createdAt)}</Row>
          </div>
        </Card>
      )}

      <Card title="💳 Thanh toán">
        {order.payments.length === 0 ? (
          <p className="text-sm text-slate-400">Chưa có thanh toán.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {[...order.payments].sort((a, b) => b.paymentId - a.paymentId).map((p) => (
              <li key={p.paymentId} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-700">{PAYMENT_METHOD_LABELS[p.method]}</p>
                  <p className="text-xs text-slate-400">
                    {p.paidAt ? `Thanh toán lúc ${formatDateTime(p.paidAt)}` : p.transactionId ? `Mã GD: ${p.transactionId}` : 'Chưa phát sinh giao dịch'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">{formatVND(p.amount)}</span>
                  <PaymentStatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {refund && (
        <Card title="↩️ Hoàn tiền">
          <div className="grid grid-cols-[110px_1fr] gap-y-2 text-sm sm:grid-cols-[140px_1fr]">
            <Row label="Trạng thái"><RefundStatusBadge status={refund.status} /></Row>
            <Row label="Số tiền">{formatVND(refund.amount)}</Row>
            <Row label="Lý do">{refund.reason}</Row>
            <Row label="Gửi lúc">{formatDateTime(refund.createdAt)}</Row>
          </div>
        </Card>
      )}

      <Card title="🛍️ Sản phẩm">
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <OrderItem key={item.orderItemId} item={item} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="font-semibold text-slate-800">Tổng cộng</span>
          <span className="text-lg font-bold text-violet-600">{formatVND(order.totalAmount)}</span>
        </div>
      </Card>

      {order.statusLogs.length > 0 && (
        <Card title="🕘 Lịch sử trạng thái">
          <ol className="space-y-2.5 text-sm">
            {[...order.statusLogs].sort((a, b) => b.logId - a.logId).map((log) => (
              <li key={log.logId} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-violet-400" />
                <div>
                  <p className="text-slate-700">
                    {log.oldStatus ? `${ORDER_STATUS_MAP[log.oldStatus].label} → ` : ''}
                    <b>{ORDER_STATUS_MAP[log.newStatus].label}</b>
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDateTime(log.changedAt)}
                    {log.changedByName ? ` · ${log.changedByName}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {canCancelOrder(order) && (
          <button
            onClick={() => setShowCancel(true)}
            className="w-full rounded-xl border-2 border-red-200 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            Huỷ đơn hàng
          </button>
        )}
        {canRequestRefund(order) && (
          <button
            onClick={() => setShowRefund(true)}
            className="w-full rounded-xl border-2 border-violet-200 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
          >
            Yêu cầu hoàn tiền
          </button>
        )}
      </div>

      <CancelOrderDialog
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={handleCancel}
        isLoading={cancelOrder.isPending}
      />
      <RequestRefundDialog
        isOpen={showRefund}
        onClose={() => setShowRefund(false)}
        onConfirm={handleRefund}
        isLoading={requestRefund.isPending}
      />
    </div>
  );
};
