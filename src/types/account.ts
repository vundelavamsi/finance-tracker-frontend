export type AccountType = 'BANK_ACCOUNT' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'WALLET' | 'CASH' | 'OTHER'

export interface Account {
  id: number
  user_id: number
  name: string
  account_type: AccountType
  balance: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AccountCreate {
  name: string
  account_type: AccountType
  balance?: number
  currency?: string
  is_active?: boolean
}

export interface AccountUpdate {
  name?: string
  account_type?: AccountType
  balance?: number
  currency?: string
  is_active?: boolean
}
