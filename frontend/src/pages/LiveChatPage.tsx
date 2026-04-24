import { useState, useEffect, useRef } from 'react'
import { UserIcon } from '@/shared/components/UserIcon'

interface Message {
  id: number
  user: string
  text: string
  avatarType: 'bear' | 'human' | 'seller'
  avatarVariant: number
  isOfficial?: boolean
  timestamp: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    user: '복숭아맛구름',
    text: '드디어 오늘이다 ㅠㅠ 언니 트위드 자켓 기다렸어요!',
    avatarType: 'bear',
    avatarVariant: 10,
    timestamp: '오후 5:32',
  },
  {
    id: 2,
    user: '민트초코는진리',
    text: '혹시 니트 카디건 사이즈 프리인가요??',
    avatarType: 'bear',
    avatarVariant: 6,
    timestamp: '오후 5:35',
  },
  {
    id: 3,
    user: 'My Fave 공식',
    text: '네! 앙고라 니트 카디건 사이즈 프리이고 40% 세일 중입니다💕 판매 시작되면 바로 확인해주세요!',
    avatarType: 'seller',
    avatarVariant: 1,
    isOfficial: true,
    timestamp: '오후 5:36',
  },
  {
    id: 4,
    user: '라벤더무드',
    text: '10분 전에 알림 한번 더 와주면 좋겠다!',
    avatarType: 'bear',
    avatarVariant: 7,
    timestamp: '오후 5:38',
  },
]

export function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      user: '나',
      text: inputText,
      avatarType: 'human',
      avatarVariant: 1,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, newMessage])
    setInputText('')
  }

  return (
    <div className="flex flex-1 flex-col bg-[#FFF9F0] h-full overflow-hidden">
      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-8 space-y-6 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.user === '나' ? 'flex-row-reverse' : ''}`}>
            <UserIcon type={msg.avatarType} variant={msg.avatarVariant as any} size={40} className="flex-shrink-0" />
            <div className={`flex flex-col gap-1.5 ${msg.user === '나' ? 'items-end' : ''}`}>
              <div className="flex items-center gap-1.5">
                <span className="font-noto text-[11px] font-bold text-dark-text/70">{msg.user}</span>
                {msg.isOfficial && (
                  <span className="rounded bg-point px-1.5 py-0.5 text-[9px] font-black text-white">공식</span>
                )}
              </div>
              <div className="flex items-end gap-2 max-w-[260px]">
                <div 
                  className={`rounded-[15.5px] px-4 py-2.5 shadow-sm ${
                    msg.user === '나' 
                      ? 'rounded-tr-none bg-point text-white' 
                      : 'rounded-tl-none bg-white text-dark-text'
                  }`}
                >
                  <p className="font-noto text-[13px] leading-relaxed font-medium">{msg.text}</p>
                </div>
                <span className="font-noto text-[9px] text-muted-text/60 mb-1 flex-shrink-0">{msg.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-separator bg-white px-5 py-4 pb-10">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full rounded-full border border-separator bg-footer-bg px-5 py-3 font-noto text-sm text-dark-text focus:border-point focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-point text-white shadow-md shadow-point/20 transition-all hover:bg-[#ff7fa3] active:scale-90 disabled:opacity-50 disabled:grayscale"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
