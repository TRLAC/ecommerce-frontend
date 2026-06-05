// ============================================================
// features/product/hooks/useProducts.ts
// ============================================================

import { useState, useEffect, useCallback, useRef } from "react";
import type { ProductResponse, ProductFilter, ProductQueryParams, SortOption } from "../types";
import { SORT_OPTIONS } from "../types";
import { productApi } from "../api/productApi";

// ─── Constants ───────────────────────────────────────────────

const PAGE_SIZE = 20;
const DEFAULT_FILTER: ProductFilter = {};
const DEFAULT_SORT: SortOption = "newest";

// ─── Return type ─────────────────────────────────────────────

export interface UseProductsReturn {
  products: ProductResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  filter: ProductFilter;
  sort: SortOption;
  setFilter: (filter: ProductFilter) => void;
  updateFilter: (partial: Partial<ProductFilter>) => void;
  resetFilter: () => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

// ─── Hook ────────────────────────────────────────────────────

export function useProducts(initialFilter?: ProductFilter): UseProductsReturn {
  const [products, setProducts]         = useState<ProductResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [currentPage, setCurrentPage]   = useState(0);
  const [filter, setFilterState]        = useState<ProductFilter>(initialFilter ?? DEFAULT_FILTER);
  const [sort, setSortState]            = useState<SortOption>(DEFAULT_SORT);
  const [page, setPageState]            = useState(0);
  const [isLoading, setIsLoading]       = useState(false);
  const [isError, setIsError]           = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dùng ref để cancel request cũ khi filter/sort thay đổi nhanh
  const abortRef = useRef<AbortController | null>(null);

const fetchProducts = useCallback(async () => {

  abortRef.current?.abort();

  const controller = new AbortController();
  abortRef.current = controller;

  setIsLoading(true);
  setIsError(false);
  setErrorMessage(null);

  const springSort =
    SORT_OPTIONS.find(
      (o) => o.value === sort
    )?.springSort ?? "createdAt,desc";

  const params: ProductQueryParams = {
    ...filter,
    page,
    size: PAGE_SIZE,
    sort: springSort,
  };

  try {

    const data = await productApi.getAll(
      params,
      controller.signal // truyền signal
    );

    if (controller.signal.aborted) return;

    setProducts(data.content);
    setTotalElements(data.totalElements);
    setTotalPages(data.totalPages);
    setCurrentPage(data.number);

  } catch (err) {

    if (
      err instanceof Error &&
      (
        err.name === "CanceledError" ||
        err.name === "AbortError"
      )
    ) {
      return;
    }

    setIsError(true);

    setErrorMessage(
      err instanceof Error
        ? err.message
        : "Có lỗi xảy ra khi tải sản phẩm"
    );

    setProducts([]);

  } finally {

    if (!controller.signal.aborted) {
      setIsLoading(false);
    }

  }

}, [filter, sort, page]);

  useEffect(() => {
    fetchProducts();
    return () => abortRef.current?.abort();
  }, [fetchProducts]);

  // ─── Helpers ───────────────────────────────────────────────

  const setFilter = useCallback((f: ProductFilter) => {
    setFilterState(f);
    setPageState(0);
  }, []);

  const updateFilter = useCallback((partial: Partial<ProductFilter>) => {
    setFilterState((prev) => ({ ...prev, ...partial }));
    setPageState(0);
  }, []);

  const resetFilter = useCallback(() => {
    setFilterState(DEFAULT_FILTER);
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

  return { products, totalElements, totalPages, currentPage, isLoading, isError, errorMessage, filter, sort, setFilter, updateFilter, resetFilter, setSort, setPage, refetch: fetchProducts,};
}