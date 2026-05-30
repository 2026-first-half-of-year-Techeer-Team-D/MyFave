import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { CartItem } from '@/features/cart/types'
import type { Coupon } from '@/features/coupons/types'
import type { Address } from '@/features/shipping/types'

import type { CheckoutSession, PaymentMethod } from './types'

interface CheckoutState extends CheckoutSession {
  setItems: (items: CartItem[]) => void
  setAddress: (address: Address | null) => void
  setCoupon: (coupon: Coupon | null) => void
  setPaymentMethod: (method: PaymentMethod | null) => void
  setOrderType: (orderType: 'DIRECT' | 'CART') => void
  reset: () => void
}

const initialSession: CheckoutSession = {
  items: [],
  address: null,
  appliedCoupon: null,
  paymentMethod: null,
  orderType: 'DIRECT',
}

// 주문서(결제 페이지) 데이터는 새로고침에도 유지돼야 한다.
// cart 스토어와 동일하게 persist 미들웨어로 localStorage('myfave-checkout')에 저장.
// 결제 완료 시 PaymentPage 에서 reset() 을 호출해 stale 주문서가 남지 않도록 한다.
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      ...initialSession,
      setItems: (items) => set({ items }),
      setAddress: (address) => set({ address }),
      setCoupon: (appliedCoupon) => set({ appliedCoupon }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setOrderType: (orderType) => set({ orderType }),
      reset: () => set(initialSession),
    }),
    {
      name: 'myfave-checkout',
      // 개인정보(address: 수령인명/연락처/주소)는 localStorage 에 저장하지 않는다.
      // address 는 PaymentPage 마운트 시 백엔드 배송지에서 다시 채워지므로 영속 대상에서 제외.
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        paymentMethod: state.paymentMethod,
        orderType: state.orderType,
      }),
    },
  ),
)
