import { Component, inject, Input, OnInit } from '@angular/core';
import { ICartItem } from '../../models/cart-item.interface';
import { Store } from '@ngxs/store';
import { ProductState } from '../../state/product/product.state';
import {
  DecrementQuantity,
  IncrementQuantity,
  RemoveFromCart,
} from '../../state/cart/cart.actions';
import { IProduct } from '../../models/product.interface';
@Component({
  selector: 'app-card-cart-item',
  standalone: true,
  templateUrl: './card-cart-item.component.html',
  styleUrl: './card-cart-item.component.scss',
})
export class CardCartItemComponent implements OnInit {
  @Input() public item!: ICartItem;
  public selectedProduct!: IProduct;

  private readonly store = inject(Store);

  ngOnInit(): void {
    this.selectedProduct = this.store
      .selectSnapshot(ProductState.getProducts)
      .find((el) => el.id === this.item.productId) as IProduct;
  }

  incrementQuantity() {
    this.store.dispatch(new IncrementQuantity(this.item.productId));
  }

  decrementQuantity() {
    this.store.dispatch(new DecrementQuantity(this.item.productId));
  }

  removeFromCart() {
    this.store.dispatch(new RemoveFromCart(this.item.productId));
    alert(`Ürün sepetten çıkarıldı.`);
  }
}
