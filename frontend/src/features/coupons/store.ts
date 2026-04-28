import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Coupon } from './types'

const DEFAULT_AVAILABLE_COUPONS: Coupon[] = [
  { id: 1, benefit: '10%', title: '신규 가입 축하 쿠폰', expiry: '2026.06.30', discount: 10 },
  { id: 2, benefit: '5,000원', title: '첫 주문 감사 쿠폰', expiry: '2026.05.31', discount: 5000 },
  { id: 3, benefit: '15%', title: 'VIP 회원 전용', expiry: '2026.12.31', discount: 15 },
]

interface CouponState {
  available: Coupon[]
  applied: Coupon | null
  setAvailable: (coupons: Coupon[]) => void
  applyCoupon: (coupon: Coupon | null) => void
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      available: DEFAULT_AVAILABLE_COUPONS,
      applied: null,
      setAvailable: (coupons) => set({ available: coupons }),
      applyCoupon: (coupon) => set({ applied: coupon }),
    }),
    { name: 'myfave-coupons' },
  ),
)
