// features/Cart/pages/CartPage.tsx

import { Link } from "react-router-dom";
import { useCart } from "@/features/Cart/hooks/useCart"; 
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";

// ── Skeleton ──────────────────────────────────────────────────
function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 animate-pulse">
      <div className="h-20 w-20 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
        <div className="mt-4 h-8 bg-slate-100 rounded-xl w-28" />
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Giỏ hàng trống</h2>
      <p className="text-sm text-slate-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
      <Link
        to="/"
        className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition"
      >
        Mua sắm ngay
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function CartPage() {
  const { items, totalItems, totalPrice, isLoading, isError } = useCart();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-violet-600">Trang chủ</Link></li>
              <li>/</li>
              <li className="text-slate-600 font-medium">Giỏ hàng</li>
            </ol>
          </nav>
          <div className="flex items-baseline justify-between mt-2">
            <h1 className="text-xl font-bold text-slate-900">Giỏ hàng của tôi</h1>
            {!isLoading && totalItems > 0 && (
              <span className="text-xs text-slate-500">{totalItems} sản phẩm</span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {isError && (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-500 mb-4">
            Không thể tải giỏ hàng. Vui lòng thử lại.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <CartItemSkeleton key={i} />)}
            </div>
            <div className="rounded-2xl bg-white border border-slate-100 h-64 animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))}
            </div>

            {/* Summary sidebar */}
            <div>
              <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
