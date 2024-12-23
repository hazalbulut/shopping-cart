import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { IProduct } from '../../models/product.interface';
import { ProductState } from '../../state/product/product.state';
import { LayoutComponent } from '../../components/layout/layout.component';
import {
  AddToCart,
  DecrementQuantity,
  IncrementQuantity,
} from '../../state/cart/cart.actions';
import { ICartItem } from '../../models/cart-item.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  imports: [AsyncPipe, LayoutComponent],
})
export class ProductListComponent implements OnInit {
  public products$: Observable<IProduct[]> = new Observable<IProduct[]>();
  public cartItems$: Observable<ICartItem[]> = new Observable<ICartItem[]>();
  public productCount: number = 0;
  public productInCart: { [productId: number]: boolean } = {};
  public combinedProduct$: Observable<
    {
      product: IProduct;
      isInCart: boolean;
      quantity: number;
    }[]
  > = new Observable();

  private readonly store = inject(Store);

  ngOnInit(): void {
    this.combinedProduct$ = this.store.select(ProductState.getCombinedProducts);
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
}
