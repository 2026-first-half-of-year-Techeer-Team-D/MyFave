import { INFLUENCER_PICKS, PRODUCTS, PRODUCT_DETAILS } from './mock'

export function useProducts() {
  return { data: PRODUCTS, isLoading: false }
}

export function useInfluencerPicks() {
  return { data: INFLUENCER_PICKS, isLoading: false }
}

export function useProduct(id: number | undefined) {
  const data = id != null ? PRODUCT_DETAILS[id] : undefined
  return { data, isLoading: false, isError: id != null && !data }
}
