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

export function useChatMessageHistory(enabled: boolean, roomId: number | undefined, size = 50) {
  return useQuery({
    queryKey: ['chat', 'history', roomId, size],
    queryFn: () => chatApi.getMessageHistory(size),
    enabled: enabled && roomId != null,
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
