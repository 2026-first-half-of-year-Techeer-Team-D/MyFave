
type IconType = 'bear' | 'human' | 'seller'
type Variant = number
type IconSize = 'sm' | 'md' | 'lg'

interface UserIconProps {
  type?: IconType
  variant?: Variant
  className?: string
  size?: IconSize
  // 사용자별 프로필 이미지 URL. 존재하면 type 매핑보다 우선.
  profileImageUrl?: string
}

// size 변형 → Tailwind 클래스 (sm 24px / md 40px / lg 56px). 인라인 스타일 대신 클래스로 일관 처리.
const SIZE_CLASS: Record<IconSize, string> = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
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
function DefaultAvatar({ size, className }: { size: IconSize; className: string }) {
  return (
    <div className={`relative overflow-hidden rounded-full flex-shrink-0 bg-[#F1E9E3] ${SIZE_CLASS[size]} ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-full" role="img" aria-label="기본 프로필">
        <circle cx="20" cy="15" r="7" fill="#C9BBB0" />
        <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" fill="#C9BBB0" />
      </svg>
    </div>
  )
}

export function UserIcon({ type = 'bear', variant = 1, className = '', size = 'sm', profileImageUrl }: UserIconProps) {
  // profileImageUrl 우선, 없으면 type 매핑. bear(기본) 또는 매핑 부재 시 인라인 SVG 기본 아바타.
  const iconUrl = profileImageUrl ?? ICON_URLS[type]?.[variant] ?? ICON_URLS[type]?.[1]

  if (!iconUrl) return <DefaultAvatar size={size} className={className} />

  return (
    <div className={`relative overflow-hidden rounded-full flex-shrink-0 ${SIZE_CLASS[size]} ${className}`}>
      <img
        src={iconUrl}
        alt={`${type} icon`}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
