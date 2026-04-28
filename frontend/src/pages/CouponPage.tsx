import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCouponStore } from '@/features/coupons/store'

export function CouponPage() {
  const navigate = useNavigate()
  const available = useCouponStore((s) => s.available)
  const applied = useCouponStore((s) => s.applied)
  const applyCoupon = useCouponStore((s) => s.applyCoupon)
  const [selectedId, setSelectedId] = useState<number | null>(applied?.id ?? null)

  const toggleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const handleApply = () => {
    if (selectedId === null) {
      applyCoupon(null)
    } else {
      const selected = available.find((c) => c.id === selectedId)
      applyCoupon(selected ?? null)
    }
    navigate('/payment')
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-40 overflow-y-auto">
      <div className="px-[20px] pt-[28.01px]">
        <p className="font-noto text-[16px] font-medium text-black mb-[20px]">
          사용 가능한 쿠폰 : <span className="text-point">{available.length}장</span>
        </p>

        {/* Coupon Cards - Toggle 활성화 (클릭 시 선택/해제) */}
        <div className="space-y-[16px]">
          {available.map((coupon) => (
            <div
              key={coupon.id}
              onClick={() => toggleSelect(coupon.id)}
              className={`relative h-[76px] w-full rounded-[10px] border cursor-pointer transition-all flex items-center px-[13px] ${
                selectedId === coupon.id
                  ? 'bg-point border-point text-white shadow-md'
                  : 'bg-white border-separator text-black hover:border-point/30'
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
              
              <div className={`absolute right-[55px] top-[12px] bottom-[12px] w-[1px] border-r border-dashed ${selectedId === coupon.id ? 'border-white/30' : 'border-separator'}`} />
              
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
