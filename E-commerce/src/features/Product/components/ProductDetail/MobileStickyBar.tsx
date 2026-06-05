import type { ProductResponse } from "../../types";
import { formatPrice } from "../../utils/productFormat";

interface MobileStickyBarProps {
  product: ProductResponse;
  isOutOfStock: boolean;
  addedToCart: boolean;
  handleAddToCart: () => void;
  handleBuyNow: () => void;
}

export default function MobileStickyBar({
  product,
  isOutOfStock,
  addedToCart,
  handleAddToCart,
  handleBuyNow,
}: MobileStickyBarProps) {

  if (isOutOfStock) {
    return null;
  }

  return (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 shadow-xl">
          <div className="flex flex-col justify-center flex-shrink-0">
            <span className="text-base font-bold text-violet-700 leading-none">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] text-slate-400 line-through mt-0.5">
              {formatPrice(Math.round(product.price * 1.1))}
            </span>
          </div>

          <button
            className={`flex-1 h-10 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5
              ${addedToCart ? "bg-green-500 text-white" : "bg-white border-2 border-violet-600 text-violet-600"}`}
            onClick={handleAddToCart}
          >
            {addedToCart ? "✓ Đã thêm" : "Thêm vào giỏ"}
          </button>
          <button
            className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
            onClick={handleBuyNow}
          >
            Mua ngay
          </button>
        </div>
      );
    }