import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartItem } from '../../../cart/models/cart-item.model';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../auth/services/auth-state-service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden h-full">

      <!-- Image -->
      <div class="flex items-center justify-center h-48 bg-gray-50 p-4">
        <img
          [src]="product().image"
          [alt]="product().title"
          class="max-h-full max-w-full object-contain" />
      </div>

      <!-- Body -->
      <div class="flex flex-col flex-1 gap-2 p-4">
        <p class="text-xs text-blue-500 uppercase tracking-wide">{{ product().category }}</p>
        <h3 class="text-sm font-semibold text-gray-800 line-clamp-2">{{ product().title }}</h3>

        <div class="flex items-center gap-1 text-yellow-400 text-xs">
          <span>&#9733;</span>
          <span class="text-gray-600">{{ product().rating.rate }} ({{ product().rating.count }})</span>
        </div>

        <p class="text-lg font-bold text-gray-900 mt-auto">\${{ product().price }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 p-4 pt-0">
        <a
          [routerLink]="['/products', product().id]"
          class="flex-1 text-center text-sm border border-gray-300 text-gray-700 rounded-lg py-2
                 hover:bg-gray-100 transition-colors cursor-pointer">
          View
        </a>
        @if (authState.role() === 'user') {
          <button
            type="button"
            (click)="onAddToCart()"
            class="flex-1 text-sm bg-blue-600 text-white rounded-lg py-2
                   hover:bg-blue-700 transition-colors cursor-pointer">
            Add to Cart
          </button>
        }
        @if (authState.role() === 'admin') {
          <a
            [routerLink]="['/products', product().id, 'edit']"
            class="flex-1 text-center text-sm bg-amber-500 text-white rounded-lg py-2
                   hover:bg-amber-600 transition-colors cursor-pointer">
            Edit
          </a>
        }
      </div>

    </div>
  `,
  styles: ``,
})
export class ProductCard {
  // Input: parent passes the product
  product = input.required<Product>();

  // Output: emits when user clicks "Add to Cart"
  addToCart = output<CartItem>();

  // Injected auth state used to render role-specific actions.
  readonly authState = inject(AuthStateService);

  // Constructs a CartItem from the current product
  onAddToCart() {
    const p = this.product();
    this.addToCart.emit({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.image,
      quantity: 1,
    });
  }
}
