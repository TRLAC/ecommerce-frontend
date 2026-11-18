import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import type { ProductResponse } from "../../types";
import { formatVND } from "@/shared/utils/format";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-100" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-slate-100 rounded w-1/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-2/5 mt-1" />
        <div className="h-8 bg-slate-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: ProductResponse;
  wishlisted?: boolean;
  onWishlistToggle?: (id: number) => void;
  onAddToCart?: (id: number) => void;
}

export default function ProductCard({
  product,
  wishlisted = false,
  onWishlistToggle,
  onAddToCart,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const isOutOfStock = product.stockQuantity <= 0;
  const cover = product.images[0];

  return (
    <article
      className={`group relative rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm transition-all duration-200 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100 ${
        isOutOfStock ? "opacity-70" : ""
      }`}
      aria-label={`${product.brandName} ${product.name}, ${formatVND(product.price)}${isOutOfStock ? ", hết hàng" : ""}`}
    >
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <Link to={`/products/${product.productId}`} tabIndex={-1} aria-hidden="true">
          {cover && !imgError ? (
            <img
              src={cover}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <ImageOff className="w-10 h-10" />
            </div>
          )}
        </Link>

        <button
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border shadow-sm transition-colors ${
            wishlisted
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white border-slate-200 text-slate-400 hover:text-red-400 hover:border-red-200"
          }`}
          onClick={() => onWishlistToggle?.(product.productId)}
          aria-label={wishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          aria-pressed={wishlisted}
        >
          <Heart className="w-3.5 h-3.5" fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none">
            <span className="bg-white border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full shadow-sm">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">
          {product.brandName}
        </p>

        <Link to={`/products/${product.productId}`} className="group/link">
          <h3 className="text-xs text-slate-700 leading-relaxed line-clamp-2 min-h-[2.5rem] group-hover/link:text-violet-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap gap-1 min-h-[1.5rem]">
          {!!product.ram && (
            <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600">{product.ram}GB RAM</span>
          )}
          {!!product.storage && (
            <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600">{product.storage}GB</span>
          )}
          {!!product.screenSize && (
            <span className="text-[10px] px-2 py-1 rounded bg-slate-100 text-slate-600">{product.screenSize}"</span>
          )}
        </div>

        <div className="mt-2 mb-3">
          <span className="text-sm font-semibold text-violet-600">{formatVND(product.price)}</span>
        </div>

        <button
          disabled={isOutOfStock}
          className="w-full h-8 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5"
          onClick={() => onAddToCart?.(product.productId)}
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </article>
  );
}
