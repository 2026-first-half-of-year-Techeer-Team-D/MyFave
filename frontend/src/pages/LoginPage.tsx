import { useState } from 'react'
import { Link } from 'react-router-dom'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [autoLogin, setAutoLogin] = useState(false)

  // TODO: useLogin 훅으로 대체 - auth API 연동
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-9">
      <div className="w-full max-w-sm space-y-10">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0d5a3ee5b83044e745d0f73790e43411ae194727?width=384"
            alt="My Fave"
            className="h-24 w-auto"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col">
            {/* Email input */}
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-t-lg border border-[#BBB] bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:z-10 focus:border-point focus:outline-none"
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="패스워드"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-[-1px] w-full rounded-b-lg border border-[#BBB] bg-white px-4 py-3.5 font-noto text-sm text-dark-text placeholder:text-[#999] focus:z-10 focus:border-point focus:outline-none"
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-[5px] bg-point py-3.5 font-noto text-base font-bold text-white shadow-sm transition-all hover:bg-[#ff7fa3] active:scale-[0.98]"
          >
            로그인
          </button>

          {/* Options */}
          <div className="pt-2 space-y-4">
            {/* Auto login */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoLogin"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-[#CFCFCF] text-point focus:ring-point"
              />
              <label
                htmlFor="autoLogin"
                className="cursor-pointer font-noto text-xs font-medium text-muted-text"
              >
                자동로그인
              </label>
            </div>

            {/* Find links */}
            <div className="flex items-center justify-center gap-6">
              <Link
                to="/find-id"
                className="font-noto text-xs font-medium text-muted-text hover:underline"
              >
                아이디찾기
              </Link>
              <span className="h-2.5 w-px bg-[#EEE]" />
              <Link
                to="/find-password"
                className="font-noto text-xs font-medium text-muted-text hover:underline"
              >
                비밀번호찾기
              </Link>
            </div>

            {/* Sign up */}
            <div className="flex items-center justify-end gap-1 pt-2">
              <Link
                to="/signup"
                className="font-noto text-sm font-bold text-chat-font hover:underline"
              >
                회원가입
              </Link>
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path
                  d="M1 1L5 5L1 9"
                  stroke="currentColor"
                  className="text-chat-font"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
