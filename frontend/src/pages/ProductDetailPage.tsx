import { useState } from 'react'
import { useParams } from 'react-router-dom'

interface ProductFeature {
  title: string
  description: string
}

interface ProductDetail {
  title: string
  subtitle: string
  price: string
  images: string[]
  features: ProductFeature[]
}

// TODO: React Query로 대체 - 상품 상세 API 연동
const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  1: {
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    subtitle:
      '"상세페이지 발색, 왜 나만 안 나올까?" 립 모델인 제가 직접 개발한 이유',
    price: '32,000원',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/0cb74938aec2fd4b9e8d4455dc9d134d12a15a28?width=750',
      'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd?width=324',
    ],
    features: [
      {
        title: "1. 텁텁함 없는 '맑은 커버'",
        description:
          '쿠션으로 가리면 금방 탁해지고 뭉치죠? 얇고 투명하게 밀착되어 입술의 보라끼와 칙칙함만 싹 걷어냅니다.',
      },
      {
        title: "2. 어떤 립도 착- 붙는 '자석 밀착'",
        description:
          '요플레 현상, 주름 끼임은 이제 끝. 다음에 바를 립의 컬러를 수채화처럼 맑게 살려주는 완벽한 베이스입니다.',
      },
      {
        title: "3. 자석처럼 '빨간 오버립'",
        description:
          '입술의 경계선을 무너뜨리고 제 입술이 입을 지정하는 마치 자석처럼 받아주는 것 같은 착각이 듭니다.',
      },
    ],
  },
}

function ExpandableSection({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="flex w-full items-center justify-between border-b border-[#EFE9E0] py-3"
    >
      <span className="font-noto text-sm font-medium text-[#322927]">{title}</span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
      >
        <path
          d="M4.49658 6.745L8.99325 11.2417L13.4899 6.745"
          stroke="#8B7E74"
          strokeWidth="1.49889"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [expandedFeature, setExpandedFeature] = useState<number | null>(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOption, setSelectedOption] = useState('option1')

  // TODO: React Query로 대체 - 상품 상세 API 연동
  const product = PRODUCT_DETAILS[Number(id)] ?? PRODUCT_DETAILS[1]

  return (
    <div className="flex-1 bg-white pb-28">
      {/* Image carousel */}
      <div className="relative bg-[#FFF9F0]">
        <div className="mx-auto aspect-[1/1.2] max-w-md overflow-hidden shadow-sm">
          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Image dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? 'w-5 bg-point' : 'w-1.5 bg-white/70'
              }`}
              aria-label={`이미지 ${idx + 1}`}
            />
          ))}
        </div>

        {/* Image counter */}
        <div className="absolute bottom-8 right-5 rounded-full bg-black/40 px-2.5 py-0.5 backdrop-blur-[2px]">
          <span className="font-noto text-[10px] font-medium text-white">
            {currentImageIndex + 1} / {product.images.length}
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className="mx-auto max-w-md px-5 py-8">
        <div className="space-y-2.5">
          <h1 className="font-noto text-xl font-bold leading-tight text-dark-text">
            {product.title}
          </h1>
          <p className="font-noto text-sm font-medium text-chat-font">
            {product.subtitle}
          </p>
          <div className="pt-2">
            <span className="font-noto text-2xl font-black text-dark-text">
              {product.price}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-separator" />

        {/* Options Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block font-noto text-[13px] font-bold text-dark-text">
              상품 옵션
            </label>
            <div className="relative">
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full appearance-none rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text focus:border-point focus:outline-none"
              >
                <option value="option1">상품 옵션을 선택해주세요</option>
                <option value="option2">색상: 핑크 (재고 5개)</option>
                <option value="option3">색상: 레드 (재고 12개)</option>
                <option value="option4">색상: 오렌지 (재고 8개)</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" className="text-muted-text" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-noto text-[13px] font-bold text-dark-text">수량</label>
            <div className="flex items-center overflow-hidden rounded-lg border border-separator bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-9 w-9 items-center justify-center font-noto text-lg font-medium text-dark-text transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-9 w-12 border-x border-separator text-center font-noto text-sm font-bold text-dark-text focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-9 w-9 items-center justify-center font-noto text-lg font-medium text-dark-text transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-10 space-y-3">
          <label className="block font-noto text-[13px] font-bold text-dark-text">제품 특징</label>
          <div className="space-y-3">
            {product.features.map((feature, idx) => (
              <div key={idx} className="overflow-hidden rounded-xl bg-footer-bg">
                <button
                  type="button"
                  onClick={() => setExpandedFeature(expandedFeature === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <h3 className="font-noto text-[13px] font-bold text-dark-text">{feature.title}</h3>
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    className={`text-muted-text transition-transform duration-300 ${expandedFeature === idx ? 'rotate-180' : ''}`}
                  >
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {expandedFeature === idx && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="font-noto text-xs leading-relaxed text-dark-text/70">
                      {feature.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-footer-bg" />

      {/* Expandable sections */}
      <div className="mx-auto max-w-md divide-y divide-separator px-5">
        <ExpandableSection title="배송정보" />
        <ExpandableSection title="교환 및 환불안내" />
        <ExpandableSection title="제품 리뷰 (1,240)" />
      </div>

      {/* Action buttons (Fixed Bottom) */}
      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 gap-3 border-t-figma border-separator bg-white p-4 shadow-figma-app">
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-2xl border-figma border-separator bg-white text-dark-text transition-all hover:bg-gray-50 active:scale-95 shadow-sm"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl bg-point py-4 font-noto text-base font-black text-white shadow-lg shadow-point/30 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
        >
          구매하기
        </button>
      </div>
    </div>
  )
}
