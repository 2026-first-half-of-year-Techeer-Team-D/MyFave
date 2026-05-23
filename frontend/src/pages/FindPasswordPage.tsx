import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { PopUp } from '@/shared/components/PopUp'

const VERIFICATION_DURATION_SEC = 180

export function FindPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [popUpMessage, setPopUpMessage] = useState('')
  const [isPopUpOpen, setIsPopUpOpen] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const showPopUp = (msg: string) => {
    setPopUpMessage(msg)
    setIsPopUpOpen(true)
  }

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSendCode = () => {
    if (!email) { showPopUp('이메일을 입력해주세요'); return }
    setIsCodeSent(true)
    setTimeLeft(VERIFICATION_DURATION_SEC)
    showPopUp('인증번호가 발송되었습니다 🎁')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { showPopUp('이메일을 입력해주세요'); return }
    if (!code) { showPopUp('인증번호를 입력해주세요'); return }
    showPopUp('임시 비밀번호를 발송했습니다 🔑')
    setTimeout(() => navigate('/login'), 2200)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white pt-[31px]">
      <div className="w-[320px] mb-3">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 font-noto text-[13px] font-medium text-[#8B7E74] active:opacity-60 transition-opacity"
          aria-label="로그인 화면으로 돌아가기"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>뒤로</span>
        </button>
      </div>

      <div className="w-[320px]">
        <div className="mb-[64px] flex justify-center">
          <img src="/logo.svg" alt="My Fave" className="h-[77px] w-[118px] object-contain" />
        </div>

        <h1 className="mb-[11px] font-noto text-[24px] font-bold text-black">비밀번호 찾기</h1>
        <p className="mb-[18px] font-noto text-[13px] text-[#8B7E74] leading-[20px]">
          가입한 이메일로 인증번호를 받은 뒤
          <br />
          임시 비밀번호를 발급받을 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-[11px]">
          <div className="flex h-[43px] items-center rounded-[5px] border border-[#BBBBBB] bg-white px-[19px]">
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              className="w-full bg-transparent font-noto text-[16px] font-medium text-[#322927] placeholder:text-[#999999] focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {isCodeSent && (
            <div className="relative flex h-[43px] items-center rounded-[5px] border border-[#BBBBBB] bg-white px-[19px]">
              <input
                type="text"
                placeholder="인증번호를 입력해주세요"
                className="w-full bg-transparent font-noto text-[16px] font-medium text-[#322927] placeholder:text-[#999999] focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="absolute right-[19px] flex items-center gap-[10px]">
                <span className="font-noto text-[14px] font-bold text-[#999999]">{formatTime(timeLeft)}</span>
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="h-[25px] rounded-[5px] bg-point px-2 font-noto text-[10px] font-bold text-white"
                >
                  재발송
                </button>
              </div>
            </div>
          )}

          {!isCodeSent ? (
            <button
              type="button"
              onClick={handleSendCode}
              disabled={!email}
              className="flex h-[43px] w-full items-center justify-center rounded-[5px] bg-point font-noto text-[16px] font-medium text-white shadow-sm active:scale-[0.98] transition-transform disabled:bg-gray-300"
            >
              인증번호 발송하기
            </button>
          ) : (
            <button
              type="submit"
              disabled={!code}
              className="flex h-[43px] w-full items-center justify-center rounded-[5px] bg-point font-noto text-[16px] font-medium text-white shadow-sm active:scale-[0.98] transition-transform disabled:bg-gray-300"
            >
              임시 비밀번호 받기
            </button>
          )}
        </form>

        <div className="mt-[20px] text-center">
          <Link to="/find-id" className="font-noto text-[12px] font-bold text-chat-font hover:underline decoration-chat-font/30">
            아이디 찾기
          </Link>
        </div>
      </div>

      <PopUp isOpen={isPopUpOpen} message={popUpMessage} onClose={() => setIsPopUpOpen(false)} />
    </div>
  )
}
