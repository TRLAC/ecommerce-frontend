interface Props{

  message:string;
  onRetry:()=>void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-sm font-medium text-slate-700 mb-1">Không thể tải sản phẩm</h2>
      <p className="text-xs text-slate-400 mb-5 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="h-9 px-5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
}