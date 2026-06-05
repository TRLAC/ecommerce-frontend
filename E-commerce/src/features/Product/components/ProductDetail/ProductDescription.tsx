import { useState } from "react";
import type { ProductResponse } from "../../types";
import ProductSpecs from "../ProductDetail/ProductSpecs";
import { formatDate } from "../../utils/productFormat";

interface ProductDescriptionProps {
  product: ProductResponse;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {

     const [descTab, setDescTab] = useState<"desc" | "specs">("desc");
     const isOutOfStock = product.stockQuantity === 0;
     
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm mb-6 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-slate-100">
          {(["desc", "specs"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-5 py-3 text-xs font-medium border-b-2 transition-all
                ${descTab === tab
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              onClick={() => setDescTab(tab)}
              aria-selected={descTab === tab}
              role="tab"
            >
              {tab === "desc" ? "Mô tả sản phẩm" : "Thông số kỹ thuật"}
            </button>
          ))}
        </div>

        <div className="p-5">
          {descTab === "desc" && (
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.name} — sản phẩm chính hãng thuộc thương hiệu{" "}
              <strong className="font-medium text-slate-700">{product.brandName}</strong>, danh mục{" "}
              <strong className="font-medium text-slate-700">{product.categoryName}</strong>.
              {product.screenSize && ` Màn hình ${product.screenSize} inch,`}
              {product.ram && ` RAM ${product.ram} GB,`}
              {product.storage && ` bộ nhớ ${product.storage} GB,`}
              {product.battery && ` pin ${product.battery.toLocaleString()} mAh.`}
              {" "}Sản phẩm được bảo hành chính hãng, đổi trả dễ dàng trong vòng 30 ngày.
            </p>
          )}

           {/* Specs */}
        {descTab === "specs" && (
          <ProductSpecs
            product={product}
            isOutOfStock={isOutOfStock}
            formatDate={formatDate}
          />
        )}
        </div>
    </div>
    );
}
