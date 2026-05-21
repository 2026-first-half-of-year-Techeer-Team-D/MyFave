import { useMutation } from '@tanstack/react-query'

import { authApi } from './api'
import { useAuthStore } from './store'
import type {
  SignUpSendCodeRequest,
  SignUpVerifyCodeRequest,
  SignUpRequest,
} from './types'

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

export function useSendSignUpCode() {
  return useMutation({
    mutationFn: (body: SignUpSendCodeRequest) => authApi.sendSignUpCode(body),
  })
}

export function useVerifySignUpCode() {
  return useMutation({
    mutationFn: (body: SignUpVerifyCodeRequest) => authApi.verifySignUpCode(body),
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: (body: SignUpRequest) => authApi.signUp(body),
  })
}
