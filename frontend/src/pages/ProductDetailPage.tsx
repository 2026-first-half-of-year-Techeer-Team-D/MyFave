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

const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  1: {
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    subtitle: '"상세페이지 발색, 왜 나만 안 나올까?" 립 모델인 제가 직접 개발한 이유',
    price: '32,000원',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    ],
    features: [
      {
        title: "1. 텁텁함 없는 '맑은 커버'",
        description: "쿠션으로 가리면 금방 탁해지고 뭉치죠? 얇고 투명하게 밀착되어 입술의 보라끼와 칙칙함만 싹 걷어냅니다.",
      },
      {
        title: "2. 어떤 립도 착- 붙는 '자석 밀착'",
        description: "요플레 현상, 주름 끼임은 이제 끝. 다음에 바를 립의 컬러를 수채화처럼 맑게 살려주는 완벽한 도화지가 됩니다.",
      },
      {
        title: "3. 자연스러운 '필러 오버립'",
        description: "입술 경계를 매끈하게 지워 영역 확장이 쉬워요. 옹졸해 보이던 입술을 볼륨감 있게 연출하는 치트키입니다.",
      },
    ],
  },
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [isShippingOpen, setIsShippingOpen] = useState(false)
  const [isRefundOpen, setIsRefundOpen] = useState(false)

  // TODO: React Query로 대체 - 상품 상세 API 연동
  const product = PRODUCT_DETAILS[Number(id)] || PRODUCT_DETAILS[1]

  return (
    <div className="flex-1 bg-white pb-24 min-h-0">
      {/* 0. Product Image - Figma layout_RWO9VH (h:455px) */}
      <div className="w-full h-[455px] bg-[#F8F8F8] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 1. Product Info - Figma Node 37:3931 기반 */}
      <div className="px-[19.99px] pt-[16px] pb-[32px]">
        <div className="space-y-[12px]">
          <h1 className="font-noto text-[15px] font-normal leading-[24px] text-[#322927] tracking-tight">
            {product.title}
          </h1>
          <p className="font-noto text-[12px] font-normal leading-[18px] text-chat-font">
            {product.subtitle}
          </p>
          <div className="pt-[4px]">
            <span className="font-noto text-[20px] font-medium leading-[30px] text-[#322927]">
              {product.price}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Divider - Figma Node 37:3939 (h:8px) */}
      <div className="h-[8px] w-full bg-separator" />

      {/* 3. Product Description Header - Centered with Border (Figma layout_3VDCXG) */}
      <div className="h-[49.1px] flex items-center justify-center border-b-[1.096px] border-separator bg-white">
        <h2 className="font-noto text-[13px] font-bold text-[#322927] tracking-tight">상품 설명</h2>
      </div>

      {/* 4. Features Section - Figma Node 37:3940 명세 100% 동기화 */}
      <div className="px-[19.99px] pt-[23.99px] pb-[40px] space-y-[15.99px]">
        {product.features.map((feature, idx) => (
          <div key={idx} className="rounded-[12px] bg-footer-bg p-[19.99px] space-y-[4px]">
            <h3 className="font-noto text-[13px] font-medium leading-[24px] text-[#322927]">
              {feature.title}
            </h3>
            <p className="font-noto text-[13px] font-normal leading-[24px] text-[#322927] opacity-90">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* 5. Divider - Figma Node 37:3953 (h:8px) */}
      <div className="h-[8px] w-full bg-separator" />

      {/* 6. Informational Accordions - Figma Node 251:2832 기반 */}
      <div className="border-b border-separator/50">
        <button 
          onClick={() => setIsShippingOpen(!isShippingOpen)}
          className="flex w-full items-center justify-between px-[19.99px] py-[16px] border-b border-separator/30 active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[14px] font-medium text-[#322927]">배송정보</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className={`text-[#8B7E74] transition-transform ${isShippingOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {isShippingOpen && (
          <div className="bg-footer-bg px-[22px] py-[16px]">
            <p className="font-noto text-[10px] font-normal leading-[24px] text-[#000000] opacity-70 whitespace-pre-line">
              - 모든 제품은 마이 페이브의 배송비 정책을 원칙으로 합니다.{"\n"}
              - 제품 발송은 별도 배송 정보를 기준으로 구매일로부터 순차 출고됩니다.{"\n"}
              - 출고 된 제품은 배송완료까지 약 1-2 영업일이 소요되며 제주도를 포함한 도서산간 지역은 추가배송비가 발생될 수 있습니다.
            </p>
          </div>
        )}

        <button 
          onClick={() => setIsRefundOpen(!isRefundOpen)}
          className="flex w-full items-center justify-between px-[19.99px] py-[16px] border-b border-separator/30 active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[14px] font-medium text-[#322927]">교환 및 환불안내</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className={`text-[#8B7E74] transition-transform ${isRefundOpen ? 'rotate-180' : ''}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {isRefundOpen && (
          <div className="bg-footer-bg px-[22px] py-[16px]">
            <p className="font-noto text-[10px] font-normal leading-[24px] text-[#000000] opacity-70">
              - 중고 의류 특성상 교환 및 환불은 불가한점 양해 부탁드립니다.
            </p>
          </div>
        )}
      </div>

      {/* 7. Action Bar (Fixed Bottom) - Figma Node 140:206 명세 100% 동기화 */}
      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[376.04px] -translate-x-1/2 border-t border-separator bg-white shadow-figma-popup">
        {/* 장바구니 버튼 - Figma Frame 60 기반 */}
        <button
          type="button"
          className="flex-1 flex h-[49.15px] items-center justify-center gap-[8px] bg-white text-[#322927] border-r border-separator active:bg-gray-50 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="font-noto text-[14px] font-bold">장바구니</span>
        </button>
        
        {/* 구매하기 버튼 - Figma Frame 59 기반 */}
        <button
          type="button"
          className="flex-1 flex h-[49.15px] items-center justify-center bg-point text-white active:bg-[#ff7fa3] transition-all"
        >
          <span className="font-noto text-[14px] font-bold">구매하기</span>
        </button>
      </div>
    </div>
  )
}
