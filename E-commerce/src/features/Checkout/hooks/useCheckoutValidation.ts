import { useState } from 'react';
import type { CheckoutFormData } from '../types/checkout';

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

export const useCheckoutValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (data: CheckoutFormData): boolean => {
    const newErrors: FormErrors = {};

    if (!data.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!data.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[3-9]\d{8}$/.test(data.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!data.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!data.city) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    if (!data.district) newErrors.district = 'Vui lòng chọn quận/huyện';
    if (!data.ward) newErrors.ward = 'Vui lòng chọn phường/xã';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof CheckoutFormData) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return { errors, validate, clearError };
};
