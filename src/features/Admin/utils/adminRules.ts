import type { Order } from "@/features/Order/types/order";
import type { OrderStatus } from "@/features/Order/types/orderStatus";
import type { ShippingStatus } from "@/features/Order/types/shippingStatus";
import { isCodOrder } from "@/features/Order/utils/orderRules";

// Phản chiếu OrderStatusTransition của BE (chỉ để ẩn/hiện nút; BE vẫn là nơi quyết định cuối cùng)
const ONLINE: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "REFUNDED"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};
const COD: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["PAID"],
};

// Phản chiếu ShippingStatusTransition của BE
const SHIPPING_NEXT: Partial<Record<ShippingStatus, ShippingStatus[]>> = {
  PENDING: ["PROCESSING"],
  PROCESSING: ["SHIPPING"],
  SHIPPING: ["DELIVERED", "FAILED"],
  FAILED: ["RETURNED"],
};

// Trạng thái đơn tương ứng khi chuyển shipping (ShippingServiceImpl)
const SHIPPING_TO_ORDER: Partial<Record<ShippingStatus, OrderStatus>> = {
  PROCESSING: "PROCESSING",
  SHIPPING: "SHIPPED",
  DELIVERED: "DELIVERED",
};

const nextOrderStatuses = (order: Order): OrderStatus[] =>
  ((isCodOrder(order) ? COD : ONLINE)[order.status] ?? []);

/**
 * Nút đổi trạng thái đơn qua PATCH /admin/orders/{id}/status.
 * Loại bỏ: PROCESSING/SHIPPED/DELIVERED (BE bắt dùng endpoint shipping),
 * PAID của đơn online (chỉ qua xác nhận thanh toán) và REFUNDED (đi qua luồng Hoàn tiền).
 */
export function getOrderStatusActions(order: Order): OrderStatus[] {
  const cod = isCodOrder(order);
  return nextOrderStatuses(order).filter((s) => {
    if (s === "PROCESSING" || s === "SHIPPED" || s === "DELIVERED") return !order.shipping;
    if (s === "PAID") return cod;
    if (s === "REFUNDED") return false;
    return true;
  });
}

export interface ShippingAction {
  status: ShippingStatus;
  enabled: boolean;
  hint?: string;
}

/** Nút đổi trạng thái giao hàng; bị khoá nếu trạng thái đơn chưa cho phép bước tương ứng. */
export function getShippingActions(order: Order): ShippingAction[] {
  if (!order.shipping) return [];
  const nexts = SHIPPING_NEXT[order.shipping.shippingStatus] ?? [];
  return nexts.map((status) => {
    const target = SHIPPING_TO_ORDER[status];
    if (!target) return { status, enabled: order.status !== "CANCELLED" && order.status !== "REFUNDED" };
    const ok = nextOrderStatuses(order).includes(target);
    return {
      status,
      enabled: ok,
      hint: ok
        ? undefined
        : isCodOrder(order) && order.status === "PENDING"
          ? "Cần xác nhận đơn COD trước"
          : !isCodOrder(order) && order.status === "PENDING"
            ? "Đơn online chưa thanh toán"
            : "Trạng thái đơn chưa phù hợp",
    };
  });
}
