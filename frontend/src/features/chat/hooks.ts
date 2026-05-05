import { useQuery } from '@tanstack/react-query'
import { chatApi } from './api'

export function useChatRoomInfo() {
  return useQuery({
    queryKey: ['chat', 'room'],
    queryFn: chatApi.getRoomInfo,
    staleTime: 10_000,
    retry: false,
  })
}

export function useChatMessageHistory(enabled: boolean, size = 50) {
  return useQuery({
    queryKey: ['chat', 'history', size],
    queryFn: () => chatApi.getMessageHistory(size),
    enabled,
    staleTime: Infinity,
    retry: false,
  })
}

export function useChatPreview(size = 5) {
  return useQuery({
    queryKey: ['chat', 'preview', size],
    queryFn: () => chatApi.getPreview(size),
    staleTime: 30_000,
    retry: false,
  })
}
