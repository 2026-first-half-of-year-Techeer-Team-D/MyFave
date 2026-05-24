export interface SaleEventCreateRequest {
  eventName: string
  saleStartAt: string // ISO 8601 with offset: "2026-05-24T21:50:00+09:00"
  saleEndAt: string
}

export interface SaleEventCreateResponse {
  saleId: number
  eventName: string
  saleStartAt: string
  saleEndAt: string
}

export interface SaleEventCurrentResponse {
  id: number
  eventName: string
  saleStartAt: string
  saleEndAt: string
  isLive: boolean
  serverTime: string
}
