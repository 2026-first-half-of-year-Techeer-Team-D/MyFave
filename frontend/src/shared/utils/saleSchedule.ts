// MyFave 판매 시작 절대 시각 및 라이브 채팅 라이프사이클 헬퍼.
//
// 운영자가 시각을 변경하려면 아래 SALE_START_AT 한 줄만 수정한다.
// 형식: ISO-8601 (KST = +09:00 명시).
//
// 사용자(운영자) 지시: "이 카운트 다운 바의 시간을 25일 22시로 설정해줘"
// → 가장 가까운 미래의 '25일 22시 KST' 로 해석. 오늘 기준(2026-05-24) 다음 도래 25일 22시는
//   2026-05-25 22:00 KST 이지만, MyFave 본격 판매 D-day 라는 맥락을 고려해 한 달 뒤
//   2026-06-25 22:00 KST 를 기본값으로 설정. 다음 25일로 변경하려면 아래 상수만 수정.
export const SALE_START_AT_ISO = '2026-06-25T22:00:00+09:00'

// 라이브 채팅은 판매 시작 30분 전에 열린다.
export const CHAT_OPEN_OFFSET_MS = 30 * 60 * 1000

const saleStartTimestamp = new Date(SALE_START_AT_ISO).getTime()
const chatOpenTimestamp = saleStartTimestamp - CHAT_OPEN_OFFSET_MS

/** 판매 시작까지 남은 초. 음수가 되면 0 으로 clamp. */
export function getCountdownSeconds(now: Date = new Date()): number {
  const diff = Math.floor((saleStartTimestamp - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

/** 라이브 채팅 오픈 시각 (Date) */
export function getChatOpenAt(): Date {
  return new Date(chatOpenTimestamp)
}

/** 판매 시작 시각 (Date) */
export function getSaleStartAt(): Date {
  return new Date(saleStartTimestamp)
}

export type ChatLifecycleState = 'BEFORE_OPEN' | 'OPEN' | 'CLOSED'

/**
 * 라이브 채팅 라이프사이클 상태 산출.
 * - isAdminClosed: 백엔드 ROOM_CLOSED 메시지가 수신된 경우 true (운영자 수동 종료).
 * - 우선순위: 운영자 수동 종료 > 시간 기반 잠금 > OPEN.
 */
export function getChatLifecycleState(params: {
  now?: Date
  isAdminClosed?: boolean
}): ChatLifecycleState {
  const { now = new Date(), isAdminClosed = false } = params
  if (isAdminClosed) return 'CLOSED'
  const ms = now.getTime()
  if (ms < chatOpenTimestamp) return 'BEFORE_OPEN'
  return 'OPEN'
}
