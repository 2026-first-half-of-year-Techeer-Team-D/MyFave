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
      <div className="w-full max-w-sm space-y-12">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0d5a3ee5b83044e745d0f73790e43411ae194727?width=384"
            alt="My Fave"
            className="h-32 w-auto"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-t-lg border-l border-r border-t border-[#BBB] bg-white px-3 py-3 font-montserrat text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="패스워드"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-b-lg border border-[#BBB] bg-white px-3 py-3 font-montserrat text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none"
          />

          {/* Login button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-[#FF95B3] py-2 font-montserrat text-base font-medium text-white transition-colors hover:bg-[#ff7fa3]"
          >
            로그인
          </button>

          {/* Options */}
          <div className="space-y-3">
            {/* Auto login */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoLogin"
                checked={autoLogin}
                onChange={(e) => setAutoLogin(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border border-[#CFCFCF] bg-white"
              />
              <label
                htmlFor="autoLogin"
                className="cursor-pointer font-inter text-sm font-medium text-gray-600"
              >
                자동로그인
              </label>
            </div>

            {/* Find links */}
            <div className="flex items-center justify-center gap-6">
              <Link
                to="/find-id"
                className="font-inter text-sm font-medium text-gray-600 hover:underline"
              >
                아이디찾기
              </Link>
              <span className="h-2.5 w-px bg-[#EEE]" />
              <Link
                to="/find-password"
                className="font-inter text-sm font-medium text-gray-600 hover:underline"
              >
                비밀번호찾기
              </Link>
            </div>

            {/* Sign up */}
            <div className="flex items-center justify-end gap-1">
              <Link
                to="/signup"
                className="font-inter text-sm font-bold text-[#CF879B] hover:underline"
              >
                회원가입
              </Link>
              <svg width="5" height="8" viewBox="0 0 5 8" fill="none">
                <path
                  d="M0.9375 0.666626L4.0625 3.99996L0.9375 7.33329"
                  stroke="#CF879B"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
