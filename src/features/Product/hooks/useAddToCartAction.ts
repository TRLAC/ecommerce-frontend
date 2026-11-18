import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddToCart } from "@/features/Cart/hooks/useCart";
import { useAuthStore } from "@/features/auth/store";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/utils/apiError";

/** Thêm vào giỏ: chưa đăng nhập -> sang /login; có toast thành công / lỗi từ BE. */
export function useAddToCartAction() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const { mutate, isPending } = useAddToCart();

  const add = useCallback(
    (productId: number, quantity = 1, onDone?: () => void) => {
      if (!isAuthenticated) {
        toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng");
        navigate("/login", { state: { from: location.pathname + location.search } });
        return;
      }
      mutate(
        { productId, quantity },
        {
          onSuccess: () => {
            toast.success("Đã thêm vào giỏ hàng");
            onDone?.();
          },
          onError: (err) => toast.error(getErrorMessage(err, "Không thêm được vào giỏ hàng")),
        }
      );
    },
    [isAuthenticated, mutate, navigate, location]
  );

  return { add, isPending };
}
