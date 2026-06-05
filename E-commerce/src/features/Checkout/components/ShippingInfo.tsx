import React from "react";
import type { CheckoutFormData } from "../types/checkout";

interface Props {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

const InputField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: InputFieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700">
      {label}
    </label>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-11 rounded-xl border px-4 text-sm outline-none transition-all
        ${
          error
            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
            : "border-slate-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        }`}
    />

    {error && (
      <p className="text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

export const ShippingInfo: React.FC<Props> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-slate-800">
        📦 Thông tin giao hàng
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Họ và tên"
          value={formData.fullName}
          onChange={(v) => onChange("fullName", v)}
          error={errors.fullName}
          placeholder="Nguyễn Văn A"
        />

        <InputField
          label="Số điện thoại"
          value={formData.phone}
          onChange={(v) => onChange("phone", v)}
          error={errors.phone}
          placeholder="0912 345 678"
          type="tel"
        />
      </div>

      <div className="mt-4">
        <InputField
          label="Địa chỉ giao hàng"
          value={formData.address}
          onChange={(v) => onChange("address", v)}
          error={errors.address}
          placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
        />
      </div>
    </div>
  );
};