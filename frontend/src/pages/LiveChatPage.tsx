import { useState, useEffect, useRef } from 'react'
import { UserIcon } from '@/shared/components/UserIcon'

// Figma의 ShopPage 데이터를 배경으로 사용하기 위한 임시 데이터
const SHOP_PRODUCTS = [
  { id: 1, title: '[단품] 윙크 립 쉐이드 프라이머 15종 택 1', price: '16,000원' },
  { id: 2, title: '[set] 윙크 립 쉐이드 프라이머 15종 택 2', price: '32,000원' },
  { id: 3, title: '플로럴 블라썸 원피스', price: '89,000원' },
  { id: 4, title: '코튼 캐주얼 티셔츠', price: '45,000원' },
]

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
    avatarVariant: 5,
    timestamp: '오후 5:32',
  },
  {
    id: 2,
    user: '민트초코는진리',
    text: '혹시 니트 카디건 사이즈 프리인가요??',
    avatarType: 'bear',
    avatarVariant: 3,
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
      timestamp: '오후 5:40',
    }

    setMessages([...messages, newMessage])
    setInputText('')
  }

  return (
    <div className="relative flex flex-1 flex-col bg-[#FFF9F0] overflow-hidden min-h-0">
      {/* Background Shop Content Layer (Figma Node 251:1486) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        {/* Category Tabs Mock - 정밀 수치 반영 */}
        <div className="flex gap-[24px] px-[20px] py-[16px] border-b-[1.096px] border-separator bg-white">
          <div className="h-[18px] bg-dark-text/10 w-[40px] rounded-[2px]" />
          <div className="h-[18px] bg-dark-text/5 w-[40px] rounded-[2px]" />
          <div className="h-[18px] bg-dark-text/5 w-[40px] rounded-[2px]" />
          <div className="h-[18px] bg-dark-text/5 w-[40px] rounded-[2px]" />
        </div>
        <div className="mx-auto max-w-md px-[20px] grid grid-cols-2 gap-x-[15.15px] gap-y-[32px] pt-[32px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="h-[200.25px] bg-white rounded-[12px] mb-[12px] shadow-sm border border-separator/10" />
              <div className="h-[16px] bg-dark-text/10 w-full mb-[4px] rounded-[2px]" />
              <div className="h-[16px] bg-point/20 w-[60%] rounded-[2px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages Layer (Figma Node 245:193 & 251:1469) */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-[19.99px] pt-[32px] pb-[120px] scrollbar-hide"
      >
        <div className="flex flex-col gap-[17px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-[8.5px] ${msg.user === '나' ? 'flex-row-reverse' : ''}`}>
              <UserIcon 
                type={msg.avatarType} 
                variant={msg.avatarVariant as any} 
                size={23.17} 
                className="flex-shrink-0 mt-[1px]" 
              />
              <div className={`flex flex-col gap-[4.5px] ${msg.user === '나' ? 'items-end' : ''}`}>
                <div className="flex items-center gap-[6px] px-[2px]">
                  <span className="font-noto text-[12px] font-normal leading-[18px] text-dark-text/70">{msg.user}</span>
                  {msg.isOfficial && (
                    <span className="rounded-[2px] bg-point px-[4px] py-[1px] text-[9px] font-black text-white tracking-tighter uppercase">My Fave 공식</span>
                  )}
                </div>
                <div className="flex items-end gap-[8px] max-w-[240px]">
                  <div 
                    className={`rounded-[15.5px] px-4 py-2.5 shadow-sm border border-separator/5 ${
                      msg.user === '나' 
                        ? 'rounded-tr-none bg-point text-white' 
                        : 'rounded-tl-none bg-[#FFF7F8] text-dark-text'
                    }`}
                  >
                    <p className={`font-noto text-[12px] font-normal tracking-tight ${msg.isOfficial ? 'leading-[12.1px]' : 'leading-[18.2px]'}`}>
                      {msg.text}
                    </p>
                  </div>
                  <span className="font-noto text-[9px] text-muted-text/50 mb-[2px] flex-shrink-0">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action FAB (Figma Group 30) */}
      <button className="absolute bottom-[115px] right-[20px] z-30 h-[48.17px] w-[48.17px] rounded-full bg-white shadow-figma-popup flex items-center justify-center border border-separator/20 active:scale-95 transition-all">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-point">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
        </svg>
      </button>

      {/* Floating Sticky Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-xl border-t border-separator px-[20px] py-[16px] pb-[32px]">
        <form onSubmit={handleSend} className="flex items-center gap-[12px]">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full rounded-full border border-separator bg-footer-bg px-[20px] py-[11px] font-noto text-[14px] text-dark-text placeholder:text-muted-text/40 focus:border-point focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-point text-white shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] active:scale-90 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
