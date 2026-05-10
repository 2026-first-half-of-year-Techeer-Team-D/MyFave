import { Link } from 'react-router-dom'
import { UserIcon } from '@/shared/components/UserIcon'
import { useChatPreview } from '@/features/chat/hooks'

function getVariantFromNickname(nickname: string): number {
  const BEAR_VARIANTS = [1, 3, 5, 6, 7, 10] as const
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = (hash + nickname.charCodeAt(i)) % BEAR_VARIANTS.length
  }
  return BEAR_VARIANTS[hash]
}

export function LiveChatPreview() {
  const { data, isLoading, isError } = useChatPreview(5)

  if (isLoading) {
    return (
      <div className="rounded-[5px] border border-main-bg bg-main-bg p-[20px] shadow-sm">
        <div className="mb-[16px] flex items-center justify-between px-[2px]">
          <h3 className="font-noto text-[14px] font-bold text-dark-text tracking-tight">라이브 톡</h3>
          <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="space-y-[16px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-[8px]">
              <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-8 w-40 rounded-[15.5px] bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[20px] h-[46px] w-full rounded-[5px] bg-gray-200 animate-pulse" />
      </div>
    )
  }

  const isActive = !isError && data?.isActive === true
  const messages = data?.recentMessages ?? []

  return (
    <div className="rounded-[5px] border border-main-bg bg-main-bg p-[20px] shadow-sm">
      <div className="mb-[16px] flex items-center justify-between px-[2px]">
        <h3 className="font-noto text-[14px] font-bold text-dark-text tracking-tight">라이브 톡</h3>
        {isActive ? (
          <span className="flex items-center gap-1 font-noto text-[10px] text-point">
            <span className="h-1.5 w-1.5 rounded-full bg-point animate-pulse" />
            실시간
          </span>
        ) : (
          <span className="flex items-center gap-1 font-noto text-[10px] text-muted-text">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            준비중
          </span>
        )}
      </div>

      {messages.length > 0 ? (
        <div className="space-y-[16px]">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-[8px]">
              <UserIcon
                type="bear"
                variant={getVariantFromNickname(msg.senderNickname)}
                size={23.17}
                className="flex-shrink-0"
              />
              <div className="flex flex-col gap-[4px]">
                <span className="font-noto text-[12px] font-normal leading-[18px] text-dark-text/70">
                  {msg.senderNickname}
                </span>
                <div className="max-w-[210px] rounded-[15.5px] rounded-tl-none bg-chat-bg2 px-[16px] py-[10px] shadow-sm">
                  <p className="font-noto text-[12px] leading-[18.2px] font-normal tracking-tight text-chat-font2">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-6">
          <p className="font-noto text-[12px] text-muted-text">
            {isActive ? '아직 메시지가 없습니다' : '채팅방이 곧 활성화 됩니다'}
          </p>
        </div>
      )}

      <Link
        to="/live-chat"
        className="mt-[20px] flex h-[46px] w-full items-center justify-center rounded-[5px] bg-point font-montserrat text-[14px] font-semibold text-chat-bg shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
      >
        라이브 채팅 시작하기
      </Link>
    </div>
  )
}
