import type { InfluencerPick, Product, ProductDetail } from './types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: '[살안타템/여리핏][MADE] 리엔느 텐셀 프릴 골지 가디건',
    image: 'https://pureda.co.kr/web/product/medium/202604/37470ad94a702ffe8d036b8b505cd635.webp',
    price: '29,800원',
  },
  {
    id: 2,
    title: '[러블리/허리밴딩][MADE] 미로엘 캉캉 프릴 롱 스커트',
    image: 'https://pureda.co.kr/web/product/medium/202604/ccdc9d0c44a8ee2d2359ae8b10026a6a.jpg',
    price: '37,000원',
  },
  {
    id: 3,
    title: '[오늘출발][썸머][MADE] 니스 투핀턱 나일론 벨티드 슬랙스',
    image: 'https://pureda.co.kr/web/product/medium/202604/263e9dec20ecbf8455ab9351faa3ab42.webp',
    price: '36,000원',
  },
  {
    id: 4,
    title: '[살안타템/여리핏] 리슬디 보트넥 썸머 니트',
    image: 'https://pureda.co.kr/web/product/medium/202604/2d697f353f00692137b01108848bd7d0.jpg',
    price: '23,000원',
  },
  {
    id: 5,
    title: '[데일리/포인트] 헤튼 플리츠 빅 에코백',
    image: 'https://pureda.co.kr/web/product/medium/202604/6d8181284822e368060c45419082ed45.webp',
    price: '23,000원',
  },
  {
    id: 6,
    title: '[살안타템][MADE] 모어린 썸머 린넨 가디건',
    image: 'https://pureda.co.kr/web/product/medium/202604/5c2eda4c2ad4a6511201b63c638e73c9.webp',
    price: '34,000원',
  },
  {
    id: 7,
    title: '[교복템/데일리][MADE] 엘로 와이드 밴딩 팬츠',
    image: 'https://pureda.co.kr/web/product/medium/202604/3aa60c9b624e9df60984f2ec38d8b3a8.webp',
    price: '32,000원',
  },
  {
    id: 8,
    title: '[휴양지룩/끈조절] 리빌 레이어드 나시 롱 원피스',
    image: 'https://pureda.co.kr/web/product/medium/202604/66ba8465ff18f94c4a2f7338c5ef7d63.webp',
    price: '35,000원',
  },
  {
    id: 9,
    title: '[데일리] 디블 스트라이프 스퀘어 나시 티셔츠',
    image: 'https://pureda.co.kr/web/product/medium/202604/4bf71ce7858b7d455457163c550b01a0.jpg',
    price: '12,000원',
  },
  {
    id: 10,
    title: '[살안타템/장마룩][MADE] 리크 썸머 체크 셔츠',
    image: 'https://pureda.co.kr/web/product/medium/202604/77d3a4973e39d31f8dfc915fb34df114.jpg',
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
    images: ['https://pureda.co.kr/web/product/medium/202604/37470ad94a702ffe8d036b8b505cd635.webp'],
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
    images: ['https://pureda.co.kr/web/product/medium/202604/ccdc9d0c44a8ee2d2359ae8b10026a6a.jpg'],
    features: [
      { title: '캉캉 디자인', description: '계단식 프릴로 체형 커버와 볼륨감을 동시에' },
      { title: '허리 밴딩', description: '사이즈 구애 없이 하루 종일 편안한 착용감' },
    ],
  },
  3: {
    id: 3,
    title: '[오늘출발][썸머][MADE] 니스 투핀턱 나일론 벨티드 슬랙스',
    subtitle: '시원한 나일론 소재와 트렌디한 핀턱 디테일',
    price: '36,000원',
    priceNumber: 36000,
    images: ['https://pureda.co.kr/web/product/medium/202604/263e9dec20ecbf8455ab9351faa3ab42.webp'],
    features: [
      { title: '나일론 소재', description: '가볍고 시원하여 여름철 데일리 슬랙스로 추천' },
      { title: '투핀턱 디테일', description: '세련된 실루엣을 만들어주는 앞면 핀턱 디자인' },
    ],
  },
}

export const INFLUENCER_PICKS: InfluencerPick[] = [
  {
    id: 1,
    title: '[살안타템/여리핏][MADE] 리엔느 텐셀 프릴 골지 가디건',
    image: 'https://pureda.co.kr/web/product/medium/202604/37470ad94a702ffe8d036b8b505cd635.webp',
    price: '29,800원',
    rating: '4,283',
  },
  {
    id: 2,
    title: '[러블리/허리밴딩][MADE] 미로엘 캉캉 프릴 롱 스커트',
    image: 'https://pureda.co.kr/web/product/medium/202604/ccdc9d0c44a8ee2d2359ae8b10026a6a.jpg',
    price: '37,000원',
    rating: '3,314',
  },
]
