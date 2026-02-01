import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/sessionService/session-service';
import { inject } from '@angular/core';

export const isVerifiedGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  if(sessionService.user()?.status==='Pending'){
    router.navigate(['/Under_Verification']);
  }
  else if(sessionService.user()?.status==='Rejected'){
    router.navigate(['/Rejected']);
  }
  return true;
};
