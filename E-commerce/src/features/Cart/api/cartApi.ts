// features/Cart/api/cartApi.ts

import { apiClient } from "@/shared/api/apiClient";
import type { CartResponse, CreateCartRequest, UpdateCartItemRequest } from "../types";

const BASE = "/cart";

export const cartApi = {
  getCart: (): Promise<CartResponse> =>
    apiClient.get(BASE).then((r) => r.data),

  addItem: (body: CreateCartRequest): Promise<CartResponse> =>
    apiClient.post(`${BASE}/items`, body).then((r) => r.data),

  updateItem: (cartItemId: number, body: UpdateCartItemRequest): Promise<CartResponse> =>
    apiClient.put(`${BASE}/items/${cartItemId}`, body).then((r) => r.data),

  removeItem: (cartItemId: number): Promise<void> =>
    apiClient.delete(`${BASE}/items/${cartItemId}`).then(() => undefined),

  clearCart: (): Promise<void> =>
    apiClient.delete(BASE).then(() => undefined),
};
