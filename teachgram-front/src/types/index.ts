export interface User {
  id: number
  name: string
  username: string
  email: string
  phone?: string | null
  profileLink?: string | null
  bio?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  deleted?: boolean
  friendsCount?: number
}

export interface UserSummary {
  id: number
  name: string
  username: string
  profileLink?: string | null
  bio?: string | null
}

export interface Post {
  id: number
  title: string
  description?: string | null
  photoLink?: string | null
  videoLink?: string | null
  isPrivate: boolean
  likesCount: number
  createdAt: string
  updatedAt?: string | null
  deleted?: boolean
  user: UserSummary
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  username: string
  password: string
  phone?: string
  bio?: string
  profileLink?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface UserUpdatePayload {
  name: string
  username: string
  email: string
  phone?: string
  bio?: string
  profileLink?: string
  password?: string
}

export interface PostPayload {
  title: string
  description?: string
  photoLink?: string
  videoLink?: string
  isPrivate: boolean
}
