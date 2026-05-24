import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

// router root에서 사용. location.pathname 변경 시 window + main 스크롤을 0으로 리셋.
// useLayoutEffect로 paint 전에 실행해 깜빡임을 방지.
export function ScrollToTopWrapper() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return <Outlet />
}
