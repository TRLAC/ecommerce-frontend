export interface PageMeta {
  number: number; // trang hiện tại (0-indexed)
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> extends PageMeta {
  content: T[];
}

/**
 * Spring trả phân trang theo 2 dạng (CẦN XÁC NHẬN dạng nào đang bật ở BE):
 *  - mặc định:  { content, totalElements, totalPages, number, size, ... }
 *  - VIA_DTO:   { content, page: { size, number, totalElements, totalPages } }
 */
export type RawPage<T> = { content: T[]; page?: Partial<PageMeta> } & Partial<PageMeta>;
