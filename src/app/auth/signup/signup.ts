import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormsModule, NgForm, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <form
        class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
        #signupForm="ngForm"
        (ngSubmit)="handleSignup(signupForm)">

        <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h1>

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ errorMessage() }}
          </div>
        }

        <!-- First Name + Last Name -->
        <div class="flex gap-4 mb-5">
          <div class="flex flex-col gap-1 flex-1">
            <label for="firstName" class="block text-gray-700 font-semibold mb-1 text-sm">First Name</label>
            <input
              id="firstName"
              type="text"
              ngModel
              name="firstName"
              required
              minlength="2"
              #firstName="ngModel"
              placeholder="John"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (firstName.invalid && firstName.touched) {
              @if (firstName.errors?.['required']) {
                <p class="text-xs text-red-600">First name is required.</p>
              }
              @if (firstName.errors?.['minlength']) {
                <p class="text-xs text-red-600">At least 2 characters.</p>
              }
            }
          </div>

          <div class="flex flex-col gap-1 flex-1">
            <label for="lastName" class="block text-gray-700 font-semibold mb-1 text-sm">Last Name</label>
            <input
              id="lastName"
              type="text"
              ngModel
              name="lastName"
              required
              minlength="2"
              #lastName="ngModel"
              placeholder="Doe"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            @if (lastName.invalid && lastName.touched) {
              @if (lastName.errors?.['required']) {
                <p class="text-xs text-red-600">Last name is required.</p>
              }
              @if (lastName.errors?.['minlength']) {
                <p class="text-xs text-red-600">At least 2 characters.</p>
              }
            }
          </div>
        </div>

        <!-- Username -->
        <div class="mb-5">
          <label for="username" class="block text-gray-700 font-semibold mb-2 text-sm">Username</label>
          <input
            id="username"
            type="text"
            ngModel
            name="username"
            required
            minlength="3"
            #username="ngModel"
            placeholder="johndoe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          @if (username.invalid && username.touched) {
            @if (username.errors?.['required']) {
              <p class="text-xs text-red-600">Username is required.</p>
            }
            @if (username.errors?.['minlength']) {
              <p class="text-xs text-red-600">Username must be at least 3 characters.</p>
            }
          }
        </div>

        <!-- Email -->
        <div class="mb-5">
          <label for="email" class="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
          <input
            id="email"
            type="email"
            ngModel
            name="email"
            required
            email
            #email="ngModel"
            placeholder="john@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          @if (email.invalid && email.touched) {
            @if (email.errors?.['required']) {
              <p class="text-xs text-red-600">Email is required.</p>
            }
            @if (email.errors?.['email']) {
              <p class="text-xs text-red-600">Enter a valid email address.</p>
            }
          }
        </div>

        <!-- Password -->
        <div class="mb-5">
          <label for="password" class="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
          <input
            id="password"
            type="password"
            ngModel
            name="password"
            required
            minlength="6"
            #password="ngModel"
            placeholder="Min. 6 characters"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          @if (password.invalid && password.touched) {
            @if (password.errors?.['required']) {
              <p class="text-xs text-red-600">Password is required.</p>
            }
            @if (password.errors?.['minlength']) {
              <p class="text-xs text-red-600">Password must be at least 6 characters.</p>
            }
          }
        </div>

        <!-- Confirm Password -->
        <div class="mb-8">
          <label for="confirmPassword" class="block text-gray-700 font-semibold mb-2 text-sm">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            ngModel
            name="confirmPassword"
            required
            #confirmPassword="ngModel"
            placeholder="Re-enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          @if (confirmPassword.touched && signupForm.value.password !== signupForm.value.confirmPassword) {
            <p class="text-xs text-red-600">Passwords do not match.</p>
          }
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="signupForm.invalid || isLoading() || signupForm.value.password !== signupForm.value.confirmPassword"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ isLoading() ? 'Creating account...' : 'Sign Up' }}
        </button>

        <!-- Footer Link -->
        <p class="text-center text-gray-600 text-sm mt-4">
          Already have an account?
          <a routerLink="/auth/login" class="text-blue-500 hover:text-blue-600 font-semibold">Sign in</a>
        </p>

      </form>
    </div>

    <!-- Success overlay -->
    @if (successMessage()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm mx-4 flex flex-col items-center gap-4 text-center">
          <!-- Checkmark circle -->
          <div class="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-green-600" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Account Created!</h2>
          <p class="text-gray-500 text-sm">Your account has been successfully created.</p>
          <div class="flex items-center gap-2 text-sm text-green-600 font-medium">
            <!-- Spinner -->
            <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Redirecting to login...
          </div>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class Signup {
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  handleSignup(form: NgForm) {
    if (form.invalid) return;
    if (form.value.password !== form.value.confirmPassword) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { confirmPassword, ...payload } = form.value;

    this.authService.signup(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Account created! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Sign up failed. Please try again.');
        console.error('Signup failed:', err);
      },
    });
  }
}
