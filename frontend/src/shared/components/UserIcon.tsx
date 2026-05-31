
type IconType = 'bear' | 'human' | 'seller'
type Variant = number

interface UserIconProps {
  type?: IconType
  variant?: Variant
  className?: string
  size?: number
  // 사용자별 프로필 이미지 URL. 존재하면 type 매핑보다 우선.
  profileImageUrl?: string
}

// 2026-05-31: S3 버킷 삭제로 곰돌이 아이콘(MyFave_user_icon/*.png)이 유실됨.
// 백업 저장소에도 곰돌이 에셋이 없어, 기본 아바타는 외부 의존 없는 인라인 SVG로 대체한다.
// human/seller 는 살아있는 builder.io 에셋을 그대로 사용한다. (variant 는 호출처 호환을 위해 유지)
const ICON_URLS: Partial<Record<IconType, Record<number, string>>> = {
  human: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
  },
  seller: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4?width=46', // MyFave 공식 셀러 아이콘
  },
}

// 외부 의존 없는 중립 기본 아바타 (구 곰돌이 자리 대체).
function DefaultAvatar({ size, className }: { size: number; className: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full flex-shrink-0 bg-[#F1E9E3] ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" className="h-full w-full" role="img" aria-label="기본 프로필">
        <circle cx="20" cy="15" r="7" fill="#C9BBB0" />
        <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" fill="#C9BBB0" />
      </svg>
    </div>
  )
}

export function UserIcon({ type = 'bear', variant = 1, className = '', size = 23.17, profileImageUrl }: UserIconProps) {
  // profileImageUrl 우선, 없으면 type 매핑. bear(기본) 또는 매핑 부재 시 인라인 SVG 기본 아바타.
  const iconUrl = profileImageUrl ?? ICON_URLS[type]?.[variant] ?? ICON_URLS[type]?.[1]

  if (!iconUrl) return <DefaultAvatar size={size} className={className} />

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
