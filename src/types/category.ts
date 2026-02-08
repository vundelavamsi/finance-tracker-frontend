export type CategoryType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: number
  user_id: number
  name: string
  description: string | null
  color: string
  icon: string | null
  is_active: boolean
  category_type: CategoryType
  parent_id: number | null
  parent_name?: string | null
  created_at: string
  updated_at: string
  sub_categories?: Category[] | null
}

export interface CategoryCreate {
  name: string
  description?: string
  color?: string
  icon?: string
  is_active?: boolean
  category_type?: CategoryType
  parent_id?: number | null
}

export interface CategoryUpdate {
  name?: string
  description?: string
  color?: string
  icon?: string
  is_active?: boolean
  category_type?: CategoryType
  parent_id?: number | null
}
