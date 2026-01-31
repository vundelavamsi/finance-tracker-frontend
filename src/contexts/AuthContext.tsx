import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User } from '../types/user'
import { getStoredToken, setStoredToken } from '../services/api'
import * as authService from '../services/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (payload: { login: string; password: string }) => Promise<void>
  logout: () => void
  register: (payload: { email?: string; phone?: string; password: string }) => Promise<void>
  loginByTelegramUsername: (telegram_username: string) => Promise<{ message: string; expires_in: number }>
  verifyTelegramLogin: (token: string) => Promise<void>
  loginWithTelegram: (payload: authService.TelegramWidgetPayload) => Promise<void>
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const setUser = useCallback((u: User | null) => {
    setUserState(u)
  }, [])

  const refreshUser = useCallback(async () => {
    const t = getStoredToken()
    if (!t) {
      setUserState(null)
      setTokenState(null)
      return
    }
    try {
      const u = await authService.getMe()
      setUserState(u)
      setTokenState(t)
    } catch {
      setStoredToken(null)
      setUserState(null)
      setTokenState(null)
    }
  }, [])

  useEffect(() => {
    const t = getStoredToken()
    if (!t) {
      setLoading(false)
      return
    }
    setTokenState(t)
    authService
      .getMe()
      .then((u) => {
        setUserState(u)
      })
      .catch(() => {
        setStoredToken(null)
        setUserState(null)
        setTokenState(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = useCallback(async (payload: { login: string; password: string }) => {
    const res = await authService.login(payload)
    setTokenState(res.access_token)
    setUserState(res.user)
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setUserState(null)
    setTokenState(null)
  }, [])

  const register = useCallback(async (payload: { email?: string; phone?: string; password: string }) => {
    const res = await authService.register(payload)
    setTokenState(res.access_token)
    setUserState(res.user)
  }, [])

  const loginByTelegramUsername = useCallback(async (telegram_username: string) => {
    return authService.loginByTelegramUsername(telegram_username)
  }, [])

  const verifyTelegramLogin = useCallback(async (tokenParam: string) => {
    const res = await authService.verifyTelegramLogin(tokenParam)
    setTokenState(res.access_token)
    setUserState(res.user)
  }, [])

  const loginWithTelegram = useCallback(async (payload: authService.TelegramWidgetPayload) => {
    const res = await authService.loginWithTelegramWidget(payload)
    setTokenState(res.access_token)
    setUserState(res.user)
  }, [])

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    loginByTelegramUsername,
    verifyTelegramLogin,
    loginWithTelegram,
    setUser,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
