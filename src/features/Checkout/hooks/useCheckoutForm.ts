import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store';
import { useCheckoutValidation } from './useCheckoutValidation';
import { useCreateOrder } from '../../Order/hooks/useCreateOrder';
import { useCreatePayment } from '../../Payment/hooks/useCreatePayment';
import { CART_QUERY_KEY, useCart } from '../../Cart/hooks/useCart';
import { gatewayUrl } from '../../Payment/utils/gatewayUrl';
import type { PaymentMethod } from '../../Payment/types/paymentMethod';
import type { CheckoutFormData } from '../types/checkout';
import { checkoutMapper } from '../utils/checkoutMapper';
import { toast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/utils/apiError';

export const useCheckoutForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { validate, errors, clearError } = useCheckoutValidation();
  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();
  const { items, totalPrice, isLoading: isCartLoading } = useCart();
  const user = useAuthStore((state) => state.user);

  // Địa chỉ mặc định lấy từ hồ sơ; chỉ điền một lần, không ghi đè khi user đang gõ
  const [formData, setFormData] = useState<CheckoutFormData>({ address: user?.address ?? '' });
  useEffect(() => {
    if (user?.address) setFormData((prev) => (prev.address ? prev : { address: user.address }));
  }, [user?.address]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const handleSubmit = async () => {
    if (!validate(formData)) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // BE tạo đơn từ giỏ hàng, trừ kho và làm trống giỏ trong cùng một giao dịch
      const order = await createOrder.mutateAsync(checkoutMapper.toPlaceOrderRequest(formData, paymentMethod));

      if (paymentMethod === 'COD') {
        // COD không có thanh toán online (BE từ chối createPayment cho COD)
        navigate(`/orders/success/${order.orderId}`, { replace: true });
      } else {
        try {
          const payment = await createPayment.mutateAsync({ orderId: order.orderId, method: paymentMethod });
          navigate(gatewayUrl(payment), { replace: true });
        } catch (e) {
          toast.error(getErrorMessage(e, 'Đơn đã được tạo nhưng chưa thể thanh toán. Bạn có thể thanh toán lại trong chi tiết đơn.'));
          navigate(`/orders/${order.orderId}`, { replace: true });
        }
      }

      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (e) {
      setErrorMessage(getErrorMessage(e, 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    paymentMethod,
    errors,
    isSubmitting,
    errorMessage,
    items,
    totalPrice,
    isCartLoading,
    handleChange,
    setPaymentMethod,
    handleSubmit,
  };
};
