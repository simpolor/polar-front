// 인증 관련 타입

// 로그인 요청
export interface LoginRequest {
  username: string
  password: string
}

// 로그인 응답
export interface LoginResponse {
  token: string
  tokenType: string
  username: string
  role: string
  expiresIn: number
}

// 토큰 검증 응답
export interface ValidateTokenResponse {
  valid: boolean
  username: string
  role: string
  expiresIn: number
  expiresAt: number
}

// 에러 응답
export interface AuthErrorResponse {
  error: string
  message: string
}