    import { useState, useMemo, useCallback } from "react";
    import { useSearchParams } from "react-router-dom";

    import { useProducts } from "../hooks/useProducts";
    import type { ProductFilter, ViewMode } from "../types";
    import ProductCard, { ProductCardSkeleton } from "@/features/Product/components/ProductCard";
    import FilterSidebar from "../components/FilterSidebar";
    import SortBar from "../components/SortBar";
    import { useBrands } from "../hooks/useBrand";
    import { useCategories } from "../hooks/useCategory";

    const PAGE_SIZE = 20;

    function ActiveFilterChips({
      filter,
      onChange,
      onReset,
    }: {
      filter: ProductFilter;
      onChange: (partial: Partial<ProductFilter>) => void;
      onReset: () => void;
    }) {
      const chips: { label: string; onRemove: () => void }[] = [];

      if (filter.categoryId)
        chips.push({
          label: filter.categoryName ?? `Category #${filter.categoryId}`,
          onRemove: () => onChange({ categoryId: undefined, categoryName: undefined }),
        });

      if (filter.brandId)
        chips.push({
          label: filter.brandName ?? `Brand #${filter.brandId}`,
          onRemove: () => onChange({ brandId: undefined, brandName: undefined }),
        });

      (filter.brand ?? []).forEach((b) =>
        chips.push({
          label: b,
          onRemove: () => onChange({ brand: filter.brand?.filter((v) => v !== b) }),
        })
      );

      if (filter.minPrice != null || filter.maxPrice != null)
        chips.push({
          label: [
            filter.minPrice != null ? `${(filter.minPrice / 1_000_000).toFixed(0)}tr` : "0",
            filter.maxPrice != null ? `${(filter.maxPrice / 1_000_000).toFixed(0)}tr` : "+",
          ].join(" – "),
          onRemove: () => onChange({ minPrice: undefined, maxPrice: undefined }),
        });

      if (filter.inStock)
        chips.push({
          label: "Còn hàng",
          onRemove: () => onChange({ inStock: undefined }),
        });

      (filter.ram ?? []).forEach((r) =>
        chips.push({
          label: `${r}GB RAM`,
          onRemove: () => onChange({ ram: filter.ram?.filter((v) => v !== r) }),
        })
      );

      (filter.storage ?? []).forEach((s) =>
        chips.push({
          label: `${s}GB`,
          onRemove: () => onChange({ storage: filter.storage?.filter((v) => v !== s) }),
        })
      );

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
              key={chip.label}
              className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-200 text-xs px-2.5 py-1 rounded-full"
            >
              {chip.label}
              <button
                className="hover:text-violet-900 transition-colors ml-0.5"
                onClick={chip.onRemove}
                aria-label={`Xóa bộ lọc ${chip.label}`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button
            className="text-xs text-slate-500 hover:text-red-500 underline underline-offset-2 transition-colors"
            onClick={onReset}
          >
            Xóa tất cả
          </button>
        </div>
      );
    }

    function Pagination({
      currentPage,
      totalPages,
      onPageChange,
    }: {
      currentPage: number;
      totalPages: number;
      onPageChange: (page: number) => void;
    }) {
      if (totalPages <= 1) return null;

      const pages: (number | "...")[] = [];
      for (let i = 0; i < totalPages; i++) {
        if (i === 0 || i === totalPages - 1 || Math.abs(i - currentPage) <= 2) {
          pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
          pages.push("...");
        }
      }

      return (
        <nav className="flex items-center justify-center gap-1.5 pt-8 pb-4" aria-label="Phân trang">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            aria-label="Trang trước"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {pages.map((p, idx) =>
            p === "..." ? (
              <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">…</span>
            ) : (
              <button
                key={p}
                className={`w-8 h-8 flex items-center justify-center rounded-xl border text-xs font-medium transition-all
                  ${p === currentPage
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200"
                    : "border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600"
                  }`}
                onClick={() => onPageChange(p as number)}
                aria-label={`Trang ${(p as number) + 1}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {(p as number) + 1}
              </button>
            )
          )}

          <button
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            aria-label="Trang sau"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      );
    }

    function EmptyState({ onReset }: { onReset: () => void }) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Không tìm thấy sản phẩm</h3>
          <p className="text-sm text-slate-500 mb-5">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác</p>
          <button className="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors" onClick={onReset}>
            Xóa bộ lọc
          </button>
        </div>
      );
    }

    function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center" role="alert" aria-live="assertive">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-700 mb-1">Không thể tải sản phẩm</h3>
          <p className="text-xs text-slate-400 mb-5 max-w-xs">{message}</p>
          <button className="h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors flex items-center gap-1.5" onClick={onRetry}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại
          </button>
        </div>
      );
    }

    function MobileFilterDrawer({
      open,
      onClose,
      filter,
      onChange,
      onReset,
      brands,
      categories,
    }: {
      open: boolean;
      onClose: () => void;
      filter: ProductFilter;
      onChange: (partial: Partial<ProductFilter>) => void;
      onReset: () => void;
      brands: { brandId: number; brandName: string }[];
      categoryId?: number;
      categories: { categoryId: number; categoryName: string }[];
    }) {
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


    export default function ProductListPage() {
      const [searchParams] = useSearchParams();
      const [viewMode, setViewMode] = useState<ViewMode>("grid");
      const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

      const initialFilter = useMemo((): ProductFilter => {
        const categoryId = searchParams.get("categoryId");
        return {
          keyword: searchParams.get("keyword") ?? undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
        };
      }, [searchParams]);

      const {
        products,
        totalElements,
        totalPages,
        currentPage,
        isLoading,
        isError,
        errorMessage,
        filter,
        sort,
        updateFilter,
        resetFilter,
        setSort,
        setPage,
        refetch,
      } = useProducts(initialFilter);

      const { brands } = useBrands();
      const { categories } = useCategories();

      const activeCategoryName = useMemo(() => {
        if (!filter.categoryId) return undefined;
        // Lấy từ filter nếu đã có, hoặc tìm trong products
        return (
          filter.categoryName ??
          products.find((p) => p.categoryId === filter.categoryId)?.categoryName
        );
      }, [filter.categoryId, filter.categoryName, products]);

      // Wishlist
      const [wishlist, setWishlist] = useState<Set<number>>(new Set());
      const toggleWishlist = useCallback((id: number) => {
        setWishlist((prev) => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      }, []);

      const handleAddToCart = useCallback((id: number) => {
        console.info("Add to cart:", id);
      }, []);

      const handleQuickView = useCallback((product: (typeof products)[0]) => {
        console.info("Quick view:", product.productId);
      }, []);

      const activeFilterCount = useMemo(() =>
        [
          filter.keyword,
          filter.categoryId,
          filter.brandId,
          filter.minPrice,
          filter.maxPrice,
          filter.inStock,
          filter.status,
        ].filter(Boolean).length
        + (filter.ram ? 1 : 0)
        + (filter.storage ? 1 : 0)
        + (filter.brand ? 1 : 0),
        [filter]
      );

      const gridClass =
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
          : "grid grid-cols-1 gap-3";

      return (
        <div className="min-h-screen bg-slate-50">

          {/* ── Breadcrumb ── */}
          <div className="bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-xs text-slate-400">
                  <li><a href="/" className="hover:text-violet-600 transition-colors">Trang chủ</a></li>
                  <li aria-hidden="true"><span>/</span></li>
                  <li><a href="/categories" className="hover:text-violet-600 transition-colors">Danh mục</a></li>
                  {activeCategoryName && (
                    <>
                      <li aria-hidden="true"><span>/</span></li>
                      <li aria-current="page" className="text-slate-600 font-medium">{activeCategoryName}</li>
                    </>
                  )}
                </ol>
              </nav>

              <div className="flex items-baseline justify-between mt-1.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {activeCategoryName ?? "Tất cả sản phẩm"}
                </h1>
                {!isLoading && (
                  <span className="text-xs text-slate-500">
                    {totalElements.toLocaleString("vi-VN")} sản phẩm
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex gap-6">

              {/* ── Sidebar (desktop) ── */}
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-[72px]">
                  <FilterSidebar
                    filter={filter}
                    onChange={updateFilter}
                    onReset={resetFilter}
                    brands={brands}
                    categories={categories}
                  />
                </div>
              </aside>

              {/* ── Main content ── */}
              <div className="flex-1 min-w-0">

                <ActiveFilterChips
                  filter={filter}
                  onChange={updateFilter}
                  onReset={resetFilter}
                />

                <div className="mb-5">
                  <SortBar
                    sort={sort}
                    onSortChange={setSort}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalElements={totalElements}
                    activeFilterCount={activeFilterCount}
                    onOpenMobileFilter={() => setMobileFilterOpen(true)}
                  />
                </div>

                {isLoading && (
                  <div className={gridClass} aria-label="Đang tải sản phẩm" aria-live="polite">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {!isLoading && isError && (
                  <ErrorState message={errorMessage ?? "Có lỗi xảy ra"} onRetry={refetch} />
                )}

                {!isLoading && !isError && products.length === 0 && (
                  <EmptyState onReset={resetFilter} />
                )}

                {!isLoading && !isError && products.length > 0 && (
                  <>
                    <div className={gridClass} role="list" aria-label="Danh sách sản phẩm">
                      {products.map((product) => (
                        <div key={product.productId} role="listitem">
                          <ProductCard
                            product={product}
                            wishlisted={wishlist.has(product.productId)}
                            onWishlistToggle={toggleWishlist}
                            onAddToCart={handleAddToCart}
                            onQuickView={handleQuickView}
                          />
                        </div>
                      ))}
                    </div>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </>
                )}

              </div>
            </div>
          </div>

          {/* ── Mobile Filter Drawer ── */}
          <MobileFilterDrawer
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            filter={filter}
            onChange={updateFilter}
            onReset={resetFilter}
            brands={brands}
            categories={categories}
          />

        </div>
      );
    }