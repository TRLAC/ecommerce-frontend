import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import type { OrderFilter } from '../types/orderFilter';

export const useOrders = (filter: OrderFilter = {}) => {
  return useQuery({
    queryKey: ['orders', 'my', filter],
    queryFn: () => orderApi.getMyOrders(filter),
  });
};
