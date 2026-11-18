import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-sm font-semibold text-slate-800">{title}</h2>}
      {children}
    </section>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
            value === t.value
              ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

const VARIANTS = {
  primary: "bg-violet-600 text-white hover:bg-violet-700",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
} as const;

/** Bấm lần 1 → hỏi xác nhận, bấm lần 2 mới thực hiện (tránh bấm nhầm các thao tác đổi trạng thái). */
export function ConfirmButton({
  label,
  confirmLabel = "Xác nhận?",
  onConfirm,
  variant = "primary",
  disabled,
  title,
}: {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  variant?: keyof typeof VARIANTS;
  disabled?: boolean;
  title?: string;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onBlur={() => setArmed(false)}
      onClick={() => {
        if (!armed) return setArmed(true);
        setArmed(false);
        onConfirm();
      }}
      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
       armed ? `${VARIANTS[variant]} animate-pulse` : VARIANTS[variant]
      }`}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-slate-100" />
      ))}
    </div>
  );
}

export function EmptyRow({ text }: { text: string }) {
  return <div className="py-16 text-center text-sm text-slate-400">{text}</div>;
}

export function ErrorBox({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="py-12 text-center text-sm text-slate-500">
      Không tải được dữ liệu.{" "}
      <button onClick={onRetry} className="font-semibold text-violet-600 hover:underline">
        Thử lại
      </button>
    </div>
  );
}

export const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
export const tdCls = "px-4 py-3 text-sm text-slate-700";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:items-center" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Đóng" className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: "green" | "slate" | "amber" | "red" }) {
  const cls = {
    green: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-500",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  }[tone];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>{label}</span>;
}

export const fieldCls =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";