import { Eye, EyeOff } from "lucide-react";

type Props = { show: boolean; onToggle: () => void };

export const TogglePassword = ({ show, onToggle }: Props) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
  >
    {show ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);
