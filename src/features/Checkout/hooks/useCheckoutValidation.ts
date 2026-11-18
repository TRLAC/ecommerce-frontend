import { useState } from 'react';
import type { CheckoutFormData } from '../types/checkout';

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

export const useCheckoutValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (data: CheckoutFormData): boolean => {
    const newErrors: FormErrors = {};
    const address = data.address.trim();

    if (!address) newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    else if (address.length > 255) newErrors.address = 'Địa chỉ tối đa 255 ký tự';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof CheckoutFormData) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return { errors, validate, clearError };
};
