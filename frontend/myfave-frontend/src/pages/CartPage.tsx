import { useState } from 'react'
import { Link } from 'react-router-dom'

interface CartItem {
  id: number
  title: string
  image: string
  price: number
}

// TODO: React Query로 대체 - 장바구니 API 연동
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    title: '플로럴 블라썸 원피스',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356?width=168',
    price: 89000,
  },
  {
    id: 2,
    title: '코튼 캐주얼 티셔츠',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521?width=168',
    price: 45000,
  },
]

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS)

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const shipping = 3000
  const total = subtotal + shipping

  return (
    <div className="flex-1">
      {/* Title */}
      <div className="border-b border-[#F2EDEB] px-5 py-5">
        <h1 className="font-noto text-xl font-bold text-[#322927]">장바구니</h1>
      </div>

      {/* Cart items */}
      {items.length > 0 ? (
        <div className="space-y-3 px-5 py-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 rounded-2xl border border-[#F2EDEB] bg-white p-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="mb-1 font-noto text-xs font-bold text-[#322927]">{item.title}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-noto text-sm font-bold text-[#CF879B]">
                    {item.price.toLocaleString()}원
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[#8B7E74] hover:text-red-500"
                    aria-label="제거"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 3.99988H13.9997"
                        stroke="#8B7E74"
                        strokeWidth="1.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12.6661 3.99988V13.333C12.6661 13.9996 11.9994 14.6663 11.3328 14.6663H4.66631C3.99966 14.6663 3.33301 13.9996 3.33301 13.333V3.99988"
                        stroke="#8B7E74"
                        strokeWidth="1.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.33301 3.99991V2.66661C5.33301 1.99996 5.99966 1.33331 6.66631 1.33331H9.3329C9.99955 1.33331 10.6662 1.99996 10.6662 2.66661V3.99991"
                        stroke="#8B7E74"
                        strokeWidth="1.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6.6665 7.33313V11.333"
                        stroke="#8B7E74"
                        strokeWidth="1.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.33301 7.33313V11.333"
                        stroke="#8B7E74"
                        strokeWidth="1.3333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4 opacity-50">
            <path
              d="M2 9H7L9 38C9 39.1 9.9 40 11 40H45"
              stroke="#8B7E74"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-noto text-sm text-[#8B7E74]">장바구니가 비어있습니다</p>
          <Link to="/shop" className="mt-4 font-noto text-sm text-[#FF95B3] hover:underline">
            쇼핑하러 가기
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Order summary */}
          <div className="mx-5 my-4 rounded-2xl border border-[#F2EDEB] bg-white p-5">
            <h2 className="mb-4 font-noto text-base font-bold text-[#322927]">주문 금액</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-noto text-sm text-[#8B7E74]">상품 금액</span>
                <span className="font-noto text-sm text-[#322927]">
                  {subtotal.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-noto text-sm text-[#8B7E74]">배송비</span>
                <span className="font-noto text-sm text-[#1B1B1B]">
                  {shipping.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between border-t border-[#EFE9E0] pt-3">
                <span className="font-noto text-base font-bold text-[#322927]">총 결제 금액</span>
                <span className="font-noto text-lg font-bold text-[#CF879B]">
                  {total.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* Checkout button */}
          <div className="mx-5 mb-6">
            <Link
              to="/checkout"
              className="block w-full rounded-2xl bg-[#FF95B3] py-3 text-center font-noto font-bold text-white transition-colors hover:bg-[#ff7fa3]"
            >
              결제하기
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
