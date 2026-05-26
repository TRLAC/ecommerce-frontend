// features/product/hooks/useBrands.ts
import { useState, useEffect } from "react";
import { apiClient } from "@/shared/api/apiClient";

interface BrandResponse {
  brandId: number;
  brandName: string;
}

export function useBrands() {
  const [brands, setBrands]   = useState<BrandResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    apiClient.get<BrandResponse[]>("/brands")
      .then(res => setBrands(res.data))
      .finally(() => setIsLoading(false));
  }, []);  // chỉ fetch 1 lần khi mount

  return { brands, isLoading };
}