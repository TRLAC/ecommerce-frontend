import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { getErrorMessage } from "@/shared/utils/apiError";

export function useProductDetail(productId: number | undefined) {
  const q = useQuery({
    queryKey: ["product", productId],
    queryFn: ({ signal }) => productApi.getById(productId as number, signal),
    enabled: productId != null && !Number.isNaN(productId),
  });
  return {
    product: q.data ?? null,
    isLoading: q.isLoading,
    isError: q.isError,
    errorMessage: q.isError ? getErrorMessage(q.error, "Không thể tải sản phẩm") : null,
    refetch: () => void q.refetch(),
  };
}
