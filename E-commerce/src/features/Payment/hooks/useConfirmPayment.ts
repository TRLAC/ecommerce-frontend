import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import type { ConfirmPaymentRequest } from '../types/payment';

export const useConfirmPayment = () => {
  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => paymentApi.confirmPayment(data),
  });
};
