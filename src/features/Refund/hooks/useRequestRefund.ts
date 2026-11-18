import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refundApi } from '../api/refundApi';
import type { RefundRequest } from '../types/refund';
import { toast } from '@/shared/lib/toast';
import { getErrorMessage } from '@/shared/utils/apiError';

export const useRequestRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: RefundRequest }) =>
      refundApi.requestRefund(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Đã gửi yêu cầu hoàn tiền. Vui lòng chờ duyệt.');
    },
    onError: (e) => toast.error(getErrorMessage(e, 'Không thể gửi yêu cầu hoàn tiền.')),
  });
};
