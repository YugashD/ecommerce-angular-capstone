import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  // Inject the Router to perform navigation
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    // if token is valid, allow the navigation to proceed
    return true;
  } else {
    // Redirect to login page
    router.navigate(['/auth/login'], {
      queryParams: { reDirectTo: state.url }
    });
  }
  return false;
};
