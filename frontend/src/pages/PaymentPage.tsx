import { useState } from 'react'
import { Link } from 'react-router-dom'

interface CheckoutStep {
  step: number
  label: string
}

const CHECKOUT_STEPS: CheckoutStep[] = [
  { step: 1, label: '배송정보' },
  { step: 2, label: '결제수단' },
  { step: 3, label: '주문확인' },
]

interface FormData {
  name: string
  phone: string
  address: string
  detailAddress: string
  paymentMethod: string
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  creditCard: '신용카드',
  debit: '체크카드',
  kakaopay: '카카오페이',
  naverpay: '네이버페이',
  bank: '무통장입금',
}

export function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    paymentMethod: 'creditCard',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  // TODO: 주문 완료 API 연동
  const handleComplete = () => {
    alert('주문이 완료되었습니다!')
  }

  return (
    <div className="flex-1 bg-white pb-24">
      {/* Progress Steps */}
      <div className="border-b border-separator px-5 py-8">
        <h1 className="mb-8 font-noto text-xl font-bold text-dark-text">주문하기</h1>
        <div className="relative flex items-center justify-between px-2">
          {/* Progress Line */}
          <div className="absolute left-0 top-[15px] h-0.5 w-full bg-separator" />
          <div 
            className="absolute left-0 top-[15px] h-0.5 bg-point transition-all duration-300" 
            style={{ width: `${((currentStep - 1) / (CHECKOUT_STEPS.length - 1)) * 100}%` }}
          />
          
          {CHECKOUT_STEPS.map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-lexend text-sm font-bold transition-all duration-300 ${
                  s.step <= currentStep 
                    ? 'border-point bg-point text-white shadow-md shadow-point/20' 
                    : 'border-separator bg-white text-muted-text'
                }`}
              >
                {s.step}
              </div>
              <span
                className={`font-noto text-[11px] font-bold transition-colors duration-300 ${
                  s.step <= currentStep ? 'text-dark-text' : 'text-muted-text'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Shipping Info */}
      {currentStep === 1 && (
        <div className="mx-auto max-w-md space-y-8 px-5 py-10">
          <div className="flex items-center justify-between">
            <h2 className="font-noto text-lg font-bold text-dark-text">배송 정보</h2>
            <span className="font-noto text-xs font-bold text-point underline cursor-pointer">최근 배송지</span>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block font-noto text-[13px] font-bold text-dark-text">받는 분</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors"
                placeholder="이름을 입력해주세요"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-noto text-[13px] font-bold text-dark-text">휴대폰 번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors"
                placeholder="010-0000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-noto text-[13px] font-bold text-dark-text">주소</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-xl border border-separator bg-gray-50 px-4 py-3.5 font-noto text-sm text-dark-text focus:outline-none cursor-default"
                  placeholder="우편번호"
                  readOnly
                />
                <button className="rounded-xl border border-point px-4 py-3.5 font-noto text-sm font-bold text-point hover:bg-main-bg active:scale-95 transition-all">
                  주소 찾기
                </button>
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors"
                placeholder="기본 주소"
              />
              <input
                type="text"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                className="w-full rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors"
                placeholder="상세 주소를 입력해주세요"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {currentStep === 2 && (
        <div className="mx-auto max-w-md space-y-8 px-5 py-10">
          <h2 className="font-noto text-lg font-bold text-dark-text">결제 수단 선택</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 transition-all active:scale-[0.98] ${
                  formData.paymentMethod === value
                    ? 'border-point bg-main-bg shadow-sm'
                    : 'border-separator bg-white hover:border-separator/70'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={formData.paymentMethod === value}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className={`font-noto text-sm font-bold ${
                  formData.paymentMethod === value ? 'text-point' : 'text-dark-text'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Order Confirmation */}
      {currentStep === 3 && (
        <div className="mx-auto max-w-md space-y-8 px-5 py-10">
          <h2 className="font-noto text-lg font-bold text-dark-text">주문 확인</h2>
          <div className="space-y-6 overflow-hidden rounded-2xl border border-separator bg-white shadow-sm">
            <div className="bg-footer-bg px-5 py-4">
              <span className="font-noto text-[13px] font-bold text-dark-text">최종 결제 정보</span>
            </div>
            <div className="space-y-4 px-5 pb-6">
              <div className="flex justify-between items-center">
                <span className="font-noto text-sm text-muted-text font-medium">배송정보</span>
                <span className="font-noto text-sm text-dark-text font-bold">
                  {formData.name} ({formData.phone})
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="font-noto text-sm text-muted-text font-medium flex-shrink-0">배송주소</span>
                <span className="font-noto text-right text-sm text-dark-text font-bold leading-snug">
                  {formData.address} {formData.detailAddress}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-noto text-sm text-muted-text font-medium">결제수단</span>
                <span className="font-noto text-sm text-dark-text font-bold">
                  {PAYMENT_METHOD_LABELS[formData.paymentMethod]}
                </span>
              </div>
              <div className="pt-4 border-t border-separator">
                <div className="flex justify-between items-center">
                  <span className="font-noto text-base font-bold text-dark-text">총 결제 금액</span>
                  <span className="font-noto text-xl font-black text-point">134,000원</span>
                </div>
              </div>
            </div>
          </div>
          
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-footer-bg p-4 transition-all active:scale-[0.99]">
            <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded text-point focus:ring-point" />
            <span className="font-noto text-[11px] leading-relaxed text-dark-text/70">
              구매 조건 확인 및 결제 진행에 동의합니다. (필수)<br/>
              개인정보 제3자 제공 동의에 동의합니다. (필수)
            </span>
          </label>
        </div>
      )}

      {/* Action Buttons (Fixed Bottom) */}
      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 gap-3 border-t border-separator bg-white p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex h-14 w-20 items-center justify-center rounded-2xl border-2 border-separator bg-white font-noto text-sm font-bold text-muted-text transition-all hover:bg-gray-50 active:scale-95"
          >
            이전
          </button>
        )}
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 rounded-2xl bg-point py-4 font-noto text-base font-bold text-white shadow-lg shadow-point/30 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
          >
            다음 단계로
          </button>
        ) : (
          <Link
            to="/orders"
            onClick={handleComplete}
            className="flex-1 rounded-2xl bg-point py-4 text-center font-noto text-base font-black text-white shadow-lg shadow-point/30 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
          >
            결제하기
          </Link>
        )}
      </div>
    </div>
  )
}
