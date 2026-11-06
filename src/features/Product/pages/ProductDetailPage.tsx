// ============================================================
// features/product/pages/ProductDetailPage.tsx
// ============================================================

import { useState, useCallback, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { useProducts } from "../hooks/useProducts";
import { ProductCardSkeleton } from "../components/ProductList/ProductCard";
import { useAddToCart } from "@/features/Cart/hooks/useCart";

import {
  ProductDetailSkeleton,
  ErrorState,
  ImageGallery,
  ProductInfo,
  ProductDescription,
  ReviewSection,
  RelatedCard,
  MobileStickyBar,
  ZoomModal,
} from "../components/ProductDetail";


// ─── Main Page ────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = id ? parseInt(id, 10) : undefined;

  const { product, isLoading, isError, errorMessage, refetch } = useProductDetail(productId);

  // Related products — same category, exclude current
  const { products: relatedProducts, isLoading: relatedLoading } = useProducts(
    product ? { categoryId: product.categoryId } : undefined
  );
  const related = relatedProducts
    .filter((p) => p.productId !== productId)
    .slice(0, 4);

  // ── UI state ──────────────────────────────────────────────
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(
      { productId: product.productId, quantity: qty },
      {
        onSuccess: () => {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2000);
        },
      }
    );
  }, [product, qty, addToCart]);

  // Reset state when product changes
  useEffect(() => {
    setActiveImg(0);
    setQty(1);
    setAddedToCart(false);
  }, [productId]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    // TODO: dispatch to cart store, then navigate
    navigate("/cart");
  }, [product, navigate]);

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) return <ProductDetailSkeleton />;
  if (isError)   return <ErrorState message={errorMessage ?? "Lỗi không xác định"} onRetry={refetch} />;
  if (!product)  return null;

  const isOutOfStock = product.stockQuantity === 0;
  const images = product.images.length > 0 ? product.images : [null];

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="pb-24 lg:pb-0">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-5 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-violet-600 transition-colors">Trang chủ</Link>
        <span className="text-slate-200">/</span>
        <Link to={`/?categoryId=${product.categoryId}`} className="hover:text-violet-600 transition-colors">
          {product.categoryName}
        </Link>
        <span className="text-slate-200">/</span>
        <Link to={`/?brandId=${product.brandId}`} className="hover:text-violet-600 transition-colors">
          {product.brandName}
        </Link>
        <span className="text-slate-200">/</span>
        <span className="text-slate-600 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* ─── Left: Image Gallery ─── */}
         <ImageGallery
          images={images}
          productName={product.name}
          activeImg={activeImg}
          setActiveImg={setActiveImg}
          isOutOfStock={isOutOfStock}
          zoomed={zoomed}
          setZoomed={setZoomed}
          product={product}
        />

        {/* ─── Right: Product Info ─── */}
        <ProductInfo
          product={product}
          qty={qty}
          setQty={setQty}
          wishlisted={wishlisted}
          setWishlisted={() => setWishlisted((w) => !w)}
          addedToCart={addedToCart}
          isAddingToCart={addingToCart} 
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
        />
        </div>
        

      {/* ── Description / Specs Tabs ── */}
     <ProductDescription product={product} />

      {/* ── Reviews ── */}
      <div className="mb-8">
        <ReviewSection />
      </div>

      {/* ── Related Products ── */}
       {(relatedLoading || related.length > 0) && (
        <section aria-labelledby="related-heading" className="mb-8">
          <h2 id="related-heading" className="text-base font-semibold text-slate-800 mb-4">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : related.map((p) => <RelatedCard key={p.productId} product={p} />)
            }
          </div>
        </section>
      )}

      {/* ── Mobile Sticky Bar ── */}
      {!isOutOfStock && (
        <MobileStickyBar
          product={product}
          isOutOfStock={isOutOfStock}
          addedToCart={addedToCart}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
        />
      )}

      {/* ── Zoom Modal ── */}
      {zoomed && images[activeImg] && (
       <ZoomModal
        zoomed={zoomed}
        setZoomed={setZoomed}
        activeImg={activeImg}
        product={product}
      />
      )}
    </div>
  );
}