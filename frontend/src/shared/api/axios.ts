import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: JWT 자동 주입
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터: 401 발생 시 토큰 재발급
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
            { refreshToken },
          )
          localStorage.setItem('accessToken', data.data.accessToken)
          localStorage.setItem('refreshToken', data.data.refreshToken)
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
          return apiClient(originalRequest)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)
