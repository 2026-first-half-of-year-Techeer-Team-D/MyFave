// 회원가입 시 무작위로 부여되는 곰돌이 프로필 아바타 S3 URL 풀.
// 사용자(MyFave 운영자)가 AWS S3에 업로드한 PNG URL들을 아래 배열에 그대로 채워 넣으면
// 신규 회원 가입 시점에 무작위 1개가 선택되어 user.profileImageUrl 로 저장된다.
//
// 사용자가 URL을 제공하기 전까지는 빈 배열을 유지 — getRandomAvatarUrl()이 undefined를 반환하고
// UserIcon이 기존 fallback 아이콘을 그대로 보여주므로 앱이 깨지지 않는다.
//
// TODO(사용자 제공 대기): 아래 BEAR_AVATAR_S3_URLS 배열에 S3 PNG URL들을 그대로 push 하기.
//   예시 형식:
//     'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/avatars/bear-01.png',
//     'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/avatars/bear-02.png',
//     ...
export const BEAR_AVATAR_S3_URLS: readonly string[] = [
  // TODO: replace with actual S3 URLs supplied by the operator
]

// 회원가입 시 무작위 1개 URL을 반환. 풀이 비어있으면 undefined.
export function getRandomAvatarUrl(): string | undefined {
  if (BEAR_AVATAR_S3_URLS.length === 0) return undefined
  const index = Math.floor(Math.random() * BEAR_AVATAR_S3_URLS.length)
  return BEAR_AVATAR_S3_URLS[index]
}
