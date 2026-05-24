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
    inFlight.delete(url)
    return objectUrl
  })()

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
