import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { CartState } from './cart.state';
import { ICartItem } from '../../models/cart-item.interface';
import {
  AddToCart,
  DecrementQuantity,
  IncrementQuantity,
  RemoveFromCart,
} from './cart.actions';

describe('CartState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([CartState])],
    });
    store = TestBed.inject(Store);
  });

  it('should add item to cart', () => {
    const cartItem: ICartItem = {
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 1,
    };

    store.dispatch(new AddToCart(cartItem));
    const cartItems = store.selectSnapshot(CartState.getCartItems);
    expect(cartItems.length).toBe(1);
    expect(cartItems[0]).toEqual(cartItem);
  });

  it('should calculate total item count', () => {
    const firstItem: ICartItem = {
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 2,
    };
    const secondItem: ICartItem = {
      productId: 2,
      name: 'Mouse',
      price: 50,
      quantity: 3,
    };
    store.dispatch(new AddToCart(firstItem));
    store.dispatch(new AddToCart(secondItem));
    const totalQuantity = store.selectSnapshot(CartState.getTotalItemsCount);
    expect(totalQuantity).toBe(5);
  });

  it('should remove item to cart', () => {
    const selectedItem: ICartItem = {
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 1,
    };
    store.dispatch(new AddToCart(selectedItem));
    store.dispatch(new RemoveFromCart(selectedItem.productId));
    const cartItems = store.selectSnapshot(CartState.getCartItems);
    expect(cartItems.length).toBe(0);
  });

  it('should increment quantity', () => {
    const cartItem: ICartItem = {
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 1,
    };
    store.dispatch(new AddToCart(cartItem));
    store.dispatch(new IncrementQuantity(cartItem.productId));
    const cartItems = store.selectSnapshot(CartState.getCartItems);
    expect(cartItems[0].quantity).toBe(2);
  });

  it('should decrement quantity', () => {
    const cartItem: ICartItem = {
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 2,
    };
    store.dispatch(new AddToCart(cartItem));
    store.dispatch(new DecrementQuantity(cartItem.productId));
    const cartItems = store.selectSnapshot(CartState.getCartItems);
    expect(cartItems[0].quantity).toBe(1);
  });

  it('should calculate total price', () => {
    const selectedFirstItem: ICartItem = {
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 2,
    };
    const selectedSecondItem: ICartItem = {
      productId: 2,
      name: 'Mouse',
      price: 50,
      quantity: 4,
    };
    store.dispatch(new AddToCart(selectedFirstItem));
    store.dispatch(new AddToCart(selectedSecondItem));
    const calculatedTotalPrice = store.selectSnapshot(CartState.getTotalPrice);
    expect(calculatedTotalPrice).toBe(2200);
  });
});
