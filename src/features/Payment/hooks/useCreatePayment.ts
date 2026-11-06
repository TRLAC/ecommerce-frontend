import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import type { PaymentMethod } from '../types/paymentMethod';

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: ({ orderId, method }: { orderId: number; method: PaymentMethod }) =>
      paymentApi.createPayment(orderId, method),
  });
};
