import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CartState } from '../../state/cart/cart.state';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ICartItem } from '../../models/cart-item.interface';
import { CardCartItemComponent } from '../card-cart-item/card-cart-item.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [AsyncPipe, NgIf, RouterLink, CardCartItemComponent],
})
export class LayoutComponent implements OnInit {
  @Input() public hideCartFromLayout: boolean = false;

  public total$: Observable<number> = new Observable<number>();
  public cartItems$: Observable<ICartItem[]> = new Observable<ICartItem[]>();
  public totalCount$: Observable<number> = new Observable<number>();
  public showCartSummaryBox: boolean = false;

  private readonly store = inject(Store);

  public ngOnInit(): void {
    this.total$ = this.store.select(CartState.getTotalPrice);
    this.cartItems$ = this.store.select(CartState.getCartItems);
    this.totalCount$ = this.store.select(CartState.getTotalItemsCount);
  }

  public showBox() {
    this.showCartSummaryBox = true;
  }

  public hideBox() {
    this.showCartSummaryBox = false;
  }
}
