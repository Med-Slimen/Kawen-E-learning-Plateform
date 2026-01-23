import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/sessionService/session-service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[];
  await sessionService.ready;
  if(!sessionService.isLoggedIn()){
    return router.createUrlTree(['/login']);
  }
  if(sessionService.hasRole(roles)){
    return true;
  }
  return router.createUrlTree(['/Forbidden']);
};
