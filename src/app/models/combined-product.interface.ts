import { IProduct } from './product.interface';

export interface ICombinedProduct {
  quantity: number;
  isInCart: boolean;
  product: IProduct;
}
