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
    <div className="relative flex flex-1 flex-col bg-[#FFF9F0] overflow-hidden min-h-0">
      {/* Background Layer: Shop Page Content Mock (Figma Node 37:3357) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="flex gap-[24px] px-[20px] py-[16px] border-b border-[#F2EDEB] bg-white">
          <span className="font-noto text-[14px] font-medium text-[#322927] border-b-2 border-[#322927] pb-1">전체</span>
          <span className="font-noto text-[14px] font-medium text-[#8B7E74]">상의</span>
          <span className="font-noto text-[14px] font-medium text-[#8B7E74]">하의</span>
          <span className="font-noto text-[14px] font-medium text-[#8B7E74]">아우터</span>
          <span className="font-noto text-[14px] font-medium text-[#8B7E74]">악세사리</span>
        </div>
        <div className="mx-auto max-w-md px-[20px] grid grid-cols-2 gap-x-[15px] gap-y-[32px] pt-[32px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="h-[200px] bg-white rounded-[12px] mb-[12px] border border-[#F2EDEB]/50 shadow-sm" />
              <div className="h-4 bg-gray-200 w-full mb-1 rounded-sm" />
              <div className="h-4 bg-[#FF95B3]/10 w-1/2 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* 1. Header Notice Card - Figma Sub color1 (#E4DFE7) 반영 */}
      <div className="relative z-20 px-[20px] pt-[32px] pb-[16px]">
        <div className="rounded-[24px] bg-[#E4DFE7] p-[24px] shadow-sm border border-black/5">
          <p className="text-center font-noto text-[12px] font-bold leading-[18.2px] text-[#000000] tracking-tight">
            My Fave 판매 시작 30분전 라이브 채팅<br />
            <span className="font-normal opacity-90">오픈 30분 전, 지금이 찬스!<br />
            셀러에게 직접 물어보고 쇼핑 준비 완료하세요🎀</span>
          </p>
        </div>
      </div>

      {/* 2. Participant Badge - Figma #FF6B6B 컬러 정밀 반영 */}
      <div className="relative z-20 flex justify-center pb-[24px]">
        <div className="inline-flex items-center justify-center rounded-[10px] bg-[#E4DFE7] px-[12px] py-[4px] border border-black/5 shadow-inner">
          <span className="font-noto text-[11px] font-medium text-[#FF6B6B]">5,123명이 참여중입니다</span>
        </div>
      </div>

      {/* 3. Chat Messages Area - Spacing & Bubble Colors 100% Match */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-[19.99px] pb-[120px] scrollbar-hide"
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
                  <span className="font-noto text-[12px] font-normal leading-[18px] text-[#322927]/70">{msg.user}</span>
                  {msg.isOfficial && (
                    <span className="rounded-[2px] bg-[#FF95B3] px-[4px] py-[0.5px] text-[8px] font-black text-white uppercase tracking-tighter">My Fave 공식</span>
                  )}
                </div>
                <div className="flex items-end gap-[8px] max-w-[240px]">
                  <div 
                    className={`rounded-[15.5px] px-[16px] py-[9.5px] shadow-sm border border-[#F2EDEB]/50 ${
                      msg.user === '나' 
                        ? 'rounded-tr-none bg-[#FF95B3] text-white font-medium' 
                        : msg.isOfficial
                          ? 'rounded-tl-none bg-[#FFECF2] text-[#000000] font-medium' // 공식: Main color
                          : 'rounded-tl-none bg-[#FFF7F8] text-[rgba(0,0,0,0.9)] font-medium' // 일반: Chat color2
                    }`}
                  >
                    <p className={`font-noto text-[12px] font-normal tracking-tight ${msg.isOfficial ? 'leading-[12.1px]' : 'leading-[18.2px]'}`}>
                      {msg.text}
                    </p>
                  </div>
                  <span className="font-noto text-[9px] text-[#8B7E74]/50 mb-[2px] flex-shrink-0">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Sticky Input Bar - Figma Footer color (#FAFAF8) 및 정확한 버튼 컬러 적용 */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-[#FAFAF8] border-t border-[#F2EDEB] px-[20px] py-[16px] pb-[32px]">
        <form onSubmit={handleSend} className="flex items-center gap-[12px]">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="무엇이든 물어보세요!"
              className="w-full rounded-[21px] border border-[#F2EDEB] bg-white px-5 py-[11px] font-noto text-[12px] text-[#322927] placeholder:text-[#8B7E74]/40 focus:border-[#FF95B3] focus:outline-none transition-colors shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-[40px] items-center justify-center rounded-[21px] bg-[#FF95B3] px-[24px] font-noto text-[12px] font-bold text-white shadow-lg shadow-[#FF95B3]/20 transition-all hover:bg-[#ff7fa3] active:scale-95 disabled:opacity-50"
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  )
}
