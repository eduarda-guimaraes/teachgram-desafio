import api, { setStoredToken } from './api'
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types'

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials)
  // Se o backend não retornar um token (ou retornar vazio), geramos localmente
  // o token Basic a partir do email:password para garantir compatibilidade.
  const token = response.data.token || btoa(`${credentials.email.trim()}:${credentials.password}`)
  setStoredToken(token)
  return response.data
}

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', credentials)
  const token = response.data.token || btoa(`${credentials.email.trim()}:${credentials.password}`)
  setStoredToken(token)
  return response.data
}

export const logoutUser = () => {
  setStoredToken(null)
}
