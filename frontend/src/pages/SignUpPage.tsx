import { useState } from 'react'
import { Link } from 'react-router-dom'

export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)

  // TODO: 이메일 인증번호 발송 API 연동
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // TODO: 인증번호 확인 API 연동
  const handleVerifyCode = () => {
    if (verificationCode) {
      setCodeVerified(true)
    }
  }

  // TODO: 회원가입 API 연동
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-9 py-8">
      <div className="w-full max-w-sm space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/012e99426a1f137eeec459ec95370290a078807e?width=236"
            alt="My Fave"
            className="h-24 w-auto"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="text-left">
            <h2 className="font-montserrat text-2xl font-bold text-black">이메일</h2>
          </div>

          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#BBB] bg-white px-4 py-3 font-montserrat text-base text-gray-700 placeholder:text-gray-400 focus:border-point focus:outline-none"
            required
          />

          <input
            type="text"
            placeholder="인증번호를 입력해주세요"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full rounded-lg border border-[#BBB] bg-white px-4 py-3 font-montserrat text-base text-gray-700 placeholder:text-gray-400 focus:border-point focus:outline-none disabled:opacity-50"
            disabled={!email}
          />

          {!codeVerified ? (
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!email}
              className="w-full rounded-lg bg-point py-2 font-montserrat text-base font-bold text-white transition-colors hover:bg-[#ff7fa3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              인증번호 발송하기
            </button>
          ) : (
            <div className="rounded-lg bg-green-100 py-2 text-center font-montserrat text-base text-green-700">
              인증되었습니다
            </div>
          )}

          {verificationCode && !codeVerified && (
            <button
              type="button"
              onClick={handleVerifyCode}
              className="w-full rounded-lg border border-point py-2 font-montserrat text-base font-bold text-point transition-colors hover:bg-main-bg"
            >
              인증번호 확인
            </button>
          )}

          <button
            type="submit"
            disabled={!codeVerified}
            className="w-full rounded-lg bg-point py-2 font-montserrat text-base font-bold text-white transition-colors hover:bg-[#ff7fa3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            회원가입
          </button>
        </form>

        <div className="text-center">
          <span className="font-montserrat text-sm text-gray-600">이미 계정이 있으신가요? </span>
          <Link
            to="/login"
            className="font-montserrat text-sm font-bold text-chat-font hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
