import { ICartItem } from '../../models/cart-item.interface';

export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public payload: ICartItem) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public productId: number) {}
}

export class IncrementQuantity {
  static readonly type = '[Cart] Increment Quantity';
  constructor(public productId: number) {}
}

export class DecrementQuantity {
  static readonly type = '[Cart] Decrement Quantity';
  constructor(public productId: number) {}
}
