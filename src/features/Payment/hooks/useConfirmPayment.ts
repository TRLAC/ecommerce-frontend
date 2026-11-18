import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import type { ConfirmPaymentRequest } from '../types/payment';

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => paymentApi.confirmPayment(data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
};
