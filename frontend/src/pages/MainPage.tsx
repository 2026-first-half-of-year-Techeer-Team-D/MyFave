import { Link } from 'react-router-dom'

import { useInfluencerPicks } from '@/features/products/hooks'
import { LiveChatPreview } from '@/shared/components/LiveChatPreview'

export function MainPage() {
  const { data: influencerProducts } = useInfluencerPicks()

  return (
    <div className="flex-1 bg-white">
      {/* 1. Instagram Reels Banner */}
      <div className="mx-auto max-w-md px-[19.99px] pt-[18.01px] pb-[41.28px]">
        <div className="relative overflow-hidden rounded-[16px] border-figma border-main-bg bg-black shadow-figma-card h-[635.72px]">
          {/* Browser-like Header */}
          <div className="flex h-[40px] items-center gap-[8px] bg-main-bg px-[12px]">
            <div className="h-[12px] w-[12px] rounded-full bg-[#FF5F57] shadow-sm" />
            <div className="h-[12px] w-[12px] rounded-full bg-[#FFBD2E] shadow-sm" />
            <div className="h-[12px] w-[12px] rounded-full bg-[#28C840] shadow-sm" />
          </div>
          
          <div className="h-[593.53px] bg-[#111111] flex flex-col items-center justify-center p-8">
            <div className="flex flex-col items-center justify-center gap-[16px]">
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[18px] bg-gradient-to-br from-[#F09433] via-[#E6683C] to-[#BC1888] shadow-lg">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M22.666 2.66656H9.33299C5.65119 2.66656 2.6665 5.65125 2.6665 9.33305V22.666C2.6665 26.3478 5.65119 29.3325 9.33299 29.3325H22.666C26.3478 29.3325 29.3325 26.3478 29.3325 22.666V9.33305C29.3325 5.65125 26.3478 2.66656 22.666 2.66656Z" stroke="white" strokeWidth="2.39994" />
                  <path d="M15.9994 21.3328C18.9449 21.3328 21.3326 18.945 21.3326 15.9996C21.3326 13.0541 18.9449 10.6664 15.9994 10.6664C13.054 10.6664 10.6663 13.0541 10.6663 15.9996C10.6663 18.945 13.054 21.3328 15.9994 21.3328Z" stroke="white" strokeWidth="2.39994" />
                  <path d="M23.3326 10.2664C24.2163 10.2664 24.9326 9.55006 24.9326 8.66642C24.9326 7.78279 24.2163 7.06647 23.3326 7.06647C22.449 7.06647 21.7327 7.78279 21.7327 8.66642C21.7327 9.55006 22.449 10.2664 23.3326 10.2664Z" fill="white" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="mb-1 font-noto text-[14px] font-bold text-white/85 leading-[21px]">Instagram Reels</h3>
                <p className="font-noto text-[11px] text-white/45 leading-[17.6px]">동영상 URL을 입력하면 릴스가 자동 재생됩니다</p>
              </div>
              <button className="mt-2 flex h-[40.17px] w-[163.15px] items-center justify-center gap-[6px] rounded-full border-[1.096px] border-white/25 bg-transparent text-white transition-all hover:bg-white/10 active:scale-95">
                <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                  <path d="M9.19744 1.08203H3.78717C2.29316 1.08203 1.08203 2.29316 1.08203 3.78717V9.19744C1.08203 10.6915 2.29316 11.9026 3.78717 11.9026H9.19744C10.6915 11.9026 11.9026 10.6915 11.9026 9.19744V3.78717C11.9026 2.29316 10.6915 1.08203 9.19744 1.08203Z" stroke="white" strokeWidth="0.97385" />
                  <path d="M6.49224 8.65647C7.68744 8.65647 8.65635 7.68756 8.65635 6.49236C8.65635 5.29715 7.68744 4.32825 6.49224 4.32825C5.29703 4.32825 4.32812 5.29715 4.32812 6.49236C4.32812 7.68756 5.29703 8.65647 6.49224 8.65647Z" stroke="white" strokeWidth="0.97385" />
                  <path d="M9.46808 4.1659C9.82664 4.1659 10.1173 3.87523 10.1173 3.51666C10.1173 3.1581 9.82664 2.86743 9.46808 2.86743C9.10952 2.86743 8.81885 3.1581 8.81885 3.51666C8.81885 3.87523 9.10952 4.1659 9.46808 4.1659Z" fill="white" />
                </svg>
                <span className="font-noto text-[12px] font-medium text-white/85">인스타그램으로 이동</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Chat Section */}
      <div className="mx-auto max-w-md px-[19.99px] pb-[39.72px]">
        <LiveChatPreview />
      </div>

      {/* 3. Photo Grid Section (2*2) - 라이브 채팅 밑 */}
      <div className="mx-auto max-w-md px-[20px] pb-[40px]">
        <div className="grid grid-cols-2 gap-[12px]">
          {influencerProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="relative aspect-square overflow-hidden rounded-[8px] bg-gray-50 border border-separator/10 active:scale-[0.98] transition-transform"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Influencer’s PICK Section (Horizontal Scroll) */}
      <div className="mx-auto max-w-md pt-[23.99px] pb-20">
        <h2 className="px-[19.99px] mb-[15.99px] font-noto text-[16px] font-medium leading-[25.2px] text-dark-text tracking-tight uppercase">Influencer’s PICK</h2>

        <div className="flex overflow-x-auto pb-4 gap-[12px] px-[19.99px] scrollbar-hide">
          {influencerProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex flex-col flex-shrink-0 w-[162.03px]"
            >
              <div className="relative mb-3 h-[288.06px] overflow-hidden rounded-[8px] bg-gray-50 shadow-sm border border-separator/20">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-[2px]">
                  <span className="font-noto text-[9px] font-black text-white">❤️ {product.rating}</span>
                </div>
              </div>
              <div className="px-0.5">
                <h3 className="mb-0.5 h-9 font-noto text-[10px] font-normal text-dark-text line-clamp-2 leading-[18px] group-hover:text-point transition-colors tracking-tight whitespace-normal">
                  {product.title}
                </h3>
                <p className="font-noto text-[12px] font-medium text-point leading-[18px]">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
