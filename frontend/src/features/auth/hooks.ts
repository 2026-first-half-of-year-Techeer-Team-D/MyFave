import { useMutation } from '@tanstack/react-query'

import { authApi } from './api'
import { useAuthStore } from './store'
import type {
  FindIdRequest,
  ResetPasswordRequest,
  SignUpSendCodeRequest,
  SignUpVerifyCodeRequest,
  SignUpRequest,
} from './types'

// 회원가입 시점에 프론트가 부여한 곰돌이 아바타 URL을 이메일 키로 localStorage 에 보관.
// 백엔드 LoginResponse 가 profileImageUrl 을 아직 내려주지 않을 때 fallback 으로 사용.
const PENDING_AVATAR_PREFIX = 'myfave-avatar:'

function readPendingAvatar(email: string): string | undefined {
  if (!email) return undefined
  return localStorage.getItem(PENDING_AVATAR_PREFIX + email) ?? undefined
}

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data, variables) => {
      const profileImageUrl = data.profileImageUrl ?? readPendingAvatar(variables.email)
      login({
        user: {
          id: data.userId,
          email: variables.email,
          nickname: data.nickname,
          profileImageUrl,
        },
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
      const profileImageUrl = data.profileImageUrl ?? readPendingAvatar(data.email)
      login({
        user: {
          id: data.userId,
          email: data.email,
          nickname: data.nickname,
          profileImageUrl,
        },
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

export function useFindId() {
  return useMutation({
    mutationFn: (body: FindIdRequest) => authApi.findId(body),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: ResetPasswordRequest) => authApi.resetPassword(body),
  })
}
