import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed: string[] = (route.data?.['roles'] as string[]) ?? ['ADMIN'];
  const userRole = (auth.role ?? '').toUpperCase();
  if (auth.isAuthenticated && allowed.map(r => r.toUpperCase()).some(r => userRole.includes(r))) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
