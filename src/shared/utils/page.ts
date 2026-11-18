import type { PageResponse, RawPage } from "@/shared/types/page";

/** Đọc `data.page ?? data` và trả về một dạng duy nhất cho toàn FE. */
export function normalizePage<T>(raw: RawPage<T>): PageResponse<T> {
  const meta = raw.page ?? raw;
  return {
    content: raw.content ?? [],
    number: meta.number ?? 0,
    size: meta.size ?? raw.content?.length ?? 0,
    totalElements: meta.totalElements ?? raw.content?.length ?? 0,
    totalPages: meta.totalPages ?? 1,
  };
}
