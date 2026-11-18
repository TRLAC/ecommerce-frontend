import { useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ProductResponse, ProductFilter, ProductQueryParams, SortOption } from "../types";
import { SORT_OPTIONS } from "../types";
import { productApi } from "../api/productApi";
import { getErrorMessage } from "@/shared/utils/apiError";

export const PAGE_SIZE = 12;

export function useProducts(initialFilter: ProductFilter = {}) {
  const [filter, setFilterState] = useState<ProductFilter>(initialFilter);
  const [sort, setSortState] = useState<SortOption>("newest");
  const [page, setPageState] = useState(0);

  const springSort = SORT_OPTIONS.find((o) => o.value === sort)?.springSort ?? "createdAt,desc";
  const params: ProductQueryParams = { ...filter, page, size: PAGE_SIZE, sort: springSort };

  const q = useQuery({
    queryKey: ["products", params],
    queryFn: ({ signal }) => productApi.getAll(params, signal),
    placeholderData: keepPreviousData,
  });

  const updateFilter = useCallback((partial: Partial<ProductFilter>) => {
    setFilterState((prev) => ({ ...prev, ...partial }));
    setPageState(0);
  }, []);

  const resetFilter = useCallback(() => {
    setFilterState({});
    setPageState(0);
  }, []);

  const setSort = useCallback((s: SortOption) => {
    setSortState(s);
    setPageState(0);
  }, []);

  const setPage = useCallback((p: number) => {
    setPageState(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const products: ProductResponse[] = q.data?.content ?? [];

  return {
    products,
    totalElements: q.data?.totalElements ?? 0,
    totalPages: q.data?.totalPages ?? 0,
    currentPage: q.data?.number ?? page,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    isError: q.isError,
    errorMessage: q.isError ? getErrorMessage(q.error, "Không thể tải sản phẩm") : null,
    filter,
    sort,
    updateFilter,
    resetFilter,
    setSort,
    setPage,
    refetch: () => void q.refetch(),
  };
}

/** Sản phẩm liên quan: cùng category, loại bỏ sản phẩm hiện tại. */
export function useRelatedProducts(categoryId: number | undefined, excludeId: number | undefined) {
  const q = useQuery({
    queryKey: ["products", "related", categoryId],
    queryFn: ({ signal }) =>
      productApi.getAll({ categoryId, page: 0, size: 8, sort: "createdAt,desc" }, signal),
    enabled: categoryId != null,
  });
  return {
    related: (q.data?.content ?? []).filter((p) => p.productId !== excludeId).slice(0, 4),
    isLoading: q.isLoading,
  };
}
