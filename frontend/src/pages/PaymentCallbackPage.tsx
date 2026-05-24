import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { paymentsApi } from '@/features/payments/api'
import { useConfirmPayment } from '@/features/payments/hooks'

import { PopUp } from '@/shared/components/PopUp'

export function PaymentCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const confirmPayment = useConfirmPayment()
  const [popUpMessage, setPopUpMessage] = useState('')
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
  // React StrictMode 의 effect 이중실행으로 confirm 이 2번 호출되는 것을 방지한다.
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    hasProcessed.current = true

    // PaymentPage 가 redirectUrl 에 박아둔 bpid (backend Payment.paymentId).
    // sessionStorage 가 새 탭/세션 복귀로 유실되어도 URL 자체로 운반되므로 항상 복구 가능.
    const backendPaymentId = Number(searchParams.get('bpid'))
    // PortOne v2 표준: 모바일 redirect query 의 paymentId = 우리가 SDK 에 넘긴 idempotencyKey.
    // 백엔드 paymentProvider.getPaymentInfo(pgTransactionId) 가 PortOne API GET /payments/{paymentId} 로 사용한다.
    const pgTransactionId = searchParams.get('paymentId') ?? ''
    const code = searchParams.get('code')
    const message = searchParams.get('message') ?? ''

    const openFailurePopUp = (msg: string) => {
      setPopUpMessage(msg)
      setIsPopUpOpen(true)
    }

    const hasValidBpid = Number.isFinite(backendPaymentId) && backendPaymentId > 0

    // 1) PortOne 가 실패/취소로 redirect 한 경우.
    if (code) {
      const isUserCancel = message.includes('취소') || message.toLowerCase().includes('cancel')
      // 백엔드에 남은 PENDING 결제 silent cleanup — 실패해도 사용자 흐름에 영향 없음.
      if (hasValidBpid) {
        paymentsApi
          .cancel(backendPaymentId, { reason: isUserCancel ? 'USER_CANCEL' : `SDK_ERROR: ${message}` })
          .catch(() => {})
      }
      openFailurePopUp(isUserCancel ? '결제를 취소하셨습니다.' : `결제 실패: ${message || '알 수 없는 오류'}`)
      return
    }

    // 2) bpid query 가 없거나 비정상 — 새 탭에서 직접 URL 입력 등 비정상 진입.
    if (!hasValidBpid) {
      openFailurePopUp('결제 정보를 확인할 수 없습니다. 결제 페이지에서 다시 시도해주세요.')
      return
    }

    // 3) 정상 redirect — 백엔드 confirm 호출.
    confirmPayment.mutate(
      { paymentId: backendPaymentId, pgTransactionId },
      {
        onSuccess: () => {
          navigate('/orders', { replace: true })
        },
        onError: (err) => {
          const errorCode = (err as { response?: { data?: { errorCode?: string } } })?.response?.data?.errorCode
          const friendly =
            errorCode === 'PAYMENT_AMOUNT_MISMATCH'
              ? '결제 금액이 일치하지 않아 자동 환불 처리되었습니다.'
              : errorCode === 'PAYMENT_ALREADY_DONE'
              ? '이미 처리된 결제입니다.'
              : '결제 승인에 실패했습니다. 잠시 후 다시 시도해주세요.'
          openFailurePopUp(friendly)
        },
      },
    )
  }, [confirmPayment, navigate, searchParams])

  const handleClosePopUp = () => {
    setIsPopUpOpen(false)
    navigate('/payment', { replace: true })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-[60vh] px-[19.99px]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F2EDEB] border-t-[#CF879B]" />
        <p className="font-noto text-[14px] text-[#322927]">결제 결과를 확인하고 있습니다…</p>
      </div>
      <PopUp isOpen={isPopUpOpen} message={popUpMessage} onClose={handleClosePopUp} />
    </div>
  )
}
