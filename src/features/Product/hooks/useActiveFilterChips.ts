import { useMemo } from "react";
import type { BrandResponse, CategoryResponse, ProductFilter } from "../types";
import { formatVND } from "@/shared/utils/format";

export function useActiveFilterChips(
  filter: ProductFilter,
  onChange: (partial: Partial<ProductFilter>) => void,
  brands: BrandResponse[] = [],
  categories: CategoryResponse[] = []
) {
  return useMemo(() => {
    const chips: { id: string; label: string; onRemove: () => void }[] = [];

    if (filter.keyword) {
      chips.push({ id: "keyword", label: `"${filter.keyword}"`, onRemove: () => onChange({ keyword: undefined }) });
    }
    if (filter.categoryId != null) {
      const c = categories.find((x) => x.categoryId === filter.categoryId);
      chips.push({
        id: "category",
        label: c?.categoryName ?? `Danh mục #${filter.categoryId}`,
        onRemove: () => onChange({ categoryId: undefined }),
      });
    }
    if (filter.brandId != null) {
      const b = brands.find((x) => x.brandId === filter.brandId);
      chips.push({
        id: "brand",
        label: b?.brandName ?? `Thương hiệu #${filter.brandId}`,
        onRemove: () => onChange({ brandId: undefined }),
      });
    }
    if (filter.minPrice != null || filter.maxPrice != null) {
      const from = filter.minPrice != null ? formatVND(filter.minPrice) : "0₫";
      const to = filter.maxPrice != null ? formatVND(filter.maxPrice) : "trở lên";
      chips.push({
        id: "price",
        label: `${from} – ${to}`,
        onRemove: () => onChange({ minPrice: undefined, maxPrice: undefined }),
      });
    }
    if (filter.ram != null) {
      chips.push({ id: "ram", label: `${filter.ram}GB RAM`, onRemove: () => onChange({ ram: undefined }) });
    }
    if (filter.storage != null) {
      chips.push({ id: "storage", label: `${filter.storage}GB`, onRemove: () => onChange({ storage: undefined }) });
    }
    return chips;
  }, [filter, onChange, brands, categories]);
}
