import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

/**
 * CartService
 *
 * Manages the shopping cart state and persists it to localStorage so
 * the cart survives page refreshes.
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  /** localStorage key used to save and load the cart. */
  private readonly STORAGE_KEY = 'easybuy_cart';

  items: CartItem[] = this.loadFromStorage();

  /** Reads the cart from localStorage and returns it as an array. */
  private loadFromStorage(): CartItem[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  /** Writes the current cart array to localStorage. */
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  }

  /**
   * Adds a product to the cart.
   * If the product already exists, its quantity is increased by the
   * requested amount rather than adding a duplicate entry.
   */
  addToCart(product: CartItem) {
    const existing = this.items.find(item => item.id === product.id);

    if (existing) {
      // Merge quantities when the product is already present in the cart
      existing.quantity += product.quantity;
    } else {
      // Add a new entry using a shallow copy to avoid shared references
      this.items.push({ ...product });
    }

    this.saveToStorage();
    console.log('Added to cart:', product.title);
  }

  // Removes a product from the cart entirely, regardless of its quantity.

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
  }

  // Increments the quantity of an existing cart item by one.
  increaseQuantity(productId: number) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      item.quantity++;
      this.saveToStorage();
    }
  }

  // Decrements the quantity of an existing cart item by one.
  decreaseQuantity(productId: number) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      // Remove the last unit rather than allowing a zero-quantity entry
      this.removeFromCart(productId);
    } else {
      item.quantity--;
      this.saveToStorage();
    }
  }

  // Empties the cart by discarding all line items and clearing localStorage.
  // Typically called after a successful order placement.
  clearCart() {
    this.items = [];
    this.saveToStorage();
  }

  // Calculates and returns the total number of individual units

  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }


  // Calculates and returns the cumulative monetary value of all items
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
