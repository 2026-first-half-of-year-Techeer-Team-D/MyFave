import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AddShippingPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    request: '',
    isDefault: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 배송지 등록 API 연동
    navigate('/payment')
  }

  return (
    <div className="flex-1 bg-white min-h-0 pb-10 overflow-y-auto">
      <form onSubmit={handleSubmit} className="px-[31px] pt-[28.01px] space-y-[44px]">
        {/* 이름 섹션 */}
        <div className="relative h-[64px]">
          <label className="absolute top-0 left-0 font-noto text-[16px] font-normal leading-[24px] text-black">
            이름
          </label>
          <input
            type="text"
            placeholder="받는 분의 이름을 입력해주세요"
            className="absolute bottom-0 left-0 w-full h-[35px] rounded-[5px] border border-separator px-[15px] font-noto text-[16px] text-black placeholder:text-[#CFB0B0] focus:border-point focus:outline-none transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* 휴대폰 번호 섹션 */}
        <div className="relative h-[64px]">
          <label className="absolute top-0 left-0 font-noto text-[16px] font-normal leading-[24px] text-black">
            휴대폰 번호
          </label>
          <input
            type="tel"
            placeholder="휴대폰번호를 입력해주세요"
            className="absolute bottom-0 left-0 w-full h-[35px] rounded-[5px] border border-separator px-[15px] font-noto text-[16px] text-black placeholder:text-[#CFB0B0] focus:border-point focus:outline-none transition-colors"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        {/* 주소 섹션 - Figma Node 100:327, 331, 333, 340 (간격 보정) */}
        <div className="space-y-[8px]">
          <label className="font-noto text-[16px] font-normal leading-[24px] text-black block">
            주소
          </label>
          <div className="space-y-[10px]">
            <div className="flex gap-[20px]">
              <input
                type="text"
                placeholder="우편번호"
                className="w-[224px] h-[35px] rounded-[5px] border border-separator px-[15px] font-noto text-[16px] text-black placeholder:text-[#CFB0B0] bg-white focus:outline-none"
                readOnly
                value={formData.zipcode}
              />
              <button
                type="button"
                className="w-[69px] h-[35px] rounded-[5px] bg-[#D9D9D9] font-noto text-[15px] font-medium text-[#949494] active:opacity-80 transition-opacity"
              >
                주소 찾기
              </button>
            </div>
            <input
              type="text"
              placeholder="주소"
              className="w-full h-[35px] rounded-[5px] border border-separator px-[15px] font-noto text-[16px] text-black placeholder:text-[#CFB0B0] bg-white focus:outline-none"
              readOnly
              value={formData.address}
            />
            <input
              type="text"
              placeholder="상세주소"
              className="w-full h-[35px] rounded-[5px] border border-separator px-[15px] font-noto text-[16px] text-black placeholder:text-[#CFB0B0] focus:border-point focus:outline-none transition-colors"
              value={formData.detailAddress}
              onChange={(e) => setFormData({...formData, detailAddress: e.target.value})}
            />
          </div>
        </div>

        {/* 배송 요청사항 섹션 */}
        <div className="relative h-[64px]">
          <label className="absolute top-0 left-0 font-noto text-[16px] font-normal leading-[24px] text-black">
            배송 요청사항 (선택)
          </label>
          <div className="absolute bottom-0 left-0 w-full h-[35px]">
            <select 
              className="w-full h-full rounded-[5px] border border-separator px-[15px] font-noto text-[16px] text-black focus:border-point focus:outline-none bg-white appearance-none"
              value={formData.request}
              onChange={(e) => setFormData({...formData, request: e.target.value})}
            >
              <option value="" className="text-[#CFB0B0]">배송 요청사항을 선택해주세요</option>
              <option value="문 앞에 두어주세요">문 앞에 두어주세요</option>
              <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-separator">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 기본 배송지 설정 - Figma Node 100:338 (정렬 및 밀착 보정) */}
        <div className="flex items-center gap-[6px] mt-[-40px]">
          <input
            type="checkbox"
            id="default-address"
            className="w-[13px] h-[13px] rounded-[2px] border-separator text-point focus:ring-0 cursor-pointer"
            checked={formData.isDefault}
            onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
          />
          <label htmlFor="default-address" className="font-noto text-[11px] font-normal text-[#949494] cursor-pointer">
            기본 배송지로 설정
          </label>
        </div>

        {/* 제출 버튼 - Figma Node 100:296 (h:36px) */}
        <div className="pt-[140px] flex justify-center">
          <button
            type="submit"
            className="w-[312px] h-[36px] rounded-[12px] bg-point font-noto text-[14px] font-bold text-white shadow-lg shadow-point/20 active:scale-[0.98] transition-all"
          >
            배송지 추가하기
          </button>
        </div>
      </form>
    </div>
  )
}
