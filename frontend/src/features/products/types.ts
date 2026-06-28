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
  // 조회수 (DB 확정값). 조회 시 view 호출 응답으로 최신값 갱신
  viewCount: number
  // 좋아요 수
  likeCount: number
  // 현재 로그인 유저가 좋아요 눌렀는지 (비로그인=false)
  liked: boolean
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
  viewCount: number
  likeCount: number
  liked: boolean
}

// 조회수 증가 응답 — DB 확정값 + Redis 미반영분 합산한 최신 총합
export interface ProductViewApiResponse {
  productId: number
  viewCount: number
}

// 좋아요 토글 응답 — 현재 유저 좋아요 상태 + 총 좋아요 수
export interface ProductLikeApiResponse {
  productId: number
  liked: boolean
  likeCount: number
}

export interface ProductListApiResponse {
  content: ProductApiItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
