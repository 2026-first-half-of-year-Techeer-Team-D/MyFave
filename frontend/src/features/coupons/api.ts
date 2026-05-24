import { apiClient } from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/api/types'

import type { Coupon, CouponIssueRequest, CouponIssueResponse, CouponStatus } from './types'

export const couponsApi = {
  getMyCoupons: async (status?: CouponStatus): Promise<Coupon[]> => {
    const { data } = await apiClient.get<ApiResponse<Coupon[]>>('/coupons', {
      params: status ? { status } : undefined,
    })
    return data.data
  },

  // 8-2. 쿠폰 발급 — admin(인플루언서)만 호출 가능. 백엔드에서 requesterId == influencerUserId 검증.
  // 호출 실패(403) 시 일반 user. 본인에게 발급 시도 시에도 백엔드가 막음.
  issueCoupon: async (request: CouponIssueRequest): Promise<CouponIssueResponse> => {
    const { data } = await apiClient.post<ApiResponse<CouponIssueResponse>>('/coupons', request)
    return data.data
  },
}
