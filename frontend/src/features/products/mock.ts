import type { InfluencerPick, Product, ProductDetail } from './types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: '[살안타템/여리핏][MADE] 리엔느 텐셀 프릴 골지 가디건',
    image: 'https://pureda.co.kr/web/product/big/202405/65c87930335e47858c7414df8986d38e.jpg',
    price: '29,800원',
  },
  {
    id: 2,
    title: '[러블리/허리밴딩][MADE] 미로엘 캉캉 프릴 롱 스커트',
    image: 'https://pureda.co.kr/web/product/big/202405/2ebf88e4e758e5746f3a3c99f1205634.jpg',
    price: '37,000원',
  },
  {
    id: 3,
    title: '[오늘출발][썸머][MADE] 니스 투핀턱 나일론 벨티드 슬랙스',
    image: 'https://pureda.co.kr/web/product/big/202405/496f8c853f86e3f435c5c56c5c5c5c5c.jpg',
    price: '36,000원',
  },
  {
    id: 4,
    title: '[살안타템/여리핏] 리슬디 보트넥 썸머 니트',
    image: 'https://pureda.co.kr/web/product/big/202405/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p.jpg',
    price: '23,000원',
  },
  {
    id: 5,
    title: '[데일리/포인트] 헤튼 플리츠 빅 에코백',
    image: 'https://pureda.co.kr/web/product/big/202405/z1x2c3v4b5n6m7l8k9j0h1g2f3d4s5a6.jpg',
    price: '23,000원',
  },
  {
    id: 6,
    title: '[살안타템][MADE] 모어린 썸머 린넨 가디건',
    image: 'https://pureda.co.kr/web/product/big/202405/q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6.jpg',
    price: '34,000원',
  },
  {
    id: 7,
    title: '[교복템/데일리][MADE] 엘로 와이드 밴딩 팬츠',
    image: 'https://pureda.co.kr/web/product/big/202405/m1n2b3v4c5x6z7a8s9d0f1g2h3j4k5l6.jpg',
    price: '32,000원',
  },
  {
    id: 8,
    title: '[휴양지룩/끈조절] 리빌 레이어드 나시 롱 원피스',
    image: 'https://pureda.co.kr/web/product/big/202405/p0o9i8u7y6t5r4e3w2q1a1s2d3f4g5h6.jpg',
    price: '35,000원',
  },
  {
    id: 9,
    title: '[데일리] 디블 스트라이프 스퀘어 나시 티셔츠',
    image: 'https://pureda.co.kr/web/product/big/202405/l9k8j7h6g5f4d3s2a1z1x2c3v4b5n6m7.jpg',
    price: '12,000원',
  },
  {
    id: 10,
    title: '[살안타템/장마룩][MADE] 리크 썸머 체크 셔츠',
    image: 'https://pureda.co.kr/web/product/big/202405/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.jpg',
    price: '36,000원',
  },
]

export const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  1: {
    id: 1,
    title: '[살안타템/여리핏][MADE] 리엔느 텐셀 프릴 골지 가디건',
    subtitle: '넥라인과 소매 끝단의 프릴 디테일이 돋보이는 여리핏 가디건',
    price: '29,800원',
    priceNumber: 29800,
    images: ['https://pureda.co.kr/web/product/big/202405/65c87930335e47858c7414df8986d38e.jpg'],
    features: [
      { title: '프릴 디테일', description: '여성스러운 무드를 더해주는 섬세한 프릴 장식' },
      { title: '텐셀 혼방', description: '여름에도 쾌적하게 착용 가능한 시원한 소재' },
    ],
  },
  2: {
    id: 2,
    title: '[러블리/허리밴딩][MADE] 미로엘 캉캉 프릴 롱 스커트',
    subtitle: '풍성한 볼륨감과 편안한 밴딩으로 완성하는 러블리룩',
    price: '37,000원',
    priceNumber: 37000,
    images: ['https://pureda.co.kr/web/product/big/202405/2ebf88e4e758e5746f3a3c99f1205634.jpg'],
    features: [
      { title: '캉캉 디자인', description: '계단식 프릴로 체형 커버와 볼륨감을 동시에' },
      { title: '허리 밴딩', description: '사이즈 구애 없이 하루 종일 편안한 착용감' },
    ],
  },
}

export const INFLUENCER_PICKS: InfluencerPick[] = [
  {
    id: 1,
    title: '[살안타템/여리핏][MADE] 리엔느 텐셀 프릴 골지 가디건',
    image: 'https://pureda.co.kr/web/product/big/202405/65c87930335e47858c7414df8986d38e.jpg',
    price: '29,800원',
    rating: '4,283',
  },
  {
    id: 2,
    title: '[러블리/허리밴딩][MADE] 미로엘 캉캉 프릴 롱 스커트',
    image: 'https://pureda.co.kr/web/product/big/202405/2ebf88e4e758e5746f3a3c99f1205634.jpg',
    price: '37,000원',
    rating: '3,314',
  },
]
