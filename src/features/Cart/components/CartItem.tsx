// features/Cart/components/CartItem.tsx

import { useState } from "react";
import type { CartItem as CartItemType } from "../types";
import { useUpdateCartItem, useRemoveCartItem } from "../hooks/useCart";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleQty = (delta: number) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    updateQty({ cartItemId: item.cartItemId, quantity: next });
  };

  const handleRemove = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    removeItem(item.cartItemId);
  };

  const isPending = isUpdating || isRemoving;

  return (
    <div className={`flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 transition-opacity ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* Image */}
      <div className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
        {item.productImageUrl ? (
          <img src={item.productImageUrl} alt={item.productName} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-300 text-2xl">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate mb-1">{item.productName}</p>
        <p className="text-xs text-slate-400 mb-3">
          Đơn giá:{" "}
          <span className="text-slate-600 font-medium">
            {item.productPrice.toLocaleString("vi-VN")}₫   {/* productPrice */}
          </span>
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 overflow-hidden">
            <button onClick={() => handleQty(-1)} disabled={item.quantity <= 1}
              className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition text-sm font-bold">−</button>
            <span className="px-3 py-1.5 text-sm font-semibold text-slate-700 min-w-[2rem] text-center">{item.quantity}</span>
            <button onClick={() => handleQty(+1)}
              className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition text-sm font-bold">+</button>
          </div>

          <p className="text-sm font-bold text-violet-600">
            {item.totalPrice.toLocaleString("vi-VN")}₫   {/* totalPrice */}
          </p>
        </div>
      </div>

      {/* Delete */}
      <button onClick={handleRemove} onBlur={() => setConfirmDelete(false)}
        className={`self-start rounded-xl p-2 transition text-sm ${confirmDelete ? "bg-red-50 text-red-500 hover:bg-red-100" : "text-slate-300 hover:text-red-400 hover:bg-slate-50"}`}
        title={confirmDelete ? "Nhấn lần nữa để xác nhận" : "Xóa"}>
        {confirmDelete ? "Xác nhận?" : "🗑"}
      </button>
    </div>
  );
}
