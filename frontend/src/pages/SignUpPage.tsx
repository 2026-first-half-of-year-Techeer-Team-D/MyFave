import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PopUp } from '@/shared/components/PopUp'

export function SignUpPage() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [codeVerified, setCodeVerified] = useState(false)
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)
  const [popUpMessage, setPopUpMessage] = useState('')

  // TODO: 이메일 인증번호 발송 API 연동
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    setPopUpMessage('인증번호가 발송되었습니다 🎁')
    setIsPopUpOpen(true)
  }

  // TODO: 인증번호 확인 API 연동
  const handleVerifyCode = () => {
    if (verificationCode) {
      setCodeVerified(true)
      setPopUpMessage('인증이 완료되었습니다 ✨')
      setIsPopUpOpen(true)
    }
  }

  // TODO: 회원가입 API 연동
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-9 py-12">
      <div className="w-full max-w-sm space-y-10">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/012e99426a1f137eeec459ec95370290a078807e?width=236"
            alt="My Fave"
            className="h-16 w-auto"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block font-noto text-sm font-bold text-dark-text">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[5px] border border-[#BBB] bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="인증번호를 입력해주세요"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full rounded-[5px] border border-[#BBB] bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:border-point focus:outline-none disabled:bg-gray-50 disabled:opacity-50"
                disabled={!email}
              />
            </div>

            {!codeVerified ? (
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!email}
                className="w-full rounded-[5px] bg-point py-3.5 font-noto text-sm font-bold text-white shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
              >
                인증번호 발송하기
              </button>
            ) : (
              <div className="rounded-[5px] bg-main-bg py-3.5 text-center font-noto text-sm font-bold text-point border border-point/20 shadow-inner">
                인증이 완료되었습니다
              </div>
            )}
          </div>

          {verificationCode && !codeVerified && (
            <button
              type="button"
              onClick={handleVerifyCode}
              className="w-full rounded-[5px] border-2 border-point py-3 font-noto text-sm font-bold text-point transition-all hover:bg-main-bg active:scale-[0.98]"
            >
              인증번호 확인
            </button>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!codeVerified}
              className="w-full rounded-[5px] bg-point py-3.5 font-noto text-base font-bold text-white shadow-lg shadow-point/20 transition-all hover:bg-[#ff7fa3] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
            >
              회원가입 완료
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <span className="font-noto text-xs text-muted-text font-medium">이미 계정이 있으신가요? </span>
          <Link
            to="/login"
            className="font-noto text-xs font-bold text-chat-font hover:underline underline-offset-2 ml-1"
          >
            로그인
          </Link>
        </div>
      </div>

      <PopUp
        isOpen={isPopUpOpen}
        message={popUpMessage}
        onClose={() => setIsPopUpOpen(false)}
      />
    </div>
  )
}
