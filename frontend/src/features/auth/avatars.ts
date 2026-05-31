// 회원가입 시 무작위로 부여되는 곰돌이 프로필 아바타 S3 URL 풀.
// 사용자(MyFave 운영자)가 AWS S3에 업로드한 PNG URL들을 아래 배열에 그대로 채워 넣으면
// 신규 회원 가입 시점에 무작위 1개가 선택되어 user.profileImageUrl 로 저장된다.
//
// 빈 배열이면 getRandomAvatarUrl()이 undefined를 반환하고 UserIcon이 기본 아바타(인라인 SVG)를 보여준다.
//
// 2026-05-31: AWS S3 버킷 삭제로 곰돌이 아바타 PNG(MyFave_user_icon/*)가 전부 유실됨.
// 백업 저장소에도 곰돌이 에셋이 없어 무작위 아바타 부여를 중단(빈 배열). 신규 회원은 기본 SVG 아바타 사용.
export const BEAR_AVATAR_S3_URLS: readonly string[] = []

// 회원가입 시 무작위 1개 URL을 반환. 풀이 비어있으면 undefined.
export function getRandomAvatarUrl(): string | undefined {
  if (BEAR_AVATAR_S3_URLS.length === 0) return undefined
  const index = Math.floor(Math.random() * BEAR_AVATAR_S3_URLS.length)
  return BEAR_AVATAR_S3_URLS[index]
}
