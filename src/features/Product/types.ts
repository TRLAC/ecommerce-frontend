// Khớp BE: ProductResponse + ProductFilter (dto/filter/ProductFilter.java)

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface ProductResponse {
  productId: number;
  name: string;
  price: number;
  stockQuantity: number;
  status: ProductStatus;
  ram?: number | null;
  storage?: number | null;
  battery?: number | null;
  screenSize?: number | null;
  images: string[];
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
}

export interface BrandResponse {
  brandId: number;
  brandName: string;
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
}

// ─── Filter (chỉ gửi những gì BE hỗ trợ) ─────────────────────

export interface ProductFilter {
  keyword?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  ram?: number;
  storage?: number;
}

// ─── Sort ────────────────────────────────────────────────────

export type SortOption = "newest" | "price_asc" | "price_desc";

export const SORT_OPTIONS: { label: string; value: SortOption; springSort: string }[] = [
  { label: "Mới nhất", value: "newest", springSort: "createdAt,desc" },
  { label: "Giá thấp ↑", value: "price_asc", springSort: "price,asc" },
  { label: "Giá cao ↓", value: "price_desc", springSort: "price,desc" },
];

export type ViewMode = "grid" | "list";

export interface ProductQueryParams extends ProductFilter {
  page: number; // 0-indexed
  size: number;
  sort: string;
}
