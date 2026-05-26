// ============================================================
// features/product/components/ProductCard.tsx
// ============================================================

import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductResponse } from "../types";

// ─── Helpers ─────────────────────────────────────────────────

function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Skeleton ─────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-100" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-slate-100 rounded w-1/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-2/5 mt-1" />
        <div className="flex justify-between mt-1">
          <div className="h-2.5 bg-slate-100 rounded w-1/3" />
          <div className="h-2.5 bg-slate-100 rounded w-1/4" />
        </div>
        <div className="h-8 bg-slate-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────

interface ProductCardProps {
  product: ProductResponse;
  wishlisted?: boolean;
  onWishlistToggle?: (id: number) => void;
  onAddToCart?: (id: number) => void;
  onQuickView?: (product: ProductResponse) => void;
}

// ─── Main Component ───────────────────────────────────────────

export default function ProductCard({
  product,
  wishlisted = false,
  onWishlistToggle,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.stockQuantity === 0;
  

  return (
    <article
      className={`group relative rounded-2xl border bg-white overflow-hidden transition-all duration-200
        ${isOutOfStock ? "opacity-60" : ""}
        ${isHovered ? "border-violet-300 shadow-md shadow-violet-100" : "border-slate-100 shadow-sm"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${product.brandName} ${product.name}, ${formatPrice(product.price)}${isOutOfStock ? ", hết hàng" : ""}`}
    >
      {/* ── Image Area ── */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <Link to={`/products/${product.productId}`} tabIndex={-1} aria-hidden="true">
          {product.images[0] && !imgError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </Link>

        {/* Wishlist button */}
        <button
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all
            border shadow-sm
            ${wishlisted
              ? "bg-red-50 border-red-200 text-red-500"
              : "bg-white border-slate-200 text-slate-400 hover:text-red-400 hover:border-red-200"
            }`}
          onClick={(e) => { e.preventDefault(); onWishlistToggle?.(product.productId); }}
          aria-label={wishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          aria-pressed={wishlisted}
        >
          <svg className="w-3.5 h-3.5" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick View — visible on hover */}
        {!isOutOfStock && (
          <button
            className="absolute bottom-0 inset-x-0 h-9 bg-slate-900/80 text-white text-xs flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => onQuickView?.(product)}
            aria-label={`Xem nhanh ${product.name}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Xem nhanh
          </button>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white border border-slate-200 text-slate-500 text-xs px-3 py-1 rounded-full shadow-sm">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">
          {product.brandName}
        </p>

        {/* Name */}
        <Link to={`/products/${product.productId}`} className="group/link">
          <h3 className="text-xs text-slate-700 leading-relaxed line-clamp-2 group-hover/link:text-violet-600 transition-colors">
            {product.name}
          </h3>
        </Link>

         {/* Specs */}

        <div className="
          mt-2
          flex
          flex-wrap
          gap-1
        ">

          {product.ram && (
            <span className="text-[10px] px-2 py-1 rounded bg-slate-100">
              {product.ram}GB RAM
            </span>
          )}

          {product.storage && (
            <span className="text-[10px] px-2 py-1 rounded bg-slate-100">
              {product.storage}GB
            </span>
          )}

          {product.screenSize && (
            <span className="text-[10px] px-2 py-1 rounded bg-slate-100">
              {product.screenSize}"
            </span>
          )}

        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-2 mb-3 flex-wrap">
          <span className="text-sm font-semibold text-violet-600">
            {formatPrice(product.price)}
          </span>
          {product.price && product.price > product.price && (
            <span className="text-[11px] text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* CTA */}
        {isOutOfStock ? (
          <button
            className="w-full h-8 rounded-xl border border-slate-200 text-xs text-slate-500 hover:border-violet-300 hover:text-violet-500 transition-colors"
            onClick={() => {/* TODO: notify when back in stock */}}
            aria-label="Thông báo khi có hàng"
          >
            Thông báo khi có hàng
          </button>
        ) : (
          <button
            className="w-full h-8 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5"
            onClick={(e) => { e.preventDefault(); onAddToCart?.(product.productId); }}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Thêm vào giỏ
          </button>
        )}
      </div>
    </article>
  );
}
