import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useClearCart } from "../hooks/useCart";
import { formatVND } from "@/shared/utils/format";

interface Props {
  totalItems: number;
  totalPrice: number;
}

export default function CartSummary({ totalItems, totalPrice }: Props) {
  const navigate = useNavigate();
  const { mutate: clearCart, isPending } = useClearCart();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="sticky top-[88px] space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-800">Tóm tắt đơn hàng</h2>

      <div className="flex justify-between text-sm text-slate-500">
        <span>Tạm tính ({totalItems} sản phẩm)</span>
        <span className="font-medium text-slate-700">{formatVND(totalPrice)}</span>
      </div>
      <p className="text-xs text-slate-400">Chưa tính phí vận chuyển (hiện chưa áp dụng).</p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-semibold text-slate-700">Tổng cộng</span>
        <span className="text-xl font-bold text-violet-600">{formatVND(totalPrice)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
      >
        Tiến hành thanh toán <ArrowRight size={16} />
      </button>

      <button
        onClick={() => navigate("/")}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm text-slate-500 transition hover:bg-slate-50"
      >
        <ArrowLeft size={16} /> Tiếp tục mua sắm
      </button>

      <button
        onClick={() => (confirmClear ? clearCart() : setConfirmClear(true))}
        onBlur={() => setConfirmClear(false)}
        disabled={isPending}
        className={`w-full pt-1 text-xs transition ${confirmClear ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
      >
        {isPending ? "Đang xóa..." : confirmClear ? "Nhấn lần nữa để xóa toàn bộ" : "Xóa toàn bộ giỏ hàng"}
      </button>
    </div>
  );
}
