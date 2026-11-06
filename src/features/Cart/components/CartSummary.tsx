// features/Cart/components/CartSummary.tsx

import { useNavigate } from "react-router-dom";
import { useClearCart } from "../hooks/useCart";

interface Props {
  totalItems: number;
  totalPrice: number;
}

export default function CartSummary({ totalItems, totalPrice }: Props) {
  const navigate = useNavigate();
  const { mutate: clearCart, isPending } = useClearCart();

  const shipping = totalPrice >= 500_000 ? 0 : 30_000;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 sticky top-[88px]">
      <h2 className="text-base font-bold text-slate-800">Tóm tắt đơn hàng</h2>

      {/* Lines */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Sản phẩm ({totalItems})</span>
          <span className="text-slate-700 font-medium">{totalPrice.toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Phí vận chuyển</span>
          {shipping === 0 ? (
            <span className="text-emerald-500 font-medium">Miễn phí</span>
          ) : (
            <span className="text-slate-700 font-medium">{shipping.toLocaleString("vi-VN")}₫</span>
          )}
        </div>
        {shipping === 0 && (
          <p className="text-xs text-emerald-500 bg-emerald-50 rounded-lg px-3 py-2">
            🎉 Miễn phí ship cho đơn từ 500.000₫
          </p>
        )}
        {shipping > 0 && (
          <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
            Mua thêm{" "}
            <span className="font-semibold text-violet-600">
              {(500_000 - totalPrice).toLocaleString("vi-VN")}₫
            </span>{" "}
            để được miễn phí ship
          </p>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-700">Tổng cộng</span>
        <span className="text-lg font-bold text-violet-600">{grandTotal.toLocaleString("vi-VN")}₫</span>
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/checkout")}
        className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 active:scale-95 transition-all"
      >
        Tiến hành thanh toán →
      </button>

      <button
        onClick={() => navigate("/")}
        className="w-full rounded-xl border border-slate-200 py-2.5 text-sm text-slate-500 hover:bg-slate-50 transition"
      >
        ← Tiếp tục mua sắm
      </button>

      {/* Clear cart */}
      <button
        onClick={() => clearCart()}
        disabled={isPending}
        className="w-full text-xs text-slate-300 hover:text-red-400 transition pt-1"
      >
        {isPending ? "Đang xóa..." : "Xóa toàn bộ giỏ hàng"}
      </button>
    </div>
  );
}
