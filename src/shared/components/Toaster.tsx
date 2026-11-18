import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useToastStore } from "@/shared/lib/toast";
import type { ToastType } from "@/shared/lib/toast";

const STYLE: Record<ToastType, { icon: typeof Info; cls: string }> = {
  success: { icon: CheckCircle2, cls: "text-emerald-600" },
  error: { icon: AlertCircle, cls: "text-red-500" },
  info: { icon: Info, cls: "text-violet-600" },
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
      {toasts.map((t) => {
        const { icon: Icon, cls } = STYLE[t.type];
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60"
          >
            <Icon size={20} className={`mt-0.5 flex-shrink-0 ${cls}`} />
            <p className="flex-1 text-sm text-slate-700">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Đóng"
              className="rounded-lg p-0.5 text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
