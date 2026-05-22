export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  profileLink?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
  deleted: boolean;
}

export interface Post {
  id: number;
  title: string;
  description?: string;
  photoLink?: string;
  videoLink?: string;
  isPrivate: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt?: string;
  deleted: boolean;
  user: Partial<User>;
}

export interface AuthResponse {
  token: string;
  user: User;
}
