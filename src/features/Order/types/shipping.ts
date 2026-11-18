import type { ShippingStatus } from './shippingStatus';

// Khớp ShippingResponse của BE
export interface Shipping {
  shippingId: number;
  orderId: number;
  address: string;
  shippingStatus: ShippingStatus;
  trackingCode: string | null;
  createdAt: string;
  updatedAt: string;
}
