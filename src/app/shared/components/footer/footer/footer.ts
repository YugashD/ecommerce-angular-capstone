import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../../logo/logo';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo],
  template: `
    <footer class="bg-gray-900 text-gray-400 border-t border-gray-800">
      

      <!-- Main footer columns -->
      <div class="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-10 border-b border-gray-800">

        <!-- Brand column -->
        <div class="flex flex-col gap-4">
          <a routerLink="" class="flex items-center gap-2 group w-fit" aria-label="EasyBuy home">
            <app-logo size="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span class="text-white text-base font-bold tracking-tight group-hover:text-blue-300 transition-colors">EasyBuy</span>
          </a>
          <p class="text-sm text-gray-500 leading-relaxed">
            Your one-stop destination for quality products at the best prices. Shop with confidence.
          </p>
        </div>

        <!-- Quick links -->
        <div class="flex flex-col gap-3">
          <h3 class="text-white text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
          <nav class="flex flex-col gap-2" aria-label="Footer quick links">
            <a routerLink=""     class="text-sm hover:text-white transition-colors w-fit">Home</a>
            <a routerLink="/products" class="text-sm hover:text-white transition-colors w-fit">Products</a>
            <a routerLink="/cart"     class="text-sm hover:text-white transition-colors w-fit">Cart</a>
          </nav>
        </div>

        <!-- Account links -->
        <div class="flex flex-col gap-3">
          <h3 class="text-white text-sm font-semibold uppercase tracking-wider">Account</h3>
          <nav class="flex flex-col gap-2" aria-label="Footer account links">
            <a routerLink="/auth/login"  class="text-sm hover:text-white transition-colors w-fit">Sign In</a>
            <a routerLink="/auth/signup" class="text-sm hover:text-white transition-colors w-fit">Create Account</a>
          </nav>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-center text-xs text-gray-600">
        <p>&copy; {{ year }} EasyBuy. All rights reserved.</p>
      </div>

    </footer>
  `,
  styles: ``,
})
export class Footer {
  readonly year = new Date().getFullYear();
}
