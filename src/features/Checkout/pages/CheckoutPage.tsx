// features/Checkout/pages/CheckoutPage.tsx

import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import PageLoader from '@/shared/components/PageLoader';
import { CheckoutLayout } from '../components/CheckoutLayout';
import { ShippingInfo } from '../components/ShippingInfo';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { CheckoutSummary } from '../components/CheckoutSummary';
import { PlaceOrderButton } from '../components/PlaceOrderButton';
import { useCheckoutForm } from '../hooks/useCheckoutForm';

export const CheckoutPage: React.FC = () => {
  const {
    formData,
    paymentMethod,
    errors,
    isSubmitting,
    errorMessage,
    items,
    totalPrice,
    isCartLoading,
    handleChange,
    setPaymentMethod,
    handleSubmit,
  } = useCheckoutForm();
  const user = useAuthStore((state) => state.user);

  // Chờ giỏ hàng tải xong rồi mới quyết định (tránh bị đẩy về /cart khi tải lại trang)
  if (isCartLoading) return <PageLoader fullScreen={false} label="Đang tải giỏ hàng..." />;

  // Redirect về cart nếu giỏ hàng trống
  if (items.length === 0 && !isSubmitting) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-violet-600">Trang chủ</Link></li>
              <li>/</li>
              <li><Link to="/cart" className="hover:text-violet-600">Giỏ hàng</Link></li>
              <li>/</li>
              <li className="text-slate-600 font-medium">Thanh toán</li>
            </ol>
          </nav>
          <h1 className="mt-2 text-xl font-bold text-slate-900">Thanh toán</h1>
        </div>
      </div>

      {/* Body */}
      <CheckoutLayout
        left={
          <>
            {errorMessage && (
              <div role="alert" className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-500">
                {errorMessage}
              </div>
            )}
            <ShippingInfo
              recipient={{ fullName: user?.fullName ?? '', phone: user?.phone ?? '' }}
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </>
        }
        right={
          <>
            <CheckoutSummary
              items={items.map((item) => ({
                productId: item.productId,
                productName: item.productName ?? `Sản phẩm #${item.productId}`,
                productImage: item.productImageUrl ?? '',
                quantity: item.quantity,
                price: item.productPrice,
              }))}
              totalAmount={totalPrice}
            />
            <PlaceOrderButton
              isLoading={isSubmitting}
              onClick={handleSubmit}
            />
            <p className="text-center text-xs text-slate-400">
              Thanh toán online dùng cổng giả lập, không phát sinh giao dịch thật.
            </p>
          </>
        }
      />
    </div>
  );
};
