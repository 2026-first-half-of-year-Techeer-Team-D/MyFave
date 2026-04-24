import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

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
    <div className="flex-1 bg-white pb-10">
      <div className="border-b border-separator px-5 py-8">
        <h1 className="font-noto text-xl font-bold text-dark-text tracking-tight">자주 묻는 질문</h1>
        <p className="mt-1 font-noto text-xs text-muted-text">도움이 필요하신가요? 궁금하신 점을 확인해보세요.</p>
      </div>

      <div className="mx-auto max-w-md divide-y divide-separator/50">
        {FAQs.map((faq) => (
          <div key={faq.id} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="flex w-full items-center justify-between px-5 py-5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-start gap-3">
                <span className="font-lexend text-sm font-black text-point">Q</span>
                <span className="font-noto text-sm font-bold text-dark-text leading-snug">{faq.question}</span>
              </div>
              <ChevronRight
                className={`h-4 w-4 flex-shrink-0 text-muted-text transition-transform duration-300 ${
                  expandedId === faq.id ? 'rotate-90' : ''
                }`}
              />
            </button>
            {expandedId === faq.id && (
              <div className="bg-footer-bg px-5 py-6">
                <div className="flex items-start gap-3">
                  <span className="font-lexend text-sm font-black text-muted-text/30">A</span>
                  <p className="font-noto text-[13px] leading-relaxed text-dark-text/80">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Link */}
      <div className="mx-auto max-w-md px-5 py-12 text-center">
        <p className="mb-4 font-noto text-xs text-muted-text">찾으시는 답변이 없으신가요?</p>
        <Link 
          to="/inquiry" 
          className="inline-flex items-center gap-2 rounded-xl border border-point px-6 py-2.5 font-noto text-sm font-bold text-point transition-all hover:bg-main-bg active:scale-95"
        >
          1:1 문의하기
        </Link>
      </div>
    </div>
  )
}
