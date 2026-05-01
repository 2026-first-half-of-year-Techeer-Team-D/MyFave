import { Link } from 'react-router-dom'

import { useInfluencerPicks } from '@/features/products/hooks'
import { LiveChatPreview } from '@/shared/components/LiveChatPreview'

const DAONS_PICK_SHORTS = [
  '7s9NQcQMTHo',
  'd-Hrt-SC6D0',
  '1gfbdSHLDoY',
  'gh_yql93quc',
]

export function MainPage() {
  const { data: influencerProducts } = useInfluencerPicks()

  return (
    <div className="flex-1 bg-white">
      {/* 1. YouTube Shorts Banner */}
      <div className="mx-auto max-w-md px-[19.99px] pt-[18.01px] pb-[41.28px]">
        <div className="relative overflow-hidden rounded-[16px] border-figma border-main-bg bg-black shadow-figma-card h-[635.72px]">
          {/* Browser-like Header */}
          <div className="flex h-[40px] items-center gap-[8px] bg-main-bg px-[12px]">
            <div className="h-[12px] w-[12px] rounded-full bg-[#FF5F57] shadow-sm" />
            <div className="h-[12px] w-[12px] rounded-full bg-[#FFBD2E] shadow-sm" />
            <div className="h-[12px] w-[12px] rounded-full bg-[#28C840] shadow-sm" />
          </div>
          <iframe
            src="https://www.youtube.com/embed/_Cib8IO1-CU?autoplay=1&mute=1&loop=1&playlist=_Cib8IO1-CU&controls=0&modestbranding=1"
            className="w-full h-[595.72px] pointer-events-none"
            frameBorder="0"
            scrolling="no"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
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

      {/* 4. DAON’S PICK Section (Horizontal Scroll) */}
      <div className="mx-auto max-w-md pt-[23.99px] pb-20">
        <h2 className="px-[19.99px] mb-[15.99px] font-noto text-[16px] font-medium leading-[25.2px] text-dark-text tracking-tight uppercase">DAON’S PICK</h2>

        <div className="flex overflow-x-auto pb-4 gap-[12px] px-[19.99px] scrollbar-hide">
          {influencerProducts.map((product, index) => (
            <div
              key={product.id}
              className="group flex flex-col flex-shrink-0 w-[162.03px]"
            >
              <div className="relative mb-3 h-[288.06px] overflow-hidden rounded-[8px] bg-black shadow-sm border border-separator/20">
                <iframe
                  src={`https://www.youtube.com/embed/${DAONS_PICK_SHORTS[index % DAONS_PICK_SHORTS.length]}?autoplay=1&mute=1&loop=1&playlist=${DAONS_PICK_SHORTS[index % DAONS_PICK_SHORTS.length]}&controls=0&modestbranding=1`}
                  className="w-full h-full pointer-events-none scale-150"
                  frameBorder="0"
                  scrolling="no"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <Link to={`/product/${product.id}`} className="px-0.5">
                <h3 className="mb-0.5 h-9 font-noto text-[10px] font-normal text-dark-text line-clamp-2 leading-[18px] group-hover:text-point transition-colors tracking-tight whitespace-normal">
                  {product.title}
                </h3>
                <p className="font-noto text-[12px] font-medium text-point leading-[18px]">{product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
