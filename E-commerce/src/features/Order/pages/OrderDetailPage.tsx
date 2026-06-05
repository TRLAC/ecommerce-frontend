import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrderTimeline } from '../components/OrderTimeline';
import { OrderItem } from '../components/OrderItem';
import { CancelOrderDialog } from '../components/CancelOrderDialog';

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';
const formatDate = (date: string) =>
  new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: order, isLoading } = useOrder(Number(id));
  const cancelOrder = useCancelOrder();

  const handleCancel = async (reason: string) => {
    if (!order) return;
    await cancelOrder.mutateAsync({ id: order.id, data: { reason } });
    setShowCancelDialog(false);
  };

  const canCancel = order?.status === 'PENDING' || order?.status === 'CONFIRMED';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 animate-pulse">
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
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 text-sm text-violet-600 underline"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-2 text-sm text-slate-400">
        <button onClick={() => navigate('/orders')} className="hover:text-violet-500">
          Đơn hàng của tôi
        </button>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-600">#{order.id}</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Chi tiết đơn #{order.id}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Trạng thái đơn hàng</h2>
        <OrderTimeline currentStatus={order.status} />
      </div>

      {/* Shipping info */}
      <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">📦 Thông tin giao hàng</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-slate-400">Người nhận</span>
          <span className="font-medium text-slate-700">{order.fullName}</span>
          <span className="text-slate-400">Số điện thoại</span>
          <span className="font-medium text-slate-700">{order.phone}</span>
          <span className="text-slate-400">Địa chỉ</span>
          <span className="font-medium text-slate-700">{order.shippingAddress}</span>
          <span className="text-slate-400">Ngày đặt</span>
          <span className="font-medium text-slate-700">{formatDate(order.createdAt)}</span>
          {order.note && (
            <>
              <span className="text-slate-400">Ghi chú</span>
              <span className="font-medium text-slate-700">{order.note}</span>
            </>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-slate-700">🛍️ Sản phẩm</h2>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-slate-500">Phí vận chuyển</span>
            {order.shippingFee === 0 ? (
              <span className="text-sm text-emerald-500 font-medium">Miễn phí</span>
            ) : (
              <span className="text-sm text-slate-700">{formatVND(order.shippingFee)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold text-slate-800">Tổng cộng</span>
            <span className="text-lg font-bold text-violet-600">
              {formatVND(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canCancel && (
        <button
          onClick={() => setShowCancelDialog(true)}
          className="w-full rounded-xl border-2 border-red-200 py-3 text-sm font-semibold
            text-red-500 transition hover:bg-red-50"
        >
          Huỷ đơn hàng
        </button>
      )}

      <CancelOrderDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        isLoading={cancelOrder.isPending}
      />
    </div>
  );
};
