import type { ProductResponse } from "../../types";

interface ImageGalleryProps {
  images: (string | null)[];
  productName: string;
  activeImg: number;
  setActiveImg: (i: number) => void;
  isOutOfStock: boolean;
  zoomed: boolean;
  setZoomed: (v: boolean) => void;
  product: ProductResponse;
}

export default function ImageGallery({
  images,
  activeImg,
  setActiveImg,
  isOutOfStock,
  setZoomed,
  product,
}: ImageGalleryProps) {
  return (
    <div>
      {/* Main Image */}
      <div
        className={`relative aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden mb-3 ${
          !isOutOfStock ? "cursor-zoom-in" : ""
        }`}
        onClick={() => !isOutOfStock && setZoomed(true)}
      >
        {images[activeImg] ? (
          <img
            src={images[activeImg]!}
            alt={`${product.name} — ảnh ${activeImg + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>

            <span className="text-xs">
              Không có ảnh
            </span>
          </div>
        )}

        {/* Zoom hint */}
            {images[activeImg] && (
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Zoom
              </div>
            )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-white border px-4 py-1 rounded-full">
              Hết hàng
            </span>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/40 text-white text-[10px] px-2 py-1 rounded-full">
            {activeImg + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`
                w-14 h-14 rounded-lg overflow-hidden border
                ${
                  activeImg === i
                    ? "border-violet-500"
                    : "border-slate-200"
                }
              `}
            >
              {img && (
                <img
                  src={img}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}