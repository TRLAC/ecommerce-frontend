import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { useAdminCategories, useAllCategories, useHideCategory, useSaveCategory, useShowCategory} from "../hooks/useAdmin";
import {
  ConfirmButton, EmptyRow, ErrorBox, Modal, PageHeader, StatusPill, TableSkeleton, fieldCls, tdCls, thCls,
} from "../components/AdminUI";
import { Pagination } from "@/features/Product/components/ProductList/Pagination";
import { formatDate } from "@/shared/utils/format";
import type { AdminCategory } from "../types";

function CategoryDialog({ category, onClose }: { category: AdminCategory | null; onClose: () => void }) {
  const isEdit = category !== null;
  const all = useAllCategories();
  const save = useSaveCategory();
  const [name, setName] = useState(category?.categoryName ?? "");
  const [parentId, setParentId] = useState(category?.parentId != null ? String(category.parentId) : "");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Nhập tên danh mục");
    setError(null);
     save.mutate(
      {
        id: category?.categoryId,
        body: {
          name: name.trim(),
          parentId: parentId ? Number(parentId) : null,
        
          removeParent: isEdit && category.parentId != null && !parentId,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal open title={isEdit ? `Sửa danh mục #${category?.categoryId}` : "Thêm danh mục"} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Tên danh mục *</span>
          <input className={fieldCls} value={name} maxLength={100} onChange={(e) => setName(e.target.value)} autoFocus />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Danh mục cha</span>
          <select className={fieldCls} value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">— Không (danh mục gốc) —</option>
            {(all.data ?? [])
              .filter((c) => c.status === "ACTIVE" && c.categoryId !== category?.categoryId)
              .map((c) => (
                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
              ))}
          </select>
          {isEdit && (
            <span className="mt-1 block text-[11px] text-slate-400">
              Để trống = giữ nguyên cha hiện tại (BE chưa hỗ trợ gỡ danh mục cha).
            </span>
          )}
        </label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
            Huỷ
          </button>
          <button type="submit" disabled={save.isPending} className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
            {save.isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminCategoriesPage() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [dialog, setDialog] = useState<{ open: boolean; category: AdminCategory | null }>({ open: false, category: null });

  useEffect(() => {
    const t = setTimeout(() => {
      setKeyword(input.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [input]);

  const q = useAdminCategories({ keyword: keyword || undefined, page, size: 10 });
  const all = useAllCategories();
  const hide = useHideCategory();
  const show = useShowCategory();
  const items = q.data?.content ?? [];
  const nameOf = (id: number | null) => (id == null ? "—" : all.data?.find((c) => c.categoryId === id)?.categoryName ?? `#${id}`);

  return (
    <div>
      <PageHeader
        title="Danh mục"
        subtitle={q.data ? `${q.data.totalElements} danh mục` : undefined}
        action={
          <button
            onClick={() => setDialog({ open: true, category: null })}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/30 hover:bg-violet-700"
          >
            <Plus size={16} /> Thêm danh mục
          </button>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tìm theo tên danh mục..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {q.isLoading ? (
          <TableSkeleton />
        ) : q.isError ? (
          <ErrorBox onRetry={() => void q.refetch()} />
        ) : items.length === 0 ? (
          <EmptyRow text="Không có danh mục nào" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className={thCls}>Danh mục</th>
                  <th className={thCls}>Danh mục cha</th>
                  <th className={thCls}>Trạng thái</th>
                  <th className={thCls}>Cập nhật</th>
                  <th className={thCls}>Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((c) => (
                  <tr key={c.categoryId}>
                    <td className={tdCls}>
                      <p className="font-medium text-slate-800">{c.categoryName}</p>
                      <p className="text-xs text-slate-400">#{c.categoryId}</p>
                    </td>
                    <td className={tdCls}>{nameOf(c.parentId)}</td>
                    <td className={tdCls}>
                      <StatusPill label={c.status === "ACTIVE" ? "Đang hiện" : "Đã ẩn"} tone={c.status === "ACTIVE" ? "green" : "slate"} />
                    </td>
                    <td className={tdCls}>{formatDate(c.updatedAt)}</td>
                    <td className={tdCls}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDialog({ open: true, category: c })}
                          className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                        >
                          <Pencil size={13} /> Sửa
                        </button>
                        {c.status === "ACTIVE" ? (
                          <ConfirmButton label="Ẩn" variant="danger" onConfirm={() => hide.mutate(c.categoryId)} disabled={hide.isPending} />
                        ) : (
                          <ConfirmButton label="Hiện lại" onConfirm={() => show.mutate(c.categoryId)} disabled={show.isPending} />
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

      {q.data && q.data.totalPages > 1 && (
        <div className="mt-4">
          <Pagination currentPage={page + 1} totalPages={q.data.totalPages} onPageChange={(p) => setPage(p - 1)} />
        </div>
      )}

      {dialog.open && (
        <CategoryDialog
          key={dialog.category?.categoryId ?? "new"}
          category={dialog.category}
          onClose={() => setDialog({ open: false, category: null })}
        />
      )}
    </div>
  );
}