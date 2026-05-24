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

export interface SignUpSendCodeRequest {
  email: string
}

export interface SignUpVerifyCodeRequest {
  email: string
  verificationCode: string
}

export interface SignUpVerifyCodeResponse {
  verifiedToken: string
}

export interface SignUpRequest {
  email: string
  password: string
  name: string
  nickname: string
  phone: string
  verifiedToken: string
}

export interface SignUpResponse {
  userId: number
  nickname: string
}

export interface FindIdRequest {
  name: string
  phoneNumber: string
}

export interface FindIdResponse {
  maskedEmail: string
}

export interface ResetPasswordRequest {
  email: string
}
