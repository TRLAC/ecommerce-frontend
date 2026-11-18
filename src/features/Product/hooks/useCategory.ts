import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories", "roots"],
    queryFn: productApi.getRootCategories,
    staleTime: 10 * 60 * 1000,
  });
  return { categories: data ?? [], isLoading, isError };
}
