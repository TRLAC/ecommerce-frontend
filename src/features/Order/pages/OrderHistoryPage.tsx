import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/OrderCard';
import type { OrderStatus } from '../types/orderStatus';

const PAGE_SIZE = 10;

const TABS: { label: string; statuses: OrderStatus[] | null }[] = [
  { label: 'Tất cả', statuses: null },
  { label: 'Chờ xử lý', statuses: ['PENDING'] },
  { label: 'Đang xử lý', statuses: ['CONFIRMED', 'PAID', 'PROCESSING'] },
  { label: 'Đang giao', statuses: ['SHIPPED'] },
  { label: 'Đã giao', statuses: ['DELIVERED'] },
  { label: 'Đã huỷ / hoàn tiền', statuses: ['CANCELLED', 'REFUNDED'] },
];

export const OrderHistoryPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useOrders();

  const orders = data?.content ?? [];

  const counts = useMemo(
    () => TABS.map((t) => (t.statuses ? orders.filter((o) => t.statuses!.includes(o.status)).length : orders.length)),
    [orders]
  );

  const filtered = useMemo(() => {
    const statuses = TABS[tabIndex].statuses;
    return statuses ? orders.filter((o) => statuses.includes(o.status)) : orders;
  }, [orders, tabIndex]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-violet-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-600">Đơn hàng của tôi</span>
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Đơn hàng của tôi</h1>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => {
              setTabIndex(i);
              setPage(0);
            }}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              tabIndex === i
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300'
            }`}
          >
            {tab.label}
            {!isLoading && <span className={`ml-1.5 text-xs ${tabIndex === i ? 'text-violet-200' : 'text-slate-400'}`}>{counts[i]}</span>}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-sm text-slate-500">Không tải được danh sách đơn hàng.</p>
          <button onClick={() => refetch()} className="mt-3 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700">
            Thử lại
          </button>
        </div>
      ) : pageItems.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="mb-3 text-5xl">📦</span>
          <p className="text-base font-medium text-slate-700">Chưa có đơn hàng nào</p>
          <Link to="/" className="mt-3 text-sm font-medium text-violet-600 hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pageItems.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-sm text-slate-500">
            Trang {page + 1}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};
