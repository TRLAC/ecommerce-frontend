// Khớp enum ShippingStatus của BE.
export type ShippingStatus = 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'RETURNED' | 'FAILED';

export const SHIPPING_STATUS_MAP: Record<ShippingStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'Chờ lấy hàng', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  PROCESSING: { label: 'Đang chuẩn bị', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  SHIPPING: { label: 'Đang vận chuyển', color: 'text-violet-600', bgColor: 'bg-violet-50' },
  DELIVERED: { label: 'Đã giao', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  RETURNED: { label: 'Hoàn về kho', color: 'text-slate-500', bgColor: 'bg-slate-100' },
  FAILED: { label: 'Giao thất bại', color: 'text-red-500', bgColor: 'bg-red-50' },
};
