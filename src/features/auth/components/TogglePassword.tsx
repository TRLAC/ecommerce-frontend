import { Eye, EyeOff } from "lucide-react";

export const TogglePassword = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
  >
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);