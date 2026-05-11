import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useKakaoLogin } from '@/features/auth/hooks'

export function KakaoCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate } = useKakaoLogin()
  const [errorMessage, setErrorMessage] = useState('')
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    const code = searchParams.get('code')
    if (!code) {
      navigate('/login', { replace: true })
      return
    }
    calledRef.current = true

    mutate(code, {
      onSuccess: () => navigate('/', { replace: true }),
      onError: () =>
        setErrorMessage('카카오 로그인에 실패했습니다. 다시 시도해주세요.'),
    })
  }, [searchParams, mutate, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="font-noto text-[14px] text-[#322927]">
        {errorMessage || '카카오 로그인 처리 중...'}
      </p>
    </div>
  )
}
