import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Product {
  id: number
  title: string
  image: string
  price: string
}

// TODO: React Query로 대체 - 상품 목록 API 연동
const PRODUCTS: Product[] = [
  {
    id: 1,
    title: '[단품] 윙크 립 쉐이드 프라이머 15종 택 1',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    price: '16,000원',
  },
  {
    id: 2,
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
    price: '32,000원',
  },
  {
    id: 3,
    title: '플로럴 블라썸 원피스',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
    price: '89,000원',
  },
  {
    id: 4,
    title: '코튼 캐주얼 티셔츠',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521',
    price: '45,000원',
  },
  {
    id: 5,
    title: '프리미엄 니트 카디건',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    price: '125,000원',
  },
  {
    id: 6,
    title: '미니 에코백',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4',
    price: '55,000원',
  },
]

const CATEGORIES = [
  { label: '전체', value: 'all' },
  { label: '상의', value: 'top' },
  { label: '하의', value: 'bottom' },
  { label: '아우터', value: 'outer' },
  { label: '악세사리', value: 'accessory' },
]

export function ProductListPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="flex-1 bg-white">
      {/* 1. Category tabs - 상단 네비게이션바 바로 아래 고정 (top-0) */}
      <div className="sticky top-0 z-30 h-[44.18px] border-b-[1.096px] border-separator bg-white">
        <div className="mx-auto max-w-[376.04px] px-[19.99px] h-full flex items-center">
          <div className="flex gap-[16px] whitespace-nowrap overflow-x-auto scrollbar-hide h-full items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`h-full font-noto text-[12px] font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'text-dark-text border-b-[1.096px] border-dark-text'
                    : 'text-muted-text hover:text-dark-text/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Product count - 카테고리 탭 바로 아래 위치 (간격 축소) */}
      <div className="mx-auto max-w-[376.04px] bg-white h-[40px] px-[19.99px] flex items-center">
        <p className="font-noto text-[12px] font-normal text-dark-text">
          상품 <span className="font-medium text-black">{PRODUCTS.length}</span>개
        </p>
      </div>

      {/* 3. Products grid - 하단 상품 카드 리스트 (각진 모서리 반영) */}
      <div className="mx-auto max-w-[376.04px] px-[21.32px] pt-[12px] pb-[32px] bg-white">
        <div className="grid grid-cols-2 gap-x-[11.36px] gap-y-[21px]">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col w-full"
            >
              {/* Product Image - 각진 모서리(rounded-none) */}
              <div className="relative mb-[9px] h-[200px] overflow-hidden bg-gray-50 border border-separator/10">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Product Info */}
              <div className="px-[1.98px] flex flex-col gap-[3.99px]">
                <h3 className="min-h-[40px] font-noto text-[12px] font-normal leading-[20px] text-dark-text line-clamp-2 tracking-tight">
                  {product.title}
                </h3>
                <p className="font-noto text-[14px] font-bold text-black leading-[18px]">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
