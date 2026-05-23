// 데이터 출처: frontend/상품 정보.md
// 백엔드 응답의 thumbnailUrl/images[].imageUrl을 신뢰하지 않고 프론트엔드에서 S3 URL을 직접 매핑한다.
// 관련 spec: .omc/specs/deep-interview-frontend-image-broken.md

export interface ImageMapEntry {
  slug: string
  jpg: string | null
  heic: string
}

export const imageMap: Partial<Record<number, ImageMapEntry>> = {
  1: {
    slug: 'top1',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  2: {
    slug: 'top2',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  3: {
    slug: 'top3',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top3_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  4: {
    slug: 'top4',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top4_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  5: {
    slug: 'top5',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top5_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  6: {
    slug: 'top6',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top6_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  7: {
    slug: 'outer1',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  8: {
    slug: 'outer2',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/outer2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  9: {
    slug: 'bottom1',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  10: {
    slug: 'bottom2',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  11: {
    slug: 'top7',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top7_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top7_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  12: {
    slug: 'top8',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top8_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top8_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  13: {
    slug: 'top9',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top9_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top9_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  14: {
    slug: 'top10',
    jpg: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top10_%E1%84%8E%E1%85%A1%E1%86%A8%E1%84%8B%E1%85%AD%E1%86%BC%E1%84%89%E1%85%A3%E1%86%BA.jpg',
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top10_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  15: {
    slug: 'top11',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/top11_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  16: {
    slug: 'bottom3',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom3_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  17: {
    slug: 'bottom4',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/bottom4_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  18: {
    slug: 'acc1',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/acc1_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
  },
  19: {
    slug: 'acc2',
    jpg: null,
    heic: 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/acc2_%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA.heic',
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
