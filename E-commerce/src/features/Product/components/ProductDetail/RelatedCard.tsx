import { useState } from "react";
import { Link } from "react-router-dom";

import type { ProductResponse } from "../../types";
import { formatPrice } from "../../utils/productFormat";

interface RelatedCardProps {
  product: ProductResponse;
}

export default function RelatedCard({
  product,
}: RelatedCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link
      to={`/products/${product.productId}`}
      className="group block bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-violet-300 hover:shadow-md hover:shadow-violet-50 transition-all duration-200"
    >
      <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        {product.images[0] && !imgError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
          {product.brandName}
        </p>
        <p className="text-[11px] text-slate-700 line-clamp-2 leading-tight mb-1.5">
          {product.name}
        </p>
        <p className="text-xs font-semibold text-violet-600">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>

  );
}

