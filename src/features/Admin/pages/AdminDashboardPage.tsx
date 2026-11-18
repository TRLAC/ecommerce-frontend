import { Link } from "react-router-dom";
import { AlertTriangle, Banknote, Package, ReceiptText, Undo2, Users } from "lucide-react";
import type { ComponentType } from "react";
import { useAdminOrders, useAdminStats } from "../hooks/useAdmin";
import { ErrorBox, PageHeader, Panel } from "../components/AdminUI";
import { OrderStatusBadge } from "@/features/Order/components/OrderStatusBadge";
import { ORDER_STATUS_MAP } from "@/features/Order/constants/orderStatusMap";
import type { OrderStatus } from "@/features/Order/types/orderStatus";
import { formatDateTime, formatVND } from "@/shared/utils/format";

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  to,
}: {
  icon: ComponentType<{ size?: number }>;
  label: string;
  value: string;
  tone: string;
  to?: string;
}) {
  const body = (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="break-words text-lg font-bold text-slate-900 xl:text-xl">{value}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

const BAR_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-amber-400",
  CONFIRMED: "bg-blue-400",
  PAID: "bg-emerald-400",
  PROCESSING: "bg-indigo-400",
  SHIPPED: "bg-violet-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-400",
  REFUNDED: "bg-slate-400",
};

export default function AdminDashboardPage() {
  const stats = useAdminStats();
  const recent = useAdminOrders({ page: 0, size: 5, sort: "createdAt,desc" });

  if (stats.isError) return <ErrorBox onRetry={() => void stats.refetch()} />;

  const s = stats.data;
  const statuses = Object.keys(ORDER_STATUS_MAP) as OrderStatus[];
  const maxCount = Math.max(1, ...statuses.map((k) => s?.ordersByStatus[k] ?? 0));

  return (
    <div>
      <PageHeader title="Tổng quan" subtitle="Số liệu cửa hàng theo thời gian thực" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Banknote} label="Doanh thu (đã thu)" value={s ? formatVND(s.revenue) : "…"} tone="bg-emerald-50 text-emerald-600" />
        <StatCard icon={ReceiptText} label="Đơn hàng" value={s ? String(s.totalOrders) : "…"} tone="bg-violet-50 text-violet-600" to="/admin/orders" />
        <StatCard icon={Users} label="Người dùng" value={s ? String(s.totalUsers) : "…"} tone="bg-blue-50 text-blue-600" to="/admin/users" />
        <StatCard icon={Package} label="Sản phẩm" value={s ? String(s.totalProducts) : "…"} tone="bg-amber-50 text-amber-600" />
      </div>

      {s && (s.pendingRefunds > 0 || s.lowStockProducts > 0) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {s.pendingRefunds > 0 && (
            <Link to="/admin/refunds" className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 ring-1 ring-amber-100 hover:bg-amber-100">
              <Undo2 size={16} /> {s.pendingRefunds} yêu cầu hoàn tiền đang chờ duyệt
            </Link>
          )}
          {s.lowStockProducts > 0 && (
            <span className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 ring-1 ring-red-100">
              <AlertTriangle size={16} /> {s.lowStockProducts} sản phẩm sắp hết hàng (≤ 5)
            </span>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Panel title="Đơn hàng theo trạng thái" className="lg:col-span-2">
          <ul className="space-y-3">
            {statuses.map((k) => {
              const n = s?.ordersByStatus[k] ?? 0;
              return (
                <li key={k}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-600">{ORDER_STATUS_MAP[k].label}</span>
                    <span className="font-semibold text-slate-800">{n}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${BAR_COLORS[k]}`} style={{ width: `${(n / maxCount) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Đơn hàng mới nhất" className="lg:col-span-3">
          {recent.isLoading ? (
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {(recent.data?.content ?? []).map((o) => (
                <li key={o.orderId}>
                  <Link to={`/admin/orders/${o.orderId}`} className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50/60">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800">#{o.orderId} · {o.userFullName}</p>
                      <p className="text-xs text-slate-400">{formatDateTime(o.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-violet-600">{formatVND(o.totalAmount)}</span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                  </Link>
                </li>
              ))}
              {recent.data?.content.length === 0 && <li className="py-8 text-center text-sm text-slate-400">Chưa có đơn hàng</li>}
            </ul>
          )}
          <Link to="/admin/orders" className="mt-3 inline-block text-xs font-semibold text-violet-600 hover:underline">
            Xem tất cả đơn hàng →
          </Link>
        </Panel>
      </div>
    </div>
  );
}
