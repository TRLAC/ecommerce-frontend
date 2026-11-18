import { useEffect, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { useAdminProducts, useHideProduct, useShowProduct } from "../hooks/useAdmin";
import {
  ConfirmButton, EmptyRow, ErrorBox, PageHeader, StatusPill, Tabs, TableSkeleton, tdCls, thCls,
} from "../components/AdminUI";
import ProductFormDialog from "../components/ProductFormDialog";
import { Pagination } from "@/features/Product/components/ProductList/Pagination";
import { formatVND } from "@/shared/utils/format";
import type { ProductResponse, ProductStatus } from "@/features/Product/types";

type Tab = "ALL" | ProductStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "ACTIVE", label: "Đang bán" },
  { value: "INACTIVE", label: "Đã ẩn" },
  { value: "OUT_OF_STOCK", label: "Hết hàng" },
  { value: "DISCONTINUED", label: "Ngừng KD" },
];

const STATUS_VIEW: Record<ProductStatus, { label: string; tone: "green" | "slate" | "amber" | "red" }> = {
  ACTIVE: { label: "Đang bán", tone: "green" },
  INACTIVE: { label: "Đã ẩn", tone: "slate" },
  OUT_OF_STOCK: { label: "Hết hàng", tone: "amber" },
  DISCONTINUED: { label: "Ngừng KD", tone: "red" },
};

export default function AdminProductsPage() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tab, setTab] = useState<Tab>("ALL");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<{ open: boolean; product: ProductResponse | null }>({ open: false, product: null });

  useEffect(() => {
    const t = setTimeout(() => {
      setKeyword(input.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [input]);

  const q = useAdminProducts({
    keyword: keyword || undefined,
    status: tab === "ALL" ? undefined : tab,
    page,
    size: 10,
    sort: "createdAt,desc",
  });
  const hide = useHideProduct();
  const show = useShowProduct();
  const items = q.data?.content ?? [];

  return (
    <div>
      <PageHeader
        title="Sản phẩm"
        subtitle={q.data ? `${q.data.totalElements} sản phẩm` : undefined}
        action={
          <button
            onClick={() => setDialog({ open: true, product: null })}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/30 hover:bg-violet-700"
          >
            <Plus size={16} /> Thêm sản phẩm
          </button>
        }
      />

      <Tabs tabs={TABS} value={tab} onChange={(v) => { setTab(v); setPage(0); }} />

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tìm theo tên sản phẩm..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {q.isLoading ? (
          <TableSkeleton />
        ) : q.isError ? (
          <ErrorBox onRetry={() => void q.refetch()} />
        ) : items.length === 0 ? (
          <EmptyRow text="Không có sản phẩm nào" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className={thCls}>Sản phẩm</th>
                  <th className={thCls}>Danh mục</th>
                  <th className={thCls}>Giá</th>
                  <th className={thCls}>Tồn</th>
                  <th className={thCls}>Trạng thái</th>
                  <th className={thCls}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((p) => {
                  const sv = STATUS_VIEW[p.status];
                  return (
                    <tr key={p.productId}>
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img src={p.images[0]} alt="" className="h-11 w-11 rounded-lg border border-slate-100 object-cover" />
                          ) : (
                            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">No img</span>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-[16rem] truncate font-medium text-slate-800" title={p.name}>{p.name}</p>
                            <p className="text-xs text-slate-400">#{p.productId} · {p.brandName}</p>
                          </div>
                        </div>
                      </td>
                      <td className={tdCls}>{p.categoryName}</td>
                      <td className={`${tdCls} font-medium`}>{formatVND(p.price)}</td>
                      <td className={tdCls}>{p.stockQuantity}</td>
                      <td className={tdCls}><StatusPill label={sv.label} tone={sv.tone} /></td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDialog({ open: true, product: p })}
                            className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                          >
                            <Pencil size={13} /> Sửa
                          </button>
                          {p.status === "INACTIVE" ? (
                            <ConfirmButton label="Hiện lại" onConfirm={() => show.mutate(p.productId)} disabled={show.isPending} />
                          ) : (
                            <ConfirmButton label="Ẩn" variant="danger" onConfirm={() => hide.mutate(p.productId)} disabled={hide.isPending} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {q.data && q.data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination currentPage={page + 1} totalPages={q.data.totalPages} onPageChange={(p) => setPage(p - 1)} />
        </div>
      )}

      {dialog.open && (
        <ProductFormDialog
          key={dialog.product?.productId ?? "new"}
          open
          product={dialog.product}
          onClose={() => setDialog({ open: false, product: null })}
        />
      )}
    </div>
  );
}