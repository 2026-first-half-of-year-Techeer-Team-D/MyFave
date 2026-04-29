import type { InfluencerPick, Product, ProductDetail } from './types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: '[단품] 윙크 립 쉐이드 프라이머 15종 택 1',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    price: '16,000원',
  },
  {
    id: 2,
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
    price: '32,000원',
  },
  {
    id: 3,
    title: '플로럴 블라썸 원피스',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
    price: '89,000원',
  },
  {
    id: 4,
    title: '코튼 캐주얼 티셔츠',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521',
    price: '45,000원',
  },
  {
    id: 5,
    title: '프리미엄 니트 카디건',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    price: '125,000원',
  },
  {
    id: 6,
    title: '미니 에코백',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4',
    price: '55,000원',
  },
]

export const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  1: {
    id: 1,
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    subtitle: '"상세페이지 발색, 왜 나만 안 나올까?" 립 모델인 제가 직접 개발한 이유',
    price: '32,000원',
    priceNumber: 32000,
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    ],
    features: [
      {
        title: "1. 텁텁함 없는 '맑은 커버'",
        description:
          '쿠션으로 가리면 금방 탁해지고 뭉치죠? 얇고 투명하게 밀착되어 입술의 보라끼와 칙칙함만 싹 걷어냅니다.',
      },
      {
        title: "2. 어떤 립도 착- 붙는 '자석 밀착'",
        description:
          '요플레 현상, 주름 끼임은 이제 끝. 다음에 바를 립의 컬러를 수채화처럼 맑게 살려주는 완벽한 도화지가 됩니다.',
      },
      {
        title: "3. 자연스러운 '필러 오버립'",
        description:
          '입술 경계를 매끈하게 지워 영역 확장이 쉬워요. 옹졸해 보이던 입술을 볼륨감 있게 연출하는 치트키입니다.',
      },
    ],
  },
}

export const INFLUENCER_PICKS: InfluencerPick[] = [
  {
    id: 1,
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd?width=324',
    price: '32,000원',
    rating: '3,283',
  },
  {
    id: 2,
    title: '플로럴 블라썸 원피스',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356?width=168',
    price: '89,000원',
    rating: '2,314',
  },
  {
    id: 3,
    title: '코튼 캐주얼 티셔츠',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521?width=168',
    price: '45,000원',
    rating: '3,983',
  },
  {
    id: 4,
    title: '프리미엄 나일론 자켓',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/438182fa25c703088b338ac8e37d54c4a9e?width=324',
    price: '125,000원',
    rating: '2,594',
  },
]
