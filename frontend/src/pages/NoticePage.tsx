interface NoticeItem {
  id: number
  title: string
  date: string
  content: string
}

// TODO: React Query로 대체 - 공지사항 API 연동
const NOTICES: NoticeItem[] = [
  {
    id: 1,
    title: '2026년 3월 신상품 입고 안내',
    date: '2026.03.15',
    content: '새로운 봄 시즌 컬렉션이 입고되었습니다. MY FAVE에서 만나보세요!',
  },
  {
    id: 2,
    title: '배송 일정 공지',
    date: '2026.03.10',
    content: '현재 1-2일 소요되던 배송이 주말을 제외하고 하루 만에 도착합니다.',
  },
  {
    id: 3,
    title: '고객센터 운영 시간 안내',
    date: '2026.03.05',
    content: '평일 11:00-18:00 / 점심 12:30-14:00 휴무 / 토일공휴일 휴무',
  },
]

export function NoticePage() {
  return (
    <div className="flex-1">
      <div className="border-b border-separator px-5 py-6">
        <h1 className="font-noto text-xl font-bold text-dark-text">공지사항</h1>
      </div>

      <div className="divide-y divide-separator">
        {NOTICES.map((notice) => (
          <div
            key={notice.id}
            className="cursor-pointer border-b border-separator px-5 py-4 transition-colors hover:bg-footer-bg"
          >
            <h3 className="mb-2 font-noto font-bold text-dark-text">{notice.title}</h3>
            <p className="mb-2 font-noto text-xs text-muted-text">{notice.date}</p>
            <p className="font-noto text-sm text-dark-text">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
