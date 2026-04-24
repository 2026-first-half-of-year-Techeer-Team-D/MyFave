import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/Footer'
import { Header } from '@/shared/components/Header'

export function Layout() {
  return (
    <div className="min-h-screen w-full bg-[#FFE0E0] flex justify-center py-10">
      <div className="w-[376.04px] bg-white shadow-figma-app flex flex-col relative overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
