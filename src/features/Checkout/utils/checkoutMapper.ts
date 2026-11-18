import type { PaymentMethod } from "../../Payment/types/paymentMethod";
import type { CheckoutFormData } from '../types/checkout';
import type { PlaceOrderRequest } from '../../Order/types/order';

export const checkoutMapper = {
  toPlaceOrderRequest: (form: CheckoutFormData, paymentMethod: PaymentMethod): PlaceOrderRequest => ({
    paymentMethod,
    address: form.address.trim() || undefined,
  }),
};
