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
      {/* 1. Category tabs - Figma Node 37:3365 (h:44.18px, border-b:1.096px) */}
      <div className="sticky top-[85.99px] z-30 h-[44.18px] border-b-[1.096px] border-separator bg-white">
        <div className="mx-auto max-w-[376.04px] px-[19.99px] h-full flex items-center">
          <div className="flex gap-[16px] whitespace-nowrap overflow-x-auto scrollbar-hide h-full items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`h-full font-noto text-[12px] font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'text-dark-text border-b-[1.096px] border-dark-text'
                    : 'text-muted-text'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Product count - Figma Node 37:3377 (h:52.47px) */}
      <div className="mx-auto max-w-[376.04px] bg-white h-[52.47px] px-[19.99px] flex items-center">
        <p className="font-noto text-[12px] font-normal text-dark-text">
          상품 <span className="font-medium text-point">{PRODUCTS.length}</span>개
        </p>
      </div>

      {/* 3. Products grid - Figma Node 99:615 기반 (gap:21px, width:162.03px) */}
      <div className="mx-auto max-w-[376.04px] px-[21.32px] py-[32px] bg-white">
        <div className="grid grid-cols-2 gap-x-[11.36px] gap-y-[21px]">
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col w-[162.03px]"
            >
              {/* Product Image - Figma Node 99:543 (h:200px) */}
              <div className="relative mb-[9px] h-[200px] overflow-hidden rounded-[12px] bg-gray-50 border border-separator/10">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Product Info - Figma layout_HHWRP7 기반 */}
              <div className="px-[1.98px] flex flex-col gap-[3.99px]">
                <h3 className="min-h-[40px] font-noto text-[12px] font-normal leading-[20px] text-dark-text line-clamp-2 tracking-tight">
                  {product.title}
                </h3>
                <p className="font-noto text-[14px] font-bold text-dark-text leading-[18px]">
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
