import { useShippingStore } from '@/features/shipping/store'
import { useOrderStore } from '@/features/orders/store'

export const initDemoData = () => {
  // 1. 배송지 데이터 시딩
  const shippingStore = useShippingStore.getState()
  if (shippingStore.addresses.length === 0) {
    shippingStore.addAddress({
      id: 'demo-1',
      name: '성수동 자취방',
      recipient: '성진우',
      phone: '010-1234-5678',
      baseAddress: '서울 성동구 아차산로 123',
      detailAddress: '4층 402호',
      zipCode: '04789',
      isDefault: true,
    })
  }

  // 2. 주문 내역 데이터 시딩
  const orderStore = useOrderStore.getState()
  if (orderStore.orders.length === 0) {
    orderStore.addOrder({
      id: 'ORDER-20240501-12345',
      date: '2024-05-01',
      status: '배송 완료',
      totalPrice: '125,000원',
      items: [
        {
          id: 5,
          title: '프리미엄 니트 카디건',
          price: '125,000원',
          quantity: 1,
          image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
        },
      ],
    })
  }
}
