import { useState } from 'react'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useShippingStore } from '@/features/shipping/store'
import type { Address } from '@/features/shipping/types'

interface AddressFormData {
  name: string
  phone: string
  zipcode: string
  address: string
  detailAddress: string
  request: string
  isDefault: boolean
}

interface DaumPostcodeData {
  address: string
  addressType: string
  bname: string
  buildingName: string
  zonecode: string
}

const initialFormData: AddressFormData = {
  name: '',
  phone: '',
  zipcode: '',
  address: '',
  detailAddress: '',
  request: '',
  isDefault: false,
}

function buildInitialFormData(target: Address | undefined): AddressFormData {
  if (!target) return initialFormData
  return {
    name: target.name,
    phone: target.phone,
    zipcode: target.zipcode ?? '',
    address: target.address,
    detailAddress: target.detailAddress ?? '',
    request: target.request ?? '',
    isDefault: target.isDefault,
  }
}

interface AddShippingFormProps {
  editId: string | null
  fromPath: string
  initialTarget: Address | undefined
}

function AddShippingForm({ editId, fromPath, initialTarget }: AddShippingFormProps) {
  const navigate = useNavigate()
  const addresses = useShippingStore((s) => s.addresses)
  const addAddress = useShippingStore((s) => s.addAddress)
  const updateAddress = useShippingStore((s) => s.updateAddress)
  const [isOpenPost, setIsOpenPost] = useState(false)
  const [formData, setFormData] = useState<AddressFormData>(() => buildInitialFormData(initialTarget))

  const handleComplete = (data: DaumPostcodeData) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    setFormData({
      ...formData,
      zipcode: data.zonecode,
      address: fullAddress,
    })
    setIsOpenPost(false)
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address) {
      alert('모든 필수 정보를 입력해주세요.')
      return
    }

    if (editId) {
      updateAddress(editId, {
        name: formData.name,
        phone: formData.phone,
        zipcode: formData.zipcode,
        address: formData.address,
        detailAddress: formData.detailAddress,
        request: formData.request,
        isDefault: formData.isDefault,
      })
    } else {
      const isFirstAddress = addresses.length === 0
      addAddress({
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        zipcode: formData.zipcode,
        address: formData.address,
        detailAddress: formData.detailAddress,
        request: formData.request,
        isDefault: formData.isDefault || isFirstAddress,
      })
    }

    navigate(fromPath)
  }

  return (
    <>
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
            onChange={handlePhoneChange}
            maxLength={13}
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
                onClick={() => setIsOpenPost(true)}
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

        {/* 기본 배송지 설정 - Figma Node 100:338 (크기 1.3배 확대 보정) */}
        <div className="flex items-center gap-[8px] mt-[-48px]">
          <input
            type="checkbox"
            id="default-address"
            className="w-[17px] h-[17px] rounded-[3px] border-separator text-point focus:ring-0 cursor-pointer"
            checked={formData.isDefault}
            onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
          />
          <label htmlFor="default-address" className="font-noto text-[14px] font-normal text-[#949494] cursor-pointer">
            기본 배송지로 설정
          </label>
        </div>

        <div className="pt-[140px] flex justify-center">
          <button
            type="submit"
            className="w-[312px] h-[36px] rounded-[12px] bg-point font-noto text-[14px] font-bold text-white shadow-lg shadow-point/20 active:scale-[0.98] transition-all"
          >
            {editId ? '배송지 수정하기' : '배송지 추가하기'}
          </button>
        </div>
      </form>

    </div>

    {/* 주소 검색 모달 — overflow 컨테이너 외부에 렌더링 */}
    {isOpenPost && (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4" onClick={() => setIsOpenPost(false)}>
        <div className="relative w-full max-w-[460px] bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-separator">
            <h2 className="font-noto text-[16px] font-bold">주소 찾기</h2>
            <button
              type="button"
              onClick={() => setIsOpenPost(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="w-full h-[480px]">
            <DaumPostcodeEmbed
              onComplete={handleComplete}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export function AddShippingPage() {
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')
  const fromPath = searchParams.get('from') || '/shipping-addresses'
  const initialTarget = useShippingStore((s) =>
    editId ? s.addresses.find((a) => a.id === editId) : undefined,
  )

  return (
    <AddShippingForm
      key={editId ?? 'new'}
      editId={editId}
      fromPath={fromPath}
      initialTarget={initialTarget}
    />
  )
}
