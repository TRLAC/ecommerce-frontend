import { Link } from "react-router-dom";
import type { ProductResponse } from "../../types";

import StarRating from "./StarRating";
import { formatPrice } from "../../utils/productFormat";
import { MOCK_RATING_SUMMARY } from "../../constants/mockReview";

interface ProductInfoProps {
  product: ProductResponse;

  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;

  addedToCart: boolean;
  isAddingToCart?: boolean;
  handleAddToCart: () => void;
  handleBuyNow: () => void;

  wishlisted: boolean;
  setWishlisted: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProductInfo({
  product,
  qty,
  setQty,
  addedToCart,
  isAddingToCart = false,
  handleAddToCart,
  handleBuyNow,
  wishlisted,
  setWishlisted,
}: ProductInfoProps) {

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="flex flex-col gap-4">
    
              {/* Brand + Stock */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/?brandId=${product.brandId}`}
                  className="text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-violet-50 hover:text-violet-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {product.brandName}
                </Link>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hết hàng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Còn hàng
                  </span>
                )}
                <Link
                  to={`/?categoryId=${product.categoryId}`}
                  className="text-[10px] text-slate-400 hover:text-violet-600 transition-colors"
                >
                  {product.categoryName}
                </Link>
              </div>
    
              {/* Product Name */}
              <h1 className="text-lg font-semibold text-slate-800 leading-snug">
                {product.name}
              </h1>
    
              {/* Rating row (mock) */}
              <div className="flex items-center gap-2">
                <StarRating rating={MOCK_RATING_SUMMARY.average} />
                <span className="text-xs font-medium text-slate-700">
                  {MOCK_RATING_SUMMARY.average}
                </span>
                <span className="text-[11px] text-slate-400">
                  ({MOCK_RATING_SUMMARY.total.toLocaleString("vi-VN")} đánh giá)
                </span>
                <div className="w-px h-3 bg-slate-200 hidden sm:block" />
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  ID: #{product.productId}
                </span>
              </div>
    
              {/* Price Block */}
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-violet-700 mb-1.5 leading-none">
                  {formatPrice(product.price)}
                </div>
                {/* Placeholder for original price / discount — add originalPrice field when API supports it */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(Math.round(product.price * 1.1))}
                  </span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    -10%
                  </span>
                  <span className="text-[11px] text-green-600 font-medium">
                    Tiết kiệm {formatPrice(Math.round(product.price * 0.1))}
                  </span>
                </div>
              </div>
    
              {/* Specs (RAM / Storage / Screen) */}
              {product.ram && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">RAM</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-3 py-1.5 rounded-full border border-violet-500 bg-violet-50 text-violet-700 font-medium">
                      {product.ram} GB
                    </span>
                  </div>
                </div>
              )}
              {product.storage && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Bộ nhớ</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-3 py-1.5 rounded-full border border-violet-500 bg-violet-50 text-violet-700 font-medium">
                      {product.storage} GB
                    </span>
                  </div>
                </div>
              )}
    
              {/* Specs chips row */}
              <div className="flex flex-wrap gap-1.5">
                {product.screenSize && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    📱 {product.screenSize}"
                  </span>
                )}
                {product.battery && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    🔋 {product.battery.toLocaleString()} mAh
                  </span>
                )}
                {product.ram && (
                  <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                    💾 {product.ram} GB RAM
                  </span>
                )}
              </div>
    
              {/* Quantity + Stock */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Số lượng:</span>
                  <div
                    className="flex items-center border border-slate-200 rounded-lg overflow-hidden"
                    role="group"
                    aria-label="Chọn số lượng"
                  >
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-violet-50 hover:text-violet-600 text-slate-500 text-lg leading-none transition-colors"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Giảm số lượng"
                      disabled={qty <= 1}
                    >
                      −
                    </button>
                    <span
                      className="w-10 h-8 flex items-center justify-center text-sm font-medium text-slate-700 border-x border-slate-200"
                      aria-live="polite"
                    >
                      {qty}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-violet-50 hover:text-violet-600 text-slate-500 text-lg leading-none transition-colors"
                      onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                      aria-label="Tăng số lượng"
                      disabled={qty >= product.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Còn {product.stockQuantity.toLocaleString()} sản phẩm
                  </span>
                </div>
              )}
    
              {/* CTA Buttons */}
              <div className="flex flex-col gap-2.5">
                {isOutOfStock ? (
                  <button
                    className="w-full h-11 rounded-xl border border-slate-200 text-sm text-slate-500 hover:border-violet-300 hover:text-violet-600 transition-colors"
                    aria-label="Thông báo khi có hàng"
                  >
                    🔔 Thông báo khi có hàng
                  </button>
                ) : (
                  <>
                    <button
                      className={`w-full h-11 rounded-xl text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2
                        ${addedToCart
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white"
                        }`}
                      onClick={handleAddToCart}
                      disabled={isAddingToCart} 
                      aria-label="Thêm vào giỏ hàng"
                    >
                      {addedToCart ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Đã thêm vào giỏ!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Thêm vào giỏ hàng
                        </>
                      )}
                    </button>
    
                    <button
                      className="w-full h-11 rounded-xl border-2 border-violet-600 text-violet-600 hover:bg-violet-50 active:scale-[0.98] text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2"
                      onClick={handleBuyNow}
                      aria-label="Mua ngay"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Mua ngay
                    </button>
                  </>
                )}
    
                {/* Wishlist */}
                <button
                  className={`flex items-center justify-center gap-1.5 text-xs py-1 transition-colors
                    ${wishlisted ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
                  onClick={() => setWishlisted((w) => !w)}
                  aria-label={wishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  aria-pressed={wishlisted}
                >
                  <svg
                    className="w-4 h-4"
                    fill={wishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlisted ? "Đã yêu thích" : "Thêm vào yêu thích"}
                </button>
              </div>
    
              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { icon: "🚚", text: "Giao hàng toàn quốc" },
                  { icon: "🔄", text: "Đổi trả 30 ngày" },
                  { icon: "🛡️", text: "Bảo hành chính hãng" },
                ].map((b) => (
                  <div key={b.text} className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl text-center">
                    <span className="text-base">{b.icon}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">{b.text}</span>
                  </div>
                ))}
              </div>
          </div>
  );
}
