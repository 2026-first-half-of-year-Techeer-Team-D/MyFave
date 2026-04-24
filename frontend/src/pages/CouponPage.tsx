import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Coupon {
  id: number
  benefit: string
  title: string
  expiry: string
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: 1,
    benefit: '배송비 무료',
    title: '배송비 무료 쿠폰',
    expiry: '오늘 만료',
  },
  {
    id: 2,
    benefit: '3,000원',
    title: '라이브 채팅 특별 이벤트 쿠폰',
    expiry: '오늘 만료',
  },
  {
    id: 3,
    benefit: '10,000원',
    title: '라이브 채팅 특별 이벤트 쿠폰',
    expiry: '오늘 만료',
  }
]

export function CouponPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleApply = () => {
    if (selectedId === null) return
    navigate('/payment')
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-40 overflow-y-auto">
      <div className="px-[20px] pt-[28.01px]">
        <p className="font-noto text-[16px] font-medium text-black mb-[20px]">
          사용 가능한 쿠폰 : <span className="text-point">{AVAILABLE_COUPONS.length}장</span>
        </p>

        {/* Coupon Cards - Figma 명세 100% 동기화 (클릭 시에만 핑크색 활성화) */}
        <div className="space-y-[16px]">
          {AVAILABLE_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => setSelectedId(coupon.id)}
              className={`relative h-[76px] w-full rounded-[10px] border cursor-pointer transition-all flex items-center px-[13px] ${
                selectedId === coupon.id
                  ? 'bg-point border-point text-white shadow-md' // 활성 상태: 핑크 배경
                  : 'bg-white border-separator text-black hover:border-point/30' // 기본 상태: 화이트 배경
              }`}
            >
              <div className="flex flex-col gap-[2px] flex-1">
                <span className={`font-noto text-[16px] font-bold leading-[15.13px] ${selectedId === coupon.id ? 'text-white' : 'text-black'}`}>
                  {coupon.benefit}
                </span>
                <span className={`font-noto text-[11px] font-bold leading-[15.13px] ${selectedId === coupon.id ? 'text-white' : 'text-black'}`}>
                  {coupon.title}
                </span>
                <span className={`font-noto text-[11px] font-normal leading-[15.13px] ${selectedId === coupon.id ? 'text-white/80' : 'text-muted-text'}`}>
                  {coupon.expiry}
                </span>
              </div>
              
              {/* Divider line in card */}
              <div className={`absolute right-[55px] top-[12px] bottom-[12px] w-[1px] border-r border-dashed ${selectedId === coupon.id ? 'border-white/30' : 'border-separator'}`} />
              
              {/* Selection indicator */}
              {selectedId === coupon.id && (
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center ml-2">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF95B3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                     <polyline points="20 6 9 17 4 12" />
                   </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="mt-[28px] flex justify-center">
          <button
            onClick={handleApply}
            disabled={selectedId === null}
            className={`w-[336px] h-[32px] rounded-[12px] font-noto text-[12px] font-bold text-white shadow-md active:scale-[0.98] transition-all ${
              selectedId !== null ? 'bg-point' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            쿠폰 적용하기
          </button>
        </div>
      </div>
    </div>
  )
}
