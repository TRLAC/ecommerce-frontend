import { useMutation } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import type { PlaceOrderRequest } from '../types/order';

export const useCreateOrder = () =>
  useMutation({ mutationFn: (data: PlaceOrderRequest) => orderApi.placeOrder(data) });
