import api from './api'
import { Account, AccountCreate, AccountUpdate } from '../types/account'

export const getAccounts = async (): Promise<Account[]> => {
  const response = await api.get('/accounts')
  return response.data
}

export const getAccount = async (id: number): Promise<Account> => {
  const response = await api.get(`/accounts/${id}`)
  return response.data
}

export const createAccount = async (data: AccountCreate): Promise<Account> => {
  const response = await api.post('/accounts', data)
  return response.data
}

export const updateAccount = async (id: number, data: AccountUpdate): Promise<Account> => {
  const response = await api.put(`/accounts/${id}`, data)
  return response.data
}

export const deleteAccount = async (id: number): Promise<void> => {
  await api.delete(`/accounts/${id}`)
}
