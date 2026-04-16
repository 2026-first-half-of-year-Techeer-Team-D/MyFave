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
    <div className="flex-1">
      <div className="border-b border-separator px-5 py-6">
        <h1 className="font-noto text-xl font-bold text-dark-text">1:1 문의</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-5 py-8">
        <div>
          <label className="mb-2 block font-noto text-sm font-medium text-dark-text">이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
            placeholder="이름을 입력해주세요"
          />
        </div>

        <div>
          <label className="mb-2 block font-noto text-sm font-medium text-dark-text">이메일</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
            placeholder="이메일을 입력해주세요"
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
          <label className="mb-2 block font-noto text-sm font-medium text-dark-text">
            문의 분류
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text focus:border-point focus:outline-none"
          >
            <option value="general">일반 문의</option>
            <option value="product">상품 관련</option>
            <option value="delivery">배송 관련</option>
            <option value="return">반품/교환</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-noto text-sm font-medium text-dark-text">내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full rounded-lg border border-separator bg-white px-4 py-3 font-noto text-sm text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
            placeholder="문의 내용을 입력해주세요"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-point py-3 font-noto text-sm font-bold text-white transition-colors hover:bg-[#ff7fa3]"
        >
          문의 접수
        </button>
      </form>
    </div>
  )
}
