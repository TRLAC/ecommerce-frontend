// Khớp enum RefundStatus của BE (hoàn tiền toàn phần).
export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export const REFUND_STATUS_MAP: Record<RefundStatus, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: 'Chờ duyệt', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  APPROVED: { label: 'Đã duyệt', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  REJECTED: { label: 'Bị từ chối', color: 'text-red-500', bgColor: 'bg-red-50' },
  COMPLETED: { label: 'Đã hoàn tiền', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
};
