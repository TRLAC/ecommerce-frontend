import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { useProducts, PAGE_SIZE } from "../hooks/useProducts";
import type { ProductFilter, ViewMode } from "../types";
import ProductCard, { ProductCardSkeleton } from "../components/ProductList/ProductCard";
import FilterSidebar from "../components/ProductList/FilterSidebar";
import SortBar from "../components/ProductList/SortBar";
import ActiveFilterChips from "../components/ProductList/ActiveFilterChip";
import { Pagination } from "../components/ProductList/Pagination";
import { EmptyState } from "../components/ProductList/EmptyState";
import ErrorState from "../components/ProductList/ErrorState";
import { MobileFilterDrawer } from "../components/ProductList/MobileFilterDrawer";

import { useBrands } from "../hooks/useBrand";
import { useCategories } from "../hooks/useCategory";
import { useActiveFilters } from "../hooks/useActiveFilters";
import { useWishlist } from "../hooks/useWishlist";
import { useAddToCartAction } from "../hooks/useAddToCartAction";

function numParam(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Remount theo query string (?keyword=, ?categoryId=, ?brandId=) để filter luôn khớp URL. */
export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  return <ProductListContent key={searchParams.toString()} />;
}

function ProductListContent() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { add: addToCart } = useAddToCartAction();
  const handleAddToCart = useCallback((id: number) => addToCart(id, 1), [addToCart]);

  const initialFilter = useMemo<ProductFilter>(
    () => ({
      keyword: searchParams.get("keyword") ?? undefined,
      categoryId: numParam(searchParams.get("categoryId")),
      brandId: numParam(searchParams.get("brandId")),
    }),
    [searchParams]
  );

  const {
    products, totalElements, totalPages, currentPage,
    isLoading, isError, errorMessage,
    filter, sort, updateFilter, resetFilter, setSort, setPage, refetch,
  } = useProducts(initialFilter);

  const { brands } = useBrands();
  const { categories } = useCategories();
  const { wishlist, toggleWishlist } = useWishlist();
  const activeFilterCount = useActiveFilters(filter);

  const activeCategoryName = categories.find((c) => c.categoryId === filter.categoryId)?.categoryName;

  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
      : "grid grid-cols-1 gap-3";

  let content;
  if (isLoading) {
    content = (
      <div className={gridClass}>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (isError) {
    content = <ErrorState message={errorMessage} onRetry={refetch} />;
  } else if (!products.length) {
    content = <EmptyState onReset={resetFilter} />;
  } else {
    content = (
      <>
        <div className={gridClass} role="list">
          {products.map((product) => (
            <div key={product.productId} role="listitem">
              <ProductCard
                product={product}
                wishlisted={wishlist.has(product.productId)}
                onWishlistToggle={toggleWishlist}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-violet-600">Trang chủ</Link>
              </li>
              {activeCategoryName && (
                <>
                  <li>/</li>
                  <li className="text-slate-600 font-medium">{activeCategoryName}</li>
                </>
              )}
            </ol>
          </nav>
          <div className="flex items-baseline justify-between mt-2">
            <h1 className="text-xl font-bold text-slate-900">
              {filter.keyword ? `Kết quả cho "${filter.keyword}"` : activeCategoryName ?? "Tất cả sản phẩm"}
            </h1>
            {!isLoading && (
              <span className="text-xs text-slate-500">
                {totalElements.toLocaleString("vi-VN")} sản phẩm
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 shrink-0">
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

          <div className="flex-1 min-w-0">
            <ActiveFilterChips
              filter={filter}
              onChange={updateFilter}
              onReset={resetFilter}
              brands={brands}
              categories={categories}
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
            {content}
          </div>
        </div>
      </div>

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
