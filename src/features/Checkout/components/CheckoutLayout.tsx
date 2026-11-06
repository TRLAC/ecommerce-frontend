// features/Checkout/components/CheckoutLayout.tsx

import React from 'react';

interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

export const CheckoutLayout: React.FC<Props> = ({ left, right }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Forms */}
        <div className="lg:col-span-2 flex flex-col gap-5">{left}</div>

        {/* Right – Summary (sticky) */}
        <div>
          <div className="sticky top-24 flex flex-col gap-4">{right}</div>
        </div>
      </div>
    </div>
  );
};
