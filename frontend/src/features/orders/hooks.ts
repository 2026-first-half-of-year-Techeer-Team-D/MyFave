import { useMutation } from '@tanstack/react-query'
import { useOrderStore } from './store'
import { ordersApi } from './api'

export function useOrders() {
  return useOrderStore((s) => s.orders)
}

export function useOrder(id: string | undefined) {
  return useOrderStore((s) => (id ? s.orders.find((o) => o.id === id) : undefined))
}

export function useCreateOrder() {
  return useMutation({ mutationFn: ordersApi.create })
}
