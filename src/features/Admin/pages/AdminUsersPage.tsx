import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAdminUsers } from "../hooks/useAdmin";
import { EmptyRow, ErrorBox, PageHeader, TableSkeleton, tdCls, thCls } from "../components/AdminUI";
import { Pagination } from "@/features/Product/components/ProductList/Pagination";

export default function AdminUsersPage() {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  // debounce 400ms để không gọi API mỗi phím
  useEffect(() => {
    const t = setTimeout(() => {
      setKeyword(input.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(t);
  }, [input]);

  const q = useAdminUsers({ keyword: keyword || undefined, page, size: 10, sort: "createdAt,desc" });
  const users = q.data?.content ?? [];

  return (
    <div>
      <PageHeader title="Người dùng" subtitle={q.data ? `${q.data.totalElements} tài khoản` : undefined} />

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tìm theo email hoặc tên..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {q.isLoading ? (
          <TableSkeleton />
        ) : q.isError ? (
          <ErrorBox onRetry={() => void q.refetch()} />
        ) : users.length === 0 ? (
          <EmptyRow text="Không tìm thấy người dùng" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className={thCls}>Người dùng</th>
                  <th className={thCls}>Điện thoại</th>
                  <th className={thCls}>Địa chỉ</th>
                  <th className={thCls}>Vai trò</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className={tdCls}>
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-600">
                            {(u.fullName || u.email || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{u.fullName || "(chưa có tên)"}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={tdCls}>{u.phone || "—"}</td>
                    <td className={`${tdCls} max-w-[18rem] truncate`} title={u.address ?? ""}>{u.address || "—"}</td>
                    <td className={tdCls}>
                      <div className="flex gap-1.5">
                        {u.roles.map((r) => (
                          <span key={r} className={`rounded-full px-2.5 py-1 text-xs font-medium ${r === "ROLE_ADMIN" ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-600"}`}>
                            {r === "ROLE_ADMIN" ? "Admin" : "User"}
                          </span>
                        ))}
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
