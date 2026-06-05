type EmptyStateProps = {
  onReset: () => void;
};

export default function EmptyState({ onReset }: EmptyStateProps) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Không tìm thấy sản phẩm</h3>
          <p className="text-sm text-slate-500 mb-5">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác</p>
          <button className="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors" onClick={onReset}>
            Xóa bộ lọc
          </button>
        </div>
      );
    }