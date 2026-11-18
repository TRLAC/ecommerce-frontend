import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAdminOrder, useUpdateOrderStatus, useUpdateShipping } from "../hooks/useAdmin";
import { ConfirmButton, ErrorBox, PageHeader, Panel } from "../components/AdminUI";
import { getOrderStatusActions, getShippingActions } from "../utils/adminRules";
import { OrderStatusBadge } from "@/features/Order/components/OrderStatusBadge";
import { OrderItem } from "@/features/Order/components/OrderItem";
import { ORDER_STATUS_MAP } from "@/features/Order/constants/orderStatusMap";
import { SHIPPING_STATUS_MAP } from "@/features/Order/types/shippingStatus";
import { PaymentStatusBadge } from "@/features/Payment/components/PaymentStatusBadge";
import { PAYMENT_METHOD_LABELS } from "@/features/Payment/types/paymentMethod";
import { RefundStatusBadge } from "@/features/Refund/components/RefundStatusBadge";
import { formatDateTime, formatVND } from "@/shared/utils/format";

export default function AdminOrderDetailPage() {
  const orderId = Number(useParams().id);
  const q = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus(orderId);
  const updateShipping = useUpdateShipping(orderId);
  const [tracking, setTracking] = useState("");

  if (q.isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />;
  if (q.isError || !q.data) return <ErrorBox onRetry={() => void q.refetch()} />;

  const o = q.data;
  const statusActions = getOrderStatusActions(o);
  const shippingActions = getShippingActions(o);
  const busy = updateStatus.isPending || updateShipping.isPending;

  return (
    <div>
      <Link to="/admin/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600">
        <ArrowLeft size={16} /> Danh sách đơn
      </Link>
      <PageHeader
        title={`Đơn #${o.orderId}`}
        subtitle={`Đặt lúc ${formatDateTime(o.createdAt)}`}
        action={<OrderStatusBadge status={o.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Sản phẩm">
            <div className="divide-y divide-slate-100">
              {o.items.map((i) => (
                <OrderItem key={i.orderItemId} item={i} />
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
              <span className="font-semibold text-slate-700">Tổng cộng</span>
              <span className="text-lg font-bold text-violet-600">{formatVND(o.totalAmount)}</span>
            </div>
          </Panel>

          <Panel title="Thanh toán">
            <ul className="space-y-3">
              {o.payments.map((p) => (
                <li key={p.paymentId} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{PAYMENT_METHOD_LABELS[p.method]}</p>
                    <p className="text-xs text-slate-400">
                      {p.transactionId ? `Mã GD: ${p.transactionId}` : "Chưa có mã giao dịch"}
                      {p.paidAt && ` · ${formatDateTime(p.paidAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{formatVND(p.amount)}</span>
                    <PaymentStatusBadge status={p.status} />
                    {p.refund && (
                      <Link to="/admin/refunds" className="flex items-center gap-1">
                        <RefundStatusBadge status={p.refund.status} />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Lịch sử trạng thái">
            {o.statusLogs.length === 0 ? (
              <p className="text-sm text-slate-400">Chưa có lịch sử</p>
            ) : (
              <ol className="relative space-y-4 border-l border-slate-200 pl-5">
                {[...o.statusLogs]
                  .sort((a, b) => a.logId - b.logId)
                  .map((l) => (
                    <li key={l.logId} className="relative">
                      <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-violet-500 ring-4 ring-white" />
                      <p className="text-sm text-slate-800">
                        {l.oldStatus ? `${ORDER_STATUS_MAP[l.oldStatus].label} → ` : ""}
                        <b>{ORDER_STATUS_MAP[l.newStatus].label}</b>
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDateTime(l.changedAt)}
                        {l.changedByName && ` · ${l.changedByName}`}
                      </p>
                    </li>
                  ))}
              </ol>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Khách hàng">
            <p className="text-sm font-semibold text-slate-800">{o.userFullName}</p>
            <p className="text-sm text-slate-500">{o.userEmail}</p>
            {o.shipping && <p className="mt-3 text-sm text-slate-600">📍 {o.shipping.address}</p>}
          </Panel>

          <Panel title="Xử lý đơn">
            {statusActions.length === 0 ? (
              <p className="text-xs text-slate-400">Không có thao tác đổi trạng thái đơn ở bước này (các bước giao hàng làm ở phần Giao hàng bên dưới).</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {statusActions.map((s) => (
                  <ConfirmButton
                    key={s}
                   label={s === "PAID" && o.payments.some((p) => p.method === "COD") ? "Đã thu tiền COD" : `→ ${ORDER_STATUS_MAP[s].label}`}
                    variant={s === "CANCELLED" ? "danger" : "primary"}
                    disabled={busy}
                    onConfirm={() => updateStatus.mutate(s)}
                  />
                ))}
              </div>
            )}
            {o.payments.some((p) => p.refund) && (
              <Link to="/admin/refunds" className="mt-3 block text-xs font-semibold text-violet-600 hover:underline">
                Đơn có yêu cầu hoàn tiền → xử lý ở trang Hoàn tiền
              </Link>
            )}
          </Panel>

          {o.shipping && (
            <Panel title="Giao hàng">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${SHIPPING_STATUS_MAP[o.shipping.shippingStatus].bgColor} ${SHIPPING_STATUS_MAP[o.shipping.shippingStatus].color}`}>
                  {SHIPPING_STATUS_MAP[o.shipping.shippingStatus].label}
                </span>
                {o.shipping.trackingCode && <span className="text-xs text-slate-500">Mã vận đơn: {o.shipping.trackingCode}</span>}
              </div>

              {shippingActions.length > 0 && (
                <>
                  <input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="Mã vận đơn (tuỳ chọn)"
                    maxLength={50}
                    className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                  <div className="flex flex-wrap gap-2">
                    {shippingActions.map((a) => (
                      <ConfirmButton
                        key={a.status}
                        label={`→ ${SHIPPING_STATUS_MAP[a.status].label}`}
                        variant={a.status === "FAILED" ? "danger" : "primary"}
                        disabled={busy || !a.enabled}
                        title={a.hint}
                        onConfirm={() =>
                          updateShipping.mutate(
                            { shippingStatus: a.status, trackingCode: tracking.trim() || undefined },
                            { onSuccess: () => setTracking("") }
                          )
                        }
                      />
                    ))}
                  </div>
                  {shippingActions.some((a) => !a.enabled && a.hint) && (
                    <p className="mt-2 text-xs text-amber-600">{shippingActions.find((a) => !a.enabled && a.hint)?.hint}</p>
                  )}
                </>
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
