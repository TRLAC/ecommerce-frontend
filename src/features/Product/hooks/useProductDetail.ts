// features/product/hooks/useProductDetail.ts

import { useState, useEffect, useRef } from "react";
import type { ProductResponse } from "../types";
import { productApi } from "../api/productApi";

export interface UseProductDetailReturn {
  product: ProductResponse | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
}

export function useProductDetail(productId: number | undefined): UseProductDetailReturn {
  const [product, setProduct]       = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [isError, setIsError]       = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProduct = () => {
    if (productId == null) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setErrorMessage(null);

    productApi
      .getById(productId, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setProduct(data);
      })
      .catch((err) => {
        if (
          err instanceof Error &&
          (err.name === "AbortError" || err.name === "CanceledError")
        )
          return;
        setIsError(true);
        setErrorMessage(
          err instanceof Error ? err.message : "Không thể tải sản phẩm"
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return { product, isLoading, isError, errorMessage, refetch: fetchProduct };
}