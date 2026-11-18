import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export function useBrands() {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: productApi.getBrands,
    staleTime: 10 * 60 * 1000,
  });
  return { brands: data ?? [], isLoading };
}
