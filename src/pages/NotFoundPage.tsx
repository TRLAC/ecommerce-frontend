import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { btnCls } from "@/shared/components/Button";

export default function NotFoundPage({ homeHref = "/" }: { homeHref?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <SearchX size={32} />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-violet-600">Lỗi 404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Không tìm thấy trang</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link to={homeHref} className={`${btnCls} mt-6 !w-auto`}>
        Về trang chủ
      </Link>
    </div>
  );
}
