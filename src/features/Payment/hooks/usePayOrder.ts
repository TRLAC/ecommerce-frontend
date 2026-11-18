import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import { gatewayUrl } from '../utils/gatewayUrl';
import type { PaymentMethod } from '../types/paymentMethod';
import { toast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/utils/apiError';

/** Tạo (hoặc thử lại) thanh toán cho đơn online rồi chuyển sang cổng giả lập. */
export const usePayOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, method }: { orderId: number; method: PaymentMethod }) =>
      paymentApi.createPayment(orderId, method),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(gatewayUrl(payment));
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Không thể tạo thanh toán.')),
  });
};
