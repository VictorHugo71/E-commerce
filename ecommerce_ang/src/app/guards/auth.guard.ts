import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AllAuthService } from '../services/auth/all-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const allAuthService = inject(AllAuthService)
  const router = inject(Router);

  if(allAuthService.isClient()) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};