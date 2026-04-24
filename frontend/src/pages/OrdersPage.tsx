import { useState } from 'react'
import { Link } from 'react-router-dom'

type OrderStatus = '입금확인' | '배송준비' | '배송중' | '배송완료'

interface Order {
  id: string
  date: string
  status: OrderStatus
  items: string
  total: string
}

// TODO: React Query로 대체 - 주문 내역 API 연동
const ORDERS: Order[] = [
  {
    id: '2026-001',
    date: '2026.03.16',
    status: '배송완료',
    items: '플로럴 블라썸 원피스 외 1건',
    total: '134,000원',
  },
  {
    id: '2026-002',
    date: '2026.03.10',
    status: '배송완료',
    items: '코튼 캐주얼 티셔츠',
    total: '45,000원',
  },
]

const STATUS_OPTIONS: OrderStatus[] = ['입금확인', '배송준비', '배송중', '배송완료']

const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  배송완료: 'bg-green-100 text-green-700',
  배송중: 'bg-blue-100 text-blue-700',
  배송준비: 'bg-yellow-100 text-yellow-700',
  입금확인: 'bg-yellow-100 text-yellow-700',
}

export function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)

  const filteredOrders = selectedStatus
    ? ORDERS.filter((order) => order.status === selectedStatus)
    : ORDERS

  return (
    <div className="flex-1 bg-white pb-10">
      {/* Title */}
      <div className="border-b border-separator px-5 py-6">
        <h1 className="font-noto text-xl font-bold text-dark-text">주문 내역</h1>
      </div>

      {/* Status Filter */}
      <div className="sticky top-[86px] z-30 border-b border-separator bg-white">
        <div className="mx-auto max-w-md overflow-x-auto px-5">
          <div className="flex gap-2 py-4">
            <button
              type="button"
              onClick={() => setSelectedStatus(null)}
              className={`whitespace-nowrap rounded-xl px-5 py-2.5 font-noto text-[13px] font-bold transition-all active:scale-95 ${
                selectedStatus === null
                  ? 'bg-point text-white shadow-md shadow-point/20'
                  : 'bg-footer-bg text-muted-text hover:bg-separator/50'
              }`}
            >
              전체
            </button>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 font-noto text-[13px] font-bold transition-all active:scale-95 ${
                  selectedStatus === status
                    ? 'bg-point text-white shadow-md shadow-point/20'
                    : 'bg-footer-bg text-muted-text hover:bg-separator/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="mx-auto max-w-md px-5 py-8">
        {filteredOrders.length > 0 ? (
          <div className="space-y-10">
            {filteredOrders.map((order) => (
              <div key={order.id} className="space-y-4">
                <div className="flex items-center justify-between border-b-2 border-separator pb-3">
                  <span className="font-lexend text-sm font-black text-dark-text">
                    {order.date} (수)
                  </span>
                  <Link to={`/orders/${order.id}`} className="font-noto text-[11px] font-bold text-muted-text/60 underline">
                    상세보기
                  </Link>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl border border-separator bg-white p-5 shadow-sm active:scale-[0.99] transition-transform">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-lexend text-[11px] font-bold text-muted-text/50">
                      NO. {order.id}
                    </span>
                    <span
                      className={`rounded-lg px-2.5 py-1 font-noto text-[10px] font-black ${STATUS_BADGE_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gray-50 overflow-hidden">
                      <img 
                        src="https://api.builder.io/api/v1/image/assets/TEMP/f7d12ab62f820812ec916bad427ac8ab729ac356?width=100" 
                        alt="Product" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="mb-1 font-noto text-sm font-bold text-dark-text line-clamp-1">
                        {order.items}
                      </h3>
                      <p className="font-noto text-sm font-black text-point">
                        {order.total}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-footer-bg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-muted-text/30">
                <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-noto text-sm font-medium text-muted-text">주문 내역이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
