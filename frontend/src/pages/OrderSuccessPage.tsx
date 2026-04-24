import { Link } from 'react-router-dom'

export function OrderSuccessPage() {
  const orderNumber = '2026032329760731'
  const orderDate = '2026.03.23. 23:05:00'

  return (
    <div className="flex-1 bg-white flex flex-col items-center justify-center px-[19.99px] py-[60px] min-h-0">
      {/* 1. Success Message - Figma Node 251:2433 */}
      <div className="mb-[24px] text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-main-bg rounded-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF95B3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h1 className="font-noto text-[24px] font-bold text-point tracking-tight mb-[16px]">
          주문이 완료되었습니다
        </h1>
        <p className="font-noto text-[14px] leading-[22px] text-chat-font text-center whitespace-pre-line">
          {orderDate}{"\n"}
          주문번호 {orderNumber}
        </p>
      </div>

      {/* 2. Shipping Note - Figma Node 251:2790 */}
      <div className="w-full bg-footer-bg rounded-[12px] p-[20px] mb-[40px]">
        <p className="font-noto text-[12px] leading-[20px] text-muted-text text-center">
          배송은 3~7일정도 걸리며{"\n"}
          제주 및 도서 산간지역은 더 걸릴 수 있습니다.
        </p>
      </div>

      {/* 3. Action Buttons */}
      <div className="w-full space-y-[12px]">
        <Link 
          to="/orders"
          className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-point font-noto text-[16px] font-bold text-white shadow-lg shadow-point/20 active:scale-[0.98] transition-all"
        >
          주문 내역 보기
        </Link>
        <Link 
          to="/"
          className="flex h-[56px] w-full items-center justify-center rounded-[12px] border border-separator bg-white font-noto text-[16px] font-medium text-dark-text active:bg-gray-50 transition-all"
        >
          계속 쇼핑하기
        </Link>
      </div>
    </div>
  )
}
