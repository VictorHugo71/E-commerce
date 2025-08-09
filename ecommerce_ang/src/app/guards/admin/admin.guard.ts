import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminAuthService } from '../../services/admin/auth/admin-auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);

  if(adminAuthService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/admin/login']);
    return false;
  }
};
