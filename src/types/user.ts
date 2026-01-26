export interface User {
  id: number
  telegram_id: string
  email: string | null
  is_active: boolean
  created_at: string
}

export interface UserUpdate {
  email?: string
  is_active?: boolean
}
