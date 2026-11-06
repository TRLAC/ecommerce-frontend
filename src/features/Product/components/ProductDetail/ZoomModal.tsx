import type { ProductResponse } from "../../types";

interface ZoomModalProps {
  zoomed: boolean;
  setZoomed: (value: boolean) => void;

  activeImg: number;
  product: ProductResponse;
}



export default function ZoomModal({
  zoomed,
  setZoomed,
  activeImg,
  product,
}: ZoomModalProps) {

   const images: string[] =
    product.images?.filter(Boolean) ?? [];

  const currentImage = images[activeImg];

  if (!zoomed || !currentImage) return null;

  return (
    <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh phóng to"
        >
          <img
            src={images[activeImg]!}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
            onClick={() => setZoomed(false)}
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
    );
}