import { useState } from 'react'
import type { AxiosError } from 'axios'

import { useIssueCoupon } from './hooks'
import { ADMIN_COUPON_MASTERS } from './types'

interface CouponIssueModalProps {
  isOpen: boolean
  onClose: () => void
  target: { userId: number; nickname: string } | null
}

// 라이브 채팅에서 admin(인플루언서)이 특정 user에게 쿠폰 발급할 때 띄우는 모달.
// 호출 흐름: 채팅 메시지 옆 🎁 버튼 클릭 → setTarget → 모달 표시 → 마스터 선택 + 발급
export function CouponIssueModal({ isOpen, onClose, target }: CouponIssueModalProps) {
  const issueCoupon = useIssueCoupon()
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen || !target) return null

  const handleIssue = () => {
    if (selectedMasterId == null) {
      setErrorMessage('쿠폰을 선택해주세요')
      return
    }
    setErrorMessage(null)
    issueCoupon.mutate(
      { masterCouponId: selectedMasterId, userId: target.userId },
      {
        onSuccess: (response) => {
          alert(`${target.nickname} 님에게 ${response.couponName} 발급 완료`)
          setSelectedMasterId(null)
          onClose()
        },
        onError: (err) => {
          const status = (err as AxiosError).response?.status
          if (status === 403) {
            setErrorMessage('admin 권한이 없습니다 (인플루언서 계정으로 로그인했는지 확인)')
          } else if (status === 404) {
            setErrorMessage('마스터 쿠폰 또는 사용자를 찾을 수 없습니다')
          } else {
            setErrorMessage('쿠폰 발급에 실패했습니다. 잠시 후 다시 시도해주세요')
          }
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-9">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      <div className="relative w-full max-w-sm overflow-hidden rounded-[15px] border border-separator bg-footer-bg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-7">
          <p className="text-center font-noto text-[14px] font-bold leading-relaxed text-dark-text">
            🎁 <span className="text-point">{target.nickname}</span> 님에게 쿠폰 발급
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {ADMIN_COUPON_MASTERS.map((master) => {
              const isSelected = selectedMasterId === master.masterCouponId
              return (
                <button
                  key={master.masterCouponId}
                  type="button"
                  onClick={() => setSelectedMasterId(master.masterCouponId)}
                  className={`flex items-center justify-between rounded-[12px] border px-4 py-3 transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-point bg-main-bg text-dark-text'
                      : 'border-separator bg-white text-muted-text hover:border-point/50'
                  }`}
                >
                  <span className="font-noto text-[13px] font-medium">{master.label}</span>
                  <span className="font-noto text-[11px] text-muted-text">
                    {master.type === 'SHIPPING' ? '배송비' : `-${master.discountPrice.toLocaleString()}원`}
                  </span>
                </button>
              )
            })}
          </div>

          {errorMessage && (
            <p className="mt-4 text-center font-noto text-[12px] text-red-500">{errorMessage}</p>
          )}
        </div>

        <div className="flex">
          <button
            type="button"
            onClick={onClose}
            disabled={issueCoupon.isPending}
            className="flex-1 bg-sub1 py-[16px] font-noto text-sm font-bold text-muted-text transition-colors hover:bg-separator/30 active:scale-[0.98] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleIssue}
            disabled={issueCoupon.isPending || selectedMasterId == null}
            className="flex-1 bg-point py-[16px] font-noto text-sm font-black text-white transition-colors hover:bg-[#ff7fa3] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {issueCoupon.isPending ? '발급 중...' : '발급'}
          </button>
        </div>
      </div>
    </div>
  )
}
