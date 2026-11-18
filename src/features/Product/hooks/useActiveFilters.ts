import { useMemo } from "react";
import type { ProductFilter } from "../types";

export function useActiveFilters(filter: ProductFilter) {
  return useMemo(
    () =>
      [
        filter.keyword,
        filter.categoryId,
        filter.brandId,
        filter.minPrice,
        filter.maxPrice,
        filter.ram,
        filter.storage,
      ].filter((v) => v != null && v !== "").length,
    [filter]
  );
}
