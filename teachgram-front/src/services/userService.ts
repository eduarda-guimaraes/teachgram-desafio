import api from './api'
import type { User, UserSummary, UserUpdatePayload } from '../types'

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}

export const fetchUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`)
  return response.data
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users')
  return response.data
}

export const fetchFriends = async (): Promise<UserSummary[]> => {
  const response = await api.get<UserSummary[]>('/users/me/friends')
  return response.data
}

export const addFriend = async (friendId: number): Promise<User> => {
  const response = await api.post<User>(`/users/${friendId}/friends`)
  return response.data
}

export const updateCurrentUser = async (payload: UserUpdatePayload): Promise<User> => {
  const response = await api.put<User>('/users/me', payload)
  return response.data
}

export const deleteCurrentUser = async (): Promise<void> => {
  await api.delete('/users/me')
}
