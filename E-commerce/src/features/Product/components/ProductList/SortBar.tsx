// ============================================================
// features/product/components/SortBar.tsx
// ============================================================

import type { SortOption, ViewMode } from "../../types";
import { SORT_OPTIONS } from "../../types";

// ─── Props ────────────────────────────────────────────────────

interface SortBarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalElements: number;
  activeFilterCount: number;
  onOpenMobileFilter: () => void;
}

// ─── Main Component ───────────────────────────────────────────

export default function SortBar({
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalElements,
  activeFilterCount,
  onOpenMobileFilter,
}: SortBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">

      {/* Mobile: Filter button (hidden on lg+) */}
      <button
        className="lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-600 hover:border-violet-300 hover:text-violet-600 transition-colors relative"
        onClick={onOpenMobileFilter}
        aria-label="Mở bộ lọc"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586a1 1 0 00-.293-.707L2.293 7.293A1 1 0 012 6.586V4z" />
        </svg>
        Bộ lọc
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-violet-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Result count */}
      <p className="text-xs text-slate-500 flex-shrink-0">
        <span className="font-semibold text-slate-700">
          {totalElements.toLocaleString("vi-VN")}
        </span>{" "}
        sản phẩm
      </p>

      {/* Divider */}
      <div className="hidden sm:block w-px h-4 bg-slate-200" aria-hidden="true" />

      {/* Sort pills */}
      <div
        className="flex items-center gap-1.5 flex-wrap"
        role="group"
        aria-label="Sắp xếp theo"
      >
        <span className="text-xs text-slate-400 hidden sm:inline">Sắp xếp:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`h-8 px-3 rounded-full text-xs border transition-all duration-150
              ${sort === opt.value
                ? "bg-violet-600 text-white border-violet-600 font-medium"
                : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"
              }`}
            onClick={() => onSortChange(opt.value)}
            aria-pressed={sort === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* View mode toggle */}
      <div
        className="flex items-center border border-slate-200 rounded-xl overflow-hidden"
        role="group"
        aria-label="Chế độ hiển thị"
      >
        <button
          className={`w-8 h-8 flex items-center justify-center transition-colors
            ${viewMode === "grid"
              ? "bg-violet-600 text-white"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          onClick={() => onViewModeChange("grid")}
          aria-label="Lưới"
          aria-pressed={viewMode === "grid"}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          className={`w-8 h-8 flex items-center justify-center transition-colors
            ${viewMode === "list"
              ? "bg-violet-600 text-white"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          onClick={() => onViewModeChange("list")}
          aria-label="Danh sách"
          aria-pressed={viewMode === "list"}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>

    </div>
  );
}
