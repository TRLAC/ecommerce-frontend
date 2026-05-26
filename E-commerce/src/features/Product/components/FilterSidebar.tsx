  import { useState, useCallback } from "react";
  import type { ReactNode } from "react";
  import type { ProductFilter } from "../types";

  interface FilterSidebarProps {
    filter: ProductFilter;
    onChange: (partial: Partial<ProductFilter>) => void;
    onReset: () => void;
     brands?: { brandId: number; brandName: string }[];
    categories?: { categoryId: number; categoryName: string }[];
    className?: string;
  }

  const RAM_OPTIONS = [4, 6, 8, 12, 16];
  const STORAGE_OPTIONS = [64, 128, 256, 512, 1024];

  const MIN_PRICE = 0;
  const MAX_PRICE = 2_000_000;


  function FilterSection({
    title,
    children,
    defaultOpen = true,
  }: {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
  }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
      <div className="border-b border-slate-100 py-4">
        <button
          className="flex w-full items-center justify-between text-left mb-0"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "" : "-rotate-90"}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && <div className="mt-3 space-y-1">{children}</div>}
      </div>
    );
  }


  function CheckOption({
    label,
    count,
    checked,
    onChange,
  }: {
    label: string;
    count?: number;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) {
    return (
      <label className="flex items-center gap-2 cursor-pointer group py-0.5">
        <div
          className={`w-3.5 h-3.5 rounded flex-shrink-0 border flex items-center justify-center transition-colors
            ${checked ? "bg-violet-600 border-violet-600" : "border-slate-300 group-hover:border-violet-400"}`}
          aria-hidden="true"
        >
          {checked && (
            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
        />
        <span className={`text-xs flex-1 transition-colors ${checked ? "text-violet-700 font-medium" : "text-slate-600 group-hover:text-slate-900"}`}>
          {label}
        </span>
        {count != null && (
          <span className="text-[10px] text-slate-400">{count.toLocaleString()}</span>
        )}
      </label>
    );
  }

  export default function FilterSidebar({
    filter,
    onChange,
    onReset,
    brands = [],
    categories = [],
    className = "",
  }: FilterSidebarProps) {
    const [showAllBrands, setShowAllBrands] = useState(false);
    const visibleBrands = showAllBrands ? brands : brands.slice(0, 4);

  const toggleArrayFilter = useCallback(
  (
    key:
      | "brand"
      | "ram"
      | "storage",
    value: string | number,
    checked: boolean
  ) => {

    const current =
      (filter[key] as
        (string | number)[]) ?? [];

    const next = checked
      ? [...current, value]
      : current.filter(
          (v) => v !== value
        );

    onChange({
      [key]:
        next.length
          ? next
          : undefined,
        });
  },[filter, onChange]);

    // Price input blur — clamp & validate
    const handlePriceBlur = (
      field: "minPrice" | "maxPrice",
      raw: string
    ) => {
      const parsed = parseInt(raw.replace(/\D/g, ""), 10);
      if (isNaN(parsed)) return;
      const clamped = Math.min(Math.max(parsed, MIN_PRICE), MAX_PRICE);
      if (field === "minPrice" && filter.maxPrice != null && clamped > filter.maxPrice) return;
      if (field === "maxPrice" && filter.minPrice != null && clamped < filter.minPrice) return;
      onChange({ [field]: clamped });
    };

    // Active filter count for badge
    const activeCount = [
    ...(filter.categoryId != null ? [filter.categoryId] : []),
    ...(filter.brand ?? []),
    ...(filter.ram ?? []),
    ...(filter.storage ?? []),
      filter.minPrice,
    filter.maxPrice,
    filter.inStock,
    ].filter(Boolean).length;

    return (
      <aside className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586a1 1 0 00-.293-.707L1.293 6.707A1 1 0 011 6V4z" />
            </svg>
            <span className="text-sm font-semibold text-slate-800">Bộ lọc</span>
            {activeCount > 0 && (
              <span className="bg-violet-100 text-violet-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              className="text-xs text-violet-600 hover:text-violet-800 hover:underline transition-colors"
              onClick={onReset}
              aria-label="Xóa tất cả bộ lọc"
            >
              Đặt lại
            </button>
          )}
        </div>

        {/* Sections */}
        <div className="px-5">

          <FilterSection title="Danh mục">
            {categories.map(cat => (
              <CheckOption
                key={cat.categoryId}
                label={cat.categoryName}
                checked={filter.categoryId === cat.categoryId}
                onChange={(checked) => onChange({
                  categoryId:   checked ? cat.categoryId   : undefined,
                  categoryName: checked ? cat.categoryName : undefined,
                })}
              />
            ))}
          </FilterSection>

          {/* Price */}
          <FilterSection title="Khoảng giá">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
              className="flex-1 min-w-0 w-0 h-8 px-2 text-center text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 transition"
                value={filter.minPrice != null ? filter.minPrice.toLocaleString("vi-VN") : ""}
                placeholder="Từ"
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  onChange({ minPrice: isNaN(v) ? undefined : v });
                }}
                onBlur={(e) => handlePriceBlur("minPrice", e.target.value)}
                aria-label="Giá tối thiểu"
              />
              <span className="text-slate-400 text-xs">–</span>
              <input
                type="text"
                className="flex-1 min-w-0 w-0 h-8 px-2 text-center text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 transition"
                value={filter.maxPrice != null ? filter.maxPrice.toLocaleString("vi-VN") : ""}
                placeholder="Đến"
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  onChange({ maxPrice: isNaN(v) ? undefined : v });
                }}
                onBlur={(e) => handlePriceBlur("maxPrice", e.target.value)}
                aria-label="Giá tối đa"
              />
            </div>

            {/* Quick price presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Dưới 200k",    min: undefined,  max: 200_000 },
                { label: "200k – 500k",  min: 200_000,    max: 500_000 },
                { label: "500k – 1tr",   min: 500_000,    max: 1_000_000 },
                { label: "Trên 1tr",     min: 1_000_000,  max: undefined },
              ].map((preset) => {
                const active =
                  filter.minPrice === preset.min && filter.maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    className={`text-[10px] px-2 py-1 rounded-lg border transition-colors
                      ${active
                        ? "bg-violet-600 text-white border-violet-600"
                        : "border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
                      }`}
                    onClick={() =>
                      onChange(
                        active
                          ? { minPrice: undefined, maxPrice: undefined }
                          : { minPrice: preset.min, maxPrice: preset.max }
                      )
                    }
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Brand */}
          <FilterSection title="Thương hiệu">
            {visibleBrands.map((brand) => (
              <CheckOption
                key={brand.brandId}
                label={brand.brandName}
                checked={filter.brandId === brand.brandId}       // ← đổi
                onChange={(checked) => onChange({
                  brandId:   checked ? brand.brandId   : undefined,  // ← đổi
                  brandName: checked ? brand.brandName : undefined,  // ← đổi
                })}
              />
            ))}

            {brands.length > 4 && (
              <button
                className="text-[11px] text-violet-600 hover:underline mt-1"
                onClick={() =>
                  setShowAllBrands(
                    (v) => !v
                  )
                }
              >
                {showAllBrands
                  ? "Thu gọn"
                  : `+ ${brands.length - 4} thương hiệu khác`}
              </button>
            )}
          </FilterSection>

                  {/* RAM */}

          <FilterSection title="RAM">

            {RAM_OPTIONS.map((ram) => (

              <CheckOption
                key={ram}
                label={`${ram} GB`}
                checked={
                  (filter.ram ?? [])
                    .includes(ram)
                }
                onChange={(checked) =>
                  toggleArrayFilter(
                    "ram",
                    ram,
                    checked
                  )
                }
              />

            ))}

          </FilterSection>

          {/* Storage */}

          <FilterSection title="Bộ nhớ">

            {STORAGE_OPTIONS.map((storage) => (

              <CheckOption
                key={storage}
                label={`${storage} GB`}
                checked={
                  (filter.storage ?? [])
                    .includes(storage)
                }
                onChange={(checked) =>
                  toggleArrayFilter(
                    "storage",
                    storage,
                    checked
                  )
                }
              />

            ))}

          </FilterSection>

          {/* Status */}
          <FilterSection title="Tình trạng" defaultOpen={false}>
            <CheckOption
              label="Còn hàng"
              checked={filter.inStock === true}
              onChange={(c) => onChange({ inStock: c || undefined })}
            />
          </FilterSection>

        </div>

        {/* Apply button — mobile convenience */}
        <div className="px-5 py-4 lg:hidden">
          <button className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors">
            Áp dụng bộ lọc
          </button>
        </div>
      </aside>
    );
  }
