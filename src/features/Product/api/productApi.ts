import { apiClient } from "@/shared/api/apiClient";
import { normalizePage } from "@/shared/utils/page";
import type { PageResponse, RawPage } from "@/shared/types/page";
import type {
  BrandResponse,
  CategoryResponse,
  ProductQueryParams,
  ProductResponse,
} from "../types";

export const productApi = {
  getAll: async (
    params: ProductQueryParams,
    signal?: AbortSignal
  ): Promise<PageResponse<ProductResponse>> => {
    const res = await apiClient.get<RawPage<ProductResponse>>("/products", { params, signal });
    return normalizePage(res.data);
  },

  getById: async (id: number, signal?: AbortSignal): Promise<ProductResponse> => {
    const res = await apiClient.get<ProductResponse>(`/products/${id}`, { signal });
    return res.data;
  },

  getBrands: async (): Promise<BrandResponse[]> => {
    const res = await apiClient.get<BrandResponse[]>("/brands");
    return res.data;
  },

  getRootCategories: async (): Promise<CategoryResponse[]> => {
    const res = await apiClient.get<CategoryResponse[]>("/categories/roots");
    return res.data;
  },
};