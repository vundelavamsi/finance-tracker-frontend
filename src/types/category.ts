export interface Category {
  id: number
  user_id: number
  name: string
  description: string | null
  color: string
  icon: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CategoryCreate {
  name: string
  description?: string
  color?: string
  icon?: string
  is_active?: boolean
}

export interface CategoryUpdate {
  name?: string
  description?: string
  color?: string
  icon?: string
  is_active?: boolean
}
