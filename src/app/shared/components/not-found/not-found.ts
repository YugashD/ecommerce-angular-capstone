import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    imports: [RouterLink],
    template: `
    <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

      <!-- 404 badge -->
      <p class="text-8xl font-extrabold text-blue-100 select-none">404</p>

      <!-- Icon -->
      <div class="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center my-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-400" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p class="text-gray-500 text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <a routerLink=""
         class="px-7 py-2.5 bg-blue-600 text-white font-semibold rounded-xl
                hover:bg-blue-700 transition-colors shadow-sm">
        Back to Home
      </a>

    </div>
  `,
    styles: ``,
})
export class NotFound { }
