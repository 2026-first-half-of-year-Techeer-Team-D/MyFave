interface NoticeItem {
  id: number
  title: string
  content: string
}

const NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: 'MyFave 마켓 오픈 안내',
    content: 'MyFave 마켓이 2026년 5월 22일에 오픈 예정입니다! 많은 관심 부탁드려요',
  },
  {
    id: 2,
    title: '라이브 채팅 안내',
    content:
      '쇼핑 시작 30분전에 쇼핑몰 홈페이지 메인에서 진행하는 라이브 채팅에서 무엇이든지 물어보세요! 라이브 채팅에 참여하시는 모든 분들께 배송비 무료 쿠폰을 드립니다!',
  },
  {
    id: 3,
    title: '1:1 문의',
    content: '1:1문의는 DM으로 부탁드립니다. (Instagram @daonmoood)',
  },
]

export function NoticePage() {
  return (
    <div className="flex-1 bg-white pb-10">
      <div className="mx-auto max-w-md divide-y divide-separator/50">
        {NOTICES.map((notice) => (
          <div
            key={notice.id}
            className="group cursor-pointer px-5 py-6 transition-all hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="mb-2 flex items-center gap-2">
              {notice.id === 1 && (
                <span className="rounded bg-main-bg px-1.5 py-0.5 font-noto text-[10px] font-black text-point">NEW</span>
              )}
            </div>
            <h3 className="mb-2 font-noto text-base font-bold text-dark-text leading-snug group-hover:text-point transition-colors">
              {notice.title}
            </h3>
            <p className="font-noto text-[13px] leading-relaxed text-dark-text/70 line-clamp-2">
              {notice.content}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}
