import { apiClient } from '@/shared/api/axios'
import type {
  PaymentPrepareRequest,
  PaymentPrepareResponse,
  PaymentConfirmRequest,
  BackendPaymentResponse,
} from './types'

export const paymentsApi = {
  prepare: async (data: PaymentPrepareRequest): Promise<PaymentPrepareResponse> => {
    const res = await apiClient.post<{ data: PaymentPrepareResponse }>('/payments/prepare', data)
    return res.data.data
  },
  confirm: async (data: PaymentConfirmRequest): Promise<BackendPaymentResponse> => {
    const res = await apiClient.post<{ data: BackendPaymentResponse }>('/payments/confirm', data)
    return res.data.data
  },
}
