import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useIsAuthenticated } from '@/features/auth/hooks'
import { useCartStore } from '@/features/cart/store'
import { useCheckoutStore } from '@/features/payments/store'
import { useProduct } from '@/features/products/hooks'
import { Modal } from '@/shared/components/Modal'
import { PopUp } from '@/shared/components/PopUp'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const productId = Number(id) || 1
  const { data: product } = useProduct(productId)
  const addCartItem = useCartStore((s) => s.addItem)
  const setCheckoutItems = useCheckoutStore((s) => s.setItems)
  const setOrderType = useCheckoutStore((s) => s.setOrderType)
  const isAuthenticated = useIsAuthenticated()
  const [isShippingOpen, setIsShippingOpen] = useState(false)
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())

  if (!product) {
    return (
      <div className="flex-1 bg-white p-8 text-center font-noto text-sm text-muted-text">
        존재하지 않는 상품입니다.
      </div>
    )
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
      return
    }

    setCheckoutItems([
      { id: product.id, title: product.title, image: product.images[0], price: product.priceNumber },
    ])
    setOrderType('DIRECT')
    navigate('/payment')
  }

  const handleAddToCart = () => {
    addCartItem({
      id: product.id,
      title: product.title,
      image: product.images[0],
      price: product.priceNumber,
    })
    setIsPopUpOpen(true)
  }

  return (
    <div className="flex-1 bg-white pb-24 min-h-0">
      <PopUp 
        isOpen={isPopUpOpen} 
        message="상품이 장바구니에 담겼습니다👏" 
        onClose={() => setIsPopUpOpen(false)} 
      />
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        buttonText="확인"
        onButtonClick={() => navigate('/login')}
      >
        회원들만 결제가 가능한 쇼핑몰입니다.<br />
        결제하시려면 회원가입 또는 로그인을 진행해주세요.
      </Modal>
      <div className="relative w-full h-[455px] bg-[#F8F8F8]">
        <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {product.images.map((img, idx) =>
            failedImages.has(idx) ? null : (
              <div key={idx} className="h-full w-full flex-shrink-0 snap-center">
                <img
                  src={img}
                  alt={`${product.title}-${idx}`}
                  className="h-full w-full object-cover"
                  onError={() => setFailedImages((prev) => new Set(prev).add(idx))}
                />
              </div>
            )
          )}
        </div>
        {product.images.filter((_, idx) => !failedImages.has(idx)).length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {product.images.filter((_, idx) => !failedImages.has(idx)).map((_, idx) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-black/20" />
            ))}
          </div>
        )}
      </div>

      <div className="px-[19.99px] pt-[16px] pb-[32px]">
        <div className="space-y-[12px]">
          <h1 className="font-noto text-[15px] font-normal leading-[24px] text-[#322927] tracking-tight">{product.title}</h1>
          <p className="font-noto text-[12px] font-normal leading-[18px] text-chat-font">{product.subtitle}</p>
          <div className="pt-[4px]">
            <span className="font-noto text-[20px] font-medium leading-[30px] text-[#322927]">{product.price}</span>
          </div>
        </div>
      </div>

      <div className="h-[8px] w-full bg-separator" />

      <div className="h-[49.1px] flex items-center justify-center border-b-[1.096px] border-separator bg-white">
        <h2 className="font-noto text-[13px] font-bold text-[#322927] tracking-tight">상품 설명</h2>
      </div>

      <div className="px-[19.99px] pt-[23.99px] pb-[40px] space-y-[15.99px]">
        {product.features.map((feature, idx) => (
          <div key={idx} className="rounded-[12px] bg-footer-bg p-[19.99px] space-y-[4px]">
            <h3 className="font-noto text-[13px] font-medium leading-[24px] text-[#322927]">{feature.title}</h3>
            <p className="font-noto text-[13px] font-normal leading-[24px] text-[#322927] opacity-90">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="h-[8px] w-full bg-separator" />

      <div className="border-b border-separator/50">
        <button onClick={() => setIsShippingOpen(!isShippingOpen)} className="flex w-full items-center justify-between px-[19.99px] py-[16px] border-b border-separator/30 active:bg-gray-50 transition-colors">
          <span className="font-noto text-[14px] font-medium text-[#322927]">배송정보</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[#8B7E74] transition-transform ${isShippingOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {isShippingOpen && (
          <div className="bg-footer-bg px-[22px] py-[16px]">
            <p className="font-noto text-[10px] font-normal leading-[24px] text-[#000000] opacity-70 whitespace-pre-line">
              - 모든 제품은 마이 페이브의 배송비 정책을 원칙으로 합니다.{"\n"}- 출고 된 제품은 배송완료까지 약 3-4 영업일이 소요됩니다.
            </p>
          </div>
        )}
        <button onClick={() => setIsRefundOpen(!isRefundOpen)} className="flex w-full items-center justify-between px-[19.99px] py-[16px] border-b border-separator/30 active:bg-gray-50 transition-colors">
          <span className="font-noto text-[14px] font-medium text-[#322927]">교환 및 환불안내</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[#8B7E74] transition-transform ${isRefundOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        {isRefundOpen && (
          <div className="bg-footer-bg px-[22px] py-[16px]">
            <p className="font-noto text-[10px] font-normal leading-[24px] text-[#000000] opacity-70">
              • 중고 의류 특성상 교환 및 환불은 불가한점 양해 부탁드립니다.
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[376.04px] -translate-x-1/2 border-t border-separator bg-white shadow-figma-popup">
        <button type="button" onClick={handleAddToCart} className="flex-1 flex h-[49.15px] items-center justify-center gap-[8px] bg-white text-[#322927] border-r border-separator active:bg-gray-50 transition-all">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          <span className="font-noto text-[14px] font-bold">장바구니</span>
        </button>
        <button type="button" onClick={handleBuyNow} className="flex-1 flex h-[49.15px] items-center justify-center bg-point text-white active:bg-[#ff7fa3] transition-all">
          <span className="font-noto text-[14px] font-bold">구매하기</span>
        </button>
      </div>
    </div>
  )
}
