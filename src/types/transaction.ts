export interface Transaction {
  id: number
  user_id: number
  amount: string
  currency: string
  merchant: string | null
  category_id: number | null
  account_id: number | null
  source_image_url: string | null
  status: string
  category?: {
    id: number
    name: string
    color: string
  } | null
  account?: {
    id: number
    name: string
    account_type: string
  } | null
  created_at: string
  updated_at: string
}

export interface TransactionCreate {
  amount: string
  currency?: string
  merchant?: string
  category_id?: number | null
  account_id?: number | null
  source_image_url?: string | null
  status?: string
}

export interface TransactionUpdate {
  amount?: string
  currency?: string
  merchant?: string
  category_id?: number | null
  account_id?: number | null
  status?: string
}
