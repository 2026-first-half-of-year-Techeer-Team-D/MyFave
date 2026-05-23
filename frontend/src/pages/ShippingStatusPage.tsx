import axios from 'axios'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'

import { useTracking } from '@/features/shipping/hooks'

const STEPS = ['결제완료', '배송준비중', '배송중', '배송완료']

function getStepIndex(statusCode: string): number {
  if (statusCode === 'DELIVERED') return 3
  if (['OUT_FOR_DELIVERY', 'SHIPPING', 'AT_HUB', 'IN_TRANSIT'].includes(statusCode)) return 2
  return 1
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorCode = error.response?.data?.errorCode
    if (errorCode === 'TRACKING_NOT_REGISTERED') return '운송장이 아직 등록되지 않았습니다.'
    if (errorCode === 'TRACKING_API_ERROR') return '배송 추적 서버 오류. 잠시 후 다시 시도해주세요.'
  }
  return '배송 정보를 불러올 수 없습니다.'
}

export function ShippingStatusPage() {
  const { orderId } = useParams()
  const { data, isLoading, error } = useTracking(orderId ? Number(orderId) : undefined)

  const currentStep = data ? getStepIndex(data.statusCode) : 0

  return (
    <div className="flex-1 bg-white pb-20 overflow-y-auto">
      <div className="px-5 py-6">
        {/* 주문번호 */}
        <p className="font-noto text-sm text-muted-text mb-4">주문번호: {orderId}</p>

        {/* 진행 바 */}
        <div className="mb-8 flex items-center justify-between px-4 py-8 bg-footer-bg rounded-xl border border-separator/10">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2">
                <span className={`font-noto text-[12px] ${idx === currentStep ? 'font-bold text-point' : 'text-dark-text'}`}>
                  {step}
                </span>
                <div className={`rounded-full ${idx === currentStep ? 'w-3 h-3 bg-point shadow-sm' : 'w-2 h-2 bg-point'}`} />
              </div>
              {idx < STEPS.length - 1 && (
                <div className="flex-1 h-px bg-separator/50 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* 에러 */}
        {error && !isLoading && (
          <div className="py-16 text-center">
            <p className="font-noto text-[14px] text-muted-text">{getErrorMessage(error)}</p>
          </div>
        )}

        {/* 현재 상태 요약 */}
        {data && (
          <>
            <div className="mb-4 p-4 rounded-xl bg-main-bg/20 border border-point/20">
              <p className="font-noto text-[13px] font-bold text-point">{data.statusName}</p>
              {data.location && (
                <p className="font-noto text-[12px] text-dark-text mt-1">{data.location}</p>
              )}
              {data.description && (
                <p className="font-noto text-[11px] text-muted-text mt-1">{data.description}</p>
              )}
              {data.trackingNumber && (
                <p className="font-noto text-[11px] text-muted-text mt-2">
                  운송장: {data.trackingNumber}
                </p>
              )}
            </div>

            {/* 배송 이력 테이블 */}
            <h2 className="font-noto text-base font-bold text-dark-text mb-4">배송 정보</h2>
            <div className="border border-separator/30 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-footer-bg border-b border-separator/30">
                    <th className="px-4 py-3 font-noto text-sm font-bold text-dark-text">처리 일시</th>
                    <th className="px-4 py-3 font-noto text-sm font-bold text-dark-text">현재 위치</th>
                    <th className="px-4 py-3 font-noto text-sm font-bold text-dark-text">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-separator/20">
                  {data.events.map((event, index) => (
                    <tr key={index} className={index === 0 ? 'bg-main-bg/10' : ''}>
                      <td className="px-4 py-4 font-noto text-[11px] text-dark-text leading-tight whitespace-pre-line">
                        {format(new Date(event.time), 'yyyy-MM-dd\nHH:mm:ss')}
                      </td>
                      <td className="px-4 py-4 font-noto text-[12px] text-dark-text leading-snug">
                        {event.location}
                      </td>
                      <td className={`px-4 py-4 font-noto text-[12px] font-medium ${index === 0 ? 'text-point font-bold' : 'text-dark-text'}`}>
                        {event.statusName}
                      </td>
                    </tr>
                  ))}
                  {data.events.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center font-noto text-[13px] text-muted-text">
                        배송 이력이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
