import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Coupon {
  id: number
  benefit: string
  title: string
  expiry: string
  type: 'pink' | 'white'
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    id: 1,
    benefit: '배송비 무료',
    title: '배송비 무료 쿠폰',
    expiry: '오늘 만료',
    type: 'pink'
  },
  {
    id: 2,
    benefit: '3,000원',
    title: '라이브 채팅 특별 이벤트 쿠폰',
    expiry: '오늘 만료',
    type: 'pink'
  },
  {
    id: 3,
    benefit: '10,000원',
    title: '라이브 채팅 특별 이벤트 쿠폰',
    expiry: '오늘 만료',
    type: 'white'
  }
]

export function CouponPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const handleApply = () => {
    // TODO: 쿠폰 적용 로직 연동
    navigate('/payment')
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-40 overflow-y-auto">
      <div className="px-[20px] pt-[28.01px]">
        <p className="font-noto text-[16px] font-medium text-black mb-[20px]">
          사용 가능한 쿠폰 : <span className="text-point">{AVAILABLE_COUPONS.length}장</span>
        </p>

        {/* Coupon Cards - Figma Node 251:1887, 1875, 1881 */}
        <div className="space-y-[16px]">
          {AVAILABLE_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => setSelectedId(coupon.id)}
              className={`relative h-[76px] w-full rounded-[10px] border cursor-pointer transition-all flex items-center px-[13px] ${
                coupon.type === 'pink'
                  ? 'bg-point border-separator text-white'
                  : 'bg-white border-separator text-black'
              } ${selectedId === coupon.id ? 'ring-2 ring-point ring-offset-2' : ''}`}
            >
              <div className="flex flex-col gap-[2px] flex-1">
                <span className="font-noto text-[16px] font-bold leading-[15.13px]">
                  {coupon.benefit}
                </span>
                <span className="font-noto text-[11px] font-bold leading-[15.13px]">
                  {coupon.title}
                </span>
                <span className={`font-noto text-[11px] font-normal leading-[15.13px] ${coupon.type === 'pink' ? 'text-white' : 'text-muted-text'}`}>
                  {coupon.expiry}
                </span>
              </div>
              
              {/* Divider line in card - Figma Node 251:1892 */}
              <div className={`absolute right-[55px] top-[12px] bottom-[12px] w-[1px] border-r border-dashed ${coupon.type === 'pink' ? 'border-white/30' : 'border-separator'}`} />
              
              {/* Status or selection indicator */}
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

        {/* Apply Button - Figma Node 251:1944 (h:32px) */}
        <div className="mt-[28px] flex justify-center">
          <button
            onClick={handleApply}
            className="w-[336px] h-[32px] rounded-[12px] bg-point font-noto text-[12px] font-bold text-white shadow-md active:scale-[0.98] transition-all"
          >
            쿠폰 적용하기
          </button>
        </div>
      </div>
    </div>
  )
}
