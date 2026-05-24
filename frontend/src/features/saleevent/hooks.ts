import { useMutation } from '@tanstack/react-query'
import { saleEventApi } from './api'
import type { SaleEventCreateRequest } from './types'

export function useSaleEventCreate() {
  return useMutation({
    mutationFn: (body: SaleEventCreateRequest) => saleEventApi.create(body),
  })
}
