import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

// TODO: React Query로 대체 - FAQ API 연동
const FAQs: FAQItem[] = [
  {
    id: 1,
    question: '배송은 얼마나 걸리나요?',
    answer: '주문 후 1-2영업일 내에 배송되며, 배송지에 따라 2-3일이 소요될 수 있습니다.',
  },
  {
    id: 2,
    question: '반품은 어떻게 하나요?',
    answer: '상품 수령 후 7일 이내에 고객센터로 연락하신 후 반품해주시면 됩니다.',
  },
  {
    id: 3,
    question: '결제 방법은 어떤 것들이 있나요?',
    answer:
      '신용카드, 체크카드, 무통장입금, 카카오페이, 네이버페이 등 다양한 결제수단을 지원합니다.',
  },
  {
    id: 4,
    question: '적립금은 어디에서 사용하나요?',
    answer: 'MY FAVE의 모든 상품 구매 시 적립금으로 결제할 수 있습니다.',
  },
]

export function FAQPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="flex-1">
      <div className="border-b border-separator px-5 py-6">
        <h1 className="font-noto text-xl font-bold text-dark-text">자주 묻는 질문</h1>
      </div>

      <div className="divide-y divide-separator">
        {FAQs.map((faq) => (
          <div key={faq.id}>
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-footer-bg"
            >
              <span className="font-noto font-medium text-dark-text">{faq.question}</span>
              <ChevronRight
                className={`h-5 w-5 flex-shrink-0 text-muted-text transition-transform ${
                  expandedId === faq.id ? 'rotate-90' : ''
                }`}
              />
            </button>
            {expandedId === faq.id && (
              <div className="border-t border-separator bg-footer-bg px-5 py-4">
                <p className="font-noto text-sm leading-relaxed text-dark-text">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
