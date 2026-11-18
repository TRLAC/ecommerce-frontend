import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export const Field = ({ label, htmlFor, error, hint, children, className = "" }: FieldProps) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
    {error ? (
      <p className="mt-1.5 text-xs text-red-500">{error}</p>
    ) : hint ? (
      <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
    ) : null}
  </div>
);
