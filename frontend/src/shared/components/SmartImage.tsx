import { useEffect, useState } from 'react'
import type { ImgHTMLAttributes } from 'react'

// .heic URL → 변환된 jpeg blob URL 캐시 (페이지 이동 시에도 재사용)
const heicCache = new Map<string, string>()
const inFlight = new Map<string, Promise<string>>()

function isHeic(url: string): boolean {
  return /\.heic(\?|$)/i.test(url)
}

async function convertHeicUrl(url: string): Promise<string> {
  const cached = heicCache.get(url)
  if (cached) return cached
  const pending = inFlight.get(url)
  if (pending) return pending

  // inFlight 는 성공/실패와 무관하게 finally 에서 정리 — 실패 후 재시도 영구 차단 방지 (CR M7).
  const promise = (async () => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
    const blob = await res.blob()
    const { default: heic2any } = await import('heic2any')
    const out = await heic2any({ blob, toType: 'image/jpeg', quality: 0.9 })
    const finalBlob: Blob | undefined = Array.isArray(out) ? out[0] : out
    if (!finalBlob) throw new Error('heic2any returned empty result')
    const objectUrl = URL.createObjectURL(finalBlob)
    heicCache.set(url, objectUrl)
    return objectUrl
  })().finally(() => {
    inFlight.delete(url)
  })

  inFlight.set(url, promise)
  return promise
}

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string | undefined
}

export function SmartImage({ src, ...rest }: SmartImageProps) {
  const needsConversion = src != null && isHeic(src)
  const [convertedUrl, setConvertedUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    // src 변경 시 이전 변환 URL 이 잠시 노출되는 것을 막기 위해 변환 시작 전에 초기화 (CR M8).
    setConvertedUrl(undefined)
    if (!needsConversion || !src) return
    let cancelled = false
    convertHeicUrl(src)
      .then((url) => {
        if (!cancelled) setConvertedUrl(url)
      })
      .catch(() => {
        if (!cancelled) setConvertedUrl(undefined)
      })
    return () => {
      cancelled = true
    }
  }, [src, needsConversion])

  // HEIC가 아니면 src 그대로 사용. HEIC면 변환 완료 전엔 undefined.
  const resolved = needsConversion ? convertedUrl : src

  return <img src={resolved} {...rest} />
}
