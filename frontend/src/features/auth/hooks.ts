import { useMutation } from '@tanstack/react-query'

import { authApi } from './api'
import { useAuthStore } from './store'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login({
        user: { id: data.userId, email: '', nickname: data.nickname },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    },
  })
}

export function useKakaoLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: (authorizationCode: string) =>
      authApi.socialLogin('kakao', { authorizationCode }),
    onSuccess: (data) => {
      login({
        user: { id: data.userId, email: data.email, nickname: data.nickname },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    },
  })
}

export function useUser() {
  return useAuthStore((s) => s.user)
}

export function useIsAuthenticated() {
  return useAuthStore((s) => s.accessToken !== null)
}

export function useLogout() {
  return useAuthStore((s) => s.logout)
}
