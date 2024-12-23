import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ProductState } from './product.state';

describe('ProductState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ProductState])],
    });

    store = TestBed.inject(Store);
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
});
