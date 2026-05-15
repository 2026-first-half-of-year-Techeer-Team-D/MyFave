import { useNavigate, useParams } from 'react-router-dom'

import { useOrderDetailQuery } from '@/features/orders/hooks'
import type { BackendOrderStatus } from '@/features/orders/types'
import { PRODUCTS } from '@/features/products/mock'

const STATUS_LABEL: Record<BackendOrderStatus, string> = {
  PENDING: '결제 대기',
  PAID: '배송 준비중',
  SHIPPING: '배송 중',
  DELIVERY_COMPLETED: '배송 완료',
  PURCHASE_CONFIRMED: '구매 확정',
  CANCELLED: '주문 취소',
  REFUNDED: '환불 완료',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CARD: '카드',
  KAKAO_PAY: '카카오페이',
  NAVER_PAY: '네이버페이',
  TOSS_PAY: '토스페이',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function getProductImage(productId: number) {
  return PRODUCTS.find((p) => p.id === productId)?.image ?? ''
}

export function OrderDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const orderId = id ? Number(id) : undefined
  const { data, isLoading } = useOrderDetailQuery(orderId)

  if (isLoading) {
    return (
      <div className="flex-1 bg-white p-12 text-center font-noto text-sm text-muted-text">
        불러오는 중...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 bg-white p-12 text-center font-noto text-sm text-muted-text">
        존재하지 않는 주문입니다.
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white">
      <div className="flex justify-center pt-[28.01px] mb-[11px]">
        <span className="font-noto text-[16px] font-medium leading-[24px] text-[#000000]">
          {formatDate(data.createdAt)}
        </span>
      </div>

      <div className="flex flex-col gap-[11.99px] px-[19.99px] mb-[22.63px]">
        {data.orderItems.map((item) => (
          <div
            key={item.productId}
            className="flex gap-[11.99px] p-[15.99px] rounded-[12px] border-[1.096px] border-[#F2EDEB] bg-white"
          >
            <div className="w-[84px] h-[84px] flex-shrink-0 overflow-hidden rounded-[15px]">
              <img
                src={getProductImage(item.productId)}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between flex-1">
              <div className="flex flex-col gap-[21px]">
                <div className="flex justify-between items-start">
                  <span className="font-noto text-[11px] font-bold text-[#322927] leading-[15.13px] max-w-[97px]">
                    {item.productName}
                  </span>
                  <span className="font-noto text-[16px] font-bold text-[#CF879B] leading-[24px]">
                    {item.price.toLocaleString()}원
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-noto text-[11px] text-[#949494]">
                    {STATUS_LABEL[data.orderStatus]}
                  </span>
                  {data.orderStatus === 'SHIPPING' && (
                    <button
                      type="button"
                      onClick={() => navigate(`/shipping-status/${data.orderId}`)}
                      className="w-full h-[35px] flex items-center justify-center border border-[#F2EDEB] rounded-[5px] font-noto text-[15px] font-medium text-[#949494] active:bg-gray-50 transition-colors"
                    >
                      배송 조회
                    </button>
                  )}
                  {data.orderStatus === 'DELIVERY_COMPLETED' && (
                    <button
                      type="button"
                      className="w-full h-[35px] flex items-center justify-center border border-[#F2EDEB] rounded-[5px] font-noto text-[15px] font-medium text-[#949494] active:bg-gray-50 transition-colors"
                    >
                      구매 확정
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-[8px] w-full bg-[#EFE9E0] mb-[22px]" />

      {data.totalPaymentPrice != null && (
        <div className="px-[30px] pb-20">
          <h2 className="font-noto text-[16px] font-medium leading-[24px] text-[#000000] mb-[13px]">
            결제 정보
          </h2>
          <div className="flex flex-col gap-[5px] px-[3px]">
            <div className="flex justify-between items-center h-[24px]">
              <span className="font-noto text-[12px] font-normal text-[#000000]">상품 금액</span>
              <span className="font-noto text-[12px] font-normal text-[#000000] text-right">
                {(data.totalProductPrice ?? 0).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center h-[24px]">
              <span className="font-noto text-[12px] font-normal text-[#000000]">할인 금액</span>
              <span className="font-noto text-[12px] font-normal text-[#000000] text-right">
                -{(data.discountPrice ?? 0).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center h-[24px]">
              <span className="font-noto text-[12px] font-normal text-[#000000]">배송비</span>
              <span className="font-noto text-[12px] font-normal text-[#000000] text-right">
                {(data.deliveryFee ?? 0).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between items-center h-[24px]">
              <span className="font-noto text-[12px] font-normal text-[#000000]">결제 금액</span>
              <span className="font-noto text-[12px] font-bold text-[#CF879B] text-right">
                {data.totalPaymentPrice.toLocaleString()}원
              </span>
            </div>
            {data.paymentMethod && (
              <div className="flex justify-between items-center h-[24px]">
                <span className="font-noto text-[12px] font-normal text-[#000000]">결제 수단</span>
                <span className="font-noto text-[12px] font-normal text-[#000000] text-right">
                  {PAYMENT_METHOD_LABEL[data.paymentMethod] ?? data.paymentMethod}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {data.receiverName && (
        <div className="px-[30px] pb-20">
          <h2 className="font-noto text-[16px] font-medium leading-[24px] text-[#000000] mb-[13px]">
            배송 정보
          </h2>
          <div className="flex flex-col gap-[5px] px-[3px]">
            <p className="font-noto text-[12px] font-bold text-[#322927]">{data.receiverName}</p>
            <p className="font-noto text-[12px] font-normal text-[#322927]">{data.receiverPhone}</p>
            <p className="font-noto text-[12px] font-normal text-[#322927]">{data.receiverAddress}</p>
            {data.deliveryRequest && (
              <p className="font-noto text-[11px] text-[#8B7E74]">요청사항: {data.deliveryRequest}</p>
            )}
            {data.trackingNumber && (
              <p className="font-noto text-[11px] text-[#8B7E74]">
                {data.courierName} · 운송장 {data.trackingNumber}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
