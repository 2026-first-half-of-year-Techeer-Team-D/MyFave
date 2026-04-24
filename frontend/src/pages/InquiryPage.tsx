import { useState } from 'react'

interface InquiryFormData {
  name: string
  email: string
  phone: string
  category: string
  content: string
}

export function InquiryPage() {
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    content: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // TODO: 문의 제출 API 연동
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.')
    setFormData({ name: '', email: '', phone: '', category: 'general', content: '' })
  }

  return (
    <div className="flex-1 bg-white pb-12">
      <div className="border-b border-separator px-5 py-8">
        <h1 className="font-noto text-xl font-bold text-dark-text tracking-tight">1:1 문의</h1>
        <p className="mt-1 font-noto text-xs text-muted-text">궁금하신 점을 남겨주시면 정성껏 답변해 드리겠습니다.</p>
      </div>

      <div className="mx-auto max-w-md">
        <form onSubmit={handleSubmit} className="space-y-8 px-5 py-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block font-noto text-[13px] font-bold text-dark-text">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors"
                placeholder="이름을 입력해주세요"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-noto text-[13px] font-bold text-dark-text">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors"
                placeholder="example@myfave.kr"
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
              <label className="block font-noto text-[13px] font-bold text-dark-text">문의 분류</label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-separator bg-white px-4 py-3.5 font-noto text-sm text-dark-text focus:border-point focus:outline-none transition-colors"
                >
                  <option value="general">일반 문의</option>
                  <option value="product">상품 관련</option>
                  <option value="delivery">배송 관련</option>
                  <option value="return">반품/교환</option>
                  <option value="other">기타</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" className="text-muted-text" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-noto text-[13px] font-bold text-dark-text">내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded-xl border border-separator bg-white px-4 py-4 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none transition-colors resize-none"
                placeholder="문의 내용을 상세히 입력해주세요"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-point py-4 font-noto text-base font-black text-white shadow-lg shadow-point/30 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
          >
            문의 접수하기
          </button>
        </form>
      </div>
    </div>
  )
}
