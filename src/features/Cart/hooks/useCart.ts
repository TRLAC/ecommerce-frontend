// features/Cart/hooks/useCart.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cartApi";
import type { CreateCartRequest } from "../types";
import { useAuthStore } from "@/features/auth/store";

export const CART_QUERY_KEY = ["cart"] as const;

export function useCart() {
  const isAuthenticated = useAuthStore((state) => !!state.accessToken);

  const { data, isLoading, isError } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  return {
    cart: data,
    totalItems: data?.totalItems ?? 0,
    totalPrice: data?.totalAmount ?? 0,       // totalAmount
    items: data?.cartItems ?? [],             // cartItems
    isLoading,
    isError,
  };
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CreateCartRequest) => cartApi.addItem(req),
    onSuccess: (data) => qc.setQueryData(CART_QUERY_KEY, data),
    onError: () => qc.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateItem(cartItemId, { quantity }),
    onSuccess: (data) => qc.setQueryData(CART_QUERY_KEY, data),
    onError: () => qc.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeItem(cartItemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_QUERY_KEY }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () =>
      qc.setQueryData(CART_QUERY_KEY, {
        cartItems: [],
        totalItems: 0,
        totalAmount: 0,
      }),
  });
}
