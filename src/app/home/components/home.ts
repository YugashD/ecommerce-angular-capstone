import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../auth/services/auth-state-service';
import { Logo } from '../../shared/components/logo/logo';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Logo],
  template: `
    <div>

      <!-- Hero -->
      <section class="relative bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900 text-white overflow-hidden">
        <!-- Decorative blobs -->
        <div class="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true"></div>

        <div class="relative max-w-5xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">

          <!-- Text -->
          <div class="flex-1 text-center md:text-left">
            <span class="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase mb-5">
              New arrivals every week
            </span>
            <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Shop Smarter.<br />
              <span class="text-blue-400">Live Better.</span>
            </h1>
            <p class="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              Discover thousands of products across electronics, fashion, jewelry and more — all in one place.
            </p>
            <div class="flex flex-wrap gap-3 justify-center md:justify-start">
              @if (isAdmin()) {
                <a routerLink="/products"
                   class="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-700/30">
                  Manage Products
                </a>
                <a routerLink="/products/new"
                   class="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
                  Add Product
                </a>
              } @else {
                <a routerLink="/products"
                   class="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-700/30">
                  Shop Now
                </a>
                <a routerLink="/cart"
                   class="px-7 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors">
                  View Cart
                </a>
              }
            </div>
          </div>

          <!-- Illustration -->
          <div class="flex-shrink-0 flex items-center justify-center w-52 h-52 md:w-64 md:h-64 rounded-full bg-blue-500/10 border border-blue-500/20">
            <app-logo size="w-28 h-28 text-blue-300" strokeWidth="1" />
          </div>

        </div>
      </section>

      <!-- Categories -->
      <section class="bg-gray-50 py-16 px-4">
        <div class="max-w-5xl mx-auto">
          @if (isAdmin()) {
            <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Manage by Category</h2>
            <p class="text-gray-500 text-sm text-center mb-10">Browse products by category</p>
          } @else {
            <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Shop by Category</h2>
            <p class="text-gray-500 text-sm text-center mb-10">Find exactly what you're looking for</p>
          }

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

            <!-- Electronics -->
            <a routerLink="/products" [queryParams]="{ category: 'electronics' }"
               class="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
              <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Electronics</span>
            </a>

            <!-- Jewelry -->
            <a routerLink="/products" [queryParams]="{ category: 'jewelery' }"
               class="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group">
              <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <!-- Diamond gem -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l4-5h10l4 5-9 11L3 9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 4l5 16 5-16"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9h18"/>
              </svg>
              </div>
              <span class="text-sm font-semibold text-gray-700 group-hover:text-amber-600 transition-colors">Jewelry</span>
            </a>

            <!-- Men's Clothing -->
            <a routerLink="/products" [queryParams]="{ category: mensCat }"
               class="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
              <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <!-- T-shirt -->
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">Men's Clothing</span>
            </a>

            <!-- Women's Clothing -->
            <a routerLink="/products" [queryParams]="{ category: womensCat }"
               class="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group">
              <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V7a3 3 0 016 0v2" />
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-700 group-hover:text-pink-600 transition-colors">Women's Clothing</span>
            </a>

          </div>
        </div>
      </section>

      <!-- Why EasyBuy -->
      <section class="bg-white py-16 px-4 border-t border-gray-100">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">Why EasyBuy?</h2>
          <p class="text-gray-500 text-sm text-center mb-10">Everything you need for a great shopping experience</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div class="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-800 mb-1">Secure Payments</h3>
                <p class="text-xs text-gray-500 leading-relaxed">Your transactions are always safe with end-to-end encryption.</p>
              </div>
            </div>

            <div class="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div class="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-800 mb-1">100% Authentic</h3>
                <p class="text-xs text-gray-500 leading-relaxed">Every product is curated and verified for quality.</p>
              </div>
            </div>

            <div class="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div class="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-800 mb-1">Easy Returns</h3>
                <p class="text-xs text-gray-500 leading-relaxed">Hassle-free returns within 30 days of purchase.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- CTA Banner -->
      <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-14 px-4 text-white text-center">
        @if (isAdmin()) {
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Manage your catalogue</h2>
          <p class="text-blue-100 text-sm mb-7 max-w-md mx-auto">
            Review inventory, update listings, and add new products.
          </p>
          <a routerLink="/products"
             class="inline-block px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Manage Products
          </a>
        } @else {
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Ready to start shopping?</h2>
          <p class="text-blue-100 text-sm mb-7 max-w-md mx-auto">
            Browse our full catalogue and find your next favourite product.
          </p>
          <a routerLink="/products"
             class="inline-block px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Browse All Products
          </a>
        }
      </section>

    </div>
  `,
  styles: ``,
})
export class Home {
  readonly authState = inject(AuthStateService);

  isAdmin() {
    return this.authState.role() === 'admin';
  }

  // Pre-encoded slug for the men's clothing category.
  readonly mensCat = 'mens-clothing';

  // Pre-encoded slug for the women's clothing category.
  readonly womensCat = 'womens-clothing';
}
