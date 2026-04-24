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
    <div className="flex-1">
      {/* Category tabs */}
      <div className="border-b border-[#F2EDEB] bg-white">
        <div className="mx-auto max-w-md overflow-x-auto px-5 pb-0">
          <div className="flex gap-4 border-b-2 border-transparent">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`whitespace-nowrap px-1 py-3 font-noto text-xs font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'border-b-2 border-[#322927] text-[#322927]'
                    : 'text-[#8B7E74]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product count */}
      <div className="mx-auto max-w-md border-b border-[#F2EDEB] bg-white px-5 py-3">
        <p className="font-noto text-xs font-medium text-[#322927]">
          상품 <span className="font-bold">{PRODUCTS.length}</span>개
        </p>
      </div>

      {/* Products grid */}
      <div className="bg-[#FFF9F0] px-5 py-6">
        <div className="mx-auto max-w-md">
          <div className="grid gap-6 sm:grid-cols-2">
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group overflow-hidden rounded-lg"
              >
                <div className="relative mb-3 aspect-[167/100] overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-1 min-h-[22px] font-noto text-[11px] font-bold text-[#322927] line-clamp-2">
                  {product.title}
                </h3>
                <p className="font-noto text-xs font-bold text-[#CF879B]">{product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
