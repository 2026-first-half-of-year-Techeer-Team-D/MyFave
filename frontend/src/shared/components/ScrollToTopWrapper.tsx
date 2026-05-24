import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

// 라우트 변경 시 window를 최상단으로 스크롤. useLayoutEffect로 paint 전에 실행.
export function ScrollToTopWrapper() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return <Outlet />
}
