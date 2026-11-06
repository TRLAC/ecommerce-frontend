    import { useState, useMemo, useCallback } from "react";
    import { useSearchParams } from "react-router-dom";

    import { useProducts } from "../hooks/useProducts";
    import type { ViewMode } from "../types";
    import ProductCard, { ProductCardSkeleton } from "@/features/Product/components/ProductList/ProductCard";
    import FilterSidebar from "../components/ProductList/FilterSidebar";
    import SortBar from "../components/ProductList/SortBar";

    import { useBrands } from "../hooks/useBrand";
    import { useCategories } from "../hooks/useCategory";

    import ActiveFilterChips from "../components/ProductList/ActiveFilterChip";
    import { Pagination } from "../components/ProductList/Pagination";
    import { EmptyState }  from "../components/ProductList/EmptyState";
    import  ErrorState  from "../components/ProductList/ErrorState";
    import { MobileFilterDrawer } from "../components/ProductList/MobileFilterDrawer";

    import { useActiveFilters } from "../hooks/useActiveFilters";
    import { useWishlist } from "../hooks/useWishlist";

    import { useAddToCart } from "@/features/Cart/hooks/useCart";
      

    const PAGE_SIZE = 20;
  
    export default function ProductListPage() {
      const [searchParams] = useSearchParams();
      const [viewMode, setViewMode] = useState<ViewMode>("grid");
      const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

      const { mutate: addToCart } = useAddToCart();

      const handleAddToCart = useCallback((id: number) => {
        addToCart({ productId: id, quantity: 1 });
      }, [addToCart]);

       const initialFilter = useMemo(() => ({
      keyword: searchParams.get("keyword") ?? undefined,
      categoryId: searchParams.get("categoryId")
        ? Number(searchParams.get("categoryId"))
        : undefined,
    }), [searchParams]);

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
      const { wishlist, toggleWishlist } = useWishlist();
      const  activeFilterCount  = useActiveFilters(filter);
      const activeCategoryName = filter.categoryName;

      const gridClass = useMemo(
          () =>
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
              : "grid grid-cols-1 gap-3",
          [viewMode]
        );

      const handleQuickView = useCallback((product: (typeof products)[0]) => {
        console.info("Quick view:", product.productId);
      }, []);

      const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className={gridClass}>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <ErrorState
          onReset={refetch}
        />
      );
    }

    if (!products.length) {
      return (
        <EmptyState
          message="Không tìm thấy sản phẩm"
          onReset={resetFilter}
        />
      );
    }

    return (
      <>
        <div className={gridClass} role="list">
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
    );
  }, [
    isLoading,
    isError,
    products,
    gridClass,
    errorMessage,
    refetch,
    resetFilter,
    wishlist,
    toggleWishlist,
    handleAddToCart,
    handleQuickView,
    currentPage,
    totalPages,
    setPage,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-slate-400">
              <li>
                <a href="/" className="hover:text-violet-600">
                  Trang chủ
                </a>
              </li>
              <li>/</li>
              <li>
                <a href="/categories" className="hover:text-violet-600">
                  Danh mục
                </a>
              </li>
              {activeCategoryName && (
                <>
                  <li>/</li>
                  <li className="text-slate-600 font-medium">
                    {activeCategoryName}
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div className="flex items-baseline justify-between mt-2">
            <h1 className="text-xl font-bold text-slate-900">
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

      {/* ================= BODY ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56">
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

          {/* Main */}
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

            {content}

          </div>
        </div>
      </div>

      {/* ================= MOBILE FILTER ================= */}
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