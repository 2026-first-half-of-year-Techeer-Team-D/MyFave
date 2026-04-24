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
  const discount = 3000
  const total = subtotal + shipping - discount

  return (
    <div className="flex-1 bg-white pb-10">
      {/* Title */}
      <div className="border-b border-separator px-5 py-6">
        <h1 className="font-noto text-xl font-bold text-dark-text">장바구니</h1>
      </div>

      {/* Cart items */}
      {items.length > 0 ? (
        <div className="space-y-4 px-5 py-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-separator bg-white p-4 shadow-sm"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-noto text-[13px] font-bold leading-snug text-dark-text line-clamp-2">
                    {item.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-text transition-colors hover:text-red-500"
                    aria-label="제거"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-noto text-sm font-black text-point">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center rounded-md border border-separator">
                    <button className="px-2 py-0.5 text-xs text-muted-text hover:bg-gray-50">−</button>
                    <span className="px-2 text-xs font-bold text-dark-text">1</span>
                    <button className="px-2 py-0.5 text-xs text-muted-text hover:bg-gray-50">+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-footer-bg">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-muted-text/40">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-noto text-[15px] font-medium text-muted-text">장바구니가 비어있습니다</p>
          <Link to="/shop" className="mt-6 rounded-xl border border-point px-6 py-2.5 font-noto text-sm font-bold text-point transition-all hover:bg-main-bg active:scale-95">
            인기 상품 보러가기
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-10">
          {/* Coupon Section */}
          <div className="px-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-noto text-base font-bold text-dark-text">보유 쿠폰</h2>
              <span className="font-noto text-xs font-bold text-point underline cursor-pointer">쿠폰 전체보기</span>
            </div>
            <div className="space-y-3">
              <div className="relative flex flex-col justify-center rounded-xl bg-point p-4 text-white shadow-md overflow-hidden group cursor-pointer active:scale-[0.99] transition-transform">
                <div className="absolute right-[-10px] top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white" />
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <span className="block font-lexend text-xl font-black">배송비 무료</span>
                    <span className="block font-noto text-xs opacity-90">회원가입 환영 배송비 쿠폰</span>
                  </div>
                  <div className="text-right">
                    <span className="font-noto text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">오늘 만료</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mx-5 rounded-[15px] border border-separator bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-noto text-base font-bold text-dark-text">주문 금액</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-noto text-figma-small text-muted-text font-medium tracking-tight">상품 금액</span>
                <span className="font-noto text-figma-small text-dark-text font-bold">
                  {subtotal.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-noto text-figma-small text-muted-text font-medium tracking-tight">배송비</span>
                <span className="font-noto text-figma-small text-dark-text font-bold">
                  +{shipping.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-noto text-figma-small text-muted-text font-medium tracking-tight">할인 금액</span>
                <span className="font-noto text-figma-small text-point font-bold">
                  -{discount.toLocaleString()}원
                </span>
              </div>
              <div className="pt-4 border-t border-separator mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-noto text-base font-bold text-dark-text">총 결제 금액</span>
                  <span className="font-noto text-xl font-black text-point">
                    {total.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout button */}
          <div className="px-5">
            <Link
              to="/payment"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-point py-4 shadow-lg shadow-point/30 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
            >
              <span className="font-lexend text-base font-bold text-white/50 border-r border-white/30 pr-3">
                {total.toLocaleString()}원
              </span>
              <span className="font-noto text-base font-black text-white">
                결제하기
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
