// hooks/useActiveFilters.ts
import { useMemo } from "react";
import type { ProductFilter } from "../types";

export function useActiveFilters(filter: ProductFilter) {
  return useMemo(() => {
    return [
      filter.keyword,
      filter.categoryId,
      filter.brandId,
      filter.minPrice,
      filter.maxPrice,
      filter.inStock,
      filter.status,
      filter.ram?.length,
      filter.storage?.length,
      filter.brand?.length,
    ].filter(Boolean).length;
  }, [filter]);
}