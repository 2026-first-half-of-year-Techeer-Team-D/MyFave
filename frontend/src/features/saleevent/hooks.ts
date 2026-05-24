import { useMutation, useQuery } from '@tanstack/react-query'
import { saleEventApi } from './api'
import type { SaleEventCreateRequest } from './types'

export function useSaleEventCreate() {
  return useMutation({
    mutationFn: (body: SaleEventCreateRequest) => saleEventApi.create(body),
  })
}

export function useCurrentSaleEvent() {
  return useQuery({
    queryKey: ['sale-events', 'current'],
    queryFn: saleEventApi.getCurrent,
    retry: false,
  })
}
