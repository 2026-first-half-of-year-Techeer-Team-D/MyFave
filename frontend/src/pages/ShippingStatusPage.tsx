import { useParams } from 'react-router-dom'

export function ShippingStatusPage() {
  const { orderId } = useParams()

  // Mock data for shipping status
  const shippingHistory = [
    { time: '2026-03-12 13:17:26', location: '강북직영1팀 (이동윤)', status: '배달완료' },
    { time: '2026-03-12 11:27:57', location: '강북직영1팀 (이동윤)', status: '배달중' },
    { time: '2026-03-12 08:32:59', location: '강북직영1팀', status: '배달지 도착' },
    { time: '2026-03-12 08:31:52', location: '강북직영1팀', status: '배달지도착' },
    { time: '2026-03-11 22:15:30', location: '동서울Hub', status: '배송중(출고)' },
    { time: '2026-03-11 18:42:15', location: '동서울Hub', status: '배송중(입고)' },
    { time: '2026-03-11 04:33:02', location: '대전Hub', status: '배송중(입고)' },
    { time: '2026-03-11 01:22:18', location: '대전Hub', status: '배송중(출고)' },
    { time: '2026-03-10 20:15:44', location: '군포Hub', status: '배송중(입고)' },
    { time: '2026-03-10 16:30:22', location: '군포Hub', status: '배송중(출고)' },
    { time: '2026-03-10 12:45:00', location: '서울성동직영', status: '집하' },
  ]

  return (
    <div className="flex-1 bg-white pb-20 overflow-y-auto">
      <div className="px-5 py-6">
        <div className="mb-8">
          <p className="font-noto text-sm text-muted-text mb-2">주문번호: {orderId}</p>
          <div className="flex items-center justify-between px-4 py-8 bg-footer-bg rounded-xl border border-separator/10">
            <div className="flex flex-col items-center gap-2">
              <span className="font-noto text-[12px] text-dark-text">결제완료</span>
              <div className="w-2 h-2 rounded-full bg-point"></div>
            </div>
            <div className="flex-1 h-px bg-separator/50 mx-2"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-noto text-[12px] text-dark-text">배송준비중</span>
              <div className="w-2 h-2 rounded-full bg-point"></div>
            </div>
            <div className="flex-1 h-px bg-separator/50 mx-2"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-noto text-[12px] text-dark-text">배송중</span>
              <div className="w-2 h-2 rounded-full bg-point"></div>
            </div>
            <div className="flex-1 h-px bg-separator/50 mx-2"></div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-noto text-[12px] font-bold text-point">배송완료</span>
              <div className="w-3 h-3 rounded-full bg-point shadow-sm"></div>
            </div>
          </div>
        </div>

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
              {shippingHistory.map((item, index) => (
                <tr key={index} className={index === 0 ? 'bg-main-bg/10' : ''}>
                  <td className="px-4 py-4 font-noto text-[11px] text-dark-text leading-tight whitespace-pre-line">
                    {item.time.split(' ').join('\n')}
                  </td>
                  <td className="px-4 py-4 font-noto text-[12px] text-dark-text leading-snug">
                    {item.location}
                  </td>
                  <td className={`px-4 py-4 font-noto text-[12px] font-medium ${index === 0 ? 'text-point font-bold' : 'text-dark-text'}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
