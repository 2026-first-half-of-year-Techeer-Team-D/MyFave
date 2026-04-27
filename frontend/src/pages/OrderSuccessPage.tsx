import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface OrderItem {
  id: number
  title: string
  image: string
  price: number
}

interface AddressInfo {
  main: string
  detail: string
  phone: string
}

export function OrderSuccessPage() {
  const navigate = useNavigate()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<{benefit: string, discount: number} | null>(null)
  const [address, setAddress] = useState<AddressInfo | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('카드 결제')
  const [shippingRequest, setShippingRequest] = useState<string>('')
  
  const orderNumber = '2026032329760731' // 실결제 연동 시에는 백엔드에서 받아와야 함
  const orderDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  useEffect(() => {
    const savedItems = localStorage.getItem('finalOrderItems')
    const savedCoupon = localStorage.getItem('finalOrderCoupon')
    const savedAddress = localStorage.getItem('finalOrderAddress')
    const savedMethod = localStorage.getItem('finalOrderMethod')
    const savedRequest = localStorage.getItem('finalOrderRequest')

    if (!savedItems) {
      // 데이터가 없으면 비정상 접근으로 간주하고 홈으로 이동
      navigate('/')
      return
    }

    setOrderItems(JSON.parse(savedItems))
    if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon))
    if (savedAddress) setAddress(JSON.parse(savedAddress))
    if (savedMethod) setPaymentMethod(savedMethod)
    if (savedRequest) setShippingRequest(savedRequest)

    // 페이지를 떠날 때 데이터를 정리하도록 cleanup 함수 설정하거나, 
    // 혹은 여기서 바로 정리하지 않고 사용자가 나중에 마이페이지에서 볼 수 있게 할 수도 있음.
    // 여기서는 디자인 요구사항에 따라 완료 페이지 표시용으로만 사용하므로 나중에 정리.
  }, [navigate])

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0)
  const shippingFee = 3000
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const total = subtotal + shippingFee - discount

  if (orderItems.length === 0) return null

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
        <h2 className="font-noto text-[15px] font-bold text-[#322927]">주문 상품 {orderItems.length}개</h2>
        <div className="space-y-[12px]">
          {orderItems.map((item) => (
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
            <span className="font-noto font-bold text-[#322927]">{paymentMethod}</span>
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
          {address ? (
            <>
              <p className="font-noto text-[14px] font-bold text-[#322927]">민트초코좋아 <span className="font-normal text-[12px] text-muted-text ml-2">{address.phone}</span></p>
              <p className="font-noto text-[12px] font-normal leading-[18.2px] text-[#322927]">
                {address.main}<br />
                {address.detail}
              </p>
              <div className="pt-2 border-t border-separator/10">
                 <p className="font-noto text-[11px] text-[#8B7E74]">배송 요청사항: {shippingRequest || '없음'}</p>
              </div>
            </>
          ) : (
            <p className="font-noto text-[12px] text-[#8B7E74]">배송 정보가 없습니다.</p>
          )}
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
