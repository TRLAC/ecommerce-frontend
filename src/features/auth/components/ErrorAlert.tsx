import { AlertCircle } from "lucide-react";

type ErrorAlertProps = { message: string; className?: string };

export const ErrorAlert = ({ message, className = "" }: ErrorAlertProps) => (
  <div
    role="alert"
    className={`flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 ${className}`}
  >
    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
    <span>{message}</span>
  </div>
);
