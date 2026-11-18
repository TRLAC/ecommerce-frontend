import { SearchX } from "lucide-react";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-violet-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">Không tìm thấy sản phẩm</h3>
      <p className="text-sm text-slate-500 mb-5">Thử đổi bộ lọc hoặc từ khóa khác nhé</p>
      <button
        className="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        onClick={onReset}
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

export default EmptyState;
