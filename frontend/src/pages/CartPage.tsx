import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface CartItem {
  id: number
  title: string
  image: string
  price: number
}

const INITIAL_CART_ITEMS: CartItem[] = [
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

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS)
  const navigate = useNavigate()

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const shipping = 3000
  const total = subtotal + shipping

  return (
    <div className="flex-1 bg-white min-h-0 pb-32">
      {/* 2. Cart Items Container - Figma Node 37:4145 (gap: 11.99px) */}
      <div className="px-[19.99px] pt-8 space-y-[11.99px]">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex w-full min-h-[114.19px] gap-[11.99px] rounded-[12px] border-[1.096px] border-separator bg-white p-[15.99px]"
          >
            {/* Item Image - Figma Node 99:1052 (84x84, rounded 15px) */}
            <div className="h-[84px] w-[84px] flex-shrink-0 overflow-hidden rounded-[15px]">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Item Info */}
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <h3 className="font-noto text-[11px] font-bold leading-[15.13px] text-[#322927]">
                  {item.title}
                </h3>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-[#8B7E74] hover:text-red-500 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-end items-center">
                <span className="font-noto text-[16px] font-bold leading-[24px] text-[#CF879B]">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Order Summary - 할인 항목 제거 */}
      <div className="mt-[22px] px-[19.99px]">
        <div className="rounded-[12px] bg-white p-[21.08px] space-y-[13.99px] border border-separator/30 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="font-noto text-[14px] font-normal text-[#322927]">상품 금액</span>
            <span className="font-noto text-[14px] font-medium text-[#322927]">{subtotal.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-noto text-[14px] font-normal text-[#322927]">배송비</span>
            <span className="font-noto text-[14px] font-medium text-[#322927]">+{shipping.toLocaleString()}원</span>
          </div>
          <div className="pt-[12px] border-t border-separator/30">
            <div className="flex justify-between items-center">
              <span className="font-noto text-[18px] font-bold text-[#322927]">총 결제 예정 금액</span>
              <span className="font-noto text-[18px] font-bold text-point">{total.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Checkout Button */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[376.04px] -translate-x-1/2 bg-white p-[19.99px] border-t border-separator shadow-figma-popup">
        <button
          type="button"
          onClick={() => navigate('/payment')}
          className="flex h-[51.99px] w-full items-center justify-center rounded-[8px] bg-point font-noto text-[16px] font-bold text-white shadow-lg shadow-point/20 active:scale-[0.98] transition-all"
        >
          결제하기
        </button>
      </div>
    </div>
  )
}
