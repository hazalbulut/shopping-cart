import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ProductState } from './product.state';
import { CartState } from '../cart/cart.state';

describe('ProductState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProductState, CartState])],
    });

    store = TestBed.inject(Store);

    store.reset({
      products: [
        { id: 1, name: 'Laptop', price: 1000, stock: 10 },
        { id: 2, name: 'Mouse', price: 50, stock: 100 },
        { id: 3, name: 'Keyboard', price: 70, stock: 50 },
        { id: 4, name: 'Monitor', price: 300, stock: 20 },
      ],
      cart: {
        items: [
          { productId: 1, name: 'Laptop', price: 1000, quantity: 1 },
          { productId: 3, name: 'Keyboard', price: 70, quantity: 1 },
        ],
      },
    });
  });

  it('should get all products', () => {
    const products = store.selectSnapshot(ProductState.getProducts);
    expect(products.length).toBe(4);
    expect(products).toEqual([
      { id: 1, name: 'Laptop', price: 1000, stock: 10 },
      { id: 2, name: 'Mouse', price: 50, stock: 100 },
      { id: 3, name: 'Keyboard', price: 70, stock: 50 },
      { id: 4, name: 'Monitor', price: 300, stock: 20 },
    ]);
  });
  it('should combine products with cart items from getCombinedProducts', () => {
    const combinedProducts = store.selectSnapshot(
      ProductState.getCombinedProducts
    );
    expect(combinedProducts[0]).toEqual({
      product: { id: 1, name: 'Laptop', price: 1000, stock: 10 },
      quantity: 1,
      isInCart: true,
    });
    expect(combinedProducts[1]).toEqual({
      product: { id: 2, name: 'Mouse', price: 50, stock: 100 },
      quantity: 0,
      isInCart: false,
    });
    expect(combinedProducts[2]).toEqual({
      product: { id: 3, name: 'Keyboard', price: 70, stock: 50 },
      quantity: 1,
      isInCart: true,
    });
    expect(combinedProducts[3]).toEqual({
      product: { id: 4, name: 'Monitor', price: 300, stock: 20 },
      quantity: 0,
      isInCart: false,
    });
  });
});
