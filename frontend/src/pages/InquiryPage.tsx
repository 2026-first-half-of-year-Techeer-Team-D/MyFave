// 1:1 문의는 별도 백엔드 없이 인스타그램 DM으로 안내한다.
// 제목/뒤로가기는 공통 Layout(Header)에서 처리하고, 본문은 다른 안내 페이지(ShippingInfoPage 등)와 동일한 섹션 스타일을 따른다.
export function InquiryPage() {
  return (
    <div className="flex-1 bg-white pb-10">
      <div className="space-y-8 px-5 py-8">
        <section>
          <h2 className="mb-3 font-noto text-base font-bold text-dark-text">1:1 문의</h2>
          <p className="font-noto text-sm leading-relaxed text-muted-text">
            1:1 문의는 인스타그램 DM으로 부탁드립니다!<br />
            최대한 빠르게 답변 드릴게요 :)
          </p>
        </section>

        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[48px] w-full items-center justify-center rounded-[12px] bg-point font-noto text-[15px] font-bold text-white shadow-md active:scale-[0.98] transition-all"
        >
          인스타그램 바로가기
        </a>
      </div>
    </div>
  )
}
