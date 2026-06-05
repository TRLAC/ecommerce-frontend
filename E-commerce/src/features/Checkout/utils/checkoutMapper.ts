import type { PaymentMethod } from "../../Payment/types/paymentMethod";
import type { CheckoutFormData } from '../types/checkout';
import type { PlaceOrderRequest } from '../../Order/types/order';
import type { CartItem } from '../../Cart/types';

export const checkoutMapper = {
  toPlaceOrderRequest: (
    form: CheckoutFormData,
    items: CartItem[],
    paymentMethod: PaymentMethod
  ): PlaceOrderRequest => ({
    fullName: form.fullName,
    phone: form.phone,
    shippingAddress: `${form.address}`,
    paymentMethod,
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  }),
};
