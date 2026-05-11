import { apiClient } from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/api/types'

import type {
  LoginRequest,
  LoginResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from './types'

export const authApi = {
  login: async (body: LoginRequest) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', body)
    return data.data
  },
  socialLogin: async (provider: 'kakao' | 'naver' | 'google', body: SocialLoginRequest) => {
    const { data } = await apiClient.post<ApiResponse<SocialLoginResponse>>(
      `/auth/social-login/${provider}`,
      body,
    )
    return data.data
  },
}
