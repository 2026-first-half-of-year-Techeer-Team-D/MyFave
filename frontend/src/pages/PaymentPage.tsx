import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/shared/components/Modal'

export function PaymentPage() {
  const navigate = useNavigate()
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('card')

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccessModalOpen(true)
  }

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false)
    navigate('/orders')
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-40 overflow-y-auto">
      {/* 1. Header & Title - Figma Node 100:140 & 99:1215 100% 동기화 */}
      <div className="px-[19.99px] pt-[17.01px] pb-[16px]">
        <h1 className="font-noto text-[15px] font-medium leading-[22px] text-[#322927]">민트초코좋아님</h1>
        <h2 className="mt-[2px] font-noto text-[20px] font-bold text-[#322927]">주문서</h2>
      </div>

      <div className="px-[19.99px] space-y-[28px]">
        {/* 2. Shipping Address Card - Figma Node 100:232 명세 반영 */}
        <section className="space-y-[12px]">
          <div className="flex items-center justify-between">
            <h2 className="font-noto text-[15px] font-medium text-[#322927]">배송지 정보</h2>
            <div className="flex gap-[6px]">
              <span className="rounded-[5px] bg-[#EFE9E0] px-[8px] py-[2px] font-noto text-[10px] font-medium text-[#949494]">기본 배송지</span>
              <button className="rounded-[5px] bg-[#EFE9E0] px-[8px] py-[2px] font-noto text-[10px] font-medium text-[#949494] active:opacity-70 transition-opacity">배송지 변경</button>
            </div>
          </div>
          <div className="rounded-[12px] border-[1.096px] border-separator bg-white p-[16px] space-y-[8px] shadow-sm">
            <p className="font-noto text-[12px] font-normal leading-[18px] text-[#322927]">
              인천광역시 연수구 아카데미로 119<br />
              공과대학교 8호관 A동
            </p>
            <p className="font-noto text-[12px] font-normal text-[#322927]">010-1234-5678</p>
            <div className="relative mt-[4px]">
              <button className="w-full flex items-center justify-between rounded-[5px] border border-separator px-[12px] py-[10px] bg-white text-left transition-colors hover:border-point/30">
                <span className="font-noto text-[12px] text-[#949494]">배송 요청사항을 선택해주세요</span>
                <svg width="14" height="7" viewBox="0 0 14 7" fill="none" className="text-separator">
                   <path d="M1 1L7 6L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Order Item Summary - Figma Node 100:221 명세 반영 */}
        <section className="space-y-[12px]">
          <h2 className="font-noto text-[15px] font-medium text-[#322927]">주문 상품 2개</h2>
          <div className="space-y-[8px]">
            <div className="flex items-center gap-[12px] p-[12px] border border-separator/30 rounded-[12px] bg-[#FAFAF8]">
               <div className="w-[48px] h-[48px] bg-white rounded-[8px] overflow-hidden border border-separator/20">
                 <img 
                   src="https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356" 
                   alt="product" 
                   className="w-full h-full object-cover" 
                 />
               </div>
               <div className="flex flex-col gap-[2px]">
                 <span className="font-noto text-[13px] font-bold text-[#322927]">플로럴 블라썸 원피스 외 1건</span>
                 <span className="font-noto text-[11px] text-[#8B7E74]">수량 2개 / 무료배송</span>
               </div>
            </div>
          </div>
        </section>

        {/* 4. Payment Method Selection - Figma Node 100:367 (165x42px Grid) */}
        <section className="space-y-[12px]">
          <h2 className="font-noto text-[15px] font-medium text-[#322927]">결제 수단</h2>
          <div className="grid grid-cols-2 gap-[11px]">
            {[
              { id: 'card', label: '카드' },
              { id: 'kakao', label: '카카오페이' },
              { id: 'naver', label: '네이버페이' },
              { id: 'toss', label: '토스페이' }
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`h-[42px] w-full rounded-[5px] border font-noto text-[15px] font-medium transition-all ${
                  selectedMethod === method.id
                    ? 'border-point bg-main-bg text-point'
                    : 'border-separator bg-white text-[#949494]'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </section>

        {/* 5. Final Order Summary Card - Figma Node 251:919 정밀 수치 반영 */}
        <section className="space-y-[12px] pb-[40px]">
          <h2 className="font-noto text-[15px] font-medium text-[#322927]">주문 금액</h2>
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
              <span className="font-noto text-[18px] font-bold text-[#CF879B]">131,000원</span>
            </div>
          </div>
        </section>
      </div>

      {/* 6. Fixed Action Button - Figma Node 251:887 100% 동기화 */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[376.04px] -translate-x-1/2 bg-white p-[19.99px] border-t border-separator shadow-figma-popup">
        <button
          onClick={handlePayment}
          className="w-full h-[56px] rounded-[12px] bg-point flex flex-col items-center justify-center shadow-lg shadow-point/20 active:scale-[0.98] transition-all"
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
