import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

// 라우트 변경 시 window + main + 페이지 내부 자체 스크롤 컨테이너 모두 0으로 리셋.
// Tailwind의 .overflow-y-auto / .overflow-auto 클래스를 모두 탐색해 일괄 처리.
export function ScrollToTopWrapper() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document
      .querySelectorAll<HTMLElement>('.overflow-y-auto, .overflow-auto')
      .forEach((el) => {
        el.scrollTop = 0
      })
  }, [pathname])
  return <Outlet />
}
