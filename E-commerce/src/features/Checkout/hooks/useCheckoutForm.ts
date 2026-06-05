// features/Checkout/hooks/useCheckoutForm.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CheckoutFormData } from '../types/checkout';
import { useCheckoutValidation } from './useCheckoutValidation';
import { useCreateOrder } from '../../Order/hooks/useCreateOrder';
import { useCreatePayment } from '../../Payment/hooks/useCreatePayment';
import { useClearCart } from '../../Cart/hooks/useCart';
import { useCart } from '../../Cart/hooks/useCart';
import type { PaymentMethod } from '../../Payment/types/paymentMethod';
import { checkoutMapper } from '../utils/checkoutMapper';

export const useCheckoutForm = () => {
  const navigate = useNavigate();
  const { validate, errors } = useCheckoutValidation();
  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();
  const clearCart = useClearCart();
  const { items, totalPrice } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validate(formData)) return;
    setIsSubmitting(true);

    try {
      const orderRequest = checkoutMapper.toPlaceOrderRequest(formData, items);
      const order = await createOrder.mutateAsync(orderRequest);

      const payment = await createPayment.mutateAsync({
        orderId: order.id,
        method: paymentMethod,
      });

      await clearCart.mutateAsync();

      if (paymentMethod === 'COD') {
        navigate(`/orders/success/${order.id}`);
      } else if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      }
    } catch {
      // errors surfaced via mutation.isError
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    paymentMethod,
    errors,
    isSubmitting,
    items,
    totalPrice,
    handleChange,
    setPaymentMethod,
    handleSubmit,
    isError: createOrder.isError || createPayment.isError,
  };
};
