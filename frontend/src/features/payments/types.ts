import type { CartItem } from '@/features/cart/types'
import type { Coupon } from '@/features/coupons/types'
import type { Address } from '@/features/shipping/types'

export type PaymentMethod = '카드' | '계좌이체' | '카카오페이' | '네이버페이'

export interface CheckoutSession {
  items: CartItem[]
  address: Address | null
  appliedCoupon: Coupon | null
  paymentMethod: PaymentMethod | null
}
