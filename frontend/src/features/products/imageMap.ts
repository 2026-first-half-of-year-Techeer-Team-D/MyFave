// 데이터 출처: frontend/상품 정보.md
// 백엔드 응답의 thumbnailUrl/images[].imageUrl을 신뢰하지 않고 프론트엔드에서 이미지 URL을 직접 매핑한다.
// 관련 spec: .omc/specs/deep-interview-frontend-image-broken.md
//
// 2026-05-31: AWS S3 버킷(myfave-team-bucket)이 삭제되어 모든 S3 URL이 깨짐.
// 백업 저장소(github.com/2026-first-half-of-year-Techeer-Team-D/asset)를 jsDelivr CDN으로 서빙해 대체.
// 저장소에는 '단독샷(사진2)'만 존재하고 '착용샷(대표/사진1)'은 없으므로 jpg(착용샷) 필드는 전부 null.
// 파일명(한글)은 기존 S3와 동일한 NFD percent-인코딩을 그대로 사용한다(jsDelivr 200 확인).
//
// 필드 이름(`jpg`/`heic`)은 호출처 영향 회피를 위해 그대로 두지만 의미는 jpg=대표(현재 유실) / heic=단독샷(현재 대표 역할).

const CDN = 'https://cdn.jsdelivr.net/gh/2026-first-half-of-year-Techeer-Team-D/asset@main'
const d = '%E1%84%83%E1%85%A1%E1%86%AB%E1%84%83%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A3%E1%86%BA' // 단독샷 (NFD)

export interface ImageMapEntry {
  slug: string
  jpg: string | null
  heic: string
}

export const imageMap: Partial<Record<number, ImageMapEntry>> = {
  1: { slug: 'top1', jpg: null, heic: `${CDN}/top1_${d}.jpg` },
  2: { slug: 'top2', jpg: null, heic: `${CDN}/top2_${d}.jpg` },
  3: { slug: 'top3', jpg: null, heic: `${CDN}/top3_${d}.jpeg` },
  4: { slug: 'top4', jpg: null, heic: `${CDN}/top4_${d}.jpeg` },
  5: { slug: 'top5', jpg: null, heic: `${CDN}/top5_${d}.jpeg` },
  6: { slug: 'top6', jpg: null, heic: `${CDN}/top6_${d}.jpg` },
  7: { slug: 'outer1', jpg: null, heic: `${CDN}/outer1_${d}.jpg` },
  8: { slug: 'outer2', jpg: null, heic: `${CDN}/outer2_${d}.jpg` },
  9: { slug: 'bottom1', jpg: null, heic: `${CDN}/bottom1_${d}.jpg` },
  10: { slug: 'bottom2', jpg: null, heic: `${CDN}/bottom2_${d}.jpg` },
  11: { slug: 'top7', jpg: null, heic: `${CDN}/top7_${d}.jpg` },
  12: { slug: 'top8', jpg: null, heic: `${CDN}/top8_${d}.jpg` },
  13: { slug: 'top9', jpg: null, heic: `${CDN}/top9_${d}.jpg` },
  14: { slug: 'top10', jpg: null, heic: `${CDN}/top10_${d}.jpg` },
  15: { slug: 'top11', jpg: null, heic: `${CDN}/top11_${d}.jpg` },
  16: { slug: 'bottom3', jpg: null, heic: `${CDN}/bottom3_${d}.jpg` },
  17: { slug: 'bottom4', jpg: null, heic: `${CDN}/bottom4_${d}.jpg` },
  18: { slug: 'acc1', jpg: null, heic: `${CDN}/acc1_${d}.jpg` },
  19: { slug: 'acc2', jpg: null, heic: `${CDN}/acc2_${d}.jpg` },
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
