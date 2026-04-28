import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Coupon } from './types'

const DEFAULT_AVAILABLE_COUPONS: Coupon[] = [
  { id: 1, benefit: '배송비 무료', title: '배송비 무료 쿠폰', expiry: '오늘 만료', discount: 3000 },
  { id: 2, benefit: '3,000원', title: '라이브 채팅 특별 이벤트 쿠폰', expiry: '오늘 만료', discount: 3000 },
  { id: 3, benefit: '10,000원', title: '라이브 채팅 특별 이벤트 쿠폰', expiry: '오늘 만료', discount: 10000 },
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
