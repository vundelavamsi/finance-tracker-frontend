import api from './api'

export interface DashboardStats {
  summary: {
    total_income: number
    total_expenses: number
    net_balance: number
    accounts_count: number
  }
  monthly_breakdown: Array<{
    month: string
    income: number
    expenses: number
  }>
  category_breakdown: Array<{
    name: string
    amount: number
    color: string
  }>
  account_balances: Array<{
    id: number
    name: string
    type: string
    balance: number
    currency: string
  }>
  recent_transactions: Array<{
    id: number
    amount: string
    currency: string
    merchant: string | null
    category: string | null
    account: string | null
    date: string
  }>
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats')
  return response.data
}
