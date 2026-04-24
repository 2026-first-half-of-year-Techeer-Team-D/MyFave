import { Outlet, useLocation } from 'react-router-dom'

import { Footer } from '@/shared/components/Footer'
import { Header } from '@/shared/components/Header'

export function Layout() {
  const location = useLocation()
  
  const getHeaderProps = () => {
    const path = location.pathname
    
    if (path === '/payment') return { title: '주문서', showBackButton: true }
    if (path === '/cart') return { title: '장바구니', showBackButton: true }
    if (path === '/add-shipping') return { title: '배송지 정보', showBackButton: true }
    if (path === '/coupons') return { title: '쿠폰', showBackButton: true }
    if (path === '/order-success') return { title: '주문완료', showBackButton: false }
    
    return {} // Default logo header
  }

  return (
    <div className="min-h-screen w-full bg-[#FFE0E0] flex justify-center overflow-x-hidden">
      <div className="w-full max-w-[376.04px] min-h-screen bg-white shadow-figma-app flex flex-col relative">
        <Header {...getHeaderProps()} />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
