import { Outlet } from 'react-router-dom'

// TODO: 개발 완료 후 아래 주석 해제하여 인증 복원
// import { Navigate } from 'react-router-dom'
// const token = localStorage.getItem('accessToken')
// if (!token) return <Navigate to="/login" replace />

export function ProtectedRoute() {
  return <Outlet />
}
