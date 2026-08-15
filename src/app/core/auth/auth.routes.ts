import { Routes } from '@angular/router';
import { guestGuard } from './auth-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login').then((component) => component.Login),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];