import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface OrderItem {
  id: number
  title: string
  image: string
  price: number
}

const ORDER_ITEMS: OrderItem[] = [
  {
    id: 1,
    title: '플로럴 블라썸 원피스',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
    price: 89000,
  },
  {
    id: 2,
    title: '코튼 캐주얼 티셔츠',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521',
    price: 45000,
  },
]

export function OrderSuccessPage() {
  const [appliedCoupon, setAppliedCoupon] = useState<{benefit: string, discount: number} | null>(null)
  const orderNumber = '2026032329760731'
  const orderDate = '2026.03.23. 23:05:00'

  useEffect(() => {
    const saved = localStorage.getItem('finalOrderCoupon')
    if (saved) {
      setAppliedCoupon(JSON.parse(saved))
      // 한 번 표시한 후에는 초기화 (새로고침 시 등 데이터 혼선 방지)
      localStorage.removeItem('finalOrderCoupon')
    }
  }, [])

  const subtotal = 134000
  const shippingFee = 3000
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const total = subtotal + shippingFee - discount

  return (
    <div className="flex-1 bg-white min-h-0 pb-32 overflow-y-auto">
      {/* 1. Success Message - Figma Node 251:2433 명세 100% 동기화 */}
      <div className="flex flex-col items-center justify-center px-[19.99px] py-[40px] text-center">
        <div className="mb-[24px]">
          <div className="w-[80px] h-[80px] bg-main-bg rounded-full flex items-center justify-center shadow-sm border border-separator/5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF95B3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h1 className="font-noto text-[24px] font-bold text-point tracking-tight mb-[16px]">
          주문이 완료되었습니다
        </h1>
        <p className="font-noto text-[14px] leading-[22px] text-chat-font whitespace-pre-line mb-[24px]">
          {orderDate}{"\n"}
          주문번호 {orderNumber}
        </p>
        {/* Shipping Note */}
        <div className="w-full bg-footer-bg rounded-[12px] p-[16px] border border-separator/10">
          <p className="font-noto text-[12px] leading-[20px] text-muted-text opacity-80 text-center">
            배송은 3~4일정도 걸리며<br />
            제주 및 도서 산간지역은 더 걸릴 수 있습니다.
          </p>
        </div>
      </div>

      {/* 2. Order Items Section */}
      <section className="px-[19.99px] py-[24px] space-y-[16px]">
        <h2 className="font-noto text-[15px] font-bold text-[#322927]">주문 상품 2개</h2>
        <div className="space-y-[12px]">
          {ORDER_ITEMS.map((item) => (
            <div key={item.id} className="flex w-full h-[114.19px] gap-[11.99px] rounded-[12px] border-[1.096px] border-[#F2EDEB] bg-white p-[15.99px] shadow-sm">
              <div className="h-[84px] w-[84px] flex-shrink-0 overflow-hidden rounded-[15px] shadow-sm">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between py-[2px]">
                <h3 className="font-noto text-[11px] font-bold leading-[15.13px] text-[#322927] line-clamp-2">{item.title}</h3>
                <div className="flex justify-end">
                  <span className="font-noto text-[16px] font-bold leading-[24px] text-[#CF879B]">{item.price.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Payment Detail Section - 동적 쿠폰 할인 반영 */}
      <section className="px-[19.99px] py-[24px] space-y-[16px]">
        <h2 className="font-noto text-[15px] font-bold text-[#322927]">결제 상세</h2>
        <div className="rounded-[12px] border border-[#F2EDEB] p-[20px] space-y-[14px] bg-white shadow-sm">
          <div className="flex justify-between items-center text-[14px]">
            <span className="font-noto text-[#8B7E74]">결제 수단</span>
            <span className="font-noto font-bold text-[#322927]">카드 결제</span>
          </div>
          <div className="pt-[14px] border-t border-separator/10 space-y-[10px]">
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-noto text-[#8B7E74]">상품 금액</span>
              <span className="font-noto font-bold text-[#322927]">{subtotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-noto text-[#8B7E74]">배송비</span>
              <span className="font-noto font-bold text-[#322927]">{shippingFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-noto text-[#8B7E74]">쿠폰 할인</span>
              <span className="font-noto font-bold text-point">-{discount.toLocaleString()}원</span>
            </div>
          </div>
          <div className="pt-[14px] border-t-[1.096px] border-[#F2EDEB] flex justify-between items-center">
            <span className="font-noto text-[18px] font-bold text-[#322927]">총 결제 금액</span>
            <span className="font-noto text-[20px] font-bold text-point">{total.toLocaleString()}원</span>
          </div>
        </div>
      </section>

      {/* 4. Shipping Info Section */}
      <section className="px-[19.99px] py-[24px] space-y-[16px]">
        <h2 className="font-noto text-[15px] font-bold text-[#322927]">배송 정보</h2>
        <div className="rounded-[12px] border border-[#F2EDEB] p-[20px] space-y-[8px] bg-white shadow-sm">
          <p className="font-noto text-[14px] font-bold text-[#322927]">민트초코좋아 <span className="font-normal text-[12px] text-muted-text ml-2">010-1234-5678</span></p>
          <p className="font-noto text-[12px] font-normal leading-[18.2px] text-[#322927]">
            인천광역시 연수구 아카데미로 119<br />
            공과대학교 8호관 A동
          </p>
          <div className="pt-2 border-t border-separator/10">
             <p className="font-noto text-[11px] text-[#8B7E74]">배송 요청사항: 문 앞에 놓아주세요</p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Action Button */}
      <div className="px-[19.99px] py-[48px]">
        <Link 
          to="/"
          className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-point font-noto text-[16px] font-bold text-white shadow-lg shadow-point/20 active:scale-[0.98] transition-all text-center"
        >
          계속 쇼핑하기
        </Link>
      </div>
    </div>
  )
}
