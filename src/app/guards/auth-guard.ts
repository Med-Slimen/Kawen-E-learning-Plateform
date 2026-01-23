import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../services/sessionService/session-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  await sessionService.ready;
  const role=sessionService.user?.role;
   if (sessionService.isLoggedIn()) return true;

  return router.createUrlTree(['/Login']);
};
