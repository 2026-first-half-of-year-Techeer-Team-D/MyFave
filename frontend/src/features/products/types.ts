export type ProductCategory = 'top' | 'bottom' | 'outer' | 'accessory'

export interface ProductFeature {
  title: string
  description: string
}

export interface Product {
  id: number
  title: string
  image: string
  price: string
  category: ProductCategory
  isSoldOut?: boolean
}

export interface ProductDetail {
  id: number
  title: string
  subtitle: string
  price: string
  priceNumber: number
  images: string[]
  features: ProductFeature[]
  isSoldOut: boolean
  // 상품 상태 등급 라벨 (예: 'S급'). 백엔드 condition(S_GRADE 등)을 변환한 값. 없으면 빈 문자열.
  conditionLabel: string
}

export interface InfluencerPick extends Product {
  rating: string
}

// API 응답 타입
export interface ProductApiItem {
  id: number
  productName: string
  price: number
  thumbnailUrl: string | null
  isSoldOut: boolean
  categoryCode: string | null
}

export interface ProductDetailApiResponse {
  id: number
  productName: string
  shortReview: string | null
  price: number
  description: string | null
  size: string | null
  condition: string
  categoryCode: string
  isSoldOut: boolean
  images: { imageId: number; imageUrl: string; sortOrder: number; isMain: boolean }[]
  createdAt: string
}

export interface ProductListApiResponse {
  content: ProductApiItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
