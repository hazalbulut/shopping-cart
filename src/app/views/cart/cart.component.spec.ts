import { of } from 'rxjs';
import { CartState } from '../../state/cart.state';
import { ProductState } from '../../state/product.state';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CardCartItemComponent } from '../../components/card-cart-item/card-cart-item.component';
import { Store } from '@ngxs/store';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockData: any;

  beforeEach(async () => {
    mockData = {
      select: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getCartItems) {
          return of([
            { productId: 1, name: 'Laptop', price: 1000, quantity: 1 },
          ]);
        }
        if (item === CartState.getTotalPrice) {
          return of(1000);
        }
        if (item === ProductState.getProducts) {
          return of([{ id: 1, name: 'Laptop', price: 1000, stock: 10 }]);
        }
        return of([]);
      }),
      selectSnapshot: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getCartItems) {
          return [{ productId: 1, name: 'Laptop', price: 1000, quantity: 1 }];
        }
        if (item === CartState.getTotalPrice) {
          return 1000;
        }
        if (item === ProductState.getProducts) {
          return [{ id: 1, name: 'Laptop', price: 1000, stock: 10 }];
        }
        return null;
      }),
      dispatch: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent, CardCartItemComponent],
      providers: [
        {
          provide: Store,
          useValue: mockData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart items', (done: DoneFn) => {
    component.ngOnInit();
    component.cartItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].name).toBe('Laptop');
      expect(items[0].price).toBe(1000);
      done();
    });
  });

  it('should display total price', (done: DoneFn) => {
    component.ngOnInit();
    component.total$.subscribe((item) => {
      expect(item).toBe(1000);
      done();
    });
  });

  it('should show cart items in the DOM', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const elements = fixture.nativeElement as HTMLElement;
    const cartItemsRef = elements.querySelectorAll('.cart-item');
    expect(cartItemsRef.length).toBe(1);
    expect(cartItemsRef[0].textContent).toContain('Laptop');
    expect(cartItemsRef[0].textContent).toContain('1000');
  });
});
