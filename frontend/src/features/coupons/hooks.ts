import { useMutation, useQuery } from '@tanstack/react-query'

import { couponsApi } from './api'
import type { CouponIssueRequest, CouponStatus } from './types'

export function useMyCoupons(status?: CouponStatus) {
  return useQuery({
    queryKey: ['coupons', { status }],
    queryFn: () => couponsApi.getMyCoupons(status),
  })
}

// admin(인플루언서)이 라이브 채팅 사용자에게 쿠폰 발급할 때 사용
export function useIssueCoupon() {
  return useMutation({
    mutationFn: (request: CouponIssueRequest) => couponsApi.issueCoupon(request),
  })
}
