import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSaleEventCreate } from '@/features/saleevent/hooks'

// datetime-local 입력값("2026-05-24T21:50")을 KST ZonedDateTime 문자열로 변환
function toKstIso(localDatetime: string): string {
  return `${localDatetime}:00+09:00`
}

const schema = z
  .object({
    eventName: z.string().min(1, '이벤트 이름을 입력하세요').max(100, '100자 이하로 입력하세요'),
    saleStartAt: z.string().min(1, '시작 일시를 선택하세요'),
    saleEndAt: z.string().min(1, '종료 일시를 선택하세요'),
  })
  .refine((v) => v.saleEndAt > v.saleStartAt, {
    message: '종료 일시는 시작 일시 이후여야 합니다',
    path: ['saleEndAt'],
  })

type FormValues = z.infer<typeof schema>

interface SaleEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SaleEventModal({ isOpen, onClose }: SaleEventModalProps) {
  const { mutate, isPending, isError, error, reset: resetMutation } = useSaleEventCreate()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // 모달 닫힐 때 폼·mutation 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      reset()
      resetMutation()
    }
  }, [isOpen, reset, resetMutation])

  if (!isOpen) return null

  const onSubmit = (values: FormValues) => {
    mutate(
      {
        eventName: values.eventName,
        saleStartAt: toKstIso(values.saleStartAt),
        saleEndAt: toKstIso(values.saleEndAt),
      },
      { onSuccess: onClose },
    )
  }

  const apiErrorMessage =
    isError && error instanceof Error ? error.message : isError ? '등록에 실패했습니다' : null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-9">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-[15px] border border-separator bg-footer-bg shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Title */}
        <div className="px-6 pt-8 pb-2 text-center">
          <h2 className="font-noto text-[16px] font-bold text-dark-text">판매 이벤트 등록</h2>
        </div>

        {/* Form */}
        <form id="sale-event-form" onSubmit={handleSubmit(onSubmit)} className="px-6 pb-2 pt-4 space-y-4">
          {/* 이벤트 이름 */}
          <div className="flex flex-col gap-1">
            <label className="font-noto text-[12px] font-medium text-dark-text">이벤트 이름</label>
            <input
              {...register('eventName')}
              type="text"
              placeholder="이벤트 이름을 입력하세요"
              className="w-full rounded-[8px] border border-separator bg-white px-3 py-2 font-noto text-[13px] text-dark-text placeholder:text-muted-text focus:border-point focus:outline-none"
            />
            {errors.eventName && (
              <span className="font-noto text-[11px] text-point">{errors.eventName.message}</span>
            )}
          </div>

          {/* 시작 일시 */}
          <div className="flex flex-col gap-1">
            <label className="font-noto text-[12px] font-medium text-dark-text">시작 일시</label>
            <input
              {...register('saleStartAt')}
              type="datetime-local"
              className="w-full rounded-[8px] border border-separator bg-white px-3 py-2 font-noto text-[13px] text-dark-text focus:border-point focus:outline-none"
            />
            {errors.saleStartAt && (
              <span className="font-noto text-[11px] text-point">{errors.saleStartAt.message}</span>
            )}
          </div>

          {/* 종료 일시 */}
          <div className="flex flex-col gap-1">
            <label className="font-noto text-[12px] font-medium text-dark-text">종료 일시</label>
            <input
              {...register('saleEndAt')}
              type="datetime-local"
              className="w-full rounded-[8px] border border-separator bg-white px-3 py-2 font-noto text-[13px] text-dark-text focus:border-point focus:outline-none"
            />
            {errors.saleEndAt && (
              <span className="font-noto text-[11px] text-point">{errors.saleEndAt.message}</span>
            )}
          </div>

          {/* API 에러 */}
          {apiErrorMessage && (
            <p className="font-noto text-[11px] text-point text-center">{apiErrorMessage}</p>
          )}

          {/* 취소 버튼 */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 font-noto text-[13px] font-medium text-muted-text"
          >
            취소
          </button>
        </form>

        {/* 등록 버튼 — 하단 고정 */}
        <button
          type="submit"
          form="sale-event-form"
          disabled={isSubmitting || isPending}
          className="flex w-full items-center justify-center bg-point py-[18px] font-noto text-sm font-black text-white transition-colors hover:bg-[#ff7fa3] active:scale-[0.98] disabled:opacity-60"
        >
          {isPending ? '등록 중...' : '등록'}
        </button>
      </div>
    </div>
  )
}
