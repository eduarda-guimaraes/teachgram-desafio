import api from './api'
import type { Post, PostPayload } from '../types'

export const fetchFeedPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('/posts/feed')
  return response.data
}

export const fetchPostById = async (postId: number): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${postId}`)
  return response.data
}

import mockFriendsData from '../data/mockFriends.json'

export const fetchPostsByUser = async (userId: number): Promise<Post[]> => {
  const mockFriend = (mockFriendsData as any).friends?.find((f: any) => f.id === userId);
  if (mockFriend) {
    return mockFriend.posts.map((p: any) => ({
      ...p,
      user: {
        id: mockFriend.id,
        name: mockFriend.name,
        username: mockFriend.username,
        profileLink: mockFriend.profileLink
      }
    }));
  }

  const response = await api.get<Post[]>(`/posts/user/${userId}`)
  return response.data
}

export const createPost = async (payload: PostPayload): Promise<Post> => {
  const response = await api.post<Post>('/posts', payload)
  return response.data
}

export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/posts/${postId}`)
}

export const updatePost = async (postId: number, payload: PostPayload): Promise<Post> => {
  const response = await api.put<Post>(`/posts/${postId}`, payload)
  return response.data
}

export const likePost = async (postId: number): Promise<Post> => {
  const response = await api.post<Post>(`/posts/${postId}/like`)
  return response.data
}
