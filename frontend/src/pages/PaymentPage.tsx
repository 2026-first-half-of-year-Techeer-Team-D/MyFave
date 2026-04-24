import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/shared/components/Modal'

export function PaymentPage() {
  const navigate = useNavigate()
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccessModalOpen(true)
  }

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false)
    navigate('/orders')
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-32">
      {/* 1. Header & User Greeting - Figma Node 100:71 */}
      <div className="px-[19.99px] pt-[19.99px] pb-[16px]">
        <h1 className="font-noto text-[20px] font-bold leading-[30px] text-[#322927]">결제하기</h1>
        <p className="mt-[8px] font-noto text-[16px] font-medium text-[#322927]">민트초코좋아님</p>
      </div>

      <div className="px-[19.99px] space-y-[24px]">
        {/* 2. Shipping Address Section - Figma Node 100:73 */}
        <section className="space-y-[12px]">
          <h2 className="font-noto text-[14px] font-bold text-[#322927]">배송지 정보</h2>
          <button
            type="button"
            className="w-full h-[48px] rounded-[12px] bg-point font-noto text-[14px] font-bold text-white shadow-md active:scale-[0.99] transition-all"
          >
            배송지 등록하기
          </button>
        </section>

        {/* 3. Coupon Section - Figma Node 100:66 */}
        <section className="space-y-[12px]">
          <h2 className="font-noto text-[14px] font-bold text-[#322927]">쿠폰 사용</h2>
          <button
            type="button"
            className="w-full h-[48px] rounded-[12px] bg-point font-noto text-[14px] font-bold text-white shadow-md active:scale-[0.99] transition-all"
          >
            쿠폰 사용
          </button>
        </section>

        {/* 4. Order Summary Card - Figma Node 251:768 명세 100% 동기화 */}
        <section className="space-y-[12px]">
          <h2 className="font-noto text-[14px] font-bold text-[#322927]">주문 금액</h2>
          <div className="rounded-[12px] border-[1.096px] border-separator bg-white p-[21.08px] space-y-[14px]">
            <div className="flex justify-between items-center">
              <span className="font-noto text-[14px] font-normal text-[#8B7E74]">상품 금액</span>
              <span className="font-noto text-[14px] font-bold text-[#322927]">131,000원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-noto text-[14px] font-normal text-[#8B7E74]">배송비</span>
              <span className="font-noto text-[14px] font-bold text-[#322927]">무료</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-noto text-[14px] font-normal text-[#8B7E74]">할인 금액</span>
              <span className="font-noto text-[14px] font-bold text-point">-3,000원</span>
            </div>
            <div className="pt-[14px] border-t border-separator/30 flex justify-between items-center">
              <span className="font-noto text-[18px] font-bold text-[#322927]">최종 결제 금액</span>
              <span className="font-noto text-[18px] font-bold text-point">131,000원</span>
            </div>
          </div>
        </section>
      </div>

      {/* 5. Fixed Action Button - Figma Node 99:1268 (Complex Design) */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[376.04px] -translate-x-1/2 bg-white p-[19.99px] border-t border-separator shadow-figma-popup">
        <button
          onClick={handlePayment}
          className="relative w-full h-[56px] rounded-[12px] bg-point flex flex-col items-center justify-center shadow-lg shadow-point/20 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-[6px] opacity-60">
            <span className="font-noto text-[12px] text-white line-through">134,000원</span>
          </div>
          <span className="font-noto text-[16px] font-bold text-white">131,000원 결제하기</span>
        </button>
      </div>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessConfirm}
        buttonText="주문 내역 보기"
      >
        <div className="text-center">
          <p className="text-[18px] font-bold text-dark-text mb-2">결제가 완료되었습니다!</p>
          <p className="text-[14px] text-muted-text">주문하신 상품이 곧 배송될 예정입니다.</p>
        </div>
      </Modal>
    </div>
  )
}
