import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { ProductState } from '../../state/product/product.state';
import { ActivatedRoute } from '@angular/router';
import {
  AddToCart,
  IncrementQuantity,
  DecrementQuantity,
} from '../../state/cart/cart.actions';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockData: any;

  beforeEach(async () => {
    mockData = {
      select: jasmine.createSpy().and.callFake((selector) => {
        if (selector === ProductState.getCombinedProducts) {
          return of([
            {
              product: { id: 1, name: 'Laptop', price: 1000, stock: 10 },
              quantity: 1,
              isInCart: true,
            },
            {
              product: { id: 2, name: 'Mouse', price: 50, stock: 100 },
              quantity: 0,
              isInCart: false,
            },
          ]);
        }
        return of([]);
      }),
      dispatch: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        {
          provide: Store,
          useValue: mockData,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display combined products', (done: DoneFn) => {
    component.combinedProduct$.subscribe((combinedProducts) => {
      expect(combinedProducts.length).toBe(2);
      expect(combinedProducts[0].product.name).toBe('Laptop');
      expect(combinedProducts[0].quantity).toBe(1);
      expect(combinedProducts[0].isInCart).toBeTrue();

      expect(combinedProducts[1].product.name).toBe('Mouse');
      expect(combinedProducts[1].quantity).toBe(0);
      expect(combinedProducts[1].isInCart).toBeFalse();
      done();
    });
  });

  it('should dispatch AddToCart action', () => {
    const product = { id: 1, name: 'Laptop', price: 1000, stock: 10 };
    component.addToCart(product);

    expect(mockData.dispatch).toHaveBeenCalledWith(
      new AddToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
    );
  });

  it('should dispatch IncrementQuantity action when incrementQuantity called', () => {
    component.incrementQuantity(1);
    expect(mockData.dispatch).toHaveBeenCalledWith(new IncrementQuantity(1));
  });

  it('should dispatch DecrementQuantity action when decrementQuantity called', () => {
    component.decrementQuantity(1);
    expect(mockData.dispatch).toHaveBeenCalledWith(new DecrementQuantity(1));
  });

  it('should show combined products in the DOM', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const productElements = compiled.querySelectorAll('.product-name');

    expect(productElements.length).toBe(2);
    expect(productElements[0].textContent).toContain('Laptop');
    expect(productElements[1].textContent).toContain('Mouse');
  });
});
