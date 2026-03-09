import { Injectable, signal } from '@angular/core';

export type UserRole = 'admin' | 'user';


 // AuthStateService is a singleton service that manages the authentication state of the user across the application.

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  /** signal tracking whether the user is authenticated. */
  private _isLoggedIn = signal(this.checkLoginStatus());

  /** signal tracking the current user's role. */
  private _role = signal<UserRole>(this.checkRole());

  /** projection of the login state. */
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  /** projection of the user role. */
  readonly role = this._role.asReadonly();


  // if a valid session exists at the time of service instantiation.
  private checkLoginStatus(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  // Reads the persisted role from localStorage.
  // Falls back to `'user'` if no valid role is stored.

  private checkRole(): UserRole {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('role');
      if (stored === 'admin' || stored === 'user') return stored;
    }
    return 'user';
  }

  // Updates the authenticated session state after a successful login.
  setLoggedIn(status: boolean, role: UserRole = 'user'): void {
    this._isLoggedIn.set(status);
    if (status) {
      this._role.set(role);
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('role', role);
      }
    }
  }

  // Terminates the current session by clearing the token and role
  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    this._isLoggedIn.set(false);
    this._role.set('user');
  }
}
