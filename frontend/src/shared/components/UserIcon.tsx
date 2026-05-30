
type IconType = 'bear' | 'human' | 'seller'
type Variant = number

interface UserIconProps {
  type?: IconType
  variant?: Variant
  className?: string
  size?: number
  // 회원가입 시 부여된 사용자별 프로필 이미지 URL. 존재하면 type/variant 매핑보다 우선.
  profileImageUrl?: string
}

// 곰돌이 폴백 아이콘은 256px S3 PNG(회원가입 아바타와 동일 소스)를 사용한다.
// 기존 Builder.io 에셋은 원본이 23px라 56px(마이페이지) 등에서 업스케일 시 깨졌으므로 교체.
const S3_BEAR_BASE = 'https://myfave-team-bucket.s3.ap-northeast-2.amazonaws.com/MyFave_user_icon'
const ICON_URLS: Record<IconType, Record<number, string>> = {
  bear: {
    1: `${S3_BEAR_BASE}/Property+1%3DDefault.png`,
    3: `${S3_BEAR_BASE}/Property+1%3DVariant2.png`,
    5: `${S3_BEAR_BASE}/Property+1%3DVariant3.png`,
    6: `${S3_BEAR_BASE}/Property+1%3DVariant4.png`,
    7: `${S3_BEAR_BASE}/Property+1%3DVariant5.png`,
    10: `${S3_BEAR_BASE}/Property+1%3DDefault.png`,
  },
  human: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
  },
  seller: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4?width=46', // MyFave 공식 셀러 아이콘
  }
}

export function UserIcon({ type = 'bear', variant = 1, className = '', size = 23.17, profileImageUrl }: UserIconProps) {
  // profileImageUrl 이 있으면 그 S3 URL 을 우선 사용. 없으면 기존 type/variant 매핑.
  const iconUrl = profileImageUrl ?? (ICON_URLS[type]?.[variant] || ICON_URLS[type]?.[1] || ICON_URLS['bear'][1])

  return (
    <div
      className={`relative overflow-hidden rounded-full flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={iconUrl}
        alt={`${type} icon`}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
