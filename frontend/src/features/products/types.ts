export interface ProductFeature {
  title: string
  description: string
}

export type ProductCategory = 'top' | 'bottom' | 'outer' | 'accessory'

export interface Product {
  id: number
  title: string
  image: string
  price: string
  category: ProductCategory
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

export interface InfluencerPick extends Product {
  rating: string
}

export type CategoryCode = 'all' | 'fashion' | 'beauty' | 'living' | 'food' | 'etc'
