import { useNavigate } from 'react-router-dom'

// 1:1 문의는 별도 백엔드 없이 인스타그램 DM으로 안내한다. (구 가짜 문의 폼 → DM 안내 페이지로 전환)
export function InquiryPage() {
  const navigate = useNavigate()

  return (
    <div className="flex-1 bg-white pb-10">
      <div className="border-b border-separator px-5 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1 font-noto text-[13px] font-medium text-[#8B7E74] active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>뒤로</span>
        </button>
        <h1 className="font-noto text-xl font-bold text-dark-text tracking-tight">1:1 문의</h1>
        <p className="mt-1 font-noto text-xs text-muted-text">인스타그램 DM으로 문의를 받고 있어요.</p>
      </div>

      <div className="mx-auto max-w-md px-5 pt-10 flex flex-col items-center text-center">
        <p className="font-noto text-[15px] font-medium leading-relaxed text-dark-text">
          1:1 문의는 인스타그램 DM으로 부탁드립니다!
        </p>
        <p className="mt-2 font-noto text-[13px] leading-relaxed text-muted-text">
          최대한 빠르게 답변 드릴게요 :)
        </p>

        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex h-[48px] w-full items-center justify-center rounded-[12px] bg-point font-noto text-[15px] font-bold text-white shadow-md active:scale-[0.98] transition-all"
        >
          인스타그램 바로가기
        </a>
      </div>
    </div>
  )
}
