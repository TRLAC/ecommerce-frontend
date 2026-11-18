import { apiClient } from "@/shared/api/apiClient";
import { normalizePage } from "@/shared/utils/page";
import type { PageResponse, RawPage } from "@/shared/types/page";
import type { Order } from "@/features/Order/types/order";
import type { OrderStatus } from "@/features/Order/types/orderStatus";
import type { Shipping } from "@/features/Order/types/shipping";
import type { ShippingStatus } from "@/features/Order/types/shippingStatus";
import type { RefundStatus } from "@/features/Refund/types/refundStatus";
import type { Refund } from "@/features/Refund/types/refund";
import type { Profile } from "@/features/Profile/profile.type";
import type { ProductResponse } from "@/features/Product/types";
import type {
  AdminOrderQuery,
  AdminRefund,
  AdminRefundQuery,
  AdminStats,
  AdminUserQuery,
  AdminCategory,
  AdminCategoryQuery,
  AdminProductQuery,
  CategoryPayload,
  ProductPayload
} from "../types";

export const adminApi = {
  getStats: async (): Promise<AdminStats> => (await apiClient.get<AdminStats>("/admin/stats")).data,

  getOrders: async (params: AdminOrderQuery): Promise<PageResponse<Order>> =>
    normalizePage((await apiClient.get<RawPage<Order>>("/admin/orders", { params })).data),

  getOrder: async (id: number): Promise<Order> => (await apiClient.get<Order>(`/admin/orders/${id}`)).data,

  updateOrderStatus: async (id: number, newStatus: OrderStatus): Promise<Order> =>
    (await apiClient.patch<Order>(`/admin/orders/${id}/status`, { newStatus })).data,

  updateShipping: async (
    orderId: number,
    body: { shippingStatus: ShippingStatus; trackingCode?: string }
  ): Promise<Shipping> => (await apiClient.patch<Shipping>(`/admin/orders/${orderId}/shipping`, body)).data,

  getRefunds: async (params: AdminRefundQuery): Promise<PageResponse<AdminRefund>> =>
    normalizePage((await apiClient.get<RawPage<AdminRefund>>("/admin/refunds", { params })).data),

  updateRefundStatus: async (refundId: number, status: RefundStatus): Promise<Refund> =>
    (await apiClient.patch<Refund>(`/admin/refunds/${refundId}/status`, { status })).data,

  getProducts: async (params: AdminProductQuery): Promise<PageResponse<ProductResponse>> =>
    normalizePage((await apiClient.get<RawPage<ProductResponse>>("/admin/products", { params })).data),

  createProduct: async (body: ProductPayload): Promise<ProductResponse> =>
    (await apiClient.post<ProductResponse>("/admin/products", body)).data,

  updateProduct: async (id: number, body: Partial<ProductPayload>): Promise<ProductResponse> =>
    (await apiClient.put<ProductResponse>(`/admin/products/${id}`, body)).data,

  // BE: POST multipart, field "file" lặp lại cho nhiều ảnh
  uploadProductImages: async (id: number, files: File[]): Promise<void> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("file", f));
    await apiClient.post(`/admin/products/${id}/images`, fd);
  },

  showCategory: async (id: number): Promise<void> => {
    await apiClient.patch(`/admin/categories/${id}/show`);
  },

  hideProduct: async (id: number): Promise<void> => {
    await apiClient.patch(`/admin/products/${id}/hide`);
  },

  getCategories: async (params: AdminCategoryQuery): Promise<PageResponse<AdminCategory>> =>
    normalizePage((await apiClient.get<RawPage<AdminCategory>>("/categories/search", { params })).data),

  createCategory: async (body: CategoryPayload): Promise<AdminCategory> =>
    (await apiClient.post<AdminCategory>("/admin/categories", body)).data,

  updateCategory: async (id: number, body: CategoryPayload): Promise<AdminCategory> =>
    (await apiClient.put<AdminCategory>(`/admin/categories/${id}`, body)).data,

  hideCategory: async (id: number): Promise<void> => {
    await apiClient.patch(`/admin/categories/${id}/hide`);
  },

  getUsers: async (params: AdminUserQuery): Promise<PageResponse<Profile>> =>
    normalizePage((await apiClient.get<RawPage<Profile>>("/admin/users", { params })).data),
};
