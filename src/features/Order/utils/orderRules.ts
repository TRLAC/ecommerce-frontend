import type { Order } from '../types/order';
import type { Payment } from '../../Payment/types/payment';
import type { Refund } from '../../Refund/types/refund';

/** Payment mới nhất của đơn (BE cho phép nhiều lần thanh toán). */
export const getLatestPayment = (order: Order): Payment | undefined =>
  order.payments.reduce<Payment | undefined>(
    (latest, p) => (!latest || p.paymentId > latest.paymentId ? p : latest),
    undefined
  );

export const isCodOrder = (order: Order): boolean => getLatestPayment(order)?.method === 'COD';

/** PENDING -> CANCELLED (cả ONLINE lẫn COD). CONFIRMED/PAID không có nhánh huỷ. */
export const canCancelOrder = (order: Order): boolean => order.status === 'PENDING';

/** Đơn online còn PENDING: được tạo / thử lại thanh toán. COD thì không cần. */
export const canPayOrder = (order: Order): boolean => order.status === 'PENDING' && !isCodOrder(order);

/** Hoàn tiền: chỉ đơn online đã PAID, có payment SUCCESS và chưa có yêu cầu hoàn tiền. */
export const canRequestRefund = (order: Order): boolean =>
  order.status === 'PAID' &&
  !isCodOrder(order) &&
  order.payments.some((p) => p.status === 'SUCCESS' && !p.refund);

export const getOrderRefund = (order: Order): Refund | null =>
  order.payments.find((p) => p.refund)?.refund ?? null;
