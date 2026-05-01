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
  {
    id: 7,
    title: '오버사이즈 헤비 후드티',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521',
    price: '68,000원',
  },
  {
    id: 8,
    title: '스트레이트 로우 데님',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
    price: '72,000원',
  },
  {
    id: 9,
    title: '실크 터치 스카프',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    price: '24,000원',
  },
  {
    id: 10,
    title: '캔버스 토트백 Large',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4',
    price: '48,000원',
  },
  {
    id: 11,
    title: '울 블렌드 스웨터',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd',
    price: '95,000원',
  },
  {
    id: 12,
    title: '슬림핏 코튼 치노팬츠',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521',
    price: '59,000원',
  },
]

export const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  1: {
    id: 1,
    title: '[단품] 윙크 립 쉐이드 프라이머 15종 택 1',
    subtitle: '본연의 입술색을 살려주는 맑은 커버력',
    price: '16,000원',
    priceNumber: 16000,
    images: ['https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd'],
    features: [
      { title: '맑은 발색', description: '입술의 칙칙함만 걷어내고 본연의 색을 살려줍니다.' },
    ],
  },
  2: {
    id: 2,
    title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2',
    subtitle: '"상세페이지 발색, 왜 나만 안 나올까?" 립 모델인 제가 직접 개발한 이유',
    price: '32,000원',
    priceNumber: 32000,
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356',
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
  3: {
    id: 3,
    title: '플로럴 블라썸 원피스',
    subtitle: '봄의 설렘을 담은 우아한 실루엣',
    price: '89,000원',
    priceNumber: 89000,
    images: ['https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356'],
    features: [
      { title: '부드러운 소재', description: '하루 종일 편안한 착용감을 선사하는 고품질 원단' },
      { title: '우아한 핏', description: '허리 라인을 잡아주어 슬림해 보이는 실루엣' },
    ],
  },
  4: {
    id: 4,
    title: '코튼 캐주얼 티셔츠',
    subtitle: '매일 입고 싶은 베이직 아이템',
    price: '45,000원',
    priceNumber: 45000,
    images: ['https://api.builder.io/api/v1/image/assets/TEMP/9c8119427d69f5d98a6fd8fc600888b6444d6521'],
    features: [
      { title: '100% 코튼', description: '피부에 닿는 감촉이 부드러운 순면 소재' },
      { title: '내구성', description: '여러 번 세탁해도 변형이 적은 탄탄한 봉제' },
    ],
  },
  5: {
    id: 5,
    title: '프리미엄 니트 카디건',
    subtitle: '고급스러운 텍스처와 따뜻함',
    price: '125,000원',
    priceNumber: 125000,
    images: ['https://api.builder.io/api/v1/image/assets/TEMP/dedc87e2e02e3b692900153699047ca6fc3bbedd'],
    features: [
      { title: '고급 울 혼방', description: '가볍지만 뛰어난 보온성을 자랑합니다.' },
    ],
  },
  6: {
    id: 6,
    title: '미니 에코백',
    subtitle: '작지만 알찬 수납공간',
    price: '55,000원',
    priceNumber: 55000,
    images: ['https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4'],
    features: [
      { title: '데일리 백', description: '가벼운 외출에 적합한 콤팩트한 사이즈' },
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
