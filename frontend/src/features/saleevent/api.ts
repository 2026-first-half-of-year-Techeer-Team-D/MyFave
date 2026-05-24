import { apiClient } from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/api/types'
import type { SaleEventCreateRequest, SaleEventCreateResponse } from './types'

export const saleEventApi = {
  create: async (body: SaleEventCreateRequest): Promise<SaleEventCreateResponse> => {
    const { data } = await apiClient.post<ApiResponse<SaleEventCreateResponse>>(
      '/sale-events',
      body,
    )
    return data.data
  },
}
