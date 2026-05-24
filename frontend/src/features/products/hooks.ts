import { useQuery } from '@tanstack/react-query'

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

// DAON'S PICK: 픽1~4.mp4 영상 순서와 매칭되는 상품 id (고정)
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

function toProduct(item: ProductApiItem): Product {
  return {
    id: item.id,
    title: item.productName,
    image: getProductThumbnail(item.id),
    price: item.price.toLocaleString() + '원',
    category: mapCategory(item.categoryCode),
    isSoldOut: item.isSoldOut,
  }
}

function toInfluencerPick(item: ProductApiItem): InfluencerPick {
  return { ...toProduct(item), rating: '5.0' }
}

function toProductDetail(item: ProductDetailApiResponse): ProductDetail {
  return {
    id: item.id,
    title: item.productName,
    subtitle: item.shortReview ?? '',
    price: item.price.toLocaleString() + '원',
    priceNumber: item.price,
    images: getProductImages(item.id),
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
