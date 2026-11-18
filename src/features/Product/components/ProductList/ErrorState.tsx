import { AlertCircle, RotateCw } from "lucide-react";

export default function ErrorState({ message, onRetry }: { message?: string | null; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">Không thể tải sản phẩm</h3>
      <p className="text-xs text-slate-400 mb-5 max-w-xs">{message ?? "Đã có lỗi xảy ra"}</p>
      <button
        className="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors flex items-center gap-1.5"
        onClick={onRetry}
      >
        <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
        Thử lại
      </button>
    </div>
  );
}
