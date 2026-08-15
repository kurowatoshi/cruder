import { computed, Injectable, signal } from '@angular/core';
import {
  AuthUser,
  DemoUser,
  LoginCredentials,
} from './auth.model';

const DEMO_USERS: readonly DemoUser[] = [
  {
    id: 1,
    name: 'System Administrator',
    email: 'admin@demo.com',
    password: 'Admin123!',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Staff User',
    email: 'staff@demo.com',
    password: 'Staff123!',
    role: 'staff',
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly currentUserState = signal<AuthUser | null>(null);
  private readonly errorState = signal<string | null>(null);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly isAuthenticated = computed(
    () => this.currentUserState() !== null,
  );

  login(credentials: LoginCredentials): boolean {
    this.errorState.set(null);

    const email = credentials.email.trim().toLowerCase();

    const matchedUser = DEMO_USERS.find(
      (user) =>
        user.email.toLowerCase() === email &&
        user.password === credentials.password,
    );

    if (!matchedUser) {
      this.errorState.set('Invalid email address or password.');
      return false;
    }

    this.currentUserState.set({
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    });

    return true;
  }

  logout(): void {
    this.currentUserState.set(null);
    this.errorState.set(null);
  }

  clearError(): void {
    this.errorState.set(null);
  }
}