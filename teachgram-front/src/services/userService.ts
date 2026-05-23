import api from './api'
import type { User, UserSummary, UserUpdatePayload } from '../types'

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me')
  return response.data
}

import mockFriendsData from '../data/mockFriends.json'

export const fetchUserById = async (id: number): Promise<User> => {
  const mockFriend = (mockFriendsData as any).friends?.find((f: any) => f.id === id);
  if (mockFriend) {
    return {
      id: mockFriend.id,
      name: mockFriend.name,
      username: mockFriend.username,
      profileLink: mockFriend.profileLink,
      bio: mockFriend.bio,
      friendsCount: 1,
      createdAt: '2026-05-20T10:30:00Z',
      updatedAt: '2026-05-20T10:30:00Z',
      email: `${mockFriend.username}@example.com`,
      role: 'USER',
      postCount: mockFriend.posts.length
    }
  }

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
