import { Link } from 'react-router-dom'

import { useInfluencerPicks } from '@/features/products/hooks'
import { LiveChatPreview } from '@/shared/components/LiveChatPreview'

const LOCAL_PICKS = [
  'https://drive.google.com/uc?export=download&id=10aaIz2zGl9SjJ4t2jvzupzp3cEmJunS5',
  'https://drive.google.com/uc?export=download&id=1bVTsVcodizBVE-HfqEKvxfoS-3nnTZ0A',
  'https://drive.google.com/uc?export=download&id=1mKTPc230bkNrk1wWEB0x_-EoO8zdkMfG',
  'https://drive.google.com/uc?export=download&id=1bVTsVcodizBVE-HfqEKvxfoS-3nnTZ0A',
]

export function MainPage() {
  const { data: influencerProducts } = useInfluencerPicks()

  return (
    <div className="flex-1 bg-white">
      {/* 1. Main Reels Banner */}
      <div className="mx-auto max-w-md px-[19.99px] pt-[18.01px] pb-[41.28px]">
        <div className="relative overflow-hidden rounded-[16px] bg-white border-0 shadow-figma-card h-[635.72px]">
          {/* Browser-like Header */}
          <div className="flex h-[40px] items-center gap-[8px] bg-main-bg px-[12px] border-0">
            <div className="h-[12px] w-[12px] rounded-full bg-[#FF5F57] shadow-sm" />
            <div className="h-[12px] w-[12px] rounded-full bg-[#FFBD2E] shadow-sm" />
            <div className="h-[12px] w-[12px] rounded-full bg-[#28C840] shadow-sm" />
          </div>
          <video
            src="https://drive.google.com/uc?export=download&id=10aaIz2zGl9SjJ4t2jvzupzp3cEmJunS5"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[595.72px] object-cover border-0"
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

      {/* 4. DAON'S PICK Section (Horizontal Scroll) */}
      <div className="mx-auto max-w-md pt-[23.99px] pb-20">
        <h2 className="px-[19.99px] mb-[15.99px] font-noto text-[16px] font-medium leading-[25.2px] text-dark-text tracking-tight uppercase">DAON'S PICK</h2>

        <div className="flex overflow-x-auto pb-4 gap-[12px] px-[19.99px] scrollbar-hide">
          {influencerProducts.map((product, index) => (
            <div
              key={product.id}
              className="group flex flex-col flex-shrink-0 w-[162.03px]"
            >
              <div className="relative mb-3 h-[288.06px] overflow-hidden rounded-[8px] bg-white border-0 shadow-sm">
                <video
                  src={LOCAL_PICKS[index % LOCAL_PICKS.length]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover border-0"
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
