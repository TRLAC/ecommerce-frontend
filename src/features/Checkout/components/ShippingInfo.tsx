import React from "react";
import { Link } from "react-router-dom";
import type { CheckoutFormData } from "../types/checkout";

interface Props {
  recipient: { fullName: string; phone: string };
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

export const ShippingInfo: React.FC<Props> = ({ recipient, formData, errors, onChange }) => {
  const error = errors.address;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-slate-800">📦 Thông tin giao hàng</h2>

      <div className="mb-4 flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
        <div className="text-sm">
          <p className="text-xs text-slate-400">Người nhận</p>
          <p className="font-medium text-slate-800">{recipient.fullName}</p>
          <p className="text-slate-500">{recipient.phone || 'Chưa có số điện thoại'}</p>
        </div>
        <Link to="/profile" className="flex-shrink-0 text-xs font-medium text-violet-600 hover:underline">
          Chỉnh sửa hồ sơ
        </Link>
      </div>

      <label htmlFor="checkout-address" className="mb-1 block text-sm font-medium text-slate-700">
        Địa chỉ giao hàng
      </label>
      <input
        id="checkout-address"
        type="text"
        value={formData.address}
        onChange={(e) => onChange("address", e.target.value)}
        maxLength={255}
        placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
        className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition-all ${
          error
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
            : "border-slate-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
