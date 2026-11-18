import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { btnCls } from "@/shared/components/Button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <ShieldAlert size={32} />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-red-500">Lỗi 403</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Bạn không có quyền truy cập</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Tài khoản của bạn không được phép xem trang này.
      </p>
      <Link to="/" className={`${btnCls} mt-6 !w-auto`}>
        Về trang chủ
      </Link>
    </div>
  );
}
