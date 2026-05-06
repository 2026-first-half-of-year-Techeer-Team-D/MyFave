import { useShippingStore } from '@/features/shipping/store'
import { useOrderStore } from '@/features/orders/store'

export const initDemoData = () => {
  // 1. 배송지 데이터 시딩
  const shippingStore = useShippingStore.getState()
  if (shippingStore.addresses.length === 0) {
    shippingStore.addAddress({
      id: 'demo-1',
      name: '성수동 자취방',
      phone: '010-1234-5678',
      address: '서울 성동구 아차산로 123',
      detailAddress: '4층 402호',
      zipcode: '04789',
      isDefault: true,
    })
  }

  // 2. 주문 내역 데이터 시딩 (4월 내역 제외)
  const orderStore = useOrderStore.getState()
  if (orderStore.orders.length === 0) {
    // 5월 1일 내역만 유지 (기존에 4월 내역이 있었다면 이 시점에서 필터링하거나 추가하지 않음)
    orderStore.addOrder({
      id: 'ORDER-20240501-12345',
      date: '2024-05-01',
      items: [
        {
          id: '5',
          name: '프리미엄 니트 카디건',
          price: '125,000원',
          image: 'https://pureda.co.kr/web/product/medium/202604/5c2eda4c2ad4a6511201b63c638e73c9.webp',
          actionLabel: '배송 조회',
        },
      ],
    })
  }
}
