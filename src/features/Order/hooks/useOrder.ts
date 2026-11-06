import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApi.getOrder(id),
    enabled: !!id,
  });
};
