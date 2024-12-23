import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Store } from '@ngxs/store';
import { of, Subject, takeUntil } from 'rxjs';
import { AddToCart, CartState } from '../../state/cart.state';
import { ProductState } from '../../state/product.state';
import { ActivatedRoute } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockData: any;
  let destroy$: Subject<void>;
  beforeEach(async () => {
    destroy$ = new Subject<void>();
    mockData = {
      select: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getCartItems) {
          return of([
            { productId: 1, name: 'Laptop', price: 1000, quantity: 1 },
          ]);
        }
        if (item === ProductState.getProducts) {
          return of([
            { id: 1, name: 'Laptop', price: 1000, stock: 10 },
            { id: 2, name: 'Mouse', price: 50, stock: 100 },
          ]);
        }
        return of([]);
      }),
      selectSnapshot: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getCartItems) {
          return [{ productId: 1, name: 'Laptop', price: 1000, quantity: 1 }];
        }
        if (item === ProductState.getProducts) {
          return [
            { id: 1, name: 'Laptop', price: 1000, stock: 10 },
            { id: 2, name: 'Mouse', price: 50, stock: 100 },
          ];
        }
        return [];
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

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display products', (done: DoneFn) => {
    component.ngOnInit();
    component.products$.pipe(takeUntil(destroy$)).subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Laptop');
      expect(products[1].name).toBe('Mouse');
      done();
    });
  });

  it('should dispatch to AddToCart when add to cart button clicked', () => {
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

  it('should check if product is in cart', () => {
    const inCart = component.isInCart(1);
    expect(inCart).toBeTrue();

    const notInCart = component.isInCart(3);
    expect(notInCart).toBeFalse();
  });

  it('should not allow adding out of stock products to cart', () => {
    const outOfStockProductItem = {
      id: 3,
      name: 'Tablet',
      price: 500,
      stock: 0,
    };
    component.addToCart(outOfStockProductItem);
    expect(mockData.dispatch).not.toHaveBeenCalled();
  });

  it('should show products in the DOM', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const elements = fixture.nativeElement as HTMLElement;
    const productRef = elements.querySelectorAll('.product-name');
    expect(productRef.length).toBe(2);
    expect(productRef[0].textContent).toContain('Laptop');
    expect(productRef[1].textContent).toContain('Mouse');
  });
});
