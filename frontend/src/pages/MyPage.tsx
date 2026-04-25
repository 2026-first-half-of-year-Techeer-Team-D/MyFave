import { Link } from 'react-router-dom'
import { UserIcon } from '@/shared/components/UserIcon'

// TODO: Zustand에서 로그인 유저 정보 가져오기
const USER = {
  nickname: '민트초코좋아님',
  email: 'lovelycasual@myfave.kr',
}

// TODO: React Query로 대체 - 주문 현황 API 연동
const ORDER_STATUS = [
  { status: '입금확인', count: 0 },
  { status: '배송준비', count: 0 },
  { status: '배송중', count: 0 },
  { status: '배송완료', count: 0 },
]

export function MyPage() {
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-10 overflow-y-auto">
      {/* 1. User Profile Section - Figma Node 99:1201 */}
      <div className="px-[19.99px] pt-[23.99px] pb-[19.99px]">
        <div className="flex items-center gap-[14px]">
          <UserIcon type="bear" variant={10} size={56} className="shadow-sm" />
          <div className="flex flex-col gap-[1.99px]">
            <h2 className="font-noto text-[16px] font-medium leading-[24px] text-[#322927] tracking-tight">
              {USER.nickname}
            </h2>
            <p className="font-noto text-[11px] font-normal leading-[16.5px] text-[#8B7E74]">
              {USER.email}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Order Status Container - Figma Node 37:4278 */}
      <div className="px-[19.99px] mb-[24px]">
        <div className="rounded-[12px] bg-footer-bg p-[15.99px] shadow-sm border border-separator/10">
          <div className="flex justify-between items-center h-[54.99px]">
            {ORDER_STATUS.map((order) => (
              <Link
                key={order.status}
                to="/orders"
                className="flex flex-col items-center justify-between h-full w-[74.12px]"
              >
                <span className="font-noto text-[24px] font-medium leading-[36px] text-[#322927]">
                  {order.count}
                </span>
                <span className="font-noto text-[12px] font-normal leading-[18px] text-[#8B7E74]">
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Section Divider - Figma Node 37:4300 (h:8px) */}
      <div className="h-[8px] w-full bg-separator" />

      {/* 4. Menu List Items - Figma Node 37:4301 ~ 4332 */}
      <div className="flex flex-col">
        {/* 주문조회 */}
        <Link 
          to="/orders" 
          className="flex h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">주문조회</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* Divider 8px */}
        <div className="h-[8px] w-full bg-separator" />

        {/* 쿠폰 */}
        <Link 
          to="/coupons" 
          className="flex h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">쿠폰</span>
          <div className="flex items-center gap-1">
            <span className="font-noto text-[12px] font-medium text-chat-font">2장</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>

        {/* Divider 8px */}
        <div className="h-[8px] w-full bg-separator" />
        
        {/* 배송지 관리 */}
        <Link 
          to="/add-shipping" 
          className="flex h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">배송지 관리</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* 고객센터 */}
        <Link 
          to="/faq" 
          className="flex h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">고객센터</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="mt-12 px-[19.99px] text-center">
        <button
          type="button"
          onClick={handleLogout}
          className="font-noto text-[12px] font-medium text-muted-text/60 underline decoration-muted-text/30 hover:text-muted-text transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
