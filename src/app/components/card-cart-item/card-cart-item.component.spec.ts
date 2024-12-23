import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardCartItemComponent } from './card-cart-item.component';
import { Store } from '@ngxs/store';
import {
  CartState,
  DecrementQuantity,
  IncrementQuantity,
  RemoveFromCart,
} from '../../state/cart.state';
import { ProductState } from '../../state/product.state';

describe('CardCartItemComponent', () => {
  let component: CardCartItemComponent;
  let fixture: ComponentFixture<CardCartItemComponent>;
  let mockData: any;

  beforeEach(async () => {
    mockData = {
      dispatch: jasmine.createSpy(),
      select: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getCartItems) {
          return [
            { productId: 1, name: 'Laptop', price: 1000, quantity: 2 },
            { productId: 2, name: 'Mouse', price: 50, quantity: 1 },
          ];
        }
        if (item === ProductState.getProducts) {
          return [
            { id: 1, name: 'Laptop', price: 1000, stock: 5 },
            { id: 2, name: 'Mouse', price: 50, stock: 2 },
          ];
        }
        return [];
      }),
      selectSnapshot: jasmine.createSpy().and.callFake((item) => {
        if (item === CartState.getCartItems) {
          return [
            { productId: 1, name: 'Laptop', price: 1000, quantity: 2 },
            { productId: 2, name: 'Mouse', price: 50, quantity: 1 },
          ];
        }
        if (item === ProductState.getProducts) {
          return [
            { id: 1, name: 'Laptop', price: 1000, stock: 5 },
            { id: 2, name: 'Mouse', price: 50, stock: 2 },
          ];
        }
        return [];
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CardCartItemComponent],
      providers: [
        {
          provide: Store,
          useValue: mockData,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCartItemComponent);
    component = fixture.componentInstance;
    component.item = { productId: 1, name: 'Laptop', price: 1000, quantity: 2 };
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should display cart item data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.cart-item span')!;
    const totalElement = compiled.querySelector('.cart-item p')!;
    const nameText = nameElement.textContent?.replace(/\s+/g, ' ').trim(); // Space is fixed for x 2
    expect(nameElement.textContent).toContain('Laptop');
    expect(nameText).toContain('x 2');
    expect(totalElement.textContent).toContain('2000 TL');
  });

  it('should increment when + button cliked', () => {
    const incrementControl = fixture.nativeElement.querySelector(
      '.quantity-control'
    ) as HTMLElement;
    incrementControl.click();
    expect(mockData.dispatch).toHaveBeenCalledWith(new IncrementQuantity(1));
  });

  it('should remove item from cart when remove clicked', () => {
    // Check alert
    spyOn(window, 'alert');
    const removeControl = fixture.nativeElement.querySelector(
      '.remove-button'
    ) as HTMLElement;
    removeControl.click();
    expect(mockData.dispatch).toHaveBeenCalledWith(new RemoveFromCart(1));
    expect(window.alert).toHaveBeenCalledWith('Ürün sepetten çıkarıldı.');
  });

  it('should disable if stock unavaliable', () => {
    component.item = { productId: 2, name: 'Mouse', price: 50, quantity: 2 };
    fixture.detectChanges();

    const incrementControl = fixture.nativeElement.querySelector(
      '.quantity-control'
    ) as HTMLElement;
    expect(incrementControl.getAttribute('disabled')).not.toBeNull();
    expect(incrementControl.classList).toContain('disable');
  });

  it('should decrement when - button clicked', () => {
    const decrementControl = fixture.nativeElement.querySelector(
      '.quantity-controls button'
    ) as HTMLElement;
    decrementControl.click();
    expect(mockData.dispatch).toHaveBeenCalledWith(new DecrementQuantity(1));
  });

  it('should check product quantity', () => {
    const productQuantity = component.getProductQuantity(1);
    expect(productQuantity).toBe(2);
    const nonExistentQuantity = component.getProductQuantity(3);
    expect(nonExistentQuantity).toBe(0);
  });

  it('should check if stock is available', () => {
    const available = component.isStockAvailable({
      productId: 1,
      name: 'Laptop',
      price: 1000,
      quantity: 2,
    });
    expect(available).toBeTrue();

    const unavailable = component.isStockAvailable({
      productId: 2,
      name: 'Mouse',
      price: 50,
      quantity: 3,
    });
    expect(unavailable).toBeFalse();
  });
});
