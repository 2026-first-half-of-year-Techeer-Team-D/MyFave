export type CouponType = 'DISCOUNT' | 'SHIPPING'
export type CouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED'

export interface Coupon {
  couponId: number
  couponName: string
  couponType: CouponType
  discountPrice: number
  status: CouponStatus
  expiredAt: string
  createdAt: string
}

// 8-2 쿠폰 발급 API (POST /coupons) — admin(인플루언서)이 특정 user에게 발급
export interface CouponIssueRequest {
  masterCouponId: number
  userId: number
}

export interface CouponIssueResponse {
  couponId: number
  userId: number
  couponName: string
  couponType: CouponType
  discountPrice: number
  status: CouponStatus
  expiredAt: string
}

// 라이브 채팅 admin 발급 UI에서 사용하는 마스터 쿠폰 목록 (DB의 coupon_masters 기준 하드코딩)
export interface CouponMasterOption {
  masterCouponId: number
  label: string
  type: CouponType
  discountPrice: number
}

export const ADMIN_COUPON_MASTERS: CouponMasterOption[] = [
  { masterCouponId: 1, label: '5천원 할인', type: 'DISCOUNT', discountPrice: 5000 },
  { masterCouponId: 2, label: '3천원 할인', type: 'DISCOUNT', discountPrice: 3000 },
  { masterCouponId: 3, label: '2천원 할인', type: 'DISCOUNT', discountPrice: 2000 },
  { masterCouponId: 4, label: '배송비 무료', type: 'SHIPPING', discountPrice: 3000 },
]
