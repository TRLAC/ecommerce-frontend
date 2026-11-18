import type { RefundStatus } from './refundStatus';

// Khớp RefundResponse của BE (field `refund` chính là id của refund).
export interface Refund {
  refund: number;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  reason: string; // bắt buộc, tối đa 255 ký tự
}
