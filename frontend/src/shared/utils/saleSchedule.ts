// 라이브 채팅은 판매 시작 30분 전에 열린다.
export const CHAT_OPEN_OFFSET_MS = 30 * 60 * 1000

/** 판매 시작까지 남은 초. 음수가 되면 0으로 clamp. */
export function getCountdownSeconds(saleStartAt: Date, now: Date = new Date()): number {
  const diff = Math.floor((saleStartAt.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

/** 라이브 채팅 오픈 시각 (Date) */
export function getChatOpenAt(saleStartAt: Date): Date {
  return new Date(saleStartAt.getTime() - CHAT_OPEN_OFFSET_MS)
}

export type ChatLifecycleState = 'BEFORE_OPEN' | 'OPEN' | 'CLOSED'

/**
 * 라이브 채팅 라이프사이클 상태 산출.
 * - isAdminClosed: 백엔드 ROOM_CLOSED 메시지가 수신된 경우 true (운영자 수동 종료).
 * - 우선순위: 운영자 수동 종료 > 시간 기반 잠금 > OPEN.
 */
export function getChatLifecycleState(params: {
  saleStartAt: Date
  now?: Date
  isAdminClosed?: boolean
}): ChatLifecycleState {
  const { saleStartAt, now = new Date(), isAdminClosed = false } = params
  if (isAdminClosed) return 'CLOSED'
  const chatOpenTimestamp = saleStartAt.getTime() - CHAT_OPEN_OFFSET_MS
  if (now.getTime() < chatOpenTimestamp) return 'BEFORE_OPEN'
  return 'OPEN'
}
