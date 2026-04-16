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
    <div className="flex-1">
      {/* Title */}
      <div className="border-b border-separator px-5 py-6">
        <h1 className="font-noto text-xl font-bold text-dark-text">주문 내역</h1>
      </div>

      {/* Status Filter */}
      <div className="border-b border-separator bg-white">
        <div className="overflow-x-auto px-5">
          <div className="flex gap-3 py-3">
            <button
              type="button"
              onClick={() => setSelectedStatus(null)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-noto text-sm font-medium transition-colors ${
                selectedStatus === null
                  ? 'bg-point text-white'
                  : 'bg-footer-bg text-dark-text hover:bg-separator'
              }`}
            >
              전체
            </button>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-noto text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-point text-white'
                    : 'bg-footer-bg text-dark-text hover:bg-separator'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4 px-5 py-6">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-2xl border border-separator bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between border-b border-separator pb-3">
                <span className="font-noto text-xs text-muted-text">{order.date}</span>
                <span
                  className={`rounded-full px-3 py-1 font-noto text-xs font-medium ${STATUS_BADGE_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="mb-3">
                <p className="font-noto text-sm text-dark-text">{order.items}</p>
              </div>
              <div className="flex items-center justify-between border-t border-separator pt-3">
                <span className="font-noto text-xs text-muted-text">주문번호: {order.id}</span>
                <span className="font-noto text-sm font-bold text-chat-font">{order.total}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="font-noto text-sm text-muted-text">주문 내역이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
