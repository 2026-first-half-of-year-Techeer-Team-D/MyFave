import { useMutation } from '@tanstack/react-query'

import { authApi } from './api'

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
    },
  })
}
