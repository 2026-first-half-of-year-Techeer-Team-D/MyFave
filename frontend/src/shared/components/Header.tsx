import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { SideMenu } from '@/shared/components/SideMenu'

interface HeaderProps {
  showCountdown?: boolean
}

export function Header({ showCountdown = true }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(17 * 60 * 39 + 1) // 17:39:01

  useEffect(() => {
    if (!showCountdown) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [showCountdown])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-footer-bg shadow-sm">
        {/* Countdown bar */}
        {showCountdown && (
          <div className="flex h-[30px] items-center justify-center bg-main-bg">
            <span className="font-lexend text-[10px] font-semibold text-point">
              마이페이브 판매 시작까지{' '}
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </span>
          </div>
        )}
        {/* Nav bar */}
        <div className="relative flex h-14 items-center px-2">
          {/* Hamburger */}
          <button
            className="flex h-11 w-11 items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3.66577 10.9976H18.3292"
                stroke="currentColor"
                className="text-dark-text"
                strokeWidth="1.83293"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.66577 5.49878H18.3292"
                stroke="currentColor"
                className="text-dark-text"
                strokeWidth="1.83293"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.66577 16.4963H18.3292"
                stroke="currentColor"
                className="text-dark-text"
                strokeWidth="1.83293"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/e7df4be5ec275bc11639573f94373e14d54c4a9e?width=138"
                alt="My Fave"
                className="h-[36px] w-auto"
              />
            </Link>
          </div>

          {/* Cart icon - Right aligned */}
          <div className="ml-auto">
            <Link to="/cart" className="flex h-11 w-11 items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.99764 1.66589L2.49878 4.99771V16.6591C2.49878 17.1009 2.67429 17.5246 2.98671 17.837C3.29913 18.1495 3.72286 18.325 4.16469 18.325H15.826C16.2679 18.325 16.6916 18.1495 17.004 17.837C17.3164 17.5246 17.492 17.1009 17.492 16.6591V4.99771L14.9931 1.66589H4.99764Z"
                  stroke="currentColor"
                  className="text-dark-text"
                  strokeWidth="1.66591"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.49878 4.99774H17.492"
                  stroke="currentColor"
                  className="text-dark-text"
                  strokeWidth="1.66591"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3272 8.32953C13.3272 9.21318 12.9762 10.0606 12.3513 10.6855C11.7265 11.3103 10.879 11.6613 9.99539 11.6613C9.11174 11.6613 8.26428 11.3103 7.63944 10.6855C7.0146 10.0606 6.66357 9.21318 6.66357 8.32953"
                  stroke="currentColor"
                  className="text-dark-text"
                  strokeWidth="1.66591"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
