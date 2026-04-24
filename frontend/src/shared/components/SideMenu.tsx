import { useState } from 'react'
import { Link } from 'react-router-dom'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [shopOpen, setShopOpen] = useState(true)
  const [communityOpen, setCommunityOpen] = useState(true)

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />}

      {/* Side menu drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-[251px] flex-col bg-white transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F2EDEB] px-5 py-3">
          <Link to="/" onClick={onClose}>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/4365f9105d58ff126ad032631f85a3a4610ef3f2?width=110"
              alt="My Fave"
              className="h-9 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="메뉴 닫기"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M16.4963 5.49878L5.49878 16.4963"
                stroke="#322927"
                strokeWidth="1.83293"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.49878 5.49878L16.4963 16.4963"
                stroke="#322927"
                strokeWidth="1.83293"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto">
          {/* HOME */}
          <Link
            to="/"
            onClick={onClose}
            className="block border-b border-[#F2EDEB] px-5 py-[11px]"
          >
            <span className="font-noto text-lg font-medium text-[#322927]">HOME</span>
          </Link>

          {/* SHOP */}
          <div className="border-b border-[#F2EDEB]">
            <button
              className="flex w-full items-center justify-between px-5 py-[11px]"
              onClick={() => setShopOpen(!shopOpen)}
            >
              <span className="font-noto text-lg font-medium text-[#322927]">SHOP</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`transition-transform ${shopOpen ? 'rotate-0' : 'rotate-180'}`}
              >
                <path
                  d="M14.9933 12.4943L9.99553 7.49658L4.9978 12.4943"
                  stroke="#322927"
                  strokeWidth="1.66591"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {shopOpen && (
              <div className="pb-2">
                {[
                  { label: '전체', path: '/shop' },
                  { label: '상의', path: '/shop?category=top' },
                  { label: '하의', path: '/shop?category=bottom' },
                  { label: '아우터', path: '/shop?category=outer' },
                  { label: '악세사리', path: '/shop?category=accessory' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className="block px-8 py-2 font-noto text-sm font-medium text-[#322927] hover:bg-[#FFF7F8]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* COMMUNITY */}
          <div className="border-b border-[#F2EDEB]">
            <button
              className="flex w-full items-center justify-between px-5 py-[11px]"
              onClick={() => setCommunityOpen(!communityOpen)}
            >
              <span className="font-noto text-lg font-medium text-[#322927]">COMMUNITY</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`transition-transform ${communityOpen ? 'rotate-0' : 'rotate-180'}`}
              >
                <path
                  d="M14.9933 12.4943L9.99553 7.49658L4.9978 12.4943"
                  stroke="#322927"
                  strokeWidth="1.66591"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {communityOpen && (
              <div className="pb-2">
                {[
                  { label: '마이 페이브 소개', path: '/about' },
                  { label: '공지사항', path: '/notice' },
                  { label: '자주 묻는 질문', path: '/faq' },
                  { label: '1:1 문의', path: '/inquiry' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={onClose}
                    className="block px-8 py-2 font-noto text-sm font-medium text-[#322927] hover:bg-[#FFF7F8]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* MY PAGE */}
          <Link
            to="/mypage"
            onClick={onClose}
            className="block border-b border-[#F2EDEB] px-5 py-[11px]"
          >
            <span className="font-noto text-lg font-medium text-[#322927]">MY PAGE</span>
          </Link>

          {/* ORDER */}
          <Link
            to="/orders"
            onClick={onClose}
            className="block border-b border-[#F2EDEB] px-5 py-[11px]"
          >
            <span className="font-noto text-lg font-medium text-[#322927]">ORDER</span>
          </Link>
        </div>
      </div>
    </>
  )
}
