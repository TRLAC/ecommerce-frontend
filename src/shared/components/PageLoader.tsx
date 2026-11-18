type Props = { label?: string; fullScreen?: boolean };

export default function PageLoader({ label = "Đang tải...", fullScreen = true }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${
        fullScreen ? "min-h-screen bg-slate-50" : "py-20"
      }`}
      role="status"
    >
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-violet-200 border-t-violet-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
