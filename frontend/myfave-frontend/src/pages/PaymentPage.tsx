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
    <div className="flex-1">
      {/* Progress Steps */}
      <div className="border-b border-separator px-5 py-6">
        <h1 className="mb-6 font-noto text-xl font-bold text-dark-text">주문하기</h1>
        <div className="flex items-center justify-between">
          {CHECKOUT_STEPS.map((s, idx) => (
            <div key={s.step} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-noto text-sm font-bold ${
                  s.step <= currentStep ? 'bg-point text-white' : 'bg-separator text-muted-text'
                }`}
              >
                {s.step}
              </div>
              <span
                className={`ml-2 font-noto text-xs font-medium ${
                  s.step <= currentStep ? 'text-dark-text' : 'text-muted-text'
                }`}
              >
                {s.label}
              </span>
              {idx < CHECKOUT_STEPS.length - 1 && (
                <div
                  className={`mx-3 h-1 w-6 ${s.step < currentStep ? 'bg-point' : 'bg-separator'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Shipping Info */}
      {currentStep === 1 && (
        <div className="space-y-5 px-5 py-8">
          <h2 className="font-noto text-lg font-bold text-dark-text">배송 정보</h2>
          <div>
            <label className="mb-2 block font-noto text-sm font-medium text-dark-text">이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
              placeholder="이름을 입력해주세요"
            />
          </div>
          <div>
            <label className="mb-2 block font-noto text-sm font-medium text-dark-text">
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
              placeholder="010-0000-0000"
            />
          </div>
          <div>
            <label className="mb-2 block font-noto text-sm font-medium text-dark-text">주소</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
              placeholder="도로명 주소를 입력해주세요"
            />
          </div>
          <div>
            <label className="mb-2 block font-noto text-sm font-medium text-dark-text">
              상세주소
            </label>
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleChange}
              className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
              placeholder="아파트 호수, 건물명 등을 입력해주세요"
            />
          </div>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {currentStep === 2 && (
        <div className="space-y-5 px-5 py-8">
          <h2 className="font-noto text-lg font-bold text-dark-text">결제 수단 선택</h2>
          <div className="space-y-3">
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center rounded-lg border border-separator p-4 transition-colors hover:bg-footer-bg"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={formData.paymentMethod === value}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="ml-3 font-noto text-sm font-medium text-dark-text">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Order Confirmation */}
      {currentStep === 3 && (
        <div className="space-y-6 px-5 py-8">
          <h2 className="font-noto text-lg font-bold text-dark-text">주문 확인</h2>
          <div className="space-y-4 rounded-lg border border-separator p-5">
            <div className="flex justify-between">
              <span className="font-noto text-sm text-muted-text">배송정보</span>
              <span className="font-noto text-sm text-dark-text">
                {formData.name} / {formData.phone}
              </span>
            </div>
            <div className="flex justify-between border-t border-separator pt-4">
              <span className="font-noto text-sm text-muted-text">배송주소</span>
              <span className="font-noto text-right text-sm text-dark-text">
                {formData.address} {formData.detailAddress}
              </span>
            </div>
            <div className="flex justify-between border-t border-separator pt-4">
              <span className="font-noto text-sm text-muted-text">결제수단</span>
              <span className="font-noto text-sm text-dark-text">
                {PAYMENT_METHOD_LABELS[formData.paymentMethod]}
              </span>
            </div>
            <div className="flex justify-between border-t border-separator pt-4">
              <span className="font-noto text-sm text-muted-text">주문금액</span>
              <span className="font-noto text-lg font-bold text-chat-font">134,000원</span>
            </div>
          </div>
          <label className="flex cursor-pointer items-center rounded-lg border border-separator p-4">
            <input type="checkbox" defaultChecked className="h-4 w-4" />
            <span className="ml-3 font-noto text-xs text-dark-text">
              주문 조건을 확인하였으며, 결제에 동의합니다.
            </span>
          </label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="sticky bottom-0 flex gap-3 border-t border-separator bg-white px-5 py-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex-1 rounded-lg border-2 border-point bg-white py-3 font-noto font-bold text-point transition-colors hover:bg-point hover:text-white"
          >
            이전
          </button>
        )}
        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex-1 rounded-lg bg-point py-3 font-noto font-bold text-white transition-colors hover:bg-[#ff7fa3]"
          >
            다음
          </button>
        ) : (
          <Link
            to="/orders"
            onClick={handleComplete}
            className="flex-1 rounded-lg bg-point py-3 text-center font-noto font-bold text-white transition-colors hover:bg-[#ff7fa3]"
          >
            주문하기
          </Link>
        )}
      </div>
    </div>
  )
}
