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
    <div className="flex-1">
      {/* Image carousel */}
      <div className="relative bg-[#F8F8F8]">
        <div className="mx-auto aspect-[32/39] max-w-md overflow-hidden">
          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Image dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-2 rounded-full transition-colors ${
                idx === currentImageIndex ? 'w-6 bg-[#FF9E8D]' : 'w-2 bg-white/60'
              }`}
              aria-label={`이미지 ${idx + 1}`}
            />
          ))}
        </div>

        {/* Image counter */}
        <div className="absolute bottom-6 right-2 rounded-2xl bg-black/50 px-2 py-1">
          <span className="font-noto text-[9px] text-white">
            {currentImageIndex + 1} / {product.images.length}
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className="border-b border-[#F2EDEB] px-5 py-4">
        <h1 className="mb-3 font-noto text-[15px] font-normal text-[#322927]">{product.title}</h1>
        <p className="mb-3 font-noto text-xs text-[#CF879B]">{product.subtitle}</p>
        <p className="font-noto text-lg font-bold text-[#322927]">{product.price}</p>
      </div>

      {/* Options Section */}
      <div className="border-b border-[#F2EDEB] px-5 py-5">
        {/* Option Select */}
        <div className="mb-5">
          <label className="mb-3 block font-noto text-sm font-medium text-[#322927]">
            상품 선택
          </label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full rounded-lg border border-[#D9D9D9] bg-white px-4 py-3 font-noto text-sm text-[#322927] focus:border-point focus:outline-none"
          >
            <option value="option1">상품 옵션 선택</option>
            <option value="option2">색상: 핑크</option>
            <option value="option3">색상: 빨강</option>
            <option value="option4">색상: 주황</option>
          </select>
        </div>

        {/* Quantity Select */}
        <div>
          <label className="mb-3 block font-noto text-sm font-medium text-[#322927]">수량</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white font-noto font-bold text-[#322927] hover:bg-[#F2EDEB]"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 rounded-lg border border-[#D9D9D9] bg-white px-4 py-2 text-center font-noto text-sm text-[#322927] focus:border-point focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white font-noto font-bold text-[#322927] hover:bg-[#F2EDEB]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 py-4">
        <div className="space-y-3">
          {product.features.map((feature, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl bg-[#FAFAF8]">
              <button
                type="button"
                onClick={() => setExpandedFeature(expandedFeature === idx ? null : idx)}
                className="w-full px-5 py-4 text-left"
              >
                <h3 className="font-noto text-sm font-medium text-[#322927]">{feature.title}</h3>
              </button>
              {expandedFeature === idx && (
                <div className="border-t border-[#F2EDEB] px-5 py-3">
                  <p className="font-noto text-xs leading-relaxed text-[#322927]">
                    {feature.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-2 bg-[#F2EDEB]" />

      {/* Expandable sections */}
      <div className="space-y-2 px-5 py-4">
        <ExpandableSection title="배송정보" />
        <ExpandableSection title="교환 및 환불안내" />
      </div>

      {/* Action buttons */}
      <div className="sticky bottom-0 flex gap-3 border-t border-[#F2EDEB] bg-white px-5 py-4 shadow-lg">
        <button
          type="button"
          className="flex-1 rounded-2xl border-2 border-[#D9D9D9] bg-white py-3 font-noto font-bold text-[#322927]"
        >
          장바구니
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl bg-[#FF95B3] py-3 font-noto font-bold text-white hover:bg-[#ff7fa3]"
        >
          구매하기
        </button>
      </div>
    </div>
  )
}
