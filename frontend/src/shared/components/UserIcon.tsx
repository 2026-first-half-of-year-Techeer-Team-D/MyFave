import React from 'react'

type IconType = 'bear' | 'human' | 'seller'
type Variant = 1 | 2 | 3 | 4 | 5

interface UserIconProps {
  type?: IconType
  variant?: Variant
  className?: string
  size?: number
}

// Figma Node 99:351 (곰돌이), 99:366 (사람) 기반 디자인 이미지 URL들
const ICON_URLS: Record<IconType, Record<Variant, string>> = {
  bear: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/78649d5e254091deb163e1ef979ed4a62c2d34a2?width=112', // Default
    2: 'https://api.builder.io/api/v1/image/assets/TEMP/78649d5e254091deb163e1ef979ed4a62c2d34a2?width=112', 
    3: 'https://api.builder.io/api/v1/image/assets/TEMP/78649d5e254091deb163e1ef979ed4a62c2d34a2?width=112',
    4: 'https://api.builder.io/api/v1/image/assets/TEMP/78649d5e254091deb163e1ef979ed4a62c2d34a2?width=112',
    5: 'https://api.builder.io/api/v1/image/assets/TEMP/78649d5e254091deb163e1ef979ed4a62c2d34a2?width=112',
  },
  human: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    2: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    3: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    4: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    5: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
  },
  seller: {
    1: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    2: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    3: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    4: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
    5: 'https://api.builder.io/api/v1/image/assets/TEMP/664f3316f9f68e98296767568c4a9a0815d48a0f?width=112',
  }
}

export function UserIcon({ type = 'bear', variant = 1, className = '', size = 40 }: UserIconProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-full bg-main-bg p-0.5 border border-separator shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={ICON_URLS[type][variant]}
        alt={`${type} icon`}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  )
}
