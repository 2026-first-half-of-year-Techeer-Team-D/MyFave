import { apiClient } from '@/shared/api/axios'
import type {
  ProductListApiResponse,
  ProductDetailApiResponse,
  ProductViewApiResponse,
} from './types'

export const productsApi = {
  getList: async (page = 0, size = 50): Promise<ProductListApiResponse> => {
    const res = await apiClient.get<{ data: ProductListApiResponse }>('/products', {
      params: { page, size },
    })
    return res.data.data
  },
  getDetail: async (id: number): Promise<ProductDetailApiResponse> => {
    const res = await apiClient.get<{ data: ProductDetailApiResponse }>(`/products/${id}`)
    return res.data.data
  },
  // 조회수 증가 (Redis 누적) — 최신 총합 반환
  increaseView: async (id: number): Promise<ProductViewApiResponse> => {
    const res = await apiClient.post<{ data: ProductViewApiResponse }>(`/products/${id}/view`)
    return res.data.data
  },
}
