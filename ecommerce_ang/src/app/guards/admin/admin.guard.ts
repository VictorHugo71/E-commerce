import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AllAuthService } from '../../services/auth/all-auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const allAuthService = inject(AllAuthService)
  const router = inject(Router);

  if (allAuthService.isAdmin()) {
    return true;
  } else {
    router.navigate(['/admin/login']);
    return false;
  }
}; 
