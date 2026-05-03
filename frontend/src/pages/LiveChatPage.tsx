import { useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { UserIcon } from '@/shared/components/UserIcon'

const THROTTLE_MS = 3000
const BEAR_VARIANTS = [1, 3, 5, 6, 7, 10] as const

function getVariantFromNickname(nickname: string): number {
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = (hash + nickname.charCodeAt(i)) % BEAR_VARIANTS.length
  }
  return BEAR_VARIANTS[hash]
}

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
  {
    id: 5,
    user: '바닐라라떼',
    text: '쿠폰 적용 중복으로 되나요?',
    avatarType: 'bear',
    avatarVariant: 1,
    timestamp: '오후 5:40',
  },
  {
    id: 6,
    user: 'My Fave 공식',
    text: '아쉽게도 쿠폰은 1주문당 1개만 적용 가능합니다. 하지만 무료배송 혜택은 자동 적용되니 걱정 마세요! 😊',
    avatarType: 'seller',
    avatarVariant: 1,
    isOfficial: true,
    timestamp: '오후 5:41',
  },
  {
    id: 7,
    user: '포근한겨울',
    text: '지난번 원피스 너무 잘 샀어요! 이번에도 기대중 ㅎㅎ',
    avatarType: 'bear',
    avatarVariant: 6,
    timestamp: '오후 5:43',
  },
]

export function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [isNoticeOpen, setIsNoticeOpen] = useState(true)
  const [participantCount, setParticipantCount] = useState(5123)
  const [isConnected, setIsConnected] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const stompClient = useRef<Client | null>(null)
  const lastSendTimeRef = useRef<number>(0)

  useEffect(() => {
    const wsBaseUrl = import.meta.env?.VITE_WS_BASE_URL
    if (!wsBaseUrl) return

    const httpUrl = wsBaseUrl.replace('ws://', 'http://').replace('wss://', 'https://')
    const token = localStorage.getItem('accessToken') ?? ''

    try {
      const client = new Client({
        webSocketFactory: () => new SockJS(httpUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })

      client.onConnect = () => {
        setIsConnected(true)
        client.subscribe('/topic/chat/1', (message) => {
          try {
            const data = JSON.parse(message.body)
            if (data.type === 'PARTICIPANT_COUNT') {
              setParticipantCount(data.payload.count)
            }
            if (data.type === 'NEW_MESSAGE') {
              const payload = data.payload
              const isOfficial = payload.nickname.includes('공식')
              const newMessage: Message = {
                id: Date.now(),
                user: payload.nickname,
                text: payload.content,
                avatarType: isOfficial ? 'seller' : 'bear',
                avatarVariant: isOfficial ? 1 : getVariantFromNickname(payload.nickname),
                isOfficial,
                timestamp: new Date(payload.sentAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              }
              setMessages((prev) => [...prev, newMessage])
            }
          } catch {
            // ignore malformed WS frames
          }
        })
      }

      client.onDisconnect = () => {
        setIsConnected(false)
      }

      client.onStompError = () => {
        setIsConnected(false)
      }

      client.activate()
      stompClient.current = client
    } catch {
      // WS unavailable — fallback to local-only mode
    }

    return () => {
      stompClient.current?.deactivate()
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const now = Date.now()
    if (now - lastSendTimeRef.current < THROTTLE_MS) return
    lastSendTimeRef.current = now

    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: '/app/chat/1',
        body: JSON.stringify({
          type: 'SEND_MESSAGE',
          payload: { content: inputText },
        }),
      })
    } else {
      // WS 미연결 시 로컬 업데이트 (데모/오프라인 백업)
      const newMessage: Message = {
        id: Date.now(),
        user: '나',
        text: inputText,
        avatarType: 'human',
        avatarVariant: 1,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, newMessage])
    }

    setInputText('')
    setIsCooldown(true)
    setTimeout(() => setIsCooldown(false), THROTTLE_MS)
  }, [inputText])

  return (
    <div className="relative flex flex-1 flex-col bg-white overflow-hidden min-h-0">
      {/* 0. Subtle Background Logo Watermark - Figma 디자인 명세 100% 동기화 */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.20]">
        <img
          src="/logo.svg"
          alt="My Fave Watermark"
          className="w-[50%] h-auto grayscale"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* 1. Header Notice Card - Figma Node 99:267 (#E4DFE7, 24px) */}
      <div className="relative z-20 px-[20px] pt-[32px] pb-[16px]">
        <div className={`relative rounded-[24px] bg-sub1 transition-all duration-300 ${isNoticeOpen ? 'p-[24px]' : 'py-[14px] px-[24px]'}`}>
          <div className={`overflow-hidden transition-all duration-300 ${isNoticeOpen ? 'max-h-[100px] opacity-100' : 'max-h-[20px] opacity-100'}`}>
            <p className={`text-center font-noto text-[12px] font-bold leading-[18.2px] text-[#000000] tracking-tight ${!isNoticeOpen && 'truncate px-4'}`}>
              My Fave 판매 시작 30분전 라이브 채팅
              {isNoticeOpen && (
                <>
                  <br />
                  <span className="font-normal opacity-90">오픈 30분 전, 지금이 찬스!<br />
                  셀러에게 직접 물어보고 쇼핑 준비 완료하세요🎀</span>
                </>
              )}
            </p>
          </div>
          <button 
            onClick={() => setIsNoticeOpen(!isNoticeOpen)}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 active:scale-90 transition-all"
            aria-label={isNoticeOpen ? "공지 접기" : "공지 펴기"}
          >
            <svg 
              width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-300 ${isNoticeOpen ? 'rotate-180' : 'rotate-0'}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Participant Badge + WS 연결 상태 */}
      <div className="relative z-20 flex items-center justify-center gap-[8px] pb-[24px]">
        <div className="inline-flex items-center justify-center rounded-[10px] bg-sub1 px-[12px] py-[4px] border border-black/5 shadow-inner">
          <span className="font-noto text-[11px] font-medium text-[#FF6B6B]">
            {participantCount.toLocaleString()}명이 참여중입니다
          </span>
        </div>
        <div className="inline-flex items-center gap-[4px] rounded-[10px] bg-sub1 px-[10px] py-[4px] border border-black/5">
          <span className={`h-[6px] w-[6px] rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="font-noto text-[10px] text-muted-text">
            {isConnected ? '연결됨' : '연결 대기'}
          </span>
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
                variant={msg.avatarVariant}
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
                        : 'rounded-tl-none bg-main-bg text-[rgba(0,0,0,0.9)] font-medium shadow-md shadow-main-bg/10'
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
            disabled={!inputText.trim() || isCooldown}
            className="flex h-[39px] w-[73px] items-center justify-center rounded-[21px] bg-point font-noto text-[12px] font-bold text-white shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCooldown ? '대기중' : '보내기'}
          </button>
        </form>
      </div>
    </div>
  )
}
