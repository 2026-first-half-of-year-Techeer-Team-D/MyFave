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
      timestamp: '오후 5:40',
    }

    setMessages([...messages, newMessage])
    setInputText('')
  }

  return (
    <div className="relative flex flex-1 flex-col bg-white overflow-hidden min-h-0">
      {/* 0. Subtle Background Logo Watermark - Figma 디자인 명세 100% 동기화 */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/e7df4be5ec275bc11639573f94373e14d54c4a9e?width=240"
          alt="My Fave Watermark"
          className="w-[50%] h-auto grayscale"
        />
      </div>

      {/* 1. Header Notice Card - Figma Node 99:267 (#E4DFE7, 24px) */}
      <div className="relative z-20 px-[20px] pt-[32px] pb-[16px]">
        <div className="rounded-[24px] bg-sub1 p-[24px] shadow-sm border border-black/5">
          <p className="text-center font-noto text-[12px] font-bold leading-[18.2px] text-[#000000] tracking-tight">
            My Fave 판매 시작 30분전 라이브 채팅<br />
            <span className="font-normal opacity-90">오픈 30분 전, 지금이 찬스!<br />
            셀러에게 직접 물어보고 쇼핑 준비 완료하세요🎀</span>
          </p>
        </div>
      </div>

      {/* 2. Participant Badge - Figma Node 99:540 (#E4DFE7, #FF6B6B) */}
      <div className="relative z-20 flex justify-center pb-[24px]">
        <div className="inline-flex items-center justify-center rounded-[10px] bg-sub1 px-[12px] py-[4px] border border-black/5 shadow-inner">
          <span className="font-noto text-[11px] font-medium text-[#FF6B6B]">5,123명이 참여중입니다</span>
        </div>
      </div>

      {/* 3. Chat Messages Area - Spacing 17px & Bubble Colors 100% Match */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-[19.99px] pb-[100px] scrollbar-hide"
      >
        <div className="flex flex-col gap-[17px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-[8.5px] ${msg.isOfficial ? 'flex-row-reverse' : ''}`}>
              <UserIcon 
                type={msg.avatarType} 
                variant={msg.avatarVariant as any} 
                size={23.17} 
                className="flex-shrink-0 mt-[1px]" 
              />
              <div className={`flex flex-col gap-[4.5px] ${msg.isOfficial ? 'items-end' : ''}`}>
                <div className="flex items-center gap-[6px] px-[2px]">
                  <span className={`font-noto text-[12px] leading-[18px] text-[#000000] ${msg.isOfficial ? 'font-bold' : 'font-normal'}`}>
                    {msg.user}
                  </span>
                </div>
                <div className="flex items-end gap-[8px] max-w-[240px]">
                  <div 
                    className={`rounded-[15.5px] px-[16px] py-[9.5px] shadow-sm border border-separator/5 ${
                      msg.isOfficial
                        ? 'rounded-tr-none bg-main-bg text-[#000000] font-medium shadow-md shadow-main-bg/10' 
                        : 'rounded-tl-none bg-main-bg text-[rgba(0,0,0,0.9)] font-medium shadow-md shadow-main-bg/10' // 모든 상대 메시지는 Main color (#FFECF2)
                    }`}
                  >
                    <p className={`font-noto text-[12px] font-normal tracking-tight ${msg.isOfficial ? 'leading-[12.1px]' : 'leading-[18.2px]'}`}>
                      {msg.text}
                    </p>
                  </div>
                  <span className={`font-noto text-[9px] text-muted-text/50 mb-[2px] flex-shrink-0 ${msg.isOfficial ? 'order-first' : ''}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Floating Input & Send Button - Figma Rectangle 8 & 9 (x:14, y:766) 명세 100% 동기화 */}
      <div className="absolute bottom-[47px] left-0 right-0 z-30 px-[14px]">
        <form onSubmit={handleSend} className="flex items-center gap-[8px]">
          {/* Input Box - Figma Rectangle 8 */}
          <div className="flex-1 h-[39px]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="무엇이든 물어보세요!"
              className="w-full h-full rounded-[21px] border border-separator bg-[#FAFAF8] px-[23px] font-noto text-[12px] text-[#000000] placeholder:text-[#B8B8B8] focus:border-point focus:outline-none transition-colors shadow-inner"
            />
          </div>
          {/* Send Button - Figma Rectangle 9 */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-[39px] w-[73px] items-center justify-center rounded-[21px] bg-point font-noto text-[12px] font-bold text-white shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] active:scale-95 disabled:opacity-50"
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  )
}
