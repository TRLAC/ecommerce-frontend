import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { toast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/utils/apiError';

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderApi.cancelOrder(id),
    onSuccess: (order) => {
      queryClient.setQueryData(['orders', order.orderId], order);
      queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });
      toast.success('Đã huỷ đơn hàng');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Không thể huỷ đơn hàng này.')),
  });
};
