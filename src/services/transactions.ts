import api from './api'
import { Transaction, TransactionCreate, TransactionUpdate } from '../types/transaction'

export const getTransactions = async (params?: {
  start_date?: string
  end_date?: string
  category_id?: number
  account_id?: number
  limit?: number
  offset?: number
}): Promise<Transaction[]> => {
  const response = await api.get('/transactions', { params })
  return response.data
}

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.get(`/transactions/${id}`)
  return response.data
}

export const createTransaction = async (data: TransactionCreate): Promise<Transaction> => {
  const response = await api.post('/transactions', data)
  return response.data
}

export const updateTransaction = async (id: number, data: TransactionUpdate): Promise<Transaction> => {
  const response = await api.put(`/transactions/${id}`, data)
  return response.data
}

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}`)
}
