export interface ProductFeature {
  title: string
  description: string
}

export interface Product {
  id: number
  title: string
  image: string
  price: string
}

export interface ProductDetail {
  id: number
  title: string
  subtitle: string
  price: string
  priceNumber: number
  images: string[]
  features: ProductFeature[]
}

export type CategoryCode = 'all' | 'fashion' | 'beauty' | 'living' | 'food' | 'etc'
