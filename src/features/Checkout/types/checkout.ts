import type { PaymentMethod } from "../../Payment/types/paymentMethod";

// BE (PlaceOrderRequest) chỉ nhận paymentMethod + address.
// Tên và SĐT người nhận lấy từ hồ sơ tài khoản, không gửi theo từng đơn.
export interface CheckoutFormData {
  address: string;
}

export interface CheckoutState {
  shippingInfo: CheckoutFormData;
  paymentMethod: PaymentMethod | null;
}
