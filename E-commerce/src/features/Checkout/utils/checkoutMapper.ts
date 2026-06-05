// features/Checkout/utils/checkoutMapper.ts

import type { CheckoutFormData } from '../types/checkout';
import type { PlaceOrderRequest } from '../../Order/types/order';
import type { CartItem } from '../../Cart/types';

export const checkoutMapper = {
  toPlaceOrderRequest: (
    form: CheckoutFormData,
    items: CartItem[]
  ): PlaceOrderRequest => ({
    fullName: form.fullName,
    phone: form.phone,
    shippingAddress: `${form.address}, ${form.ward}, ${form.district}, ${form.city}`,
    note: form.note || undefined,
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  }),
};
