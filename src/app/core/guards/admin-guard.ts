import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../../auth/services/auth-state-service';

/**
 * adminGuard is a route guard that restricts access to certain routes based on the user's authentication status and role.
 * Unauthenticated users are redirected to the login page.
 * Authenticated non-admin users are silently redirected to the home page.
 */
export const adminGuard: CanActivateFn = (_route, _state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // Ensure the user has an active session before role inspection
  if (!authState.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (authState.role() !== 'admin') {
    // Redirect non-admins back to the home page
    router.navigate(['']);
    return false;
  }

  return true;
};
