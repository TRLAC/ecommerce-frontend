import { useActiveFilterChips } from "../../hooks/useActiveFilterChips";
import type { ProductFilter } from "../../types";

export default function ActiveFilterChips({
  filter,
  onChange,
  onReset,
}: {
  filter: ProductFilter;
  onChange: (partial: Partial<ProductFilter>) => void;
  onReset: () => void;
}) {
  const chips = useActiveFilterChips(filter, onChange);

  if (chips.length === 0) return null;

  return (
    <div
      className="flex items-center gap-2 flex-wrap py-2"
      role="region"
      aria-label="Bộ lọc đang áp dụng"
    >
      <span className="text-xs text-slate-400">Lọc:</span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-200 text-xs px-2.5 py-1 rounded-full"
        >
          {chip.label}

          <button
            className="hover:text-violet-900 transition-colors ml-0.5"
            onClick={chip.onRemove}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </span>
      ))}

      <button
        className="text-xs text-slate-500 hover:text-red-500 underline"
        onClick={onReset}
      >
        Xóa tất cả
      </button>
    </div>
  );
}