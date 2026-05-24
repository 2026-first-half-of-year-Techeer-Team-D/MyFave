// 데이터 출처: frontend/상품 정보.md
// 백엔드 응답의 thumbnailUrl/images[].imageUrl을 신뢰하지 않고 프론트엔드에서 S3 URL을 직접 매핑한다.
// 관련 spec: .omc/specs/deep-interview-frontend-image-broken.md
//
// 2026-05-24: 운영자가 모든 사진2 의 확장자를 .heic → .jpg/.jpeg 로 재업로드.
// 더 이상 클라이언트 측 heic2any 변환이 필요하지 않음. 필드 이름(`jpg`/`heic`) 은 호출처 영향 회피를 위해
// 그대로 두지만 의미적으로 jpg=대표사진 / heic=사진2 (두 번째 사진) 로 이해하면 된다.

export interface ImageMapEntry {
  slug: string
  jpg: string | null
  heic: string
}

export const imageMap: Partial<Record<number, ImageMapEntry>> = {
  1: {
    slug: 'top1',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  2: {
    slug: 'top2',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  3: {
    slug: 'top3',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpeg',
  },
  4: {
    slug: 'top4',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpeg',
  },
  5: {
    slug: 'top5',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpeg',
  },
  6: {
    slug: 'top6',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  7: {
    slug: 'outer1',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  8: {
    slug: 'outer2',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  9: {
    slug: 'bottom1',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  10: {
    slug: 'bottom2',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  11: {
    slug: 'top7',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top7_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  12: {
    slug: 'top8',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top8_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top8_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  13: {
    slug: 'top9',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top9_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top9_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  14: {
    slug: 'top10',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top10_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top10_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  // id 15-19: 상품 정보.md 의 사진1(대표사진) 칸이 비어 있으므로 jpg=null. 사진2 는 .jpg 로 재업로드됨.
  // getProductThumbnail() 의 `entry.jpg ?? entry.heic` fallback 으로 사진2 가 대표 이미지 역할.
  15: {
    slug: 'top11',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top11_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  16: {
    slug: 'bottom3',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom3_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  17: {
    slug: 'bottom4',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom4_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  18: {
    slug: 'acc1',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/acc1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
  19: {
    slug: 'acc2',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/acc2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.jpg',
  },
}

export function getProductThumbnail(id: number): string {
  const entry = imageMap[id]
  if (!entry) return ''
  return entry.jpg ?? entry.heic
}

export function getProductImages(id: number): string[] {
  const entry = imageMap[id]
  if (!entry) return []
  return entry.jpg ? [entry.jpg, entry.heic] : [entry.heic]
}
