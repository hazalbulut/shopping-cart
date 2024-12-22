import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { filter, Observable } from 'rxjs';
import { CartState } from '../../state/cart.state';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
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
  public total$: Observable<number> = new Observable<number>();
  public cartItems$: Observable<ICartItem[]> = new Observable<ICartItem[]>();
  public totalCount$: Observable<number> = new Observable<number>();
  public hideCartFromLayout: boolean = false;
  public showCartSummaryBox: boolean = false;
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.total$ = this.store.select(CartState.getTotalPrice);
    this.cartItems$ = this.store.select(CartState.getCartItems);
    this.totalCount$ = this.store.select(CartState.getTotalItemsCount);
    this.hideCartBadgeOnCartPage();
  }

  private hideCartBadgeOnCartPage() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showCartSummaryBox = false;
        const childRoute = this.activatedRoute.firstChild;
        if (childRoute) {
          childRoute.data.subscribe((data) => {
            this.hideCartFromLayout = data?.['hideCartFromLayout'] || false;
          });
        }
      });
  }

  public showBox() {
    this.showCartSummaryBox = true;
  }

  public hideBox() {
    this.showCartSummaryBox = false;
  }
}
