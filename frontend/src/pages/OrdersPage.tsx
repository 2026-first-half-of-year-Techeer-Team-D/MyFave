import { Link } from 'react-router-dom'

import { useOrders } from '@/features/orders/hooks'

export function OrdersPage() {
  const orders = useOrders()

  if (orders.length === 0) {
    return (
      <div className="flex-1 bg-white p-12 text-center font-noto text-sm text-muted-text">
        주문 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white">
      {orders.map((order) => (
        <div key={order.id} className="pt-[28.01px]">
          <div className="flex justify-center mb-[34.99px]">
            <span className="font-noto text-[16px] font-medium text-[#000000]">
              {order.date}
            </span>
          </div>

          <div className="flex flex-col gap-[11.99px] px-[19.99px] pb-[22.37px]">
            {order.items.map((item) => (
              <Link
                key={item.id}
                to={`/orders/${order.id}`}
                className="flex gap-[11.99px] p-[15.99px] rounded-[12px] border-[1.096px] border-[#F2EDEB] bg-white active:bg-gray-50 transition-colors"
              >
                <div className="w-[84px] h-[84px] flex-shrink-0 overflow-hidden rounded-[15px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-[21px]">
                    <div className="flex justify-between items-start">
                      <span className="font-noto text-[11px] font-bold text-[#322927] leading-[15.13px] max-w-[86px]">
                        {item.name}
                      </span>
                      <span className="font-noto text-[16px] font-bold text-[#CF879B] leading-[24px]">
                        {item.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="w-[204px] h-[35px] flex items-center justify-center border border-[#F2EDEB] rounded-[5px] font-noto text-[15px] font-medium text-[#949494] hover:bg-gray-100 active:scale-[0.98] transition-all"
                      onClick={(e) => {
                        e.preventDefault()
                      }}
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="h-[8px] w-full bg-[#EFE9E0]" />
        </div>
      ))}
    </div>
  )
}
