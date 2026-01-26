import api from './api'
import { Category, CategoryCreate, CategoryUpdate } from '../types/category'

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories')
  return response.data
}

export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const createCategory = async (data: CategoryCreate): Promise<Category> => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (id: number, data: CategoryUpdate): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`)
}
