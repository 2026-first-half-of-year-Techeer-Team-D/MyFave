import { apiClient } from '@/shared/api/axios'

export interface BackendShippingAddress {
  shippingId: number
  receiverName: string
  receiverPhone: string
  address: string
  addressDetail: string
  zipCode: string
  deliveryRequest: string
  isDefault: boolean
}

export const shippingApi = {
  getAddresses: async (): Promise<BackendShippingAddress[]> => {
    const res = await apiClient.get<{ data: BackendShippingAddress[] }>('/shipping')
    return res.data.data
  },
}
