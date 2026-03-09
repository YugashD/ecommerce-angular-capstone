import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../../cart/services/cart.service';
import { CartItem } from '../../../cart/models/cart-item.model';
import { ProductCard } from '../product-card/product-card';
import { Loading } from '../../../shared/components/loading/loading/loading';
import { ErrorMessage } from '../../../shared/components/error-message/error-message/error-message';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../auth/services/auth-state-service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, Loading, ErrorMessage, RouterLink],
  template: `
    <section class="max-w-7xl mx-auto px-4 py-8">

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Products</h1>
        @if (authState.role() === 'admin') {
          <a
            routerLink="/products/new"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                   hover:bg-blue-700 transition-colors cursor-pointer">
            + Add Product
          </a>
        }
      </div>

      <!-- Loading state -->
      @if (isLoading()) {
        <app-loading message="Fetching products..." />
      }

      <!-- Error state -->
      @else if (hasError()) {
        <app-error-message
          title="Failed to load products"
          message="Could not reach the server. Please try again."
          (retry)="getProducts()" />
      }

      @else {
        <!-- Category filter pills -->
        <div class="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by category">
          @for (cat of categories; track cat) {
            <button
              type="button"
              (click)="selectCategory(cat)"
              [class]="selectedCategory() === cat
                ? 'px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-sm'
                : 'px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors'">
              {{ cat === 'all' ? 'All' : cat }}
            </button>
          }
        </div>

        <!-- Result count -->
        <p class="text-xs text-gray-400 mb-4">
          Showing {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }}
        </p>

        <!-- Empty filtered state -->
        @if (filteredProducts.length === 0) {
          <div class="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
            <p class="text-lg font-medium">No products found</p>
          </div>
        }

        <!-- Product grid -->
        @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (product of filteredProducts; track product.id) {
              <app-product-card
                [product]="product"
                (addToCart)="onAddToCart($event)" />
            }
          </div>
        }
      }

    </section>
  `,
  styles: ``,
})
export class ProductList implements OnInit {
  // Full unfiltered product list 
  allProducts = signal<Product[]>([]);

  // Indicates that the API fetch is in progress.
  isLoading = signal(false);

  // Indicates that the API fetch has failed and the error state should be shown.
  hasError = signal(false);

  // Currently active category filter. `'all'` means no filter is applied.
  selectedCategory = signal<string>('all');

  // Maps clean URL slugs to actual API category strings
  private readonly slugToCategory: Record<string, string> = {
    'mens-clothing': "men's clothing",
    'womens-clothing': "women's clothing",
  };

  /**
   * Converts an API category string to a URL-safe slug.
   * Strips apostrophes and replaces whitespace with hyphens.
   */
  private toSlug(cat: string): string {
    return cat.replace(/'/g, '').replace(/\s+/g, '-');
  }

  // Resolves a URL slug back to the original API category string.
  private fromSlug(slug: string): string {
    return this.slugToCategory[slug] ?? slug;
  }

  // Derives the ordered list of unique categories from the loaded products.
  get categories(): string[] {
    const cats: string[] = ['all'];
    for (const product of this.allProducts()) {
      if (!cats.includes(product.category)) {
        cats.push(product.category);
      }
    }
    return cats;
  }

  // Returns the subset of products that match the active category filter.
  // Returns all products when `selectedCategory` is `'all'`.
  get filteredProducts(): Product[] {
    const cat = this.selectedCategory();
    return cat === 'all'
      ? this.allProducts()
      : this.allProducts().filter((p) => p.category === cat);
  }

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    public authState: AuthStateService,
    private toast: ToastService
  ) { }


  // Updates the active category filter
  // with the URL query parameter so the state is shareable and bookmarkable.
  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: cat === 'all' ? null : this.toSlug(cat) },
      queryParamsHandling: 'merge',
    });
  }

  // Reads the `category` query param from the current URL on load
  ngOnInit() {
    const slug = this.route.snapshot.queryParamMap.get('category');
    if (slug) {
      this.selectedCategory.set(this.fromSlug(slug));
    }
    this.getProducts();
  }


  // Fetches the full product catalogue from the API.
  getProducts() {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.allProducts.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  // Handles the `addToCart` event 
  onAddToCart(item: CartItem) {
    this.cartService.addToCart(item);
    this.toast.show(`"${item.title}" added to cart!`);
  }
}
