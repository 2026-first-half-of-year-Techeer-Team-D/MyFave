import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// TODO: Zustand에서 로그인 유저 정보 가져오기
const USER = {
  nickname: '민트초코좋아님',
  email: 'lovelycasual@myfave.kr',
  avatarSrc:
    'https://api.builder.io/api/v1/image/assets/TEMP/78649d5e254091deb163e1ef979ed4a62c2d34a2?width=112',
}

// TODO: React Query로 대체 - 주문 현황 API 연동
const ORDER_STATUS = [
  { status: '입금확인', count: 0 },
  { status: '배송준비', count: 0 },
  { status: '배송중', count: 0 },
  { status: '배송완료', count: 2 },
]

export function MyPage() {
  const [, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section))
  }

  // TODO: 로그아웃 훅 연동
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  return (
    <div className="flex-1 bg-white">
      {/* User Profile Section */}
      <div className="border-b border-separator px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img
              src={USER.avatarSrc}
              alt="User Avatar"
              className="h-14 w-14 rounded-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-noto text-base font-medium text-dark-text">{USER.nickname}</h2>
            <p className="font-noto text-xs text-muted-text">{USER.email}</p>
          </div>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="mx-5 my-6 rounded-2xl border border-separator bg-footer-bg p-4">
        <div className="grid grid-cols-4 gap-2">
          {ORDER_STATUS.map((order) => (
            <Link
              key={order.status}
              to="/orders"
              className="flex flex-col items-center gap-1 rounded-lg p-2 transition-opacity hover:opacity-70"
            >
              <span className="text-xl font-bold text-dark-text">{order.count}</span>
              <span className="whitespace-nowrap text-center font-noto text-xs text-muted-text">
                {order.status}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Coupon Section */}
      <div className="border-b border-separator">
        <button
          type="button"
          onClick={() => toggleSection('coupon')}
          className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-footer-bg"
        >
          <div className="flex flex-1 items-center justify-between">
            <span className="font-noto text-sm font-medium text-dark-text">쿠폰</span>
            <span className="font-noto text-sm font-medium text-chat-font">2장</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-text" />
        </button>
      </div>

      {/* Separator */}
      <div className="h-2 bg-separator" />

      {/* Logout Button */}
      <div className="px-5 py-6">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl bg-point py-3 font-noto text-sm font-medium text-white transition-colors hover:bg-[#ff7fa3]"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
