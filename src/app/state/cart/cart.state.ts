import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ICartState } from '../../models/cart-state.interface';
import {
  AddToCart,
  DecrementQuantity,
  IncrementQuantity,
  RemoveFromCart,
} from './cart.actions';

@State<ICartState>({
  name: 'cart',
  defaults: {
    items: [],
  },
})
@Injectable()
export class CartState {
  @Selector()
  static getCartItems(state: ICartState) {
    return state?.items ?? [];
  }
  @Selector()
  static getTotalPrice(state: ICartState) {
    return state?.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  @Selector()
  static getTotalItemsCount(state: ICartState): number {
    return state?.items.reduce((total, item) => total + item.quantity, 0);
  }

  @Action(AddToCart)
  addToCart(
    { getState, patchState }: StateContext<ICartState>,
    { payload }: AddToCart
  ) {
    const state = getState();
    const existingItem = state?.items.find(
      (item) => item.productId === payload.productId
    );

    if (existingItem) {
      patchState({
        items: state?.items.map((item) =>
          item.productId === payload.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      patchState({
        items: [...state.items, payload],
      });
    }
  }

  @Action(RemoveFromCart)
  removeFromCart(
    { getState, patchState }: StateContext<ICartState>,
    { productId }: RemoveFromCart
  ) {
    patchState({
      items: getState()?.items.filter((item) => item.productId !== productId),
    });
  }

  @Action(IncrementQuantity)
  incrementQuantity(
    { getState, patchState }: StateContext<ICartState>,
    { productId }: IncrementQuantity
  ) {
    const state = getState();
    patchState({
      items: state?.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    });
  }

  @Action(DecrementQuantity)
  decrementQuantity(
    { getState, patchState }: StateContext<ICartState>,
    { productId }: DecrementQuantity
  ) {
    const state = getState();
    patchState({
      items: state?.items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    });
  }
}
