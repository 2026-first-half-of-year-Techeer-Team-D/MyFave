import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from './api'

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders(),
  })
}

export function useOrderDetailQuery(orderId: number | undefined) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderDetail(orderId!),
    enabled: Number.isFinite(orderId),
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useConfirmPurchase() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.confirmPurchase(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
