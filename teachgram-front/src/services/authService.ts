import api from './api';
import type { LoginCredentials, RegisterCredentials, User } from '../models/User';

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
};
