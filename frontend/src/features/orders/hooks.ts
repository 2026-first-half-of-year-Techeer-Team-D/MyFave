import { useOrderStore } from './store'

export function useOrders() {
  return useOrderStore((s) => s.orders)
}

export function useOrder(id: string | undefined) {
  return useOrderStore((s) => (id ? s.orders.find((o) => o.id === id) : undefined))
}
