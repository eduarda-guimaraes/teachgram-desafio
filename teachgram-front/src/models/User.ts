export interface User {
    id?: number;
    name?: string;
    username: string;
    userName?: string;
    email: string;
    phone?: string;
    bio?: string;
    profileLink?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  bio?: string;
  profileLink?: string;
}
