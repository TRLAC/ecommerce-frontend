// features/product/hooks/useCategories.ts
import { useState, useEffect } from "react";
import { apiClient } from "@/shared/api/apiClient";


interface CategoryResponse {
  categoryId: number;
  categoryName: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [isError, setIsError]       = useState(false);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setIsError(false);

    apiClient
      .get<CategoryResponse[]>("/categories/roots")
      .then(res => {
        if (!cancelled) setCategories(res.data);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { categories, isLoading, isError };
}