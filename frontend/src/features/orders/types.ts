export type OrderActionLabel = '배송 조회' | '구매 확정'

export type OrderStatus = '입금확인' | '배송준비' | '배송중' | '배송완료'

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
