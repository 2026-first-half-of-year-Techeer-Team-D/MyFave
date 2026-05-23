import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { shippingApi } from './api'

export const SHIPPING_QUERY_KEY = ['shipping-addresses'] as const

export function useShippingAddresses() {
  return useQuery({
    queryKey: SHIPPING_QUERY_KEY,
    queryFn: shippingApi.getAddresses,
  })
}

export function useDeleteShippingAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shippingId: number) => shippingApi.deleteAddress(shippingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_QUERY_KEY }),
  })
}

export function useSetDefaultShippingAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shippingId: number) => shippingApi.setDefaultAddress(shippingId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SHIPPING_QUERY_KEY }),
  })
}

export function useTracking(orderId: number | undefined) {
  return useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => shippingApi.getTracking(orderId!),
    enabled: !!orderId,
    refetchInterval: 30_000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && [400, 502].includes(error.response?.status ?? 0)) return false
      return failureCount < 2
    },
  })
}
