import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then(
        (routes) => routes.AUTH_ROUTES,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/app-shell').then(
        (component) => component.AppShell,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];