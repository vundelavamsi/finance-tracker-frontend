export interface User {
  id: number
  telegram_id: string | null
  telegram_username: string | null
  email: string | null
  phone: string | null
  is_active: boolean
  has_password: boolean
  expense_sub_category_enabled: boolean
  created_at: string
}

export interface UserUpdate {
  email?: string
  phone?: string
  is_active?: boolean
  expense_sub_category_enabled?: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface LoginByTelegramUsernameResponse {
  message: string
  expires_in: number
}
