import { Link } from 'react-router-dom'

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
    <div className="rounded-[5px] border border-main-bg bg-main-bg p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-noto text-sm font-bold text-dark-text">라이브 톡</h3>
        <span className="flex items-center gap-1 font-noto text-[10px] text-point">
          <span className="h-1.5 w-1.5 rounded-full bg-point animate-pulse" />
          실시간
        </span>
      </div>
      <div className="space-y-4">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.align === 'right' ? 'flex-row-reverse' : ''}`}
          >
            <img
              src={msg.avatarSrc}
              alt={msg.user}
              className="h-8 w-8 flex-shrink-0 rounded-full border border-white/50 object-cover"
            />
            <div className={`flex flex-col gap-1 ${msg.align === 'right' ? 'items-end' : ''}`}>
              <span className="font-noto text-[10px] font-semibold text-dark-text/70">
                {msg.user}
                {msg.isOfficial && (
                  <span className="ml-1 rounded bg-point px-1 text-[8px] text-white">
                    공식
                  </span>
                )}
              </span>
              <div
                className={`max-w-[200px] rounded-[15.5px] px-4 py-2.5 ${
                  msg.align === 'right'
                    ? 'rounded-tr-none bg-point text-white'
                    : 'rounded-tl-none bg-chat-bg2 text-dark-text shadow-sm'
                }`}
              >
                <p className="font-noto text-[11px] leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link 
        to="/live-chat"
        className="mt-5 flex w-full items-center justify-center rounded-[12px] bg-point py-3.5 font-noto text-sm font-black text-white shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
      >
        라이브 채팅 참여하기
      </Link>
    </div>
  )
}
