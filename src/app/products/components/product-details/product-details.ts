import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../../cart/services/cart.service';
import { Loading } from '../../../shared/components/loading/loading/loading';
import { ErrorMessage } from '../../../shared/components/error-message/error-message/error-message';
import { AuthStateService } from '../../../auth/services/auth-state-service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-product-details',
  imports: [Loading, ErrorMessage, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">

      <!-- Back -->
      <a routerLink="/products"
         class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
        &#8592; Back to Products
      </a>

      <!-- Loading state -->
      @if (isLoading()) {
        <app-loading message="Loading product..." />
      }

      <!-- Not found state -->
      @else if (notFound()) {
        <app-error-message
          title="Product Not Found"
          message="The product you're looking for doesn't exist or has been removed."
          (retry)="loadProduct()" />
      }

      <!-- Error state -->
      @else if (hasError()) {
        <app-error-message
          title="Failed to load product"
          message="Could not retrieve product details. Please try again."
          (retry)="loadProduct()" />
      }

      <!-- Product details -->
      @else if (product()) {
        <div class="flex flex-col md:flex-row gap-10">

          <!-- Image -->
          <div class="flex items-center justify-center bg-gray-50 rounded-xl p-8 md:w-80 shrink-0">
            <img
              [src]="product()?.image"
              [alt]="product()?.title"
              class="max-h-64 max-w-full object-contain" />
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-4 flex-1">
            <p class="text-sm text-blue-500 uppercase tracking-wide">{{ product()?.category }}</p>
            <h1 class="text-2xl font-bold text-gray-800">{{ product()?.title }}</h1>

            <div class="flex items-center gap-2 text-yellow-400">
              <span>&#9733;</span>
              <span class="text-gray-600 text-sm">
                {{ product()?.rating?.rate }} &mdash; {{ product()?.rating?.count }} reviews
              </span>
            </div>

            <p class="text-3xl font-bold text-gray-900">\${{ product()?.price }}</p>

            <p class="text-gray-600 leading-relaxed">{{ product()?.description }}</p>

            <!-- Action buttons -->
            <div class="flex flex-wrap items-center gap-3 mt-2">
              @if (authState.role() === 'user') {

                <!-- Quantity stepper -->
                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    (click)="quantity.set(quantity() > 1 ? quantity() - 1 : 1)"
                    [disabled]="quantity() === 1"
                    class="w-9 h-9 flex items-center justify-center text-gray-600
                           hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity">
                    &minus;
                  </button>
                  <span class="w-10 text-center text-sm font-semibold text-gray-800">{{ quantity() }}</span>
                  <button
                    type="button"
                    (click)="quantity.set(quantity() + 1)"
                    class="w-9 h-9 flex items-center justify-center text-gray-600
                           hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity">
                    &#43;
                  </button>
                </div>

                <button
                  type="button"
                  (click)="addToCart()"
                  class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium
                         hover:bg-blue-700 transition-colors cursor-pointer">
                  Add to Cart
                </button>
              }

              @if (authState.role() === 'admin') {
                <a
                  [routerLink]="['/products', product()!.id, 'edit']"
                  class="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium
                         hover:bg-gray-100 transition-colors cursor-pointer">
                  Edit
                </a>

                <button
                  type="button"
                  (click)="showDeleteConfirm.set(true)"
                  [disabled]="isDeleting()"
                  class="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium
                         hover:bg-red-700 transition-colors cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isDeleting() ? 'Deleting...' : 'Delete' }}
                </button>
              }
            </div>
          </div>

        </div>
      }

      <!-- Delete confirmation modal -->
      @if (showDeleteConfirm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 class="text-lg font-bold text-gray-800 mb-2">Delete Product</h2>
            <p class="text-sm text-gray-600 mb-2">
              Are you sure you want to delete
              <span class="font-semibold text-gray-800">"{{ product()?.title }}"</span>?
            </p>
            <p class="text-sm text-red-500 mb-6">This action cannot be undone.</p>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                (click)="showDeleteConfirm.set(false)"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium
                       hover:bg-gray-100 transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                (click)="deleteProduct()"
                class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium
                       hover:bg-red-700 transition-colors cursor-pointer">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: ``,
})
export class ProductDetails implements OnInit {
  // The product loaded from the API
  product = signal<Product | null>(null);

  // True if the product details is fetching from the API.
  isLoading = signal(false);

  // True if the product fetch failed and the error state should be shown.
  hasError = signal(false);

  // True if the product was not found (404).
  notFound = signal(false);

  // True while the delete API call is in flight.
  isDeleting = signal(false);

  // Controls visibility of the delete confirmation modal.
  showDeleteConfirm = signal(false);

  // The number of units the user intends to add to the cart.
  quantity = signal(1);

  readonly authState = inject(AuthStateService);
  readonly toast = inject(ToastService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || isNaN(id) || id <= 0) {
      this.notFound.set(true);
      return;
    }

    this.isLoading.set(true);
    this.hasError.set(false);
    this.notFound.set(false);

    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        if (!data || !data.id) {
          this.notFound.set(true);
          this.isLoading.set(false);
          return;
        }
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.isLoading.set(false);
        
        if (err.status === 404) {
          this.notFound.set(true);
        } else {
          this.hasError.set(true);
        }
      },
    });
  }

  // Adds the current product to the cart using the selected quantity
  addToCart() {
    if (!this.product()) return;
    this.cartService.addToCart({
      id: this.product()!.id,
      title: this.product()!.title,
      price: this.product()!.price,
      image: this.product()!.image,
      quantity: this.quantity(),
    });
    this.toast.show(`${this.quantity()} × "${this.product()!.title}" added to cart!`);
    // Reset quantity to 1 after a successful cart add
    this.quantity.set(1);
  }

  // Initiates the product deletion flow after confirmation.
  // On success, shows a success overlay and redirects to the product list.
  // On failure, surfaces an inline error message without navigating away.
  deleteProduct() {
    if (!this.product()) return;

    this.showDeleteConfirm.set(false);
    this.isDeleting.set(true);

    this.productsService.deleteProduct(this.product()!.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.toast.show('Product deleted successfully.', 'success');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Failed to delete product', err);
        this.isDeleting.set(false);
        this.toast.show('Failed to delete product. Please try again.', 'error');
      },
    });
  }
}
