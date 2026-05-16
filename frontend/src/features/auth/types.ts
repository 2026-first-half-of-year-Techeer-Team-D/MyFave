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

export interface SocialLoginRequest {
  authorizationCode: string
}

export interface SocialLoginResponse {
  accessToken: string
  refreshToken: string
  userId: number
  nickname: string
  email: string
  isNewUser: boolean
}
