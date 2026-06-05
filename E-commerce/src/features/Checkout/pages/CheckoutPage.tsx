// features/Checkout/pages/CheckoutPage.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
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
    isError,
    items,
    totalPrice,
    handleChange,
    setPaymentMethod,
    handleSubmit,
  } = useCheckoutForm();

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
              <li><a href="/" className="hover:text-violet-600">Trang chủ</a></li>
              <li>/</li>
              <li><a href="/cart" className="hover:text-violet-600">Giỏ hàng</a></li>
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
            {isError && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-500">
                Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.
              </div>
            )}
            <ShippingInfo
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
                productName: item.productName,
                productImage: item.productImageUrl ?? '',
                quantity: item.quantity,
                price: item.productPrice,
              }))}
              totalAmount={totalPrice}
              shippingFee={0}
            />
            <PlaceOrderButton
              isLoading={isSubmitting}
              onClick={handleSubmit}
            />
            <p className="text-center text-xs text-slate-400">
              Bằng cách đặt hàng, bạn đồng ý với{' '}
              <a href="/terms" className="text-violet-500 underline">
                Điều khoản dịch vụ
              </a>{' '}
              của chúng tôi.
            </p>
          </>
        }
      />
    </div>
  );
};
