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
