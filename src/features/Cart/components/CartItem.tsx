import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Package, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../types";
import { useUpdateCartItem, useRemoveCartItem } from "../hooks/useCart";
import { formatVND } from "@/shared/utils/format";

export default function CartItem({ item }: { item: CartItemType }) {
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleQty = (delta: number) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    updateQty({ cartItemId: item.cartItemId, quantity: next });
  };

  const handleRemove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    removeItem(item.cartItemId);
  };

  const busy = isUpdating || isRemoving;

  return (
    <div
      className={`flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-opacity ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <Link
        to={`/products/${item.productId}`}
        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50"
      >
        {item.productImageUrl ? (
          <img src={item.productImageUrl} alt={item.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <Package size={28} />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{item.productBrand}</p>
        <Link
          to={`/products/${item.productId}`}
          className="line-clamp-2 text-sm font-semibold text-slate-800 transition hover:text-violet-600"
        >
          {item.productName}
        </Link>
        <p className="mt-1 text-xs text-slate-400">
          Đơn giá: <span className="font-medium text-slate-600">{formatVND(item.productPrice)}</span>
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
            <button
              onClick={() => handleQty(-1)}
              disabled={item.quantity <= 1}
              aria-label="Giảm số lượng"
              className="px-2.5 py-2 text-slate-500 transition hover:bg-slate-50 disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-[2.25rem] text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
            <button
              onClick={() => handleQty(1)}
              aria-label="Tăng số lượng"
              className="px-2.5 py-2 text-slate-500 transition hover:bg-slate-50"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="text-sm font-bold text-violet-600">{formatVND(item.totalPrice)}</p>
        </div>
      </div>

      <button
        onClick={handleRemove}
        onBlur={() => setConfirmDelete(false)}
        aria-label="Xóa khỏi giỏ"
        className={`flex h-9 items-center gap-1 self-start rounded-xl px-2 text-xs transition ${
          confirmDelete
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "text-slate-300 hover:bg-slate-50 hover:text-red-400"
        }`}
      >
        <Trash2 size={16} />
        {confirmDelete && "Xác nhận?"}
      </button>
    </div>
  );
}
