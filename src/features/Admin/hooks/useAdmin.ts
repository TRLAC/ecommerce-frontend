import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/adminApi";
import type {
  AdminCategoryQuery,
  AdminOrderQuery,
  AdminProductQuery,
  AdminRefundQuery,
  AdminUserQuery,
  CategoryPayload,
  ProductPayload,
} from "../types";
import type { OrderStatus } from "@/features/Order/types/orderStatus";
import type { ShippingStatus } from "@/features/Order/types/shippingStatus";
import type { RefundStatus } from "@/features/Refund/types/refundStatus";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/utils/apiError";

export const useAdminStats = () => useQuery({ queryKey: ["admin", "stats"], queryFn: adminApi.getStats });

export const useAdminOrders = (params: AdminOrderQuery) =>
  useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => adminApi.getOrders(params),
    placeholderData: keepPreviousData,
  });

export const useAdminOrder = (id: number) =>
  useQuery({ queryKey: ["admin", "order", id], queryFn: () => adminApi.getOrder(id), enabled: !!id });

export const useAdminRefunds = (params: AdminRefundQuery) =>
  useQuery({
    queryKey: ["admin", "refunds", params],
    queryFn: () => adminApi.getRefunds(params),
    placeholderData: keepPreviousData,
  });

export const useAdminUsers = (params: AdminUserQuery) =>
  useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminApi.getUsers(params),
    placeholderData: keepPreviousData,
  });

export const useAdminProducts = (params: AdminProductQuery) =>
  useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => adminApi.getProducts(params),
    placeholderData: keepPreviousData,
  });

export const useAdminCategories = (params: AdminCategoryQuery) =>
  useQuery({
    queryKey: ["admin", "categories", params],
    queryFn: () => adminApi.getCategories(params),
    placeholderData: keepPreviousData,
  });

/** Toàn bộ danh mục (tối đa 200) để đổ vào ô chọn danh mục / danh mục cha. */
export const useAllCategories = () =>
  useQuery({
    queryKey: ["admin", "categories", "all"],
    queryFn: () => adminApi.getCategories({ page: 0, size: 200 }),
    select: (d) => d.content,
  });

/** Sau khi đổi đơn/shipping/refund: làm mới mọi dữ liệu admin liên quan. */
function useInvalidateAdmin() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["admin"] });
}

/** Sau khi sửa sản phẩm/danh mục: làm mới cả dữ liệu admin lẫn trang cửa hàng. */
function useInvalidateCatalog() {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["admin"] }),
      qc.invalidateQueries({ queryKey: ["products"] }),
      qc.invalidateQueries({ queryKey: ["product"] }),
      qc.invalidateQueries({ queryKey: ["categories"] }),
    ]);
}

export const useUpdateOrderStatus = (orderId: number) => {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (status: OrderStatus) => adminApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast.success("Đã cập nhật trạng thái đơn");
      return invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Không cập nhật được trạng thái đơn")),
  });
};

export const useUpdateShipping = (orderId: number) => {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (v: { shippingStatus: ShippingStatus; trackingCode?: string }) =>
      adminApi.updateShipping(orderId, v),
    onSuccess: () => {
      toast.success("Đã cập nhật giao hàng");
      return invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Không cập nhật được giao hàng")),
  });
};

export const useUpdateRefundStatus = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (v: { refundId: number; status: RefundStatus }) =>
      adminApi.updateRefundStatus(v.refundId, v.status),
    onSuccess: () => {
      toast.success("Đã cập nhật yêu cầu hoàn tiền");
      return invalidate();
    },
    onError: (e) => toast.error(getErrorMessage(e, "Không cập nhật được hoàn tiền")),
  });
};

export const useSaveProduct = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: async (v: { id?: number; body: ProductPayload; files: File[] }) => {
      const saved = v.id ? await adminApi.updateProduct(v.id, v.body) : await adminApi.createProduct(v.body);
      if (v.files.length > 0) {
        try {
          await adminApi.uploadProductImages(saved.productId, v.files);
        } catch (e) {
          throw new Error(`Đã lưu sản phẩm nhưng tải ảnh lỗi: ${getErrorMessage(e, "lỗi không xác định")}`);
        }
      }
      return saved;
    },
    onSuccess: () => toast.success("Đã lưu sản phẩm"),
    onError: (e) => toast.error(getErrorMessage(e, "Không lưu được sản phẩm")),
    onSettled: () => invalidate(),
  });
};

export const useHideProduct = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (id: number) => adminApi.hideProduct(id),
    onSuccess: () => toast.success("Đã ẩn sản phẩm"),
    onError: (e) => toast.error(getErrorMessage(e, "Không ẩn được sản phẩm")),
    onSettled: () => invalidate(),
  });
};

export const useShowProduct = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (id: number) => adminApi.updateProduct(id, { status: "ACTIVE" }),
    onSuccess: () => toast.success("Đã hiện lại sản phẩm"),
    onError: (e) => toast.error(getErrorMessage(e, "Không hiện lại được sản phẩm")),
    onSettled: () => invalidate(),
  });
};

export const useSaveCategory = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (v: { id?: number; body: CategoryPayload }) =>
      v.id ? adminApi.updateCategory(v.id, v.body) : adminApi.createCategory(v.body),
    onSuccess: () => toast.success("Đã lưu danh mục"),
    onError: (e) => toast.error(getErrorMessage(e, "Không lưu được danh mục")),
    onSettled: () => invalidate(),
  });
};

export const useShowCategory = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (id: number) => adminApi.showCategory(id),
    onSuccess: () => toast.success("Đã hiện lại danh mục"),
    onError: (e) => toast.error(getErrorMessage(e, "Không hiện lại được danh mục")),
    onSettled: () => invalidate(),
  });
};

export const useHideCategory = () => {
  const invalidate = useInvalidateCatalog();
  return useMutation({
    mutationFn: (id: number) => adminApi.hideCategory(id),
    onSuccess: () => toast.success("Đã ẩn danh mục"),
    onError: (e) => toast.error(getErrorMessage(e, "Không ẩn được danh mục")),
    onSettled: () => invalidate(),
  });
};