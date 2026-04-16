import { apiClient } from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/api/types'

import type { LoginRequest, LoginResponse } from './types'

export const authApi = {
  login: async (body: LoginRequest) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', body)
    return data.data
  },
}
