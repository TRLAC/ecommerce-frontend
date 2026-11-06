import { apiClient } from "@/shared/api/apiClient";
import type { ProductResponse, PageResponse, ProductQueryParams } from "../types";

// ─── Endpoints ───────────────────────────────────────────────

const PRODUCT_API = {
  GET_ALL:    "/products",
  GET_BY_ID:  (id: number) => `/products/${id}`,
};

// ─── API ─────────────────────────────────────────────────────

export const productApi = {

  getAll: async (params: ProductQueryParams, signal?: AbortSignal): Promise<PageResponse<ProductResponse>> => {
    const res = await apiClient.get(PRODUCT_API.GET_ALL, { params, signal });
    return res.data;
  },

  getById: async (id: number, signal?: AbortSignal): Promise<ProductResponse> => {
    const res = await apiClient.get(PRODUCT_API.GET_BY_ID(id), { signal });
    return res.data;
  },

};