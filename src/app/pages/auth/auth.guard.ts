import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { AuthService } from './auth.service';


export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated.value;

  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
