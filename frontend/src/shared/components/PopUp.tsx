import React, { useEffect } from 'react'

interface PopUpProps {
  message: string
  isOpen: boolean
  onClose: () => void
  duration?: number
}

export function PopUp({ message, isOpen, onClose, duration = 3000 }: PopUpProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, duration])

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 left-1/2 z-[150] w-[calc(100%-40px)] max-w-md -translate-x-1/2 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Pop up Content - Figma Node 99:1204 기반 */}
      <div className="flex items-center justify-center rounded-lg bg-main-bg px-6 py-4 shadow-figma-popup border border-point/10">
        <p className="font-noto text-sm font-bold text-chat-font2">
          {message}
        </p>
      </div>
    </div>
  )
}
