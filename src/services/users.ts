import api from './api'
import { User, UserUpdate } from '../types/user'

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me')
  return response.data
}

export const updateCurrentUser = async (data: UserUpdate): Promise<User> => {
  const response = await api.put('/users/me', data)
  return response.data
}
