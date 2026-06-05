import React from 'react';
import type { CheckoutFormData } from '../types/checkout';

interface Props {
  formData: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

const InputField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-11 rounded-xl border px-4 text-sm outline-none transition-all
        ${error
          ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
          : 'border-slate-200 bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
        }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  options: string[];
  placeholder: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-11 rounded-xl border px-4 text-sm outline-none transition-all appearance-none bg-white
        ${error
          ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
          : 'border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'
        }`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
const DISTRICTS = ['Quận 1', 'Quận 2', 'Quận 3', 'Bình Thạnh', 'Gò Vấp'];
const WARDS = ['Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5'];

export const ShippingForm: React.FC<Props> = ({ formData, errors, onChange }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-slate-800">
        📦 Thông tin giao hàng
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Họ và tên"
          value={formData.fullName}
          onChange={(v) => onChange('fullName', v)}
          error={errors.fullName}
          placeholder="Nguyễn Văn A"
        />
        <InputField
          label="Số điện thoại"
          value={formData.phone}
          onChange={(v) => onChange('phone', v)}
          error={errors.phone}
          placeholder="0912 345 678"
          type="tel"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectField
          label="Tỉnh / Thành phố"
          value={formData.city}
          onChange={(v) => onChange('city', v)}
          error={errors.city}
          options={CITIES}
          placeholder="Chọn tỉnh/thành"
        />
        <SelectField
          label="Quận / Huyện"
          value={formData.district}
          onChange={(v) => onChange('district', v)}
          error={errors.district}
          options={DISTRICTS}
          placeholder="Chọn quận/huyện"
        />
        <SelectField
          label="Phường / Xã"
          value={formData.ward}
          onChange={(v) => onChange('ward', v)}
          error={errors.ward}
          options={WARDS}
          placeholder="Chọn phường/xã"
        />
      </div>

      <div className="mt-4">
        <InputField
          label="Địa chỉ cụ thể"
          value={formData.address}
          onChange={(v) => onChange('address', v)}
          error={errors.address}
          placeholder="Số nhà, tên đường..."
        />
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">
          Ghi chú (tuỳ chọn)
        </label>
        <textarea
          value={formData.note ?? ''}
          onChange={(e) => onChange('note', e.target.value)}
          placeholder="Ghi chú thêm cho đơn hàng..."
          rows={3}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all
            focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
        />
      </div>
    </div>
  );
};
