import { Routes } from '@angular/router';
import { ProductListComponent } from './views/product-list/product-list.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  {
    path: 'cart',
    loadComponent: () =>
      import('./views/cart/cart.component').then((m) => m.CartComponent),
    data: { hideCartFromLayout: true },
  },
];
