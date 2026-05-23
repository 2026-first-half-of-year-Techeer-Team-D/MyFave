import { Link, useNavigate } from 'react-router-dom'

import { useLogout, useUser } from '@/features/auth/hooks'
import { useMyCoupons } from '@/features/coupons/hooks'
import { UserIcon } from '@/shared/components/UserIcon'

// TODO: React Query로 대체 - 주문 현황 API 연동
const ORDER_STATUS = [
  { status: '입금확인', count: 0 },
  { status: '배송준비', count: 0 },
  { status: '배송중', count: 0 },
  { status: '배송완료', count: 0 },
]

export function MyPage() {
  const navigate = useNavigate()
  const user = useUser()
  const logout = useLogout()
  const { data: availableCoupons = [] } = useMyCoupons('AVAILABLE')

  const displayName = user ? `${user.nickname}님` : '비회원'
  const displayEmail = user?.email ?? ''

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-10 overflow-y-auto">
      {/* 1. User Profile Section - Figma Node 99:1201 */}
      <div className="px-[19.99px] pt-[23.99px] pb-[19.99px]">
        <div className="flex items-center gap-[14px]">
          <UserIcon type="bear" variant={10} size={56} className="shadow-sm" />
          <div className="flex flex-col gap-[1.99px]">
            <h2 className="font-noto text-[16px] font-medium leading-[24px] text-[#322927] tracking-tight">
              {displayName}
            </h2>
            <p className="font-noto text-[11px] font-normal leading-[16.5px] text-[#8B7E74]">
              {displayEmail}
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

      {/* 3. Section Divider - Figma Node 37:4300 (h:1.096px) */}
      <div className="h-[1.096px] w-full bg-separator" />

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

        {/* 쿠폰 */}
        <Link 
          to="/coupons" 
          className="flex h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">쿠폰</span>
          <div className="flex items-center gap-1">
            <span className="font-noto text-[12px] font-medium text-chat-font">{availableCoupons.length}장</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>
        
        {/* 배송지 관리 */}
        <Link 
          to="/shipping-addresses" 
          className="flex h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">배송지 관리</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        {/* 로그아웃 */}
        <button 
          onClick={handleLogout}
          className="flex w-full h-[51px] items-center justify-between px-[19.99px] border-b-[1.096px] border-separator bg-white active:bg-gray-50 transition-colors"
        >
          <span className="font-noto text-[12px] font-medium text-[#322927]">로그아웃</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B7E74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
