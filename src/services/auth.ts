import api from './api'
import { setStoredToken } from './api'
import type { User, AuthResponse, LoginByTelegramUsernameResponse } from '../types/user'

export interface RegisterPayload {
  email?: string
  phone?: string
  password: string
}

export interface LoginPayload {
  login: string
  password: string
}

export interface TelegramWidgetPayload {
  hash: string
  id: number
  first_name?: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date?: number
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  setStoredToken(data.access_token)
  return data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  setStoredToken(data.access_token)
  return data
}

export async function loginByTelegramUsername(telegram_username: string): Promise<LoginByTelegramUsernameResponse> {
  const { data } = await api.post<LoginByTelegramUsernameResponse>('/auth/login-by-telegram-username', {
    telegram_username: telegram_username.trim().replace(/^@/, ''),
  })
  return data
}

export async function verifyTelegramLogin(token: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/verify-telegram-login', { token })
  setStoredToken(data.access_token)
  return data
}

export async function loginWithTelegramWidget(payload: TelegramWidgetPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/telegram', payload)
  setStoredToken(data.access_token)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}

export async function setPassword(payload: { email?: string; phone?: string; password: string }): Promise<User> {
  const { data } = await api.post<User>('/users/me/set-password', payload)
  return data
}

export async function connectTelegram(payload: TelegramWidgetPayload): Promise<User> {
  const { data } = await api.post<User>('/users/me/connect-telegram', payload)
  return data
}
