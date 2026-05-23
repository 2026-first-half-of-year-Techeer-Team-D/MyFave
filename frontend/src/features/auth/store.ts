import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { queryClient } from '@/app/providers'
import type { User } from './types'

const USER_STORE_KEYS = ['myfave-shipping', 'myfave-cart', 'myfave-coupons']

const clearUserStores = () => {
  queryClient.clear()
  USER_STORE_KEYS.forEach((key) => localStorage.removeItem(key))
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (params: { user: User; accessToken: string; refreshToken: string }) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      login: ({ user, accessToken, refreshToken }) => {
        clearUserStores()
        set({ user, accessToken, refreshToken })
      },
      logout: () => {
        clearUserStores()
        set({ user: null, accessToken: null, refreshToken: null })
      },
      updateTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken })
      },
    }),
    { name: 'myfave-auth' },
  ),
)
