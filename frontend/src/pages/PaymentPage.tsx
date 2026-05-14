import PortOne from '@portone/browser-sdk/v2'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useUser } from '@/features/auth/hooks'
import { useCart } from '@/features/cart/hooks'
import { useCartStore } from '@/features/cart/store'
import { useCouponStore } from '@/features/coupons/store'
import { useCreateOrder } from '@/features/orders/hooks'
import { useConfirmPayment, usePreparePayment } from '@/features/payments/hooks'
import { useCheckoutStore } from '@/features/payments/store'
import { PAYMENT_METHOD_MAP } from '@/features/payments/types'
import { shippingApi } from '@/features/shipping/api'
import { getDefaultAddress, useShippingStore } from '@/features/shipping/store'
import type { Address } from '@/features/shipping/types'

const SHIPPING_REQUESTS = [
  '문 앞에 두어주세요',
  '경비실에 맡겨주세요',
  '배송 전 미리 연락바랍니다',
  '직접 수령하겠습니다',
]

export function PaymentPage() {
  const navigate = useNavigate()
  const user = useUser()
  const checkoutItems = useCheckoutStore((s) => s.items)
  const setCheckoutItems = useCheckoutStore((s) => s.setItems)
  const cartItems = useCart()
  const clearCart = useCartStore((s) => s.clear)
  const appliedCoupon = useCouponStore((s) => s.applied)
  const applyCoupon = useCouponStore((s) => s.applyCoupon)
  const addresses = useShippingStore((s) => s.addresses)

  const createOrder = useCreateOrder()
  const preparePayment = usePreparePayment()
  const confirmPayment = useConfirmPayment()

  const { data: backendAddresses } = useQuery({
    queryKey: ['shipping-addresses'],
    queryFn: shippingApi.getAddresses,
  })
  const defaultBackendAddress = backendAddresses?.find((a) => a.isDefault)

  const [selectedMethod, setSelectedMethod] = useState('카드')
  const [shippingRequest, setShippingRequest] = useState('')
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)

  useEffect(() => {
    if (checkoutItems.length === 0 && cartItems.length > 0) {
      setCheckoutItems(cartItems)
    }
  }, [checkoutItems.length, cartItems, setCheckoutItems])

  useEffect(() => {
    const defaultAddr = getDefaultAddress(addresses)
    if (defaultAddr) {
      setAddress(defaultAddr)
      if (defaultAddr.request) setShippingRequest(defaultAddr.request)
    } else if (defaultBackendAddress) {
      // 로컬 배송지 없을 때 백엔드 기본 배송지로 폴백
      setAddress({
        id: String(defaultBackendAddress.shippingId),
        name: defaultBackendAddress.receiverName,
        phone: defaultBackendAddress.receiverPhone,
        address: defaultBackendAddress.address,
        detailAddress: defaultBackendAddress.addressDetail,
        zipcode: defaultBackendAddress.zipCode,
        request: defaultBackendAddress.deliveryRequest,
        isDefault: defaultBackendAddress.isDefault,
      })
      if (defaultBackendAddress.deliveryRequest) {
        setShippingRequest(defaultBackendAddress.deliveryRequest)
      }
    }
  }, [addresses, defaultBackendAddress])

  const greetingName = user ? `${user.nickname}님` : '비회원'

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price, 0)
  const shippingFee = 3000
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const total = subtotal + shippingFee - discount

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (checkoutItems.length === 0 || !defaultBackendAddress) return

    const backendMethod = PAYMENT_METHOD_MAP[selectedMethod]
    if (!backendMethod) return

    try {
      // 1. 주문 생성
      const order = await createOrder.mutateAsync({
        orderType: 'DIRECT',
        productId: checkoutItems[0].id,
        shippingAddressId: defaultBackendAddress.shippingId,
      })

      // 2. 결제 준비
      const prepareRes = await preparePayment.mutateAsync({
        orderId: order.orderId,
        paymentMethod: backendMethod,
      })

      // 3. PortOne 결제창
      const easyPayProvider = (
        {
          KAKAO_PAY: 'KAKAOPAY',
          NAVER_PAY: 'NAVERPAY',
          TOSS_PAY: 'TOSSPAY',
        } as Record<string, string>
      )[backendMethod]

      const portoneRes = await PortOne.requestPayment({
        storeId: prepareRes.storeId,
        channelKey: prepareRes.channelKey,
        paymentId: prepareRes.idempotencyKey,
        orderName: `마이페이브 주문 ${checkoutItems.length}개`,
        totalAmount: prepareRes.totalPaymentPrice,
        currency: 'KRW',
        payMethod: backendMethod === 'CARD' ? 'CARD' : 'EASY_PAY',
        ...(easyPayProvider && { easyPay: { easyPayProvider } }),
        customer: {
          email: user?.email || 'buyer@myfave.com',
          fullName: user?.nickname || '구매자',
        },
      })

      if (!portoneRes || portoneRes.code) {
        alert(`결제 실패: ${portoneRes?.message ?? '알 수 없는 오류'}`)
        return
      }

      // 4. 결제 승인 (portoneRes.paymentId === prepareRes.idempotencyKey)
      await confirmPayment.mutateAsync({
        paymentId: prepareRes.paymentId,
        pgTransactionId: portoneRes.paymentId,
      })

      clearCart()
      applyCoupon(null)
      navigate('/order-success')
    } catch (err) {
      console.error('결제 오류:', err)
      const axiosErr = err as { response?: { data?: { message?: string; code?: number } }; message?: string }
      const msg = axiosErr.response?.data?.message ?? axiosErr.message ?? '알 수 없는 오류'
      alert(`결제 오류: ${msg}`)
    }
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-40 overflow-y-auto pt-8">
      <div className="px-[19.99px] pt-[17.01px] pb-[8px]">
        <h1 className="font-noto text-[15px] font-medium leading-[22px] text-[#322927]">{greetingName}</h1>
      </div>

      <div className="px-[19.99px]">
        <section className="mt-[16px] space-y-[12px]">
          <div className="flex items-center justify-between">
            <h2 className="font-noto text-[15px] font-bold text-[#322927]">배송지 정보</h2>
            {address && (
              <div className="flex gap-[6px] items-center">
                <div className="h-[20px] rounded-[5px] bg-[#EFE9E0] px-[8px] flex items-center justify-center">
                  <span className="font-noto text-[10px] font-medium text-[#949494] leading-none">기본 배송지</span>
                </div>
                <button
                  onClick={() => navigate('/shipping-addresses')}
                  className="h-[20px] rounded-[5px] bg-[#EFE9E0] px-[8px] flex items-center justify-center active:opacity-70 transition-opacity"
                >
                  <span className="font-noto text-[10px] font-medium text-[#949494] leading-none">배송지 변경</span>
                </button>
                <button
                  onClick={() => {
                    setAddress(null)
                    setShippingRequest('')
                  }}
                  className="ml-1 p-1 text-[#949494] hover:text-red-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {address ? (
            <div className="rounded-[12px] border-[1.096px] border-[#F2EDEB] bg-white p-[20px] space-y-[10px] shadow-sm">
              <div className="space-y-[8px]">
                <p className="font-noto text-[13px] font-bold text-[#322927]">{address.name}</p>
                <p className="font-noto text-[12px] font-normal leading-[18.2px] text-[#322927]">
                  {address.address}
                  <br />
                  {address.detailAddress}
                </p>
                <p className="font-noto text-[12px] font-normal text-[#322927]">{address.phone}</p>
              </div>

              <div className="relative pt-[2px]">
                <button
                  onClick={() => setIsRequestOpen(!isRequestOpen)}
                  className="w-full h-[35px] flex items-center justify-between rounded-[5px] border border-[#F2EDEB] px-[12px] bg-white text-left transition-colors hover:border-point/30"
                >
                  <span className={`font-noto text-[12px] ${shippingRequest ? 'text-[#322927]' : 'text-[#949494]'}`}>
                    {shippingRequest || '배송 요청사항을 선택해주세요'}
                  </span>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`text-[#949494] transition-transform ${isRequestOpen ? 'rotate-180' : ''}`}>
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
              onClick={() => navigate('/add-shipping?from=/payment')}
              className="w-full h-[32px] rounded-[12px] bg-point font-noto text-[12px] font-bold text-white shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              배송지 등록하기
            </button>
          )}
        </section>

        <section className="mt-[28px] space-y-[16px]">
          <h2 className="font-noto text-[15px] font-bold text-[#322927]">쿠폰 사용</h2>
          <button
            onClick={() => navigate('/coupons')}
            className="w-full h-[32px] rounded-[12px] bg-point font-noto text-[12px] font-bold text-white shadow-md active:scale-[0.99] transition-all"
          >
            {appliedCoupon ? `적용됨: ${appliedCoupon.benefit}` : '쿠폰 사용'}
          </button>
        </section>

        <section className="mt-[32px] space-y-[16px]">
          <h2 className="font-noto text-[15px] font-bold text-[#322927]">주문 상품 {checkoutItems.length}개</h2>
          <div className="space-y-[12px]">
            {checkoutItems.map((item) => (
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

        <section className="mt-[32px] space-y-[16px]">
          <h2 className="font-noto text-[15px] font-bold text-[#322927]">결제 수단</h2>
          <div className="grid grid-cols-2 gap-[11px]">
            {['카드', '카카오페이', '네이버페이', '토스페이'].map((label) => (
              <button key={label} onClick={() => setSelectedMethod(label)} className={`h-[42px] rounded-[5px] border font-noto text-[16px] font-medium transition-all ${selectedMethod === label ? 'border-point bg-main-bg text-point' : 'border-[#F2EDEB] bg-[#FAFAF8] text-[#949494]'}`}>{label}</button>
            ))}
          </div>
        </section>

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

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[376.04px] -translate-x-1/2 bg-white p-[19.99px] border-t border-[#F2EDEB] shadow-figma-popup">
        <button
          onClick={handlePayment}
          disabled={checkoutItems.length === 0 || !defaultBackendAddress || createOrder.isPending || preparePayment.isPending || confirmPayment.isPending}
          className="w-full h-[56px] rounded-[12px] bg-point flex flex-col items-center justify-center shadow-lg active:scale-[0.98] transition-all disabled:bg-gray-300"
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
