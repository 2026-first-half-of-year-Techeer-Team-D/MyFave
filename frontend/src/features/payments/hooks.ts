import { useMutation } from '@tanstack/react-query'
import { paymentsApi } from './api'

export function usePreparePayment() {
  return useMutation({ mutationFn: paymentsApi.prepare })
}

export function useConfirmPayment() {
  return useMutation({ mutationFn: paymentsApi.confirm })
}
