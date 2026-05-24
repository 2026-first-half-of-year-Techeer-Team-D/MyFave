export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: number
  nickname: string
  profileImageUrl?: string
}

export interface User {
  id: number
  email: string
  nickname: string
  // 회원가입 시 무작위로 부여되는 곰돌이 프로필 이미지 URL (S3).
  // 풀이 비어있거나 백엔드가 아직 필드를 내려주지 않으면 undefined.
  profileImageUrl?: string
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
  profileImageUrl?: string
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
  // 백엔드 SignUpRequest DTO에 profileImageUrl 필드가 추가되면 자동으로 전송된다.
  // 현재 백엔드 미지원 → optional 로 유지. Jackson은 기본적으로 unknown 필드를 무시하므로 안전.
  profileImageUrl?: string
}

export interface SignUpResponse {
  userId: number
  nickname: string
  // 백엔드가 응답에 포함하기 시작하면 그대로 활용. 현재는 프론트가 자체 부여한 값을 store에 저장.
  profileImageUrl?: string
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
