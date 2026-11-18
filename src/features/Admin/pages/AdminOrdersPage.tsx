import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminOrders } from "../hooks/useAdmin";
import { EmptyRow, ErrorBox, PageHeader, Tabs, TableSkeleton, tdCls, thCls } from "../components/AdminUI";
import { OrderStatusBadge } from "@/features/Order/components/OrderStatusBadge";
import { ORDER_STATUS_MAP } from "@/features/Order/constants/orderStatusMap";
import { getLatestPayment } from "@/features/Order/utils/orderRules";
import type { OrderStatus } from "@/features/Order/types/orderStatus";
import { PAYMENT_METHOD_LABELS } from "@/features/Payment/types/paymentMethod";
import { Pagination } from "@/features/Product/components/ProductList/Pagination";
import { formatDateTime, formatVND } from "@/shared/utils/format";

type Tab = "ALL" | OrderStatus;
const TABS: { value: Tab; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  ...(Object.keys(ORDER_STATUS_MAP) as OrderStatus[]).map((s) => ({ value: s as Tab, label: ORDER_STATUS_MAP[s].label })),
];

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("ALL");
  const [page, setPage] = useState(0);

  const q = useAdminOrders({
    status: tab === "ALL" ? undefined : tab,
    page,
    size: 10,
    sort: "createdAt,desc",
  });
  const orders = q.data?.content ?? [];

  return (
    <div>
      <PageHeader title="Đơn hàng" subtitle={q.data ? `${q.data.totalElements} đơn` : undefined} />
      <Tabs
        tabs={TABS}
        value={tab}
        onChange={(v) => {
          setTab(v);
          setPage(0);
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {q.isLoading ? (
          <TableSkeleton />
        ) : q.isError ? (
          <ErrorBox onRetry={() => void q.refetch()} />
        ) : orders.length === 0 ? (
          <EmptyRow text="Không có đơn hàng nào" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className={thCls}>Mã đơn</th>
                  <th className={thCls}>Khách hàng</th>
                  <th className={thCls}>Thanh toán</th>
                  <th className={thCls}>Tổng tiền</th>
                  <th className={thCls}>Trạng thái</th>
                  <th className={thCls}>Ngày đặt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => {
                  const method = getLatestPayment(o)?.method;
                  return (
                    <tr
                      key={o.orderId}
                      onClick={() => navigate(`/admin/orders/${o.orderId}`)}
                      className="cursor-pointer transition hover:bg-violet-50/40"
                    >
                      <td className={`${tdCls} font-semibold text-violet-600`}>#{o.orderId}</td>
                      <td className={tdCls}>
                        <p className="font-medium text-slate-800">{o.userFullName}</p>
                        <p className="text-xs text-slate-400">{o.userEmail}</p>
                      </td>
                      <td className={tdCls}>{method ? PAYMENT_METHOD_LABELS[method] : "—"}</td>
                      <td className={`${tdCls} font-semibold`}>{formatVND(o.totalAmount)}</td>
                      <td className={tdCls}>
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className={`${tdCls} text-slate-500`}>{formatDateTime(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Pagination currentPage={page + 1} totalPages={q.data?.totalPages ?? 0} onPageChange={(p) => setPage(p - 1)} />
      </div>
    </div>
  );
}
