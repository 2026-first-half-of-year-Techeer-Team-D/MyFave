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
          
          <iframe
            src="https://www.instagram.com/reel/DXmDn2dCT9E/embed/"
            className="w-full h-[593.53px]"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          />
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
        <h2 className="px-[19.99px] mb-[15.99px] font-noto text-[16px] font-medium leading-[25.2px] text-dark-text tracking-tight uppercase">DAON’S PICK</h2>

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
