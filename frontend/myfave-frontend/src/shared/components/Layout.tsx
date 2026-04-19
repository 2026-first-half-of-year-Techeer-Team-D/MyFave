import { Outlet } from 'react-router-dom'

import { Footer } from '@/shared/components/Footer'
import { Header } from '@/shared/components/Header'

export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
