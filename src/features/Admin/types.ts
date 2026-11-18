import type { OrderStatus } from "@/features/Order/types/orderStatus";
import type { PaymentMethod } from "@/features/Payment/types/paymentMethod";
import type { RefundStatus } from "@/features/Refund/types/refundStatus";
import type { ProductStatus } from "@/features/Product/types";

// Khớp AdminStatsResponse (GET /api/admin/stats)
export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  pendingRefunds: number;
  lowStockProducts: number;
  revenue: number;
  ordersByStatus: Record<OrderStatus, number>;
}

// Khớp AdminRefundResponse (GET /api/admin/refunds)
export interface AdminRefund {
  refundId: number;
  orderId: number;
  paymentId: number;
  paymentMethod: PaymentMethod;
  userFullName: string;
  userEmail: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PageQuery {
  page?: number; // 0-indexed
  size?: number;
  sort?: string;
}

export interface ProductPayload  {
  name: string;
  price: number;
  stockQuantity: number;
  brandId: number;
  categoryId: number;
  ram?: number;
  storage?: number;
  battery?: number;
  screenSize?: number;
  status?: ProductStatus;
}

export interface AdminCategory {
  categoryId: number;
  categoryName: string;
  status: "ACTIVE" | "INACTIVE";
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  parentId?: number | null;
  removeParent?: boolean; // true = gỡ danh mục cha (BE: parentId null chỉ có nghĩa là "không đổi")
}

export interface AdminCategoryQuery extends PageQuery {
  keyword?: string;
}

export interface AdminOrderQuery extends PageQuery {
  status?: OrderStatus;
  userId?: number;
}

export interface AdminRefundQuery extends PageQuery {
  status?: RefundStatus;
}

export interface AdminUserQuery extends PageQuery {
  keyword?: string;
}

export interface AdminProductQuery extends PageQuery {
  keyword?: string;
  status?: ProductStatus;
}
