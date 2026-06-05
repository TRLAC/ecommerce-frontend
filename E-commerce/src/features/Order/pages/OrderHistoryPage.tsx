import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/OrderCard';
import type { OrderStatus } from '../types/orderStatus';

const STATUS_TABS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'Tất cả', value: undefined },
  { label: 'Chờ xác nhận', value: 'PENDING' },
  { label: 'Đang giao', value: 'SHIPPING' },
  { label: 'Đã giao', value: 'DELIVERED' },
  { label: 'Đã huỷ', value: 'CANCELLED' },
];

export const OrderHistoryPage: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useOrders({ status: activeStatus, page, size: 10 });

  const handleTabChange = (status: OrderStatus | undefined) => {
    setActiveStatus(status);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <nav className="mb-2 text-sm text-slate-400">
        <span>Trang chủ</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-slate-600">Đơn hàng của tôi</span>
      </nav>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Đơn hàng của tôi</h1>

      {/* Status tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.value)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all
              ${activeStatus === tab.value
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-slate-100 bg-white animate-pulse"
            />
          ))}
        </div>
      ) : !data?.content?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="mb-3 text-5xl">📋</span>
          <p className="text-base font-medium text-slate-700">Chưa có đơn hàng nào</p>
          <p className="mt-1 text-sm text-slate-400">
            Hãy mua sắm và quay lại đây để theo dõi đơn hàng nhé!
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {data.content.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600
                  hover:bg-slate-50 disabled:opacity-40"
              >
                ← Trước
              </button>
              <span className="text-sm text-slate-500">
                {page + 1} / {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600
                  hover:bg-slate-50 disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
