import { apiClient } from '@/shared/api/axios'

export interface OrderCreateRequest {
  orderType: 'DIRECT' | 'CART'
  productId?: number
  productIds?: number[]
  shippingAddressId: number
}

export interface BackendOrderResponse {
  orderId: number
  orderNumber: string
  orderType: string
  orderStatus: string
  createdAt: string
}

export const ordersApi = {
  create: async (data: OrderCreateRequest): Promise<BackendOrderResponse> => {
    const res = await apiClient.post<{ data: BackendOrderResponse }>('/orders', data)
    return res.data.data
  },
}
