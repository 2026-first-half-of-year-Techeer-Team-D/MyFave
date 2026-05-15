import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function FindIdPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [foundEmail, setFoundEmail] = useState<string | null>(null)

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const maskEmail = (name: string): string => {
    const lower = name.toLowerCase().replace(/\s/g, '')
    const visible = lower.slice(0, 2)
    return `${visible}***@gmail.com`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return
    setFoundEmail(maskEmail(name))
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

        <h1 className="mb-[11px] font-noto text-[24px] font-bold text-black">아이디 찾기</h1>
        <p className="mb-[18px] font-noto text-[13px] text-[#8B7E74] leading-[20px]">
          가입 시 등록한 이름과 전화번호로
          <br />
          이메일 아이디를 안내해드립니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-[11px]">
          <div className="flex h-[43px] items-center rounded-[5px] border border-[#BBBBBB] bg-white px-[19px]">
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              className="w-full bg-transparent font-noto text-[16px] font-medium text-[#322927] placeholder:text-[#999999] focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex h-[43px] items-center rounded-[5px] border border-[#BBBBBB] bg-white px-[19px]">
            <input
              type="tel"
              placeholder="전화번호를 입력해주세요"
              className="w-full bg-transparent font-noto text-[16px] font-medium text-[#322927] placeholder:text-[#999999] focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              maxLength={13}
            />
          </div>

          <button
            type="submit"
            disabled={!name || !phone}
            className="flex h-[43px] w-full items-center justify-center rounded-[5px] bg-point font-noto text-[16px] font-medium text-white shadow-sm active:scale-[0.98] transition-transform disabled:bg-gray-300"
          >
            아이디 찾기
          </button>
        </form>

        {foundEmail && (
          <div className="mt-[24px] rounded-[10px] border border-point/30 bg-main-bg px-[20px] py-[18px]">
            <p className="mb-[6px] font-noto text-[12px] font-medium text-[#8B7E74]">등록된 아이디</p>
            <p className="mb-[16px] font-noto text-[18px] font-bold text-dark-text">{foundEmail}</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex h-[38px] w-full items-center justify-center rounded-[5px] bg-point font-noto text-[14px] font-medium text-white active:scale-[0.98] transition-transform"
            >
              로그인하기
            </button>
          </div>
        )}

        <div className="mt-[20px] text-center">
          <Link to="/find-password" className="font-noto text-[12px] font-bold text-chat-font hover:underline decoration-chat-font/30">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  )
}
