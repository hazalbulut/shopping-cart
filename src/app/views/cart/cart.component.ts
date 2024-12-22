import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ICartItem } from '../../models/cart-item.interface';
import { AsyncPipe, NgIf } from '@angular/common';
import { CartState } from '../../state/cart.state';
import { CardCartItemComponent } from '../../components/card-cart-item/card-cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  imports: [AsyncPipe, CardCartItemComponent, NgIf],
})
export class CartComponent implements OnInit {
  public cartItems$: Observable<ICartItem[]> = new Observable<ICartItem[]>();
  public total$: Observable<number> = new Observable<number>();
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.cartItems$ = this.store.select(CartState.getCartItems);
    this.total$ = this.store.select(CartState.getTotalPrice);
  }
}
