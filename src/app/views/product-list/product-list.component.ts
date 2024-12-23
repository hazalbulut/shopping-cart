import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { IProduct } from '../../models/product.interface';
import {
  AddToCart,
  CartState,
  DecrementQuantity,
  IncrementQuantity,
} from '../../state/cart.state';
import { ProductState } from '../../state/product.state';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  imports: [AsyncPipe, NgIf],
})
export class ProductListComponent implements OnInit {
  public products$: Observable<IProduct[]> = new Observable<IProduct[]>();
  public productCount: number = 0;
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.products$ = this.store.select(ProductState.getProducts);
  }

  addToCart(product: any) {
    if (product.stock <= 0) {
      return;
    }
    this.store.dispatch(
      new AddToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  }

  incrementQuantity(productId: number) {
    this.store.dispatch(new IncrementQuantity(productId));
  }

  decrementQuantity(productId: number) {
    this.store.dispatch(new DecrementQuantity(productId));
  }

  isInCart(productId: number): boolean {
    const cartItems = this.store.selectSnapshot(CartState.getCartItems);
    return !!cartItems?.find((item) => item.productId === productId);
  }

  getProductQuantity(productId: number): number {
    const cartItems = this.store.selectSnapshot(CartState.getCartItems);
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  }

  isStockAvailable(productId: number): boolean {
    const selectedProduct = this.store
      .selectSnapshot(ProductState.getProducts)
      .find((p: any) => p.id === productId);
    const cartItems = this.store.selectSnapshot(CartState.getCartItems);
    const cartItem = cartItems.find((item) => item.productId === productId);

    if (selectedProduct && cartItem) {
      return cartItem.quantity < selectedProduct.stock;
    }
    return true;
  }
}
