export interface ProductResponse {
  productId: number;
  name: string;
  price: number;
  stockQuantity: number;
  status: "ACTIVE"
  ram?: number;
  storage?: number;
  battery?: number;
  screenSize?: number;
  images: string[];
  brandId: number; 
  brandName: string;
  categoryId: number; 
  categoryName: string;
  createdAt: string;
}

// Spring Page wrapper
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;       // current page (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}

// ─── Filter ──────────────────────────────────────────────────

export interface ProductFilter {
  keyword?: string;
  categoryId?: number;
  categoryName?: string; 
  brandId?: number;
  brandName?: string;    
  brand?: string[];    
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  ram?: number[];
  storage?: number[];
  status?: string;
}

// ─── Sort ────────────────────────────────────────────────────

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc";

export const SORT_OPTIONS: { label: string; value: SortOption; springSort: string }[] = [
  { label: "Mới nhất",   value: "newest",     springSort: "createdAt,desc" },
  { label: "Giá thấp ↑", value: "price_asc",  springSort: "price,asc" },
  { label: "Giá cao ↓",  value: "price_desc", springSort: "price,desc" },
];

export type ViewMode = "grid" | "list";

// ─── Query Params (sent to Spring) ───────────────────────────

export interface ProductQueryParams extends ProductFilter {
  page: number;         // 0-indexed (Spring default)
  size: number;
  sort: string; 
}