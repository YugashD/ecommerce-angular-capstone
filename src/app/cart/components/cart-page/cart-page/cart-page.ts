import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink],
  template: `
    <div class="min-h-[60vh] bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 py-10">

      <!-- Thank you screen -->
      @if (orderPlaced()) {
        <div class="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <div class="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-green-500" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-extrabold text-gray-800 mb-2">Order Placed!</h2>
            <p class="text-gray-500">Thank you for shopping with us. We'll get it to you soon.</p>
          </div>
          <a routerLink="/products"
             class="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl
                    hover:bg-blue-700 transition-colors shadow-md">
            Continue Shopping
          </a>
        </div>
      }

      @else {

        <h1 class="text-2xl font-bold text-gray-900 mb-8">
          Shopping Cart
          @if (cartService.items.length > 0) {
            <span class="ml-2 text-sm font-medium text-gray-400">({{ cartService.getTotalItems() }} item{{ cartService.getTotalItems() === 1 ? '' : 's' }})</span>
          }
        </h1>

        @if (cartService.items.length === 0) {
          <!-- Empty cart -->
          <div class="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-300" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11M10 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-700">Your cart is empty</p>
              <p class="text-sm text-gray-400 mt-1">Looks like you haven't added anything yet.</p>
            </div>
            <a routerLink="/products"
               class="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Browse Products
            </a>
          </div>
        }

        @else {
          <div class="flex flex-col lg:flex-row gap-8 items-start">

            <!-- Cart items -->
            <div class="flex-1 flex flex-col gap-3">
              @for (item of cartService.items; track item.id) {
                <div class="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">

                  <!-- Image + Info (click to navigate to product details) -->
                  <a [routerLink]="['/products', item.id]"
                     class="flex items-center gap-4 flex-1 min-w-0 group cursor-pointer">
                    <div class="w-18 h-18 shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                      <img [src]="item.image" [alt]="item.title"
                           class="w-16 h-16 object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</p>
                      <p class="text-base font-bold text-blue-600 mt-1">&#36;{{ item.price.toFixed(2) }}</p>
                    </div>
                  </a>

                  <!-- Quantity controls -->
                  <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden shrink-0">
                    <button type="button"
                      (click)="cartService.decreaseQuantity(item.id)"
                      class="w-8 h-8 flex items-center justify-center text-gray-500
                             hover:bg-gray-100 transition-colors cursor-pointer text-lg leading-none"
                      aria-label="Decrease quantity">&minus;</button>
                    <span class="w-8 text-center text-sm font-bold text-gray-800">{{ item.quantity }}</span>
                    <button type="button"
                      (click)="cartService.increaseQuantity(item.id)"
                      class="w-8 h-8 flex items-center justify-center text-gray-500
                             hover:bg-gray-100 transition-colors cursor-pointer text-lg leading-none"
                      aria-label="Increase quantity">&#43;</button>
                  </div>

                  <!-- Line total -->
                  <p class="text-sm font-bold text-gray-900 w-16 text-right shrink-0">
                    &#36;{{ (item.price * item.quantity).toFixed(2) }}
                  </p>

                  <!-- Remove -->
                  <button type="button"
                    (click)="cartService.removeFromCart(item.id)"
                    class="ml-1 p-1.5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50 shrink-0"
                    aria-label="Remove item">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                </div>
              }

              <!-- Clear cart link -->
              <div class="flex justify-end pt-1">
                <button type="button"
                  (click)="showClearConfirm.set(true)"
                  class="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer underline underline-offset-2">
                  Clear all items
                </button>
              </div>
            </div>

            <!-- Order summary -->
            <div class="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 sticky top-20">
              <h2 class="text-base font-bold text-gray-800">Order Summary</h2>

              <div class="flex flex-col gap-2 text-sm text-gray-600 border-b border-gray-100 pb-4">
                @for (item of cartService.items; track item.id) {
                  <div class="flex justify-between">
                    <span class="truncate max-w-[60%]">{{ item.title }}</span>
                    <span class="text-gray-500 shrink-0">× {{ item.quantity }}</span>
                  </div>
                }
              </div>

              <div class="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span class="font-medium text-gray-700">&#36;{{ cartService.getTotalPrice().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span class="text-green-600 font-medium">Free</span>
              </div>

              <div class="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 pt-4">
                <span>Total</span>
                <span>&#36;{{ cartService.getTotalPrice().toFixed(2) }}</span>
              </div>

              <button type="button"
                (click)="showCheckoutConfirm.set(true)"
                class="w-full bg-blue-600 text-white font-semibold rounded-xl py-3
                       hover:bg-blue-700 transition-colors cursor-pointer shadow-sm shadow-blue-200 mt-2">
                Checkout
              </button>

              <a routerLink="/products"
                 class="block text-center text-sm text-blue-600 hover:text-blue-700 transition-colors">
                ← Continue Shopping
              </a>
            </div>

          </div>
        }

      }

      <!-- Clear cart confirmation modal -->
      @if (showClearConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 class="text-lg font-bold text-gray-800 mb-2">Clear Cart</h2>
            <p class="text-sm text-gray-600 mb-2">Are you sure you want to remove all items from your cart?</p>
            <p class="text-sm text-red-500 mb-6">This action cannot be undone.</p>
            <div class="flex justify-end gap-3">
              <button type="button" (click)="showClearConfirm.set(false)"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium
                       hover:bg-gray-100 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="confirmClear()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium
                       hover:bg-red-700 transition-colors cursor-pointer">
                Yes, Clear
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Checkout confirmation modal -->
      @if (showCheckoutConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 class="text-lg font-bold text-gray-800 mb-2">Confirm Order</h2>
            <p class="text-sm text-gray-600 mb-1">
              You have <span class="font-semibold text-gray-800">{{ cartService.getTotalItems() }} item(s)</span> totalling
              <span class="font-semibold text-gray-800">&#36;{{ cartService.getTotalPrice().toFixed(2) }}</span>.
            </p>
            <p class="text-sm text-gray-500 mb-6">Do you want to place this order?</p>
            <div class="flex justify-end gap-3">
              <button type="button" (click)="showCheckoutConfirm.set(false)"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium
                       hover:bg-gray-100 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="confirmCheckout()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                       hover:bg-blue-700 transition-colors cursor-pointer">
                Place Order
              </button>
            </div>
          </div>
        </div>
      }

    </div>
    </div>
  `,
  styles: ``,
})
export class CartPage {
  showClearConfirm = signal(false);
  showCheckoutConfirm = signal(false);
  orderPlaced = signal(false);

  constructor(
    public cartService: CartService,
    private toast: ToastService,
  ) { }

  confirmClear() {
    this.cartService.clearCart();
    this.showClearConfirm.set(false);
    this.toast.show('Cart cleared successfully.', 'success');
  }

  confirmCheckout() {
    this.cartService.clearCart();
    this.showCheckoutConfirm.set(false);
    this.orderPlaced.set(true);
  }
}