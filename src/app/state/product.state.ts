import { State, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/product.interface';

@State<IProduct[]>({
  name: 'products',
  defaults: [
    { id: 1, name: 'Laptop', price: 1000, stock: 10 },
    { id: 2, name: 'Mouse', price: 50, stock: 100 },
    { id: 3, name: 'Keyboard', price: 70, stock: 50 },
    { id: 4, name: 'Monitor', price: 300, stock: 20 },
  ],
})
@Injectable()
export class ProductState {
  @Selector()
  static getProducts(state: IProduct[]) {
    return state;
  }
}
