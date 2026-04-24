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
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  return (
    <div className="flex-1 bg-white pb-10">
      {/* User Profile Section */}
      <div className="px-5 py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-main-bg p-1 shadow-inner">
              <img
                src={USER.avatarSrc}
                alt="User Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-separator text-muted-text active:scale-95 transition-transform">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
          <div className="text-center">
            <h2 className="font-noto text-lg font-black text-dark-text">{USER.nickname}</h2>
            <p className="font-noto text-[13px] font-medium text-muted-text/80">{USER.email}</p>
          </div>
        </div>
      </div>

      {/* Order Status Container */}
      <div className="mx-5 mb-10 rounded-2xl bg-footer-bg p-6 shadow-sm border border-separator/30">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-noto text-sm font-bold text-dark-text">나의 주문 현황</span>
          <Link to="/orders" className="font-noto text-[11px] font-bold text-point underline decoration-point/30">전체보기</Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ORDER_STATUS.map((order) => (
            <Link
              key={order.status}
              to="/orders"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark-text font-lexend text-sm font-black shadow-sm group-active:scale-90 transition-transform">
                {order.count}
              </div>
              <span className="whitespace-nowrap text-center font-noto text-[11px] font-bold text-muted-text">
                {order.status}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation List */}
      <div className="mx-5 space-y-2">
        <h3 className="mb-4 font-noto text-xs font-black text-muted-text/50 uppercase tracking-widest">General</h3>
        <div className="divide-y divide-separator/50 overflow-hidden rounded-2xl border border-separator/30 bg-white">
          <Link to="/orders" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
            <span className="font-noto text-sm font-bold text-dark-text">주문 내역</span>
            <ChevronRight className="h-4 w-4 text-muted-text" />
          </Link>
          <Link to="/shipping-address" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
            <span className="font-noto text-sm font-bold text-dark-text">배송지 관리</span>
            <ChevronRight className="h-4 w-4 text-muted-text" />
          </Link>
          <Link to="/profile-edit" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
            <span className="font-noto text-sm font-bold text-dark-text">회원 정보 수정</span>
            <ChevronRight className="h-4 w-4 text-muted-text" />
          </Link>
          <Link to="/customer-service" className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50 active:bg-gray-100">
            <span className="font-noto text-sm font-bold text-dark-text">고객센터</span>
            <ChevronRight className="h-4 w-4 text-muted-text" />
          </Link>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-12 px-5 text-center">
        <button
          type="button"
          onClick={handleLogout}
          className="font-noto text-[13px] font-bold text-muted-text/50 underline decoration-muted-text/20 hover:text-muted-text transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
