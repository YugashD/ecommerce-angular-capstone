import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../cart/services/cart.service';
import { AuthStateService } from '../../../../auth/services/auth-state-service';
import { Logo } from '../../logo/logo';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Logo],
  template: `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-0 flex items-stretch justify-between gap-8">

        <!-- Logo -->
        <a routerLink=""
           class="flex items-center gap-2 py-4 text-blue-600 hover:text-blue-700 transition-colors shrink-0"
           aria-label="EasyBuy home">
          <app-logo />
          <span class="text-xl font-bold tracking-tight">EasyBuy</span>
        </a>

        <!-- Nav -->
        <nav class="flex items-stretch gap-1" aria-label="Main navigation">

          <a routerLink=""
             routerLinkActive="border-b-2 border-blue-600 text-blue-600 font-semibold"
             [routerLinkActiveOptions]="{ exact: true }"
             class="flex items-center px-4 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50
                    border-b-2 border-transparent transition-colors">
            Home
          </a>

          <a routerLink="/products"
             routerLinkActive="border-b-2 border-blue-600 text-blue-600 font-semibold"
             class="flex items-center px-4 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50
                    border-b-2 border-transparent transition-colors">
            Products
          </a>

          <!-- Cart — users only -->
          @if (authState.role() === 'user') {
            <a routerLink="/cart"
               routerLinkActive="border-b-2 border-blue-600 text-blue-600"
               class="relative flex items-center px-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50
                      border-b-2 border-transparent transition-colors"
               aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
              @if (cartService.getTotalItems() > 0) {
                <span class="absolute top-2 right-1 bg-blue-600 text-white text-xs
                             font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {{ cartService.getTotalItems() }}
                </span>
              }
            </a>
          }
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-3 ml-auto">

          <!-- Role badge -->
          @if (authState.isLoggedIn()) {
            <span
              class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border"
              [class]="authState.role() === 'admin'
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-blue-50 border-blue-300 text-blue-700'"
              aria-label="Current role">
              @if (authState.role() === 'admin') {
                <!-- Shield icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              } @else {
                <!-- Person icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              {{ authState.role() === 'admin' ? 'Admin' : 'User' }}
            </span>
          }

          <!-- Logout -->
          @if (authState.isLoggedIn()) {
            <button
              type="button"
              (click)="logout()"
              class="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg
                     text-gray-600 hover:text-red-600 hover:bg-red-50 border border-transparent
                     hover:border-red-200 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>
          }

        </div>

      </div>
    </header>
  `,
  styles: ``,
})
export class Header {
  constructor(
    public cartService: CartService,
    public authState: AuthStateService,
    private router: Router,
  ) { }

  logout(): void {
    this.cartService.clearCart();
    this.authState.logout();
    this.router.navigate(['/auth/login']);
  }
}
