import { useMutation, useQuery } from '@tanstack/react-query'

import { productsApi } from './api'
import { getProductImages, getProductThumbnail } from './imageMap'
import type {
  InfluencerPick,
  Product,
  ProductApiItem,
  ProductCategory,
  ProductDetail,
  ProductDetailApiResponse,
} from './types'

// MY PICK: 픽1~4.png 순서와 매칭되는 상품 id (고정)
// 1) 원오프 넘버링 티셔츠, 2) 브라운 무스탕 자켓, 3) 스트라이프 카디건, 4) 플라워 롱스커트
const INFLUENCER_PICK_IDS = [1, 7, 2, 9] as const

function mapCategory(code: string | null | undefined): ProductCategory {
  switch (code?.toUpperCase()) {
    case 'BOTTOM': return 'bottom'
    case 'OUTER': return 'outer'
    case 'ACCESSORY': return 'accessory'
    default: return 'top'
  }
}

// 백엔드 condition enum(S_GRADE/A_GRADE/B_GRADE/C_GRADE) → 화면 표기 라벨(S급 등).
// 매핑되지 않는 값은 빈 문자열을 반환해 뱃지를 숨긴다.
const CONDITION_LABEL_MAP: Record<string, string> = {
  S_GRADE: 'S급',
  A_GRADE: 'A급',
  B_GRADE: 'B급',
  C_GRADE: 'C급',
}

function mapConditionLabel(condition: string | null | undefined): string {
  return CONDITION_LABEL_MAP[condition?.toUpperCase() ?? ''] ?? ''
}

function toProduct(item: ProductApiItem): Product {
  // 로컬 imageMap(.jpg) 우선 — 큐레이션된 S3 URL 보장.
  // 매핑 없는 신상품은 백엔드 thumbnailUrl 로 fallback (없으면 빈 문자열 → alt 노출).
  const image = getProductThumbnail(item.id) || item.thumbnailUrl || ''
  return {
    id: item.id,
    title: item.productName,
    image,
    price: item.price.toLocaleString() + '원',
    category: mapCategory(item.categoryCode),
    isSoldOut: item.isSoldOut,
  }
}

function toInfluencerPick(item: ProductApiItem): InfluencerPick {
  return { ...toProduct(item), rating: '5.0' }
}

function toProductDetail(item: ProductDetailApiResponse): ProductDetail {
  // 로컬 imageMap 우선 — .jpg + .heic 2장 큐레이션.
  // 매핑 없는 신상품은 백엔드 images[] (isMain → sortOrder → 원순서) 정렬해서 fallback.
  const localImages = getProductImages(item.id)
  let images: string[] = localImages
  if (localImages.length === 0 && item.images.length > 0) {
    images = [...item.images]
      .sort((a, b) => {
        if (a.isMain !== b.isMain) return a.isMain ? -1 : 1
        return a.sortOrder - b.sortOrder
      })
      .map((i) => i.imageUrl)
      .filter((url) => !!url)
  }
  return {
    id: item.id,
    title: item.productName,
    subtitle: item.shortReview ?? '',
    price: item.price.toLocaleString() + '원',
    priceNumber: item.price,
    images,
    isSoldOut: item.isSoldOut,
    conditionLabel: mapConditionLabel(item.condition),
    viewCount: item.viewCount ?? 0,
    features: item.description
      ? [{ title: '상품 설명', description: item.description }]
      : [],
  }
}

// useProducts / useInfluencerPicks 가 동일한 상품 리스트를 다른 형태로 가공하므로
// queryKey/queryFn 을 통일하고 select 로 변환만 분리한다 (캐시 1회 공유).
function useProductList<T>(select: (items: ProductApiItem[]) => T) {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await productsApi.getList(0, 50)
      return data.content
    },
    select,
  })
}

export function useProducts() {
  return useProductList((items) => items.map(toProduct))
}

export function useInfluencerPicks() {
  return useProductList((items) => {
    const byId = new Map(items.map((item) => [item.id, item]))
    return INFLUENCER_PICK_IDS
      .map((id) => byId.get(id))
      .filter((item): item is ProductApiItem => item != null)
      .map(toInfluencerPick)
  })
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getDetail(id!).then(toProductDetail),
    enabled: id != null,
  })
}

// 상품 조회 시 조회수 +1 (Redis 누적) — 응답으로 최신 총합을 받음
export function useIncreaseProductView() {
  return useMutation({
    mutationFn: (id: number) => productsApi.increaseView(id),
  })
}
