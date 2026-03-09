import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductUpsert } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  /** Base URL for all product-related API endpoints. */
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) { }

  // Retrieves the full list of products from the catalogue.
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Retrieves a single product by its unique identifier.
  getProductById(productId: number): Observable<Product> {
    console.log('product id: ' + productId);
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  // Retrieves the list of available product categories from the API.

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  // Submits a new product
  addProduct(data: ProductUpsert): Observable<Product> {
    console.log(data);
    return this.http.post<Product>(this.apiUrl, data);
  }

  // Updates an existing product by ID
  updateProduct(productId: number, data: ProductUpsert): Observable<Product> {
    console.log('Updating product id: ' + productId, data);
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, data);
  }

  // Deletes a product from the catalogue by its ID.
  deleteProduct(productId: number): Observable<void> {
    console.log('Deleting product id: ' + productId);
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
}
