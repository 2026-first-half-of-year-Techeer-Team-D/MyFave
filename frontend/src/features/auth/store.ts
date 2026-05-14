import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { queryClient } from '@/app/providers'
import type { User } from './types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (params: { user: User; accessToken: string; refreshToken: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      login: ({ user, accessToken, refreshToken }) => {
        queryClient.clear()
        set({ user, accessToken, refreshToken })
      },
      logout: () => {
        queryClient.clear()
        set({ user: null, accessToken: null, refreshToken: null })
      },
    }),
    { name: 'myfave-auth' },
  ),
)
