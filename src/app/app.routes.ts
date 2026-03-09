import { Routes } from '@angular/router';
import { Home } from './home/components/home';
import { ProductList } from './products/components/product-list/product-list';
import { ProductForm } from './products/components/product-form/product-form';
import { ProductDetails } from './products/components/product-details/product-details';
import { CartPage } from './cart/components/cart-page/cart-page/cart-page';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { NotFound } from './shared/components/not-found/not-found';
import { authGuard } from './shared/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', title: 'EasyBuy', component: Home, canActivate: [authGuard] },
  { path: 'auth/login', title: 'Login', component: Login },
  { path: 'auth/signup', title: 'Sign Up', component: Signup },
  { path: 'products', title: 'Products', component: ProductList, canActivate: [authGuard] },
  { path: 'products/new', title: 'New Product', component: ProductForm, canActivate: [adminGuard] },
  { path: 'products/:id/edit', title: 'Edit Product', component: ProductForm, canActivate: [adminGuard] },
  { path: 'products/:id', title: 'Product Details', component: ProductDetails, canActivate: [authGuard] },
  { path: 'cart', title: 'Cart', component: CartPage, canActivate: [authGuard] },
  { path: '**', title: 'Not Found', component: NotFound },
];
