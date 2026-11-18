import { formatVND } from "@/shared/utils/format";

// Giữ tên cũ để các component Product không phải sửa import.
export function formatPrice(value: number): string {
  return formatVND(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
