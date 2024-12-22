import { Component, inject, Input } from '@angular/core';
import { ICartItem } from '../../models/cart-item.interface';
import { Store } from '@ngxs/store';
import {
  CartState,
  DecrementQuantity,
  IncrementQuantity,
  RemoveFromCart,
} from '../../state/cart.state';
import { ProductState } from '../../state/product.state';
@Component({
  selector: 'app-card-cart-item',
  standalone: true,
  templateUrl: './card-cart-item.component.html',
  styleUrl: './card-cart-item.component.scss',
})
export class CardCartItemComponent {
  @Input() item!: ICartItem;
  private readonly store = inject(Store);

  incrementQuantity(productId: number) {
    this.store.dispatch(new IncrementQuantity(productId));
  }

  decrementQuantity(productId: number) {
    this.store.dispatch(new DecrementQuantity(productId));
  }

  removeFromCart(productId: number) {
    this.store.dispatch(new RemoveFromCart(productId));
    alert(`Ürün sepetten çıkarıldı.`);
  }

  getProductQuantity(productId: number): number {
    const cartItems = this.store.selectSnapshot(CartState.getCartItems);
    const item = cartItems.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  }

  isStockAvailable(cartItem: ICartItem): boolean {
    const selectedProduct = this.store
      .selectSnapshot(ProductState.getProducts)
      .find((el) => el.id === cartItem.productId);
    if (selectedProduct && cartItem) {
      return cartItem.quantity < selectedProduct.stock;
    }
    return true;
  }
}
