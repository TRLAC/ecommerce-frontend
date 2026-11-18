import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminRefunds, useUpdateRefundStatus } from "../hooks/useAdmin";
import { ConfirmButton, EmptyRow, ErrorBox, PageHeader, Tabs, TableSkeleton, tdCls, thCls } from "../components/AdminUI";
import { RefundStatusBadge } from "@/features/Refund/components/RefundStatusBadge";
import { REFUND_STATUS_MAP } from "@/features/Refund/types/refundStatus";
import type { RefundStatus } from "@/features/Refund/types/refundStatus";
import { PAYMENT_METHOD_LABELS } from "@/features/Payment/types/paymentMethod";
import { Pagination } from "@/features/Product/components/ProductList/Pagination";
import { formatDateTime, formatVND } from "@/shared/utils/format";

type Tab = "ALL" | RefundStatus;
const TABS: { value: Tab; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  ...(Object.keys(REFUND_STATUS_MAP) as RefundStatus[]).map((s) => ({ value: s as Tab, label: REFUND_STATUS_MAP[s].label })),
];

export default function AdminRefundsPage() {
  const [tab, setTab] = useState<Tab>("PENDING");
  const [page, setPage] = useState(0);
  const q = useAdminRefunds({ status: tab === "ALL" ? undefined : tab, page, size: 10, sort: "createdAt,desc" });
  const update = useUpdateRefundStatus();
  const rows = q.data?.content ?? [];

  return (
    <div>
      <PageHeader title="Hoàn tiền" subtitle="Duyệt → Hoàn tất. Khi hoàn tất, hệ thống hoàn kho và chuyển đơn sang Đã hoàn tiền." />
      <Tabs tabs={TABS} value={tab} onChange={(v) => { setTab(v); setPage(0); }} />

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {q.isLoading ? (
          <TableSkeleton />
        ) : q.isError ? (
          <ErrorBox onRetry={() => void q.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyRow text="Không có yêu cầu hoàn tiền" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className={thCls}>Đơn</th>
                  <th className={thCls}>Khách hàng</th>
                  <th className={thCls}>Số tiền</th>
                  <th className={thCls}>Lý do</th>
                  <th className={thCls}>Trạng thái</th>
                  <th className={thCls}>Ngày yêu cầu</th>
                  <th className={thCls}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.refundId}>
                    <td className={tdCls}>
                      <Link to={`/admin/orders/${r.orderId}`} className="font-semibold text-violet-600 hover:underline">
                        #{r.orderId}
                      </Link>
                      <p className="text-xs text-slate-400">{PAYMENT_METHOD_LABELS[r.paymentMethod]}</p>
                    </td>
                    <td className={tdCls}>
                      <p className="font-medium text-slate-800">{r.userFullName}</p>
                      <p className="text-xs text-slate-400">{r.userEmail}</p>
                    </td>
                    <td className={`${tdCls} font-semibold`}>{formatVND(r.amount)}</td>
                    <td className={`${tdCls} max-w-[16rem] truncate`} title={r.reason}>{r.reason}</td>
                    <td className={tdCls}><RefundStatusBadge status={r.status} /></td>
                    <td className={`${tdCls} text-slate-500`}>{formatDateTime(r.createdAt)}</td>
                    <td className={tdCls}>
                      <div className="flex gap-2">
                        {r.status === "PENDING" && (
                          <>
                            <ConfirmButton label="Duyệt" disabled={update.isPending} onConfirm={() => update.mutate({ refundId: r.refundId, status: "APPROVED" })} />
                            <ConfirmButton label="Từ chối" variant="danger" disabled={update.isPending} onConfirm={() => update.mutate({ refundId: r.refundId, status: "REJECTED" })} />
                          </>
                        )}
                        {r.status === "APPROVED" && (
                          <ConfirmButton label="Hoàn tất hoàn tiền" disabled={update.isPending} onConfirm={() => update.mutate({ refundId: r.refundId, status: "COMPLETED" })} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
