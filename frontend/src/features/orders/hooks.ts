import { useMutation, useQuery } from '@tanstack/react-query'
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
    enabled: orderId != null,
  })
}

export function useCreateOrder() {
  return useMutation({ mutationFn: ordersApi.create })
}
