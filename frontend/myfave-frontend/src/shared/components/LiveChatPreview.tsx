interface ChatMessage {
  user: string
  text: string
  avatarSrc: string
  isOfficial?: boolean
  align?: 'left' | 'right'
}

const chatMessages: ChatMessage[] = [
  {
    user: '복숭아맛구름',
    text: '드디어 오늘이다 ㅠㅠ 언니 트위드 자켓 기다렸어요!',
    avatarSrc:
      'https://api.builder.io/api/v1/image/assets/TEMP/5c35661ffb032d111daeaeddf909db75bead765c?width=46',
  },
  {
    user: '민트초코는진리',
    text: '혹시 니트 카디건 사이즈 프리인가요??',
    avatarSrc:
      'https://api.builder.io/api/v1/image/assets/TEMP/1eba4e904dccbdd1f1c9e77dc7b2459c7f3d30fe?width=46',
  },
  {
    user: 'My Fave 공식',
    text: '네! 앙고라 니트 카디건 사이즈 프리이고 40% 세일 중입니다💕 판매 시작되면 바로 확인해주세요!',
    avatarSrc:
      'https://api.builder.io/api/v1/image/assets/TEMP/10839d8a0a408e0bb7f424c267a2fb43e0feb3e4?width=46',
    isOfficial: true,
    align: 'right',
  },
  {
    user: '라벤더무드',
    text: '10분 전에 알림 한번 더 와주면 좋겠다!',
    avatarSrc:
      'https://api.builder.io/api/v1/image/assets/TEMP/fbce4987b2973b8b3f8ead9a566874da5b500af6?width=46',
  },
]

export function LiveChatPreview() {
  return (
    <div className="rounded-2xl border border-[#FFECF2] bg-[#FFF9F0] p-4">
      <div className="space-y-3">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.align === 'right' ? 'flex-row-reverse' : ''}`}
          >
            <img
              src={msg.avatarSrc}
              alt={msg.user}
              className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
            />
            <div className={`flex flex-col gap-0.5 ${msg.align === 'right' ? 'items-end' : ''}`}>
              <span className="font-noto text-[11px] font-medium text-[#322927]">
                {msg.user}
                {msg.isOfficial && (
                  <span className="ml-1 rounded bg-[#FF95B3] px-1 text-[9px] text-white">
                    공식
                  </span>
                )}
              </span>
              <div
                className={`max-w-[220px] rounded-2xl px-3 py-1.5 ${
                  msg.align === 'right' ? 'bg-[#FF95B3] text-white' : 'bg-[#FFF7F8] text-[#1B1B1B]'
                }`}
              >
                <p className="font-noto text-[11px] leading-[1.6]">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full rounded-full bg-[#FF95B3] py-2.5 font-noto text-sm font-medium text-white transition-colors hover:bg-[#ff7fa3]">
        라이브 채팅 시작하기
      </button>
    </div>
  )
}
