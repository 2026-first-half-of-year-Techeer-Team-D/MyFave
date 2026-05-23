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

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await productsApi.getList()
      return data.content.map(toProduct)
    },
  })
}

export function useInfluencerPicks() {
  return useQuery({
    queryKey: ['products', 'influencer'],
    queryFn: async () => {
      const data = await productsApi.getList(0, 4)
      return data.content.map(toInfluencerPick)
    },
  })
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getDetail(id!).then(toProductDetail),
    enabled: id != null,
  })
}
