import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">

      <h1 class="text-2xl font-bold text-gray-800 mb-6">{{ isEditMode() ? 'Edit Product' : 'Add Product' }}</h1>

      <form #productForm="ngForm" (ngSubmit)="onSubmit(productForm)"
            class="flex flex-col gap-5 bg-white p-6 rounded-xl shadow">

        <!-- Title -->
        <div class="flex flex-col gap-1">
          <label for="title" class="text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            [(ngModel)]="formData().title"
            #title="ngModel"
            required
            minlength="3"
            placeholder="Product title"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          @if (title.invalid && title.touched) {
            @if (title.errors?.['required']) {
              <p class="text-xs text-red-600">Title is required.</p>
            }
            @if (title.errors?.['minlength']) {
              <p class="text-xs text-red-600">Title must be at least 3 characters.</p>
            }
          }
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1">
          <label for="description" class="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="formData().description"
            #description="ngModel"
            required
            minlength="10"
            placeholder="Product description"
            rows="3"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none">
          </textarea>
          @if (description.invalid && description.touched) {
            @if (description.errors?.['required']) {
              <p class="text-xs text-red-600">Description is required.</p>
            }
            @if (description.errors?.['minlength']) {
              <p class="text-xs text-red-600">Description must be at least 10 characters.</p>
            }
          }
        </div>

        <!-- Category -->
        <div class="flex flex-col gap-1">
          <label for="category" class="text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            [(ngModel)]="formData().category"
            #category="ngModel"
            required
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select a category --</option>
            @for (cat of categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
          @if (category.invalid && category.touched) {
            <p class="text-xs text-red-600">Please select a category.</p>
          }
        </div>

        <!-- Price -->
        <div class="flex flex-col gap-1">
          <label for="price" class="text-sm font-medium text-gray-700">Price ($)</label>
          <input
            id="price"
            type="number"
            name="price"
            [(ngModel)]="formData().price"
            #price="ngModel"
            required
            min="0.01"
            placeholder="0.00"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          @if (price.invalid && price.touched) {
            @if (price.errors?.['required']) {
              <p class="text-xs text-red-600">Price is required.</p>
            }
            @if (price.errors?.['min']) {
              <p class="text-xs text-red-600">Price must be greater than 0.</p>
            }
          }
        </div>

        <!-- Image URL -->
        <div class="flex flex-col gap-1">
          <label for="image" class="text-sm font-medium text-gray-700">Image URL</label>
          <input
            id="image"
            type="text"
            name="image"
            [(ngModel)]="formData().image"
            #image="ngModel"
            required
            pattern="https?://.+"
            placeholder="https://example.com/image.jpg"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          @if (image.invalid && image.touched) {
            @if (image.errors?.['required']) {
              <p class="text-xs text-red-600">Image URL is required.</p>
            }
            @if (image.errors?.['pattern']) {
              <p class="text-xs text-red-600">Must be a valid URL starting with http:// or https://</p>
            }
          }
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            [disabled]="productForm.invalid || isSubmitting()"
            class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                   hover:bg-blue-700 transition-colors cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting() ? (isEditMode() ? 'Saving...' : 'Adding...') : (isEditMode() ? 'Save Changes' : 'Add Product') }}
          </button>

          <button
            type="button"
            (click)="goBack()"
            class="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg
                   hover:bg-gray-100 transition-colors cursor-pointer">
            Cancel
          </button>
        </div>

      </form>

    </div>
  `,
  styles: ``,
})
export class ProductForm implements OnInit {
  // Available category options fetched from the API for the category dropdown.
  categories = signal<string[]>([]);

  // True while the create/update API call is in flight.
  isSubmitting = signal(false);

  // Distinguishes between create and edit modes.
  isEditMode = signal(false);

  // The ID of the product being edited; null in create mode.
  productId: number | null = null;

  // Reactive form data backing object.
  // Price is initially null to prevent the numeric field from showing '0'.

  formData = signal({
    title: '',
    description: '',
    category: '',
    price: null as number | null,
    image: '',
  });

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) { }

  // Fetches available categories for the dropdown
  ngOnInit() {
    this.productsService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });

    // Detect edit mode by checking for an :id route parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId = Number(id);
      this.loadProduct(this.productId);
    }
  }

  // Fetches the product being edited and maps its fields into the form signal.
  loadProduct(id: number) {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.formData.set({
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          image: product.image,
        });
      },
      error: (err) => {
        console.log('Failed to load product', err);
        console.error('Failed to load product', err);
      },
    });
  }

  // Handles form submission. Guards against invalid form state
  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isSubmitting.set(true);

    if (this.isEditMode() && this.productId !== null) {
      // Edit mode: send a PUT request with the updated product payload
      this.productsService.updateProduct(this.productId, this.formData() as any).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toast.show('Product updated successfully.', 'success');
          setTimeout(() => this.router.navigate(['/products', this.productId]), 600);
        },
        error: (err) => {
          console.error('Failed to update product', err);
          this.isSubmitting.set(false);
          this.toast.show('Failed to update product. Please try again.', 'error');
        },
      });
    } else {
      // Create mode: send a POST request with the new product payload
      this.productsService.addProduct(this.formData() as any).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.toast.show('Product added successfully.', 'success');
          setTimeout(() => this.router.navigate(['/products']), 600);
        },
        error: (err) => {
          console.error('Failed to add product', err);
          this.isSubmitting.set(false);
          this.toast.show('Failed to add product. Please try again.', 'error');
        },
      });
    }
  }

  // Returns to the product detail page in edit mode, or the product list

  goBack() {
    if (this.isEditMode() && this.productId !== null) {
      this.router.navigate(['/products', this.productId]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}