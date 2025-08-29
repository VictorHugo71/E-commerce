import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AllAuthService } from '../../services/auth/all-auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const allAuthService = inject(AllAuthService)
  const router = inject(Router);

  if (allAuthService.isLoggedIn()) {
    // 2. Se estiver logado, checa o papel e redireciona
    if (allAuthService.isAdmin()) {
      return router.createUrlTree(['/admin/dashboard']);
    } else if (allAuthService.isClient()) {
      return router.createUrlTree(['/perfil']);
    }
    // 3. Se for um papel não reconhecido, redireciona para uma página padrão
    return router.createUrlTree(['/home']);
  }

  // 4. Se não estiver logado, permite o acesso à rota pública (login/cadastro)
  return true;
};

