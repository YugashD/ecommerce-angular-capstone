import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from "@angular/forms";
import { AuthService } from '../services/auth-service';
import { AuthStateService, UserRole } from '../services/auth-state-service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';


// Login Component
// Entry point for user authentication.
@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <form class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      #loginForm="ngForm" (ngSubmit)="handleLogin(loginForm)" >
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Login</h1>

        <!-- Role Selection -->
        <div class="mb-6">
          <p class="block text-gray-700 font-semibold mb-3">Login as</p>
          <div class="flex gap-6" role="radiogroup" aria-label="Select your role">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="user"
                [checked]="selectedRole() === 'user'"
                (change)="selectedRole.set('user')"
                class="w-4 h-4 text-blue-600 cursor-pointer"
                aria-label="User role"
              />
              <span class="text-gray-700 text-sm font-medium">User</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                [checked]="selectedRole() === 'admin'"
                (change)="selectedRole.set('admin')"
                class="w-4 h-4 text-blue-600 cursor-pointer"
                aria-label="Admin role"
              />
              <span class="text-gray-700 text-sm font-medium">Admin</span>
            </label>
          </div>
        </div>

        <!-- Username Field -->
        <div class="mb-6">
          <label for="username" class="block text-gray-700 font-semibold mb-2"> Username </label>
          <input
            id="username"
            type="text"
            ngModel
            name="username"
            required
            placeholder="Enter your username"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Password Field -->
        <div class="mb-8">
          <label for="password" class="block text-gray-700 font-semibold mb-2"> Password </label>
          <input
            id="password"
            type="password"
            ngModel
            name="password"
            required
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="loginForm.invalid || isLoading()"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ isLoading() ? 'Signing in...' : 'Sign In as ' + (selectedRole() === 'admin' ? 'Admin' : 'User') }}
        </button>

        <!-- Footer Link -->
        <p class="text-center text-gray-600 text-sm mt-4">
          Don't have an account?
          <a routerLink="/auth/signup" class="text-blue-500 hover:text-blue-600 font-semibold"> Sign up </a>
        </p>
      </form>
    </div>
  `,
  styles: ``,
})
export class Login {
  // Signal tracking the loading state
  isLoading = signal(false);

  // Signal tracking the role the user has selected before submitting.
  selectedRole = signal<UserRole>('user');

  constructor(
    private authService: AuthService,
    private authState: AuthStateService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) { }

  // Handles form submission. Sends credentials to the AuthService and
  // processes the API response to either establish or reject the session.
  handleLogin(loginForm: NgForm) {
    this.isLoading.set(true);

    this.authService.login(loginForm.value).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        // Persist the JWT token to localStorage for session continuity
        console.log(response);
        localStorage.setItem('token', response.token);
        // Update the global auth state with the selected role
        this.authState.setLoggedIn(true, this.selectedRole());
        // Redirect to the original destination or fall back to home
        const redirectTo = this.route.snapshot.queryParamMap.get('reDirectTo');
        this.router.navigateByUrl(redirectTo || '');
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.show('Invalid username or password. Please try again.', 'error');
        console.error('Login failed:', error);
      }
    });
  }
}