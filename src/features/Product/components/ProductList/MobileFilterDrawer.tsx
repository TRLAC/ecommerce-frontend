import type { ProductFilter } from "../../types";
import FilterSidebar from "./FilterSidebar";

type MobileFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filter: ProductFilter;
  onChange: (partial: Partial<ProductFilter>) => void;
  onReset: () => void;
  brands: { brandId: number; brandName: string }[];
  categories: { categoryId: number; categoryName: string }[];
};


export function MobileFilterDrawer({
      open,
      onClose,
      filter,
      onChange,
      onReset,
      brands,
      categories,
    }: MobileFilterDrawerProps) {
      return (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden
              ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={onClose}
            aria-hidden="true"
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 lg:hidden overflow-y-auto
              ${open ? "translate-x-0" : "-translate-x-full"}`}
            role="dialog"
            aria-modal="true"
            aria-label="Bộ lọc sản phẩm"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="font-semibold text-slate-800">Bộ lọc</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                onClick={onClose}
                aria-label="Đóng bộ lọc"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <FilterSidebar
              filter={filter}
              onChange={onChange}
              onReset={onReset}
              brands={brands}
              categories={categories}
              className="border-0 shadow-none rounded-none"
            />

            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100">
              <button
                className="w-full h-10 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors"
                onClick={onClose}
              >
                Xem kết quả
              </button>
            </div>
          </div>
        </>
      );
    }