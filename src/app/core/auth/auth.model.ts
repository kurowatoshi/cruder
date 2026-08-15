export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DemoUser extends AuthUser {
  password: string;
}