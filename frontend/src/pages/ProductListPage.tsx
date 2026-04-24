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
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/0cb74938aec2fd4b9e8d4455dc9d134d12a15a28?width=750',
    price: '32,000원',
  },
  {
    id: 2,
    title: '플로럴 블라썸 원피스',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356?width=168',
    price: '89,000원',
  },
  {
    id: 3,
    title: '코튼 캐주얼 티셔츠',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521?width=168',
    price: '45,000원',
  },
  {
    id: 4,
    title: '프리미엄 니트 카디건',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd?width=324',
    price: '125,000원',
  },
  {
    id: 5,
    title: '미니 에코백',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4?width=512',
    price: '55,000원',
  },
  {
    id: 6,
    title: '스니커즈 화이트',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd?width=324',
    price: '98,000원',
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
      {/* Category tabs */}
      <div className="sticky top-[86px] z-30 border-b border-separator bg-white">
        <div className="mx-auto max-w-md overflow-x-auto px-5">
          <div className="flex gap-6 whitespace-nowrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`relative py-4 font-noto text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'text-dark-text'
                    : 'text-muted-text hover:text-dark-text/70'
                }`}
              >
                {cat.label}
                {selectedCategory === cat.value && (
                  <div className="absolute bottom-0 left-0 h-[2px] w-full bg-dark-text" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product count */}
      <div className="mx-auto max-w-md border-b border-separator bg-white px-5 py-3.5">
        <p className="font-noto text-[13px] font-medium text-dark-text">
          상품 <span className="font-bold text-point">{PRODUCTS.length}</span>개
        </p>
      </div>

      {/* Products grid */}
      <div className="bg-[#FFF9F0] px-5 py-8">
        <div className="mx-auto max-w-md">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group flex flex-col"
              >
                <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-sm">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-0.5">
                  <h3 className="mb-1 min-h-[36px] font-noto text-[12px] font-bold text-dark-text line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <p className="font-noto text-sm font-black text-point">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
