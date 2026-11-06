import { useMemo } from "react";
import type { ProductFilter } from "../types";

export function useActiveFilterChips(
  filter: ProductFilter,
  onChange: (partial: Partial<ProductFilter>) => void
) {
  return useMemo(() => {
    const chips: {
      id: string;
      label: string;
      onRemove: () => void;
    }[] = [];

    if (filter.categoryId) {
      chips.push({
        id: `category-${filter.categoryId}`,
        label: filter.categoryName ?? `Category #${filter.categoryId}`,
        onRemove: () =>
          onChange({
            categoryId: undefined,
            categoryName: undefined,
          }),
      });
    }

    if (filter.brandId) {
      chips.push({
        id: `brand-${filter.brandId}`,
        label: filter.brandName ?? `Brand #${filter.brandId}`,
        onRemove: () =>
          onChange({
            brandId: undefined,
            brandName: undefined,
          }),
      });
    }

    (filter.brand ?? []).forEach((b) => {
      chips.push({
        id: `brand-${b}`,
        label: b,
        onRemove: () =>
          onChange({
            brand: filter.brand?.filter((v) => v !== b),
          }),
      });
    });

    if (filter.minPrice != null || filter.maxPrice != null) {
      chips.push({
        id: "price",
        label: `${filter.minPrice ?? 0} – ${filter.maxPrice ?? "+"}`,
        onRemove: () =>
          onChange({ minPrice: undefined, maxPrice: undefined }),
      });
    }

    if (filter.inStock) {
      chips.push({
        id: "stock",
        label: "Còn hàng",
        onRemove: () => onChange({ inStock: undefined }),
      });
    }

    (filter.ram ?? []).forEach((r) => {
      chips.push({
        id: `ram-${r}`,
        label: `${r}GB RAM`,
        onRemove: () =>
          onChange({
            ram: filter.ram?.filter((v) => v !== r),
          }),
      });
    });

    (filter.storage ?? []).forEach((s) => {
      chips.push({
        id: `storage-${s}`,
        label: `${s}GB`,
        onRemove: () =>
          onChange({
            storage: filter.storage?.filter((v) => v !== s),
          }),
      });
    });

    return chips;
  }, [filter, onChange]);
}