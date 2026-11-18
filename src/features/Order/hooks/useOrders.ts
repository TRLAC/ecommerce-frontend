import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';

// BE chưa lọc theo status nên lấy tối đa 100 đơn mới nhất và lọc ở FE.
export const useOrders = () =>
  useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => orderApi.getMyOrders({ page: 0, size: 100, sort: 'createdAt,desc' }),
  });
