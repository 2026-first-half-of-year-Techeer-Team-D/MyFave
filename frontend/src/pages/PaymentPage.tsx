import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

const SHIPPING_REQUESTS = [
  '배송 전 미리 연락바랍니다',
  '부재 시 경비실에 맡겨주세요',
  '부재 시 문 앞에 놓아주세요',
  '직접 수령하겠습니다',
]

export function PaymentPage() {
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState('카드')
  const [appliedCoupon, setAppliedCoupon] = useState<{benefit: string, discount: number} | null>(null)
  const [shippingRequest, setShippingRequest] = useState('')
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  
  const [address, setAddress] = useState<{
    main: string,
    detail: string,
    phone: string
  } | null>({
    main: '인천광역시 연수구 아카데미로 119',
    detail: '공과대학교 8호관 A동',
    phone: '010-1234-5678'
  })

  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon')
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon))
    }
  }, [])

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.removeItem('appliedCoupon')
    navigate('/order-success')
  }

  const subtotal = 134000
  const shippingFee = 3000
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const total = subtotal + shippingFee - discount

  return (
    <div className="flex-1 bg-white min-h-0 pb-40 overflow-y-auto pt-8">
      <div className="px-[19.99px] pt-[17.01px] pb-[8px]">
        <h1 className="font-noto text-[15px] font-medium leading-[22px] text-[#322927]">민트초코좋아님</h1>
      </div>

      <div className="px-[19.99px]">
        {/* 2. Shipping Address Section */}
        <section className="mt-[16px] space-y-[12px]">
          <div className="flex items-center justify-between">
            <h2 className="font-noto text-[15px] font-bold text-[#322927]">배송지 정보</h2>
            {address && (
              <div className="flex gap-[6px] items-center">
                <div className="rounded-[5px] bg-[#EFE9E0] px-[8px] py-[2px] flex items-center justify-center">
                  <span className="font-noto text-[10px] font-medium text-[#949494] leading-none">기본 배송지</span>
                </div>
                <button 
                  onClick={() => navigate('/add-shipping')}
                  className="rounded-[5px] bg-[#EFE9E0] px-[8px] py-[2px] flex items-center justify-center active:opacity-70 transition-opacity"
                >
                  <span className="font-noto text-[10px] font-medium text-[#949494] leading-none">배송지 변경</span>
                </button>
                <button 
                  onClick={() => {
                    setAddress(null);
                    setShippingRequest('');
                  }}
                  className="ml-1 p-1 text-[#949494] hover:text-red-500 transition-colors"
                  aria-label="배송지 제거"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {address ? (
            <div className="rounded-[12px] border-[1.096px] border-[#F2EDEB] bg-white p-[20px] space-y-[10px] shadow-sm">
              <div className="space-y-[8px]">
                <p className="font-noto text-[12px] font-normal leading-[18.2px] text-[#322927]">
                  {address.main}<br />
                  {address.detail}
                </p>
                <p className="font-noto text-[12px] font-normal text-[#322927]">{address.phone}</p>
              </div>

              {/* 배송 요청사항 선택 기능 구현 */}
              <div className="relative pt-[2px]">
                <button 
                  onClick={() => setIsRequestOpen(!isRequestOpen)}
                  className="w-full h-[35px] flex items-center justify-between rounded-[5px] border border-[#F2EDEB] px-[12px] bg-white text-left transition-colors hover:border-point/30"
                >
                  <span className={`font-noto text-[12px] ${shippingRequest ? 'text-[#322927]' : 'text-[#949494]'}`}>
                    {shippingRequest || '배송 요청사항을 선택해주세요'}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`text-[#949494] transition-transform ${isRequestOpen ? 'rotate-180' : ''}`}>
                     <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {isRequestOpen && (
                  <div className="absolute top-[38px] left-0 right-0 z-50 rounded-[5px] border border-[#F2EDEB] bg-white shadow-lg overflow-hidden">
                    {SHIPPING_REQUESTS.map((req) => (
                      <button
                        key={req}
                        onClick={() => {
                          setShippingRequest(req)
                          setIsRequestOpen(false)
                        }}
                        className="w-full px-[12px] py-[10px] text-left font-noto text-[12px] text-[#322927] hover:bg-main-bg transition-colors border-b border-separator/10 last:border-0"
                      >
                        {req}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/add-shipping')}
              className="w-full h-[32px] rounded-[12px] bg-point font-noto text-[12px] font-bold text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              배송지 등록하기
            </button>
          )}
        </section>

        {/* 3. Coupon Section */}
        <section className="mt-[28px] space-y-[16px]">
          <h2 className="font-noto text-[15px] font-bold text-[#322927]">쿠폰 사용</h2>
          <button 
            onClick={() => navigate('/coupons')}
            className="w-full h-[32px] rounded-[12px] bg-point font-noto text-[12px] font-bold text-white shadow-md active:scale-[0.99] transition-all"
          >
            {appliedCoupon ? `적용됨: ${appliedCoupon.benefit}` : '쿠폰 사용'}
          </button>
        </section>

        {/* 4. Order Items */}
        <section className="mt-[32px] space-y-[16px]">
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

        {/* 5. Payment Method Selection */}
        <section className="mt-[32px] space-y-[16px]">
          <h2 className="font-noto text-[15px] font-bold text-[#322927]">결제 수단</h2>
          <div className="grid grid-cols-2 gap-[11px]">
            {['카드', '카카오페이', '네이버페이', '토스페이'].map((label) => (
              <button key={label} onClick={() => setSelectedMethod(label)} className={`h-[42px] rounded-[5px] border font-noto text-[16px] font-medium transition-all ${selectedMethod === label ? 'border-point bg-main-bg text-point' : 'border-[#F2EDEB] bg-[#FAFAF8] text-[#949494]'}`}>{label}</button>
            ))}
          </div>
        </section>

        {/* 6. Order Summary Card */}
        <section className="mt-[32px] space-y-[16px] pb-10">
          <h2 className="font-noto text-[15px] font-bold text-[#322927]">주문 금액</h2>
          <div className="rounded-[12px] border-[1.096px] border-[#F2EDEB] bg-white p-[21.08px] space-y-[14px] shadow-sm">
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-noto font-normal text-[#8B7E74]">상품 금액</span>
              <span className="font-noto font-bold text-[#322927]">{subtotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-noto font-normal text-[#8B7E74]">배송비</span>
              <span className="font-noto font-bold text-[#322927]">{shippingFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-noto font-normal text-[#8B7E74]">할인 금액</span>
              <span className="font-noto font-bold text-point">-{discount.toLocaleString()}원</span>
            </div>
            <div className="pt-[14px] border-t-[1.096px] border-[#F2EDEB] flex justify-between items-center">
              <span className="font-noto text-[18px] font-bold text-[#322927]">최종 결제 금액</span>
              <span className="font-noto text-[20px] font-bold text-[#CF879B]">{total.toLocaleString()}원</span>
            </div>
          </div>
        </section>
      </div>

      {/* 7. Action Button - 동적 최종 금액 반영 (쿠폰 미적용 시 취소선 제거) */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[376.04px] -translate-x-1/2 bg-white p-[19.99px] border-t border-[#F2EDEB] shadow-figma-popup">
        <button
          onClick={handlePayment}
          disabled={!address}
          className={`w-full h-[56px] rounded-[12px] bg-point flex flex-col items-center justify-center shadow-lg shadow-point/20 active:scale-[0.98] transition-all`}
        >
          {appliedCoupon && (
            <span className="font-noto text-[12px] text-white/60 line-through leading-none mb-[2px]">
              {(subtotal + shippingFee).toLocaleString()}원
            </span>
          )}
          <span className="font-noto text-[16px] font-black text-white uppercase tracking-tight">
            {total.toLocaleString()}원 결제하기
          </span>
        </button>
      </div>
    </div>
  )
}
