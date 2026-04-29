export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: number
  nickname: string
}

export interface User {
  id: number
  email: string
  nickname: string
}
