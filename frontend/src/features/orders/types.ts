// ── 프론트엔드 로컬 타입 (OrderSuccessPage 표시용) ──────────────────
export type OrderActionLabel = '배송 조회' | '구매 확정'

export interface OrderItem {
  id: string
  name: string
  price: string
  image: string
  actionLabel: OrderActionLabel
}

export interface OrderPaymentInfo {
  productAmount: string
  discountAmount: string
  shippingFee: string
  totalAmount: string
  paymentMethod: string
}

export interface OrderShippingInfo {
  recipientName: string
  phone: string
  address: string
  detailAddress?: string
  request?: string
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  paymentInfo?: OrderPaymentInfo
  shipping?: OrderShippingInfo
}

// ── 백엔드 API 응답 타입 ─────────────────────────────────────────────
export type BackendOrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPING'
  | 'DELIVERY_COMPLETED'
  | 'PURCHASE_CONFIRMED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface OrderItemApiResponse {
  productId: number
  productName: string
  price: number
  thumbnailUrl: string | null
}

export interface OrderSummaryApiResponse {
  orderId: number
  orderNumber: string
  orderStatus: BackendOrderStatus
  totalPaymentPrice: number
  createdAt: string
  orderItems: OrderItemApiResponse[]
}

export interface OrderDetailApiResponse {
  orderId: number
  orderNumber: string
  orderStatus: BackendOrderStatus
  createdAt: string
  updatedAt: string
  totalProductPrice: number | null
  deliveryFee: number | null
  discountPrice: number | null
  totalPaymentPrice: number | null
  paymentMethod: string | null
  receiverName: string | null
  receiverPhone: string | null
  receiverAddress: string | null
  deliveryRequest: string | null
  trackingNumber: string | null
  courierName: string | null
  orderItems: OrderItemApiResponse[]
}

export interface OrderListApiResponse {
  content: OrderSummaryApiResponse[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
