import type { InfluencerPick, Product, ProductDetail } from './types'

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: '원오프 넘버링 티셔츠',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_착용샷.jpg',
    price: '10,000원',
    category: 'top',
  },
  {
    id: 2,
    title: '스트라이프 카디건',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_착용샷.jpg',
    price: '10,000원',
    category: 'top',
  },
  {
    id: 3,
    title: '오프숄더 리본 니트',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_착용샷.jpg',
    price: '10,000원',
    category: 'top',
  },
  {
    id: 4,
    title: '스카이 골지 카디건',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_착용샷.jpg',
    price: '10,000원',
    category: 'top',
  },
  {
    id: 5,
    title: '살구 핑크 레이어드 셔츠',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_착용샷.jpg',
    price: '10,000원',
    category: 'top',
  },
  {
    id: 6,
    title: '배색 스트라이프 니트 카디건',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_착용샷.jpg',
    price: '10,000원',
    category: 'top',
  },
  {
    id: 7,
    title: '브라운 무스탕 자켓',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_착용샷.jpg',
    price: '30,000원',
    category: 'outer',
  },
  {
    id: 8,
    title: '블랙 퍼 카라 레더 자켓',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_착용샷.jpg',
    price: '30,000원',
    category: 'outer',
  },
  {
    id: 9,
    title: '플라워 롱스커트',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_착용샷.jpg',
    price: '10,000원',
    category: 'bottom',
  },
  {
    id: 10,
    title: '셔링 롱스커트',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_착용샷.jpg',
    price: '10,000원',
    category: 'bottom',
  },
]

export const PRODUCT_DETAILS: Record<number, ProductDetail> = {
  1: {
    id: 1,
    title: '원오프 넘버링 티셔츠',
    subtitle:
      '한쪽 어깨가 시원하게 드러나는 오프숄더 디자인의 화이트 긴팔 티셔츠예요. 빈티지한 느낌의 넘버링 프린트가 포인트로 들어가 캐주얼하면서도 트렌디한 무드를 연출해줍니다. 한 장만 입어도 데일리룩으로 완성도 있게 떨어져요!',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_단독샷.heic',
    ],
    features: [
      { title: '디자인', description: '오프숄더 디자인의 화이트 긴팔 티셔츠' },
      { title: '디테일', description: '빈티지한 넘버링 프린트 포인트' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
  2: {
    id: 2,
    title: '스트라이프 카디건',
    subtitle:
      '부드러운 촉감의 그레이 톤 스트라이프 카디건이에요. 두 가지 톤의 그레이가 차분하면서도 세련된 무드를 연출해줍니다. 데일리하게 걸치기 좋고 어떤 하의에도 무난하게 매치되더라구요.',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_단독샷.heic',
    ],
    features: [
      { title: '컬러', description: '두 가지 톤의 차분하고 세련된 그레이 스트라이프' },
      { title: '활용도', description: '어떤 하의에도 무난한 데일리 아이템' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
  3: {
    id: 3,
    title: '오프숄더 리본 니트',
    subtitle:
      '과하지 않은 레드 컬러에 한쪽 어깨를 리본으로 묶는 디자인이 사랑스러운 니트예요. 허리라인 포인트로 라인을 살려줍니다. 포인트 컬러로 코디에 생기를 더해주는 아이템!',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_단독샷.heic',
    ],
    features: [
      { title: '디자인', description: '리본 오프숄더로 사랑스러운 무드 연출' },
      { title: '핏', description: '허리라인 포인트로 라인 강조' },
      { title: '상태', description: '착용 1번' },
    ],
  },
  4: {
    id: 4,
    title: '스카이 골지 카디건',
    subtitle:
      '은은한 스카이 컬러가 봄·여름 분위기에 딱 맞는 슬림핏 골지 카디건이에요. 세로 골지 패턴이 슬림한 라인을 더욱 돋보이게 해줍니다. 단독으로 입거나 이너로 활용해도 좋은 활용도 높은 아이템이에요.',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_단독샷.heic',
    ],
    features: [
      { title: '컬러', description: '봄·여름에 어울리는 은은한 스카이 컬러' },
      { title: '소재', description: '슬림한 라인이 돋보이는 세로 골지 패턴' },
      { title: '상태', description: '착용 1번' },
    ],
  },
  5: {
    id: 5,
    title: '살구 핑크 레이어드 셔츠',
    subtitle:
      '은은한 살구빛 핑크 컬러의 레이어드 셔츠예요. 레이어드 디테일 덕에 단조롭지 않고 센스있는 느낌을 줍니다. 도톰하지 않은 가벼운 소재라 봄~초여름에 데일리로 입기 좋아요.',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_단독샷.heic',
    ],
    features: [
      { title: '디테일', description: '단조롭지 않은 센스있는 레이어드 디테일' },
      { title: '소재', description: '봄~초여름 데일리에 좋은 가벼운 소재' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
  6: {
    id: 6,
    title: '배색 스트라이프 니트 카디건',
    subtitle:
      '클래식한 마린룩 무드의 아이보리 베이스 블랙 스트라이프 카디건이에요. 탄탄한 짜임감으로 봄·가을·겨울에 따뜻하게 입기 좋고, 살짝 오버핏이라 편안하게 떨어집니다. 어떤 스타일에도 잘 녹아드는 베이직 아이템으로 추천해요!',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_단독샷.heic',
    ],
    features: [
      { title: '핏', description: '살짝 오버핏으로 편안하게 떨어지는 실루엣' },
      { title: '활용도', description: '봄·가을·겨울 어울리는 사계절 베이직 아이템' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
  7: {
    id: 7,
    title: '브라운 무스탕 자켓',
    subtitle:
      '포근한 안감과 브라운 외피가 조화로운 무스탕 자켓이에요. 카라와 소매 끝, 밑단까지 풍성한 무스탕이 둘러져 있어 보온성이 뛰어납니다. 청바지와 매치하면 빈티지한 무드의 겨울 코디 완성!',
    price: '30,000원',
    priceNumber: 30000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_단독샷.heic',
    ],
    features: [
      { title: '보온성', description: '카라·소매·밑단 둘러진 풍성한 무스탕 안감' },
      { title: '스타일', description: '청바지와 매치한 빈티지 겨울 코디' },
      { title: '상태', description: '착용 1번' },
    ],
  },
  8: {
    id: 8,
    title: '블랙 퍼 카라 레더 자켓',
    subtitle:
      '탈부착 가능한 화이트 퍼 카라가 포인트인 블랙 레더 자켓이에요. 휘뚤마뚤 데일리하게 입기 좋아 더욱 매력적이구요! 간절기부터 초겨울까지 활용도 높게 입을 수 있어요.',
    price: '30,000원',
    priceNumber: 30000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_단독샷.heic',
    ],
    features: [
      { title: '디테일', description: '탈부착 가능한 화이트 퍼 카라 포인트' },
      { title: '활용도', description: '간절기부터 초겨울까지 폭넓게 활용 가능' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
  9: {
    id: 9,
    title: '플라워 롱스커트',
    subtitle:
      '은은하게 비치는 시스루 소재에 플라워 자카드 패턴이 입체적으로 들어간 롱스커트예요. 풍성한 실루엣 덕분에 한 벌만 입어도 우아한 분위기가 연출됩니다. 특히 니트와 잘 어울리더라구요!',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_단독샷.heic',
    ],
    features: [
      { title: '소재', description: '시스루 소재에 입체적인 플라워 자카드 패턴' },
      { title: '실루엣', description: '풍성한 볼륨감으로 우아한 분위기 연출' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
  10: {
    id: 10,
    title: '셔링 롱스커트',
    subtitle:
      '은은한 광택감이 도는 블랙 컬러의 셔링 디테일 롱스커트예요. 자연스러운 주름이 풍성하게 떨어져 페미닌한 실루엣을 연출해줍니다. 발목까지 떨어지는 기장감으로 키와 상관없이 분위기 있게 소화할 수 있어요.',
    price: '10,000원',
    priceNumber: 10000,
    images: [
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_착용샷.jpg',
      'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_단독샷.heic',
    ],
    features: [
      { title: '디자인', description: '자연스럽게 풍성하게 떨어지는 셔링 주름 디테일' },
      { title: '실루엣', description: '발목까지 떨어지는 페미닌한 롱 실루엣' },
      { title: '상태', description: '미착용 (only 피팅)' },
    ],
  },
}

export const INFLUENCER_PICKS: InfluencerPick[] = [
  {
    id: 1,
    title: '원오프 넘버링 티셔츠',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_착용샷.jpg',
    price: '10,000원',
    category: 'top',
    rating: '4,283',
  },
  {
    id: 7,
    title: '브라운 무스탕 자켓',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_착용샷.jpg',
    price: '30,000원',
    category: 'outer',
    rating: '2,854',
  },
  {
    id: 2,
    title: '스트라이프 카디건',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_착용샷.jpg',
    price: '10,000원',
    category: 'top',
    rating: '3,314',
  },
  {
    id: 9,
    title: '플라워 롱스커트',
    image: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_착용샷.jpg',
    price: '10,000원',
    category: 'bottom',
    rating: '3,921',
  },
]
